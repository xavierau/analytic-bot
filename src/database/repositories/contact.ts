import pool from '../pgsql';
import {hashPassword} from "../../services/Security";

export type ContactDTO = {
    id: number
    first_name: string
    last_name: string
    account_id: number
    email: string
    phone: string
    job_title: string
}

const table = "contacts"


export async function createContact(data: Omit<ContactDTO, "id">) {
    return pool.query<ContactDTO>(`INSERT INTO ${table} (account_id, first_name,last_name, email, phone, job_title) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *`, [data.account_id, data.first_name, data.last_name, data.email, data.phone, data.job_title])
        .then((res: any) => res.rows[0])
}