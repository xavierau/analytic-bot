import pool from '../pgsql';
import {hashPassword} from "../../services/Security";

export type ProductDTO = {
    id: number
    name: string
    description?: string
    price: number
}

const table = "product2"

export async function createProduct(data: Omit<ProductDTO, 'id'>) {
    return pool.query<ProductDTO>(`INSERT INTO ${table} (name, description,price) VALUES ($1, $2, $3) RETURNING *`, [data.name, data.description || "", data.price])
        .then((res: any) => res.rows[0])
}

export async function getAllProducts() {
    return pool.query<ProductDTO>(`SELECT * FROM ${table} WHERE deleted_at IS NULL`)
        .then((res: any) => res.rows)
}