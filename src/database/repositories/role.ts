import pool from '../pgsql';
import {hashPassword} from "../../services/Security";

export type RoleDTO = {
    id: number
    name: string
    description?: string
}

const table = "roles"
const roleRoleTable = "role_user"

export async function createRole(data: Omit<RoleDTO, 'id'>) {

    return pool.query<RoleDTO>(`INSERT INTO "${table}" (Name, Description) VALUES ($1, $2) RETURNING *`, [data.name, data.description || ""])
        .then((res: any) => res.rows[0])

}

export async function assignToRole(userid: number, roleid: number) {
    const nowString = (new Date()).toDateString()
    return pool.query(`INSERT INTO ${roleRoleTable} (user_id, role_id, assigned_date) VALUES ($1, $2, $3) RETURNING *`, [userid as unknown as string, roleid as unknown as string, nowString])
        .then((res: any) => true)
}