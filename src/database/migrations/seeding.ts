import {insertFakeAccounts} from "./insert_fake_accounts";
import {insertFakeAppUsers} from "./insert_fake_users";
import {insertFakeContacts} from "./insert_fake_contacts";
import {insertFakeProducts} from "./insert_fake_products";
import {insertFakeOpportunities} from "./insert_fake_opportunities";

[
    insertFakeAppUsers,
    insertFakeAccounts,
    insertFakeContacts,
    insertFakeProducts,
    insertFakeOpportunities,
].forEach((seeder => seeder()))
