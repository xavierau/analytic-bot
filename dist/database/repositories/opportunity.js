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
exports.createOpportunityProduct = exports.createOpportunity = void 0;
const pgsql_1 = __importDefault(require("../pgsql"));
const opportunities_table = "opportunities";
const opportunity_product_table = "opportunity_product";
function createOpportunity(account_id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return pgsql_1.default.query(`INSERT INTO ${opportunities_table} (account_id, name, stage, close_date) VALUES ($1, $2, $3, $4) RETURNING *`, [account_id, data.name, data.stage, data.close_date])
            .then((res) => res.rows[0]);
    });
}
exports.createOpportunity = createOpportunity;
function createOpportunityProduct(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return pgsql_1.default.query(`INSERT INTO ${opportunity_product_table} (opportunity_id, product_id, quantity, amount) VALUES ($1, $2, $3, $4) RETURNING *`, [data.opportunity_id, data.product_id, data.quantity, data.amount])
            .then((res) => res.rows[0]);
    });
}
exports.createOpportunityProduct = createOpportunityProduct;
