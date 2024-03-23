import {faker} from '@faker-js/faker';
import {AppUserDTO, createAppUser} from "../repositories/user";
import {assignToRole, createRole} from "../repositories/role";


export async function insertFakeAppUsers() {

    const createRoleTasks = [
        "Admin",
        "User"
    ].map((role: string) => {
        createRole({name: role})
    })

    Promise.all(createRoleTasks)
        .then(() => {
            for (let i = 0; i < 10; i++) {
                const appUser = {
                    first_name: faker.person.firstName(),
                    last_name: faker.person.lastName(),
                    username: faker.internet.userName(),
                    email: faker.internet.email(),
                    password: "password"
                }

                createAppUser(appUser)
                    .then((response: AppUserDTO) => assignToRole(response.id, i === 0 ? 1 : 2))
            }
        })


}
