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
exports.getQueries = exports.fetchQueries = exports.embeddingQuery = exports.createQuery = void 0;
const pgsql_1 = __importDefault(require("../pgsql"));
const OpenAIEmbedding_1 = require("../../services/embeddings/OpenAIEmbedding");
const pg_1 = __importDefault(require("pgvector/pg"));
const table = "query_examples";
const openaiEmbedding = new OpenAIEmbedding_1.OpenAIEmbedding();
function createQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return pgsql_1.default.query(`INSERT INTO ${table} (query, sql) VALUES ($1, $2) RETURNING *`, [data.query, data.sql]);
    });
}
exports.createQuery = createQuery;
function embeddingQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pgsql_1.default.query(`SELECT * FROM ${table} WHERE is_active = true AND embedding IS NULL`);
        console.log("result: ", result.rows);
        return Promise.all(result.rows.map((query) => __awaiter(this, void 0, void 0, function* () {
            const embeddingData = yield openaiEmbedding.encode(query.query);
            return pgsql_1.default.query(`UPDATE ${table} SET embedding = $1, tokens = $2 WHERE id = $3`, [pg_1.default.toSql(embeddingData.embedding), embeddingData.tokens, query.id]);
        })))
            .then(() => true);
    });
}
exports.embeddingQuery = embeddingQuery;
function fetchQueries(query_1) {
    return __awaiter(this, arguments, void 0, function* (query, number = 10) {
        const searchEmbeddingInfo = yield openaiEmbedding.encode(query);
        return pgsql_1.default.query(`SELECT query, sql FROM ${table} ORDER BY embedding <-> $1 LIMIT $2;`, [pg_1.default.toSql(searchEmbeddingInfo.embedding), number])
            .then((res) => res.rows);
    });
}
exports.fetchQueries = fetchQueries;
function getQueries() {
    return __awaiter(this, arguments, void 0, function* (limit = 10) {
        return pgsql_1.default.query(`SELECT query, sql, is_active FROM ${table} ORDER BY id DESC LIMIT $1`, [limit])
            .then((res) => res.rows);
    });
}
exports.getQueries = getQueries;
