import pool from '../pgsql';
import {hashPassword} from "../../services/Security";

export type AppUserDTO = {
    id: number
    username: string
    first_name: string
    last_name: string
    email: string
    password: string
}

const table = "users"

export async function createAppUser(data: Omit<AppUserDTO, 'id'>) {

    const hashedPassword = await hashPassword(data.password)

    const client = await pool.connect()

    console.log(client)

    return pool.query<AppUserDTO>(`INSERT INTO ${table} (Username, first_name,last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [data.username, data.first_name, data.last_name, data.email, hashedPassword])
        .then((res: any) => res.rows[0])


}

export async function getUsers(){
    return pool.query<AppUserDTO>(`SELECT id, first_name, last_name  FROM ${table}`)
        .then((res: any) => res.rows)
}