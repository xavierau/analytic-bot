"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt_1.default.genSalt(saltRounds)
        .then(salt => bcrypt_1.default.hash(password, salt))
        .catch(err => {
        console.error(err);
        throw new Error("Error hashing password");
    });
}
exports.hashPassword = hashPassword;
