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
exports.countChatMessages = exports.getChatMessages = exports.createChatMessage = void 0;
const pgsql_1 = __importDefault(require("../pgsql"));
const table = "chat_messages";
function createChatMessage(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return pgsql_1.default.query(`INSERT INTO ${table} (identifier, role,content, tool_calls, tool_call_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [data.identifier, data.role, data.content, data.tool_calls, data.tool_call_id])
            .then((res) => res.rows[0]);
    });
}
exports.createChatMessage = createChatMessage;
function getChatMessages(identifier_1) {
    return __awaiter(this, arguments, void 0, function* (identifier, limit = 10) {
        return pgsql_1.default.query(`SELECT * FROM ${table} WHERE identifier = $1 ORDER BY created_at DESC LIMIT $2`, [identifier, limit])
            .then((res) => res.rows);
    });
}
exports.getChatMessages = getChatMessages;
function countChatMessages(identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        return pgsql_1.default.query(`SELECT COUNT(*) FROM ${table} WHERE identifier = $1`, [identifier])
            .then((res) => res.rows[0]);
    });
}
exports.countChatMessages = countChatMessages;
