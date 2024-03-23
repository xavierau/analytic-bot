import {faker} from '@faker-js/faker';
import {AppUserDTO, createAppUser} from "../repositories/user";
import {assignToRole, createRole} from "../repositories/role";
import {createProduct, ProductDTO} from "../repositories/product";


export async function insertFakeProducts() {

    for(let i= 0; i < 100; i++) {
        const product:Omit<ProductDTO, 'id'> = {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price({min: 10, max: 1000})),
        }

        createProduct(product)
            .catch((error) => console.error('product create error: ', error))
    }
}
