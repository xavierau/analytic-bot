import {faker} from '@faker-js/faker';
import {AccountDTO, getAllAccounts} from "../repositories/account";
import {ContactDTO, createContact} from "../repositories/contact";


export async function insertFakeContacts() {
    return getAllAccounts()
        .then((accounts: AccountDTO[]) => {

            accounts.forEach((account: AccountDTO) => {

                console.log(account)

                const number_of_contacts = Math.ceil(Math.random() * 20)

                for (let i = 0; i < number_of_contacts; i++) {
                    const contact: Omit<ContactDTO, "id"> = {
                        account_id: account.id,
                        email: faker.internet.email(),
                        first_name: faker.person.firstName(),
                        last_name: faker.person.lastName(),
                        job_title: faker.person.jobTitle(),
                        phone: faker.phone.number()
                    }
                    createContact(contact)
                        .catch((error) => console.error("error creating contact: ", error))
                }
            })
        })
}

