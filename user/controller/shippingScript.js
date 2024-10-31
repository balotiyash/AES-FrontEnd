/** 
 * File: user/controller/shippingScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the address page of shipping page.
 * Created on: 30/10/2024
 * Last Modified: 30/10/2024
*/

import { IP, PORT } from '../../config.js';

// Utility function to format currency
const formatCurrency = (amount) => amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
const token = window.localStorage.getItem("token");

async function fetchUserProfile() {

    try {
        const response = await fetch(`http://${IP}:${PORT}/user/getUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) throw new Error('Failed to Fetch User Data');

        const userData = await response.json();
        populateAddressSelect(userData.addresses);
        updateSummary();
    } catch (error) {
        console.error('Error during Fetching User Profile:', error);
    }
}

function populateAddressSelect(addresses) {
    const selectElement = document.getElementById('addressSelect');
    addresses.forEach(address => {
        const option = new Option(address, address); // Create option element
        selectElement.add(option);
    });
}

function updateSummary() {
    const subtotal = parseFloat(window.localStorage.getItem("subtotal")) || 0; // Fallback to 0
    const tax = subtotal * 0.18;
    const shipping = 3000;
    const total = subtotal + shipping + tax;

    document.querySelector('.summary-sec .subtotal').textContent = formatCurrency(subtotal);
    document.querySelector('.summary-sec .tax').textContent = formatCurrency(tax);
    document.querySelector('.summary-sec .shipping').textContent = formatCurrency(shipping);
    document.querySelector('.summary-sec .total-text').textContent = formatCurrency(total);
}

window.onload = fetchUserProfile;

document.addEventListener("DOMContentLoaded", () => {
    const selectElement = document.getElementById('addressSelect');
    const addrFields = [
        'streetAdd1', 'streetAdd2', 'streetAdd3',
        'cityTxt', 'landmarkTxt', 'stateTxt', 'pinCode'
    ].map(id => document.getElementById(id)); // Collect input fields

    selectElement.addEventListener('change', () => {
        const isAddressSelected = selectElement.value !== "";
        addrFields.forEach(field => field.disabled = isAddressSelected);

        // Disable additional input fields if necessary
        const additionalInputs = document.querySelectorAll('.inputTxt');
        additionalInputs.forEach(input => input.disabled = isAddressSelected);
    });

    document.getElementById("checkout-btn").addEventListener("click", async () => {
        const address = selectElement.value || addrFields.map(el => el.value).join(' ').trim();
        const phoneNo = document.getElementById('phoneTxt').value;

        if (!address) {
            alert('Please select or enter an address to proceed');
            return;
        } else if (!phoneNo) {
            alert('Please enter a phone number to proceed');
            return;
        }

        window.location.href = './payment-page.html';
        window.localStorage.setItem('address', address);
        window.localStorage.setItem('phoneNo', phoneNo);
    });
});
