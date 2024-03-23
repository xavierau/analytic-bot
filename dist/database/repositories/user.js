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
exports.getUsers = exports.createAppUser = void 0;
const pgsql_1 = __importDefault(require("../pgsql"));
const Security_1 = require("../../services/Security");
const table = "users";
function createAppUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield (0, Security_1.hashPassword)(data.password);
        const client = yield pgsql_1.default.connect();
        console.log(client);
        return pgsql_1.default.query(`INSERT INTO ${table} (Username, first_name,last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [data.username, data.first_name, data.last_name, data.email, hashedPassword])
            .then((res) => res.rows[0]);
    });
}
exports.createAppUser = createAppUser;
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return pgsql_1.default.query(`SELECT id, first_name, last_name  FROM ${table}`)
            .then((res) => res.rows);
    });
}
exports.getUsers = getUsers;
