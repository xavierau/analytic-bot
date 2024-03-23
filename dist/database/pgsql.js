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
const pg_1 = require("pg");
const config_1 = __importDefault(require("../config"));
const pg_2 = __importDefault(require("pgvector/pg"));
const pool = new pg_1.Pool({
    host: config_1.default.database.host,
    user: config_1.default.database.user,
    database: config_1.default.database.database,
    password: config_1.default.database.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: config_1.default.database.timeout,
    ssl: {
        rejectUnauthorized: config_1.default.database.requireSSL
    }
});
pool.on('connect', function (client) {
    return __awaiter(this, void 0, void 0, function* () {
        yield pg_2.default.registerType(client);
    });
});
exports.default = pool;
