import pool from '../pgsql';

export type ChatMessageDTO = {
    id: number
    identifier: string
    role: string
    content: string
    tool_call_id?: string
    tool_calls?: string
}

const table = "chat_messages"

export async function createChatMessage(data: Omit<ChatMessageDTO, 'id'>) {
    return pool.query<ChatMessageDTO>(`INSERT INTO ${table} (identifier, role,content, tool_calls, tool_call_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [data.identifier, data.role, data.content, data.tool_calls, data.tool_call_id])
        .then((res: any) => res.rows[0])
}

export async function getChatMessages(identifier: string, limit: number = 10) {
    return pool.query<ChatMessageDTO>(`SELECT * FROM ${table} WHERE identifier = $1 ORDER BY created_at DESC LIMIT $2`, [identifier, limit])
        .then((res: any) => res.rows)
}

export async function countChatMessages(identifier: string) {
    return pool.query<ChatMessageDTO>(`SELECT COUNT(*) FROM ${table} WHERE identifier = $1`, [identifier])
        .then((res: any) => res.rows[0])
}