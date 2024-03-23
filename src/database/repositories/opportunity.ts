import pool from '../pgsql';
import {hashPassword} from "../../services/Security";

export type OpportunityDTO = {
    id: number
    name: string
    stage: string
    close_date: Date
}

export type OpportunityProductDTO = {
    opportunity_id: number
    product_id: number
    amount: number
    quantity: number
}

const opportunities_table = "opportunities"
const opportunity_product_table = "opportunity_product"

export async function createOpportunity(account_id: number, data: Omit<OpportunityDTO, "id">) {
    return pool.query<OpportunityDTO>(`INSERT INTO ${opportunities_table} (account_id, name, stage, close_date) VALUES ($1, $2, $3, $4) RETURNING *`, [account_id, data.name, data.stage, data.close_date])
        .then((res: any) => res.rows[0])
}

export async function createOpportunityProduct(data: OpportunityProductDTO) {
    return pool.query<OpportunityDTO>(`INSERT INTO ${opportunity_product_table} (opportunity_id, product_id, quantity, amount) VALUES ($1, $2, $3, $4) RETURNING *`, [data.opportunity_id, data.product_id, data.quantity, data.amount])
        .then((res: any) => res.rows[0])
}