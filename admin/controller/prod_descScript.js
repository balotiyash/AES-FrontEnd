/** 
 * File: product/controller/prod_descScript.js
 * Author: Atharv Mirgal
 * Description: This file contains JS code for the product description page.
 * Created on: 31/10/2024
 * Last Modified: 31/10/2024
 */

import { IP, PORT } from '../../config.js';


const fetchProductDetails = async () => {
    try {
        // Product ID from URL
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const product_id = url.searchParams.get('product_id');
        const response = await fetch(`http://${IP}:${PORT}/public/getProduct/${product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        const product = await response.json();
        console.log('Fetched product:', product);

        renderProductDetails(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};

// Function to render product details
const renderProductDetails = (product) => {
    const productContainer = document.getElementById('product-container');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('magnified-img');
    const image = document.createElement('img');
    image.classList.add('img');
    image.src = product.product_images[0];
    image.alt = product.product_name;
    imageDiv.appendChild(image);

    const productContainerDiv = document.createElement('div');
    productContainerDiv.classList.add('prod-desc');
    const productDetailsContainer = document.createElement('div');
    productDetailsContainer.classList.add('details');
    productContainerDiv.appendChild(productDetailsContainer);

    const productName = document.createElement('span');
    productName.classList.add('p_name');
    productName.textContent = product.product_name;
    productDetailsContainer.appendChild(productName);
    productDetailsContainer.appendChild(document.createElement('br'));
    productDetailsContainer.appendChild(document.createElement('br'));

    const productDesc = document.createElement('p');
    productDesc.classList.add('description');
    productDesc.textContent = product.product_desc.slice(0, 300) + '...';
    productDetailsContainer.appendChild(productDesc);

    const productPrice = document.createElement('span');
    productPrice.classList.add('prod-price');
    productPrice.textContent = 'Price: ₹' + product.product_price;
    productDetailsContainer.appendChild(productPrice);
    productDetailsContainer.appendChild(document.createElement('br'));
    productDetailsContainer.appendChild(document.createElement('br'));

    const editButton = document.createElement('button');
    editButton.classList.add('btn');
    editButton.classList.add('btn-info');
    editButton.textContent = 'Edit item';
    editButton.onclick = () => {
        window.location.href = `http://${IP}:${PORT}/admin/editProduct?product_id=${product.product_id}`;
    };
    productDetailsContainer.appendChild(editButton);

    productContainer.appendChild(imageDiv);
    productContainer.appendChild(productContainerDiv);
};

onload = async function () {
    await fetchProductDetails();
}