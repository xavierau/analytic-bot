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
exports.insertFakeOpportunities = void 0;
const faker_1 = require("@faker-js/faker");
const opportunity_1 = require("../repositories/opportunity");
const account_1 = require("../repositories/account");
const product_1 = require("../repositories/product");
function insertFakeOpportunities() {
    return __awaiter(this, void 0, void 0, function* () {
        const fromDate = new Date("2023-01-01");
        const toDate = new Date("2024-12-31");
        const products = yield (0, product_1.getAllProducts)();
        for (let i = 0; i < 500; i++) {
            (0, account_1.getRandomAccounts)(1)
                .then((accounts) => {
                const account = accounts[0];
                const closeDate = faker_1.faker.date.between({
                    from: fromDate,
                    to: toDate
                });
                const opportunity = {
                    name: faker_1.faker.word.words(),
                    stage: ['suspect', 'prospect', 'proposal', 'won', 'lost'][Math.floor(Math.random() * 5)],
                    close_date: closeDate
                };
                (0, opportunity_1.createOpportunity)(account.id, opportunity)
                    .then((response) => {
                    const numberOfProducts = Math.floor(Math.random() * 5) + 10;
                    const selectedProducts = [];
                    for (let i = 0; i < numberOfProducts; i++) {
                        // not selected products
                        let product = products[Math.floor(Math.random() * products.length)];
                        while (selectedProducts.includes(product.id)) {
                            product = products[Math.floor(Math.random() * products.length)];
                        }
                        selectedProducts.push(product.id);
                        (0, opportunity_1.createOpportunityProduct)({
                            opportunity_id: response.id,
                            product_id: product.id,
                            amount: parseFloat(faker_1.faker.commerce.price({ min: 10, max: 1000 })),
                            quantity: Math.floor(Math.random() * 10) + 1
                        })
                            .catch((error) => console.error('opportunity product create error: ', error));
                    }
                });
            });
        }
    });
}
exports.insertFakeOpportunities = insertFakeOpportunities;
