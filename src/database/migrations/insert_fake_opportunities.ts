import {faker} from '@faker-js/faker';
import {createOpportunity, createOpportunityProduct, OpportunityDTO} from "../repositories/opportunity";
import {getRandomAccounts} from "../repositories/account";
import {getAllProducts} from "../repositories/product";


export async function insertFakeOpportunities() {
    const fromDate = new Date("2023-01-01")
    const toDate = new Date("2024-12-31")

    const products = await getAllProducts()

    for (let i = 0; i < 500; i++) {

        getRandomAccounts(1)
            .then((accounts) => {
                const account = accounts[0]

                const closeDate = faker.date.between({
                    from: fromDate,
                    to: toDate
                })

                const opportunity: Omit<OpportunityDTO, 'id'> = {
                    name: faker.word.words(),
                    stage: ['suspect', 'prospect', 'proposal', 'won', 'lost'][Math.floor(Math.random() * 5)],
                    close_date: closeDate
                }

                createOpportunity(account.id, opportunity)
                    .then((response: OpportunityDTO) => {

                        const numberOfProducts = Math.floor(Math.random() * 5) + 10

                        const selectedProducts: number[] = []

                        for (let i = 0; i < numberOfProducts; i++) {
                            // not selected products
                            let product = products[Math.floor(Math.random() * products.length)]
                            while (selectedProducts.includes(product.id)) {
                                product = products[Math.floor(Math.random() * products.length)]
                            }
                            selectedProducts.push(product.id)


                            createOpportunityProduct({
                                opportunity_id: response.id,
                                product_id: product.id,
                                amount: parseFloat(faker.commerce.price({min: 10, max: 1000})),
                                quantity: Math.floor(Math.random() * 10) + 1
                            })
                                .catch((error) => console.error('opportunity product create error: ', error))
                        }
                    })
            })
    }
}
