/** 
 * File: prod_manageScript.js
 * Author: Atharv Mirgal
 * Description: This page contains all the js code for the product management page
 * Created on: 13/10/2024
 * Last Modified: 13/10/2024
*/
import { IP, PORT } from '../../config.js';

function fetchProducts() {
    fetch(`http://${IP}:${PORT}/public/allProducts`)
        .then(response => {
            // Check if the response is OK (status in the range 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON from the response
        })
        .then(data => {
            // Call the function to display the products
            displayProducts(data); 
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayProducts(products) {
    const productList = document.getElementById('product-grid');
    productList.innerHTML = ''; // Clear the existing content

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('card');
        productDiv.style.width = '18rem'; // Set width of the card

        productDiv.innerHTML = `
            <span class="dot"></span>
            <i class="fa-solid fa-trash-can trash-can" style="color: #000000;"></i>
            <img src="${product.product_image}" class="card-img-top" alt="${product.product_name}">
            <div class="card-body">
                <p class="card-text">${product.product_name}</p>
            </div>
        `;

        productList.appendChild(productDiv);
    });
}

// Call the fetch function to load products when the page is loaded
window.onload = fetchProducts;
