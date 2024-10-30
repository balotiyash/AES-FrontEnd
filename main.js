/** 
 * File: main.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the home page (index).
 * Created on: 13/10/2024
 * Last Modified: 30/10/2024
*/

// Login btn navigation
document.getElementById("loginBtn").addEventListener("click", () => {
    window.location.href = './shared/view/loginPage.html';
});

// Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
    window.localStorage.removeItem("token");
    window.location.reload();
});

import { IP, PORT } from './config.js';

// Fetching data for home page
async function fetchTopSellingProducts() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/top-sellers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayTopSellingProducts(data);

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function fetchNewArrivals() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/new-arrivals`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayNewArrivals(data);

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// You can call these functions separately, for example:
async function fetchProducts() {
    await fetchTopSellingProducts();
    await fetchNewArrivals();
}

function displayTopSellingProducts(data) {
    console.log(data);
    shuffleArray(data);

    const itemsToShow = data.slice(0, 4);
    const topSellDiv = document.getElementById('topSelling');

    itemsToShow.forEach(product => {
        const productCard = createProductCard(product);
        topSellDiv.appendChild(productCard);
    });
}

function displayNewArrivals(data) {
    console.log(data);
    shuffleArray(data);

    const itemsToShow = data.slice(0, 4);
    const newArrivalsDiv = document.getElementById('newArrivals');

    itemsToShow.forEach(product => {
        const productCard = createProductCard(product);
        newArrivalsDiv.appendChild(productCard);
    });
}

function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';

    const productImage = document.createElement('img');
    productImage.src = product.product_image;
    productImage.alt = product.product_name;

    const productName = document.createElement('h6');
    productName.textContent = product.product_name;

    const button = document.createElement('button');
    button.textContent = 'Know more';

    // Add event listener to the button
    button.addEventListener('click', () => showDescription(product.product_id));

    const span = document.createElement('span');
    span.appendChild(productName);
    span.appendChild(button);

    productCard.appendChild(productImage);
    productCard.appendChild(span);

    return productCard;
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to show product description
function showDescription(productId) {
    window.location.href = "./user/view/product-description.html?product_id=" + productId;    
}

async function hitStats() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/hit`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

    } catch (error) {
        console.error('Error hitting page reach: ', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    hitStats();
});