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
exports.assignToRole = exports.createRole = void 0;
const pgsql_1 = __importDefault(require("../pgsql"));
const table = "roles";
const roleRoleTable = "role_user";
function createRole(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return pgsql_1.default.query(`INSERT INTO "${table}" (Name, Description) VALUES ($1, $2) RETURNING *`, [data.name, data.description || ""])
            .then((res) => res.rows[0]);
    });
}
exports.createRole = createRole;
function assignToRole(userid, roleid) {
    return __awaiter(this, void 0, void 0, function* () {
        const nowString = (new Date()).toDateString();
        return pgsql_1.default.query(`INSERT INTO ${roleRoleTable} (user_id, role_id, assigned_date) VALUES ($1, $2, $3) RETURNING *`, [userid, roleid, nowString])
            .then((res) => true);
    });
}
exports.assignToRole = assignToRole;
