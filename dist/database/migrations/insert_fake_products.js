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
exports.insertFakeProducts = void 0;
const faker_1 = require("@faker-js/faker");
const product_1 = require("../repositories/product");
function insertFakeProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 100; i++) {
            const product = {
                name: faker_1.faker.commerce.productName(),
                description: faker_1.faker.commerce.productDescription(),
                price: parseFloat(faker_1.faker.commerce.price({ min: 10, max: 1000 })),
            };
            (0, product_1.createProduct)(product)
                .catch((error) => console.error('product create error: ', error));
        }
    });
}
exports.insertFakeProducts = insertFakeProducts;
