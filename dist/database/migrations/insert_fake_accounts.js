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
exports.insertFakeAccounts = void 0;
const faker_1 = require("@faker-js/faker");
const account_1 = require("../repositories/account");
const industries = [
    "Accommodation and Food Services",
    "Administration, Business Support and Waste Management Services",
    "Agriculture, Forestry, Fishing and Hunting",
    "Arts, Entertainment and Recreation",
    "Construction",
    "Educational Services",
    "Finance and Insurance",
    "Healthcare and Social Assistance",
    "Information",
    "Manufacturing",
    "Mining",
    "Other Services (except Public Administration)",
    "Professional, Scientific and Technical Services",
    "Real Estate and Rental and Leasing",
    "Retail Trade",
    "Transportation and Warehousing",
    "Utilities",
    "Wholesale Trade",
    "Advisory and Financial Services",
    "Business Franchises",
    "Consumer Goods and Services",
    "Industrial Machinery, Gas and Chemicals",
    "Life Sciences",
    "Online Retail",
    "Specialist Engineering, Infrastructure and Contractors",
    "Technology",
];
function insertFakeAccounts() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 100; i++) {
            const account = {
                name: faker_1.faker.company.name(),
                industry: industries[Math.floor(Math.random() * industries.length)],
                size: Math.floor(Math.random() * 10) * 100 + Math.floor(Math.random() * 10),
                country: faker_1.faker.location.country(),
            };
            (0, account_1.createAccount)(account)
                .catch((error) => console.error("error creating account: ", error));
        }
    });
}
exports.insertFakeAccounts = insertFakeAccounts;
