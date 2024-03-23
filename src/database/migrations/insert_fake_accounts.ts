import {faker} from '@faker-js/faker';
import {AccountDTO, createAccount} from "../repositories/account";


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
]

export async function insertFakeAccounts() {
    for (let i = 0; i < 100; i++) {
        const account = {
            name: faker.company.name(),
            industry: industries[Math.floor(Math.random() * industries.length)],
            size: Math.floor(Math.random() * 10) * 100 + Math.floor(Math.random() * 10),
            country: faker.location.country(),
        }

        createAccount(account)
            .catch((error) => console.error("error creating account: ", error))
    }
}




