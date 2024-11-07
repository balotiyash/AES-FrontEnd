/** 
 * File: product/controller/prod_manageScript.js
 * Author: Atharv Mirgal
 * Description: This file contains JS code for the product management page.
 * Created on: 13/10/2024
 * Last Modified: 07/11/2024
 */

import { IP, PORT } from '../../config.js';

let allProducts = [];

// Function to fetch all products from server
async function fetchProducts() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/allProducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        allProducts = await response.json();

        renderProducts(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Function to render all products
function renderProducts(products) {
    const productContainer = document.getElementById('bodyy');
    productContainer.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('card');
        productDiv.style.width = '18rem';

        productDiv.addEventListener('click', () => {
            window.location.href = `./prod_description.html?product_id=${product.product_id}`;
        });

        const img = document.createElement('img');
        img.src = product.product_image;
        img.alt = product.product_name;
        img.classList.add('card-img-top');
        productDiv.appendChild(img);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const productName = document.createElement('p');
        productName.classList.add('card-text');
        productName.textContent = product.product_name;
        cardBody.appendChild(productName);

        productDiv.appendChild(cardBody);
        productContainer.appendChild(productDiv);
    });
}

// add btn click handler
document.getElementById("addBtn").addEventListener("click", () => {
    window.location.href = "./prod_info.html";
});

// Fetch and render products on page load
fetchProducts();
