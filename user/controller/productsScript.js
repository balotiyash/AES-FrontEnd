/** 
 * File: user/controller/productsScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the all products page.
 * Created on: 14/10/2024
 * Last Modified: 24/10/2024
*/

import { IP, PORT } from '../../config.js';

const PRODUCTS_PER_PAGE = 10;
let currentPage = 1;
let allProducts = [];

// Function to fetch all products from server
async function fetchProducts() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/allProducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const products = await response.json();
        console.log('User data:', products);

        if (products) {
            // Left side
            const sideMenu = document.getElementById('side-menu');

            // Group products by category
            const categoryMap = {};

            products.forEach(product => {
                const { product_category, product_name, product_id } = product; // Ensure product_id is included
                if (!categoryMap[product_category]) {
                    categoryMap[product_category] = [];
                }
                categoryMap[product_category].push({ name: product_name, id: product_id }); // Store both name and id
            });

            // Generate sidebar menu
            for (const [category, items] of Object.entries(categoryMap)) {
                const categoryHeader = document.createElement('b');
                categoryHeader.textContent = category;
                sideMenu.appendChild(categoryHeader);

                const ul = document.createElement('ul');
                items.forEach(item => {
                    const li = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = `./product-description.html?product_id=${item.id}`; // Use the correct product ID
                    link.textContent = item.name; // Display the product name
                    li.appendChild(link);
                    ul.appendChild(li);
                });

                sideMenu.appendChild(ul);
                sideMenu.appendChild(document.createElement('br')); // Add spacing between categories
            }

            // Right side
            const productContainer = document.getElementById('product-container');

            products.forEach(product => {
                // To create Div
                const productDiv = document.createElement('div');
                productDiv.classList.add('product-div');

                // To create image
                const imgDiv = document.createElement('div');
                imgDiv.classList.add('product-img-div');
                const img = document.createElement('img');
                img.src = product.product_image;
                img.alt = product.product_name;
                img.classList.add('product-img');
                imgDiv.appendChild(img);

                // To create description div
                const descDiv = document.createElement('div');
                descDiv.classList.add('product-desc');

                // To add title
                const title = document.createElement('b');
                title.textContent = product.product_name;

                // To add description
                const desc = document.createElement('p');
                desc.textContent = `${product.product_desc.substring(0, 200)}...`;

                // To add view detail button
                const button = document.createElement('button');
                button.classList.add('view-btn');
                button.textContent = 'View Details';
                button.id = product.product_id;
                button.addEventListener("click", () => {
                    window.location.href = "./product-description.html?product_id=" + product.product_id;
                });

                // To append every thing on the screen inside divs
                descDiv.appendChild(title);
                descDiv.appendChild(desc);
                descDiv.appendChild(button);

                productDiv.appendChild(imgDiv);
                productDiv.appendChild(descDiv);

                productContainer.appendChild(productDiv);
            });
        };
    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}

function renderProducts() {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; // Clear previous products

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const productsToShow = allProducts.slice(start, end);

    productsToShow.forEach(product => {
        // (Existing product rendering code here...)
    });
}

function updatePaginationControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
        updatePaginationControls();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
        updatePaginationControls();
    }
});

fetchProducts();