"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataQuery = void 0;
const pgsql_1 = __importDefault(require("../database/pgsql"));
const OpenAIClient_1 = require("../services/llms/OpenAIClient");
const config_1 = __importDefault(require("../config"));
const query_1 = require("../database/repositories/query");
class DataQuery {
    constructor() {
        this.name = "data_query";
        this.description = "query data from the database";
    }
    getSchema() {
        return {
            type: "function",
            function: {
                name: this.name,
                description: this.description,
                parameters: {
                    type: "object",
                    properties: {
                        request: {
                            type: "string",
                            description: "user's request to query the database"
                        }
                    },
                    required: ["request"]
                }
            }
        };
    }
    run(query) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('query tool: ', query);
            const llmResponse = yield this.generateSQL(query.request);
            if (!llmResponse) {
                return {
                    status: "error",
                    message: "Error generating SQL",
                    result: null,
                    errors: [{ 'sql': 'Error generating SQL' }]
                };
            }
            const sqlCommand = this.extratSQLCommand(llmResponse);
            (0, query_1.createQuery)({
                query: query.request,
                sql: sqlCommand
            }).then((res) => console.log("Query saved successfully", res));
            console.log("Extracted SQL:", sqlCommand);
            return pgsql_1.default.query(sqlCommand)
                .then((res) => {
                return {
                    status: "success",
                    message: "Query ran successfully",
                    result: res.rows || []
                };
            })
                .catch((err) => {
                return {
                    status: "error",
                    message: "Error running query",
                    result: null,
                    errors: [err]
                };
            });
        });
    }
    extratSQLCommand(llmResponse) {
        console.log("llmResponse from getDBDataAndResponse: ", llmResponse);
        const responseText = llmResponse === null || llmResponse === void 0 ? void 0 : llmResponse.message.content;
        const regex = /```sql\s+([\s\S]*?)\s+```/;
        const match = responseText === null || responseText === void 0 ? void 0 : responseText.match(regex);
        if (!match)
            throw new Error("No SQL found.");
        return match[1];
    }
    getDatabaseSchema() {
        return `
<schema>
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    industry VARCHAR(255),
    size INT,
    country VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- Contact Table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(id) ON DELETE SET NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(40),
    job_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE IF NOT EXISTS opportunities (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(id) ON DELETE SET NULL,
    name VARCHAR(255),
    stage VARCHAR(255)  -- ['suspecting', 'prospecting', 'proposal', 'won','lost'],
    close_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE IF NOT EXISTS product2 (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- opportunity_product Table (Composite Primary Key)
CREATE TABLE IF NOT EXISTS opportunity_product (
    opportunity_id INT,
    product_id INT,
    quantity INT,
    amount DECIMAL(10, 2),
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product2(id) ON DELETE CASCADE
);        
</schema>
`;
    }
    generateSQL(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const llm = new OpenAIClient_1.OpenAIClient(config_1.default.openaiApiKey);
            const database_schema = this.getDatabaseSchema();
            const exampleArray = yield (0, query_1.fetchQueries)(query, 5);
            const examples = exampleArray.map((example) => `query: ${example.query}\n sql: ${example.sql}\n`).join("\n");
            const base_system_prompt = `You are a data engineer and you are working on to analyze the data of a company. Your are working on the Postgresql database. The database schema is as follows:
    {database_schema}
    {examples}
    
    Current Date: ${(new Date).toDateString()}
    
    You only give the SQL query to address the question.
    `;
            const system_prompt = base_system_prompt
                .replace("{database_schema}", database_schema)
                .replace("{examples}", `\n<query_examples>\n${examples}\n</query_examples>\n`);
            const messages = [
                {
                    role: "system",
                    content: system_prompt
                },
                {
                    role: "user",
                    content: query
                }
            ];
            return llm.generate(messages);
        });
    }
}
exports.DataQuery = DataQuery;
