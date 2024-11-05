/** 
 * File: main.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the home page (index). This file include several functions to fetch and display top selling and new arrival products. As the products data is recieved from the backend it is shuffled and trimed only 1st 4 items and displayed it using dynamically creacted product card.
 * Created on: 13/10/2024
 * Last Modified: 05/11/2024
*/

import { IP, PORT } from './config.js';

// Login btn navigation through home page
document.getElementById("loginBtn").addEventListener("click", () => {
    window.location.href = './shared/view/loginPage.html';
});

// Logout button function
document.getElementById("logoutBtn").addEventListener("click", () => {
    window.localStorage.removeItem("token");
    window.location.reload();
});

// Function to fetch top selling products data for home page
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

// Function to fetch new arrival products data for home page
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

// Function to trim 4 top selling products by shuffling the recieved product array
function displayTopSellingProducts(data) {
    shuffleArray(data);

    const itemsToShow = data.slice(0, 4);
    const topSellDiv = document.getElementById('topSelling');

    itemsToShow.forEach(product => {
        const productCard = createProductCard(product);
        topSellDiv.appendChild(productCard);
    });
}

// Function to trim 4 new arrival products by shuffling the recieved product array
function displayNewArrivals(data) {
    shuffleArray(data);

    const itemsToShow = data.slice(0, 4);
    const newArrivalsDiv = document.getElementById('newArrivals');

    itemsToShow.forEach(product => {
        const productCard = createProductCard(product);
        newArrivalsDiv.appendChild(productCard);
    });
}

// Function to create product card dynamically using the details recieved of the products
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

// Function to show product description on click on know more button of individual product card
function showDescription(productId) {
    window.location.href = "./user/view/product-description.html?product_id=" + productId;
}

// Function to send page visit data to the backend to measure page reach
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

// Function to run on load of the page
document.addEventListener("DOMContentLoaded", async () => {
    await fetchTopSellingProducts();
    await fetchNewArrivals();
    hitStats();
});