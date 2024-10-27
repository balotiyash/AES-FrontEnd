/** 
 * File: prod_manageScript.js
 * Author: Atharv Mirgal
 * Description: This page contains all the js code for the product management page
 * Created on: 13/10/2024
 * Last Modified: 13/10/2024
*/
import { IP, PORT } from '../../config.js';

const fetchProducts = async () => {
    const response = await fetch(`http://${IP}:${PORT}/public/allProducts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }

    const products = await response.json();
    console.log('Fetched products:', products);

    const productList = document.getElementById('bodyy');
    productList.innerHTML = '';

    productList.innerHTML = products.map(product => `
        <div class="card" style="width: 18rem;">
            <img src="${product.product_image}" class="card-img-top" alt="${product.product_name}">
            <div class="card-body">
                <p class="card-text">${product.product_name}</p>
            </div>
        </div>
    `).join('');
};

window.onload = fetchProducts();