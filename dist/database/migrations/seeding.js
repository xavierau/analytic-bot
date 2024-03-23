"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const insert_fake_accounts_1 = require("./insert_fake_accounts");
const insert_fake_users_1 = require("./insert_fake_users");
const insert_fake_contacts_1 = require("./insert_fake_contacts");
const insert_fake_products_1 = require("./insert_fake_products");
const insert_fake_opportunities_1 = require("./insert_fake_opportunities");
[
    insert_fake_users_1.insertFakeAppUsers,
    insert_fake_accounts_1.insertFakeAccounts,
    insert_fake_contacts_1.insertFakeContacts,
    insert_fake_products_1.insertFakeProducts,
    insert_fake_opportunities_1.insertFakeOpportunities,
].forEach((seeder => seeder()));
