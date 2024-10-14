/** 
 * File: user/controller/contactUsScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the contact us page.
 * Created on: 14/10/2024
 * Last Modified: 14/10/2024
*/

import { IP, PORT } from '../../config.js';

// Fetch and display products grouped by category
async function fetchAndDisplayProducts() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/allProducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const products = await response.json();
        console.log('Fetched products:', products);

        const sideMenu = document.getElementById('side-menu');
        const categoryMap = {};

        products.forEach(product => {
            const { product_category, product_name, product_id } = product; // Assuming product_id exists
            if (!categoryMap[product_category]) {
                categoryMap[product_category] = [];
            }
            categoryMap[product_category].push({ name: product_name, id: product_id });
        });

        for (const [category, items] of Object.entries(categoryMap)) {
            const categoryHeader = document.createElement('b');
            categoryHeader.textContent = category;
            sideMenu.appendChild(categoryHeader);

            const ul = document.createElement('ul');
            items.forEach(item => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = `./product-description.html?product_id=${item.id}`; // Update with actual links if available
                link.textContent = item.name;
                li.appendChild(link);
                ul.appendChild(li);
            });

            sideMenu.appendChild(ul);
            sideMenu.appendChild(document.createElement('br')); // Add spacing between categories
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        // Optionally, display a user-friendly error message
    }
}

// Product ID from URL
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const product_id = url.searchParams.get('product_id');

// Fetch and display product details based on product_id from URL
async function fetchProductDetails() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/getProduct/${product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        const product = await response.json();
        console.log('Fetched product details:', product);

        if (product) {
            document.getElementById("productImg").src = product.product_images[0];
            document.getElementById("productTitle").innerHTML = product.product_name;
            document.getElementById("productDesc").innerHTML = product.product_desc;
            document.getElementById("productPrice").innerHTML = `Rs. ${product.product_price}`;
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        // Optionally, display a user-friendly error message
    }
}

// Fetch and display product add to cart or inc dec
async function fetchCartDetails() {
    const token = window.localStorage.getItem("token");

    try {
        const response = await fetch(`http://${IP}:${PORT}/cart/items`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        const product = await response;
        console.log('Fetched cart details:', product);

        
    } catch (error) {
        console.error('Error fetching product details:', error);
        // Optionally, display a user-friendly error message
    }
}

fetchAndDisplayProducts();
fetchProductDetails();
fetchCartDetails();