/** 
 * File: product/controller/offline_order_manageScript.js
 * Author: Atharv Mirgal
 * Description: This file contains JS code for the offline product management page.
 * Created on: 02/11/2024
 * Last Modified: 02/11/2024
 */

import { IP, PORT } from '../../config.js';

function capitalizeFirstLetter(str) {
    return str
        .toLowerCase()
        .split(' ')  // Split the string by spaces
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const fetchUserProfile = async (username) => {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/getUserByUsername/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to Fetch User Data');
        }

        const userData = await response.json();
        console.log(userData.addresses);

        fillFormDetails(userData);
    } catch (err) {
        console.error('Error during Fetching User Profile:', err);
    }
};

const fillFormDetails = (userData) => {
    // Clear existing details
    let email = document.getElementById('emailTxt');
    let name = document.getElementById('nameTxt');
    let addressOptions = document.getElementById('addressSelect');

    // Display user details
    email.value = userData.email;
    name.value = capitalizeFirstLetter(userData.name);

    // Display addresses
    userData.addresses.forEach((address, index) => {
        const option = document.createElement('option');
        option.value = address;
        option.text = address;
        addressOptions.appendChild(option);
    });
};

document.getElementById('usernameTxt').addEventListener('change', (event) => {
    const username = event.target.value;
    fetchUserProfile(username);
});



document.getElementById('addProductButton').addEventListener('click', function() {
    // Create a new div to hold the product fields
    const productFieldsDiv = document.createElement('div');
    productFieldsDiv.classList.add('input-div');

    // Create and append the select element for product
    const select = document.createElement('select');
    select.name = 'product';
    select.innerHTML = `
        <option value="" disabled selected hidden>Select a product</option>
        <option value="a">Product A</option>
        <option value="b">Product B</option>
        <option value="c">Product C</option>
    `;
    productFieldsDiv.appendChild(select);

    // Create and append the price input
   const priceDiv = document.createElement('div');
   priceDiv.classList.add('input-div');
    const priceInput = document.createElement('input');
    priceInput.type = 'text';
    priceInput.placeholder = 'Price';
    priceInput.name = 'price';
    productFieldsDiv.appendChild(priceInput);

    // Create and append the profit input
    const profitInput = document.createElement('input');
    profitInput.type = 'text';
    profitInput.placeholder = 'Profit';
    profitInput.name = 'profit';
    productFieldsDiv.appendChild(profitInput);

    // Create and append the quantity input
    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.placeholder = 'Quantity';
    quantityInput.name = 'quantity';
    productFieldsDiv.appendChild(quantityInput);

    // Insert the new fields above the button
    const container = document.getElementById('productFieldsContainer');
    // container.insertBefore(productFieldsDiv, document.getElementById('addProductButton'));
    container.appendChild(productFieldsDiv);
 });
