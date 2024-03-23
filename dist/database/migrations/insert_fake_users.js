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
exports.insertFakeAppUsers = void 0;
const faker_1 = require("@faker-js/faker");
const user_1 = require("../repositories/user");
const role_1 = require("../repositories/role");
function insertFakeAppUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const createRoleTasks = [
            "Admin",
            "User"
        ].map((role) => {
            (0, role_1.createRole)({ name: role });
        });
        Promise.all(createRoleTasks)
            .then(() => {
            for (let i = 0; i < 10; i++) {
                const appUser = {
                    first_name: faker_1.faker.person.firstName(),
                    last_name: faker_1.faker.person.lastName(),
                    username: faker_1.faker.internet.userName(),
                    email: faker_1.faker.internet.email(),
                    password: "password"
                };
                (0, user_1.createAppUser)(appUser)
                    .then((response) => (0, role_1.assignToRole)(response.id, i === 0 ? 1 : 2));
            }
        });
    });
}
exports.insertFakeAppUsers = insertFakeAppUsers;
