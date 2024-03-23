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
exports.insertFakeContacts = void 0;
const faker_1 = require("@faker-js/faker");
const account_1 = require("../repositories/account");
const contact_1 = require("../repositories/contact");
function insertFakeContacts() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, account_1.getAllAccounts)()
            .then((accounts) => {
            accounts.forEach((account) => {
                console.log(account);
                const number_of_contacts = Math.ceil(Math.random() * 20);
                for (let i = 0; i < number_of_contacts; i++) {
                    const contact = {
                        account_id: account.id,
                        email: faker_1.faker.internet.email(),
                        first_name: faker_1.faker.person.firstName(),
                        last_name: faker_1.faker.person.lastName(),
                        job_title: faker_1.faker.person.jobTitle(),
                        phone: faker_1.faker.phone.number()
                    };
                    (0, contact_1.createContact)(contact)
                        .catch((error) => console.error("error creating contact: ", error));
                }
            });
        });
    });
}
exports.insertFakeContacts = insertFakeContacts;
