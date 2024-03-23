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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresMemory = void 0;
const chatMessage_1 = require("../database/repositories/chatMessage");
class PostgresMemory {
    constructor(identifier) {
        this.identifier = identifier;
    }
    getMessages(limit, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, chatMessage_1.getChatMessages)(this.identifier, limit)
                .then((results) => results.map((result) => {
                return {
                    role: result.role,
                    content: result.content,
                };
            }).reverse());
        });
    }
    addMessage(message, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, chatMessage_1.createChatMessage)({
                identifier: this.identifier,
                role: message.role,
                content: (message.content) || "",
            });
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, chatMessage_1.countChatMessages)(this.identifier)
                .then((count) => count);
        });
    }
    getIdentifier() {
        return this.identifier;
    }
}
exports.PostgresMemory = PostgresMemory;
