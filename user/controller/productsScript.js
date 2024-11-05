/** 
 * File: user/controller/productsScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the all products page. Here we have several functionf to fetch, arrange, align, generate product card etc along with pagination.
 * Created on: 14/10/2024
 * Last Modified: 05/11/2024
*/

import { IP, PORT } from '../../config.js';

const PRODUCTS_PER_PAGE = 10;
let currentPage = 1;
let allProducts = [];

// Helper function to create product image section
function createProductImage(product) {
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('product-img-div');
    const img = document.createElement('img');
    img.src = product.product_image;
    img.alt = product.product_name;
    img.classList.add('product-img');
    imgDiv.appendChild(img);
    return imgDiv;
}

// Helper function to create product description section
function createProductDescription(product) {
    const descDiv = document.createElement('div');
    descDiv.classList.add('product-desc');

    const title = document.createElement('b');
    title.textContent = product.product_name;

    const desc = document.createElement('p');
    desc.textContent = `${product.product_desc.substring(0, 200)}...`;

    const button = document.createElement('button');
    button.classList.add('view-btn');
    button.textContent = 'View Details';
    button.id = product.product_id;
    button.addEventListener("click", () => {
        window.location.href = `./product-description.html?product_id=${product.product_id}`;
    });

    descDiv.appendChild(title);
    descDiv.appendChild(desc);
    descDiv.appendChild(button);
    return descDiv;
}

// Helper function to create the product container div
function createProductDiv(product) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product-div');
    productDiv.appendChild(createProductImage(product));
    productDiv.appendChild(createProductDescription(product));
    return productDiv;
}

// Helper function to create the category sidebar menu
function createSidebarMenu(products) {
    const sideMenu = document.getElementById('side-menu');
    sideMenu.innerHTML = '';  // Clear any existing content
    const categoryMap = {};

    products.forEach(product => {
        const { product_category, product_name, product_id } = product;
        if (!categoryMap[product_category]) {
            categoryMap[product_category] = [];
        }
        categoryMap[product_category].push({ name: product_name, id: product_id });
    });

    // Populate the sidebar menu
    for (const [category, items] of Object.entries(categoryMap)) {
        const categoryHeader = document.createElement('b');
        categoryHeader.textContent = category;
        sideMenu.appendChild(categoryHeader);

        const ul = document.createElement('ul');
        items.forEach(item => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `./product-description.html?product_id=${item.id}`;
            link.textContent = item.name;
            li.appendChild(link);
            ul.appendChild(li);
        });

        sideMenu.appendChild(ul);
        sideMenu.appendChild(document.createElement('br'));
    }
}

// Helper function to update pagination controls
function updatePaginationControls() {
    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Helper function to handle pagination button clicks
function handlePaginationButtonClick(buttonType) {
    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);

    if (buttonType === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (buttonType === 'next' && currentPage < totalPages) {
        currentPage++;
    }

    renderProducts();
    updatePaginationControls();
}

// Helper function to render pagination controls
function renderPagination() {
    const paginationContainer = document.getElementById('pagination-controls');
    paginationContainer.innerHTML = '';  // Clear existing pagination buttons

    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);

    if (totalPages > 1) {
        // Previous Page button
        const prevBtn = createPaginationButton('Previous', 'prev', currentPage === 1);
        paginationContainer.appendChild(prevBtn);

        // Page Number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPaginationButton(i, 'page', i === currentPage);
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderProducts();
                updatePaginationControls();
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next Page button
        const nextBtn = createPaginationButton('Next', 'next', currentPage === totalPages);
        paginationContainer.appendChild(nextBtn);
    }
}

// Helper function to create pagination buttons
function createPaginationButton(text, type, isDisabled) {
    const button = document.createElement('button');
    button.textContent = text;
    button.disabled = isDisabled;
    button.id = `${type}-btn`;
    button.addEventListener('click', () => handlePaginationButtonClick(type));
    return button;
}

// Function to render products for the current page
function renderProducts() {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; // Clear previous products

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const productsToShow = allProducts.slice(start, end);

    productsToShow.forEach(product => {
        productContainer.appendChild(createProductDiv(product));
    });

    renderPagination();  // Render pagination controls
}

// Function to fetch all products from the server
async function fetchProducts() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/allProducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('HTTP request was not OK');
        }

        const products = await response.json();

        if (products) {
            allProducts = products;
            createSidebarMenu(products);  // Create sidebar menu
            renderProducts();  // Render products based on current page
        }
    } catch (error) {
        console.error('Error during Fetching Products:', error);
    }
}

// Initialize products on page load
window.onload = fetchProducts;