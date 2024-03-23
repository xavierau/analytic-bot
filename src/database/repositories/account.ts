import pool from '../pgsql';
import {hashPassword} from "../../services/Security";

export type AccountDTO = {
    id: number
    name: string
    industry: string
    size: number
    country: string
}

const table = "accounts"


export async function createAccount(data: Omit<AccountDTO, "id">) {
    return pool.query<AccountDTO>(`INSERT INTO ${table} (Name, Industry,Size, Country) VALUES ($1, $2, $3, $4) RETURNING *`, [data.name, data.industry, data.size, data.country])
        .then((res: any) => res.rows[0])
}

export async function getAllAccounts() {
    return pool.query<AccountDTO[]>(`SELECT * FROM ${table}`)
        .then((res: any) => res.rows)
}

export async function getRandomAccounts(number=10) {
    return pool.query<AccountDTO[]>(`SELECT * FROM ${table} ORDER BY random() LIMIT $1`, [number])
        .then((res: any) => res.rows)
}