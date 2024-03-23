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
exports.getRandomAccounts = exports.getAllAccounts = exports.createAccount = void 0;
const pgsql_1 = __importDefault(require("../pgsql"));
const table = "accounts";
function createAccount(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return pgsql_1.default.query(`INSERT INTO ${table} (Name, Industry,Size, Country) VALUES ($1, $2, $3, $4) RETURNING *`, [data.name, data.industry, data.size, data.country])
            .then((res) => res.rows[0]);
    });
}
exports.createAccount = createAccount;
function getAllAccounts() {
    return __awaiter(this, void 0, void 0, function* () {
        return pgsql_1.default.query(`SELECT * FROM ${table}`)
            .then((res) => res.rows);
    });
}
exports.getAllAccounts = getAllAccounts;
function getRandomAccounts() {
    return __awaiter(this, arguments, void 0, function* (number = 10) {
        return pgsql_1.default.query(`SELECT * FROM ${table} ORDER BY random() LIMIT $1`, [number])
            .then((res) => res.rows);
    });
}
exports.getRandomAccounts = getRandomAccounts;
