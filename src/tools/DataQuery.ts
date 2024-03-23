import {ChatCompletion, FunctionDefinition} from "openai/resources";
import pool from "../database/pgsql";
import {OpenAIClient} from "../services/llms/OpenAIClient";
import config from "../config";
import {createQuery, fetchQueries} from "../database/repositories/query";
import {ChatCompletionMessageParam, ChatCompletionTool} from "openai/src/resources/chat/completions";
import {Tool, ToolResponse} from "../types";
import Choice = ChatCompletion.Choice;

type DataQueryArgs = {
    request: string
}

export class DataQuery implements Tool {
    name = "data_query";
    description = "query data from the database"

    getSchema(): ChatCompletionTool {
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
        }
    }

    async run(query: DataQueryArgs): Promise<ToolResponse> {

        console.log('query tool: ', query)

        const llmResponse: Choice | undefined = await this.generateSQL(query.request)

        if (!llmResponse) {
            return {
                status: "error",
                message: "Error generating SQL",
                result: null,
                errors: [{'sql': 'Error generating SQL'}]
            }
        }

        const sqlCommand = this.extratSQLCommand(llmResponse);

        createQuery({
            query: query.request,
            sql: sqlCommand
        }).then((res) => console.log("Query saved successfully", res))

        console.log("Extracted SQL:", sqlCommand);

        return pool.query(sqlCommand)
            .then((res: any) => {
                return {
                    status: "success",
                    message: "Query ran successfully",
                    result: res.rows || []
                }
            })
            .catch((err: any) => {
                return {
                    status: "error",
                    message: "Error running query",
                    result: null,
                    errors: [err]
                }
            })
    }

    private extratSQLCommand(llmResponse: Choice) {
        console.log("llmResponse from getDBDataAndResponse: ", llmResponse)

        const responseText = llmResponse?.message.content
        const regex = /```sql\s+([\s\S]*?)\s+```/;
        const match = responseText?.match(regex);

        if (!match) throw new Error("No SQL found.")
        return match[1];
    }

    private getDatabaseSchema() {
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
`
    }

    async generateSQL(query: string) {

        const llm = new OpenAIClient(config.openaiApiKey)
        const database_schema = this.getDatabaseSchema()
        const exampleArray = await fetchQueries(query, 5)
        const examples = exampleArray.map((example: any) => `query: ${example.query}\n sql: ${example.sql}\n`).join("\n")
        const base_system_prompt = `You are a data engineer and you are working on to analyze the data of a company. Your are working on the Postgresql database. The database schema is as follows:
    {database_schema}
    {examples}
    
    Current Date: ${(new Date).toDateString()}
    
    You only give the SQL query to address the question.
    `
        const system_prompt = base_system_prompt
            .replace("{database_schema}", database_schema)
            .replace("{examples}", `\n<query_examples>\n${examples}\n</query_examples>\n`)
        const messages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: system_prompt
            },
            {
                role: "user",
                content: query
            }
        ]
        return llm.generate(messages)
    }
}