import pool from "../pgsql";
import {OpenAIEmbedding} from "../../services/embeddings/OpenAIEmbedding";
import pgvector from "pgvector/pg";

export type QueryDTO = {
    id: number
    query: string
    sql: string
}

const table = "query_examples"

const openaiEmbedding = new OpenAIEmbedding()


export async function createQuery(data: Omit<QueryDTO, 'id'>) {
    return pool.query<QueryDTO>(`INSERT INTO ${table} (query, sql) VALUES ($1, $2) RETURNING *`, [data.query, data.sql])
}

export async function embeddingQuery() {
    const result = await pool.query<QueryDTO>(`SELECT * FROM ${table} WHERE is_active = true AND embedding IS NULL`)
    console.log("result: ", result.rows)
    return Promise.all(result.rows.map(async (query) => {
        const embeddingData = await openaiEmbedding.encode(query.query)
        return pool.query<QueryDTO>(`UPDATE ${table} SET embedding = $1, tokens = $2 WHERE id = $3`, [pgvector.toSql(embeddingData.embedding), embeddingData.tokens, query.id])
    }))
        .then(() => true)
}

export async function fetchQueries(query: string, number = 10) {

    const searchEmbeddingInfo = await openaiEmbedding.encode(query)

    return pool.query<QueryDTO[]>(`SELECT query, sql FROM ${table} ORDER BY embedding <-> $1 LIMIT $2;`, [pgvector.toSql(searchEmbeddingInfo.embedding), number])
        .then((res: any) => res.rows)
}

export async function getQueries(limit = 10) {
    return pool.query<QueryDTO[]>(`SELECT query, sql, is_active FROM ${table} ORDER BY id DESC LIMIT $1`, [limit])
        .then((res: any) => res.rows)
}

