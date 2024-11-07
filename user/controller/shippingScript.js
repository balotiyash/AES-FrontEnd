/** 
 * File: user/controller/shippingScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the address page of shipping page. It contains a function to fetch shipping address from server (existing) or to add new address
 * Created on: 30/10/2024
 * Last Modified: 07/11/2024
*/

import { IP, PORT } from '../../config.js';

// Utility function to format currency
const formatCurrency = (amount) => amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
const token = window.localStorage.getItem("token");

// Function to fetch existing address
async function fetchUserProfile() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/user/getUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const userData = await response.json();
        populateAddressSelect(userData.addresses);
        updateSummary();
    } catch (error) {
        console.error('Error during Fetching User Profile:', error);
    }
}

// Function to add addresses in select tag
// Function to add addresses in select tag
function populateAddressSelect(addresses) {
    const selectElement = document.getElementById('addressSelect');
    addresses.forEach(addressObject => {
        // Extract the address and id from the object
        const address = addressObject.address;
        const id = addressObject.id;
        
        // Create option element, using address for the display text, and id for the value
        const option = new Option(address.toUpperCase(), address.toLowerCase());
        
        // Add the option to the select element
        selectElement.add(option);
    });
}

// Function to update summary section
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

// On load
document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is logged in then only this page will be accessable
    if (window.localStorage.getItem('isLoggedin') != "true" || window.localStorage.getItem("role") == "admin") {
        history.replaceState(null, '', '../../shared/view/loginPage.html');
        window.localStorage.clear();

        window.onpopstate = function (event) {
            if (!localStorage.getItem('isLoggedin') || localStorage.getItem("role") == "admin") {
                window.location.replace('../../shared/view/loginPage.html');
            }
        };
    } else {
        window.onpopstate = function (event) { };
    }

    fetchUserProfile();

    const selectElement = document.getElementById('addressSelect');
    const addrFields = [
        'streetAdd1', 'streetAdd2', 'streetAdd3',
        'cityTxt', 'landmarkTxt', 'stateTxt', 'pinCode'
    ].map(id => document.getElementById(id)); // Collect input fields

    // Event listener for address selection (either from dropdown or manual entry)
    selectElement.addEventListener('change', () => {
        const isAddressSelected = selectElement.value !== "";
        addrFields.forEach(field => field.disabled = isAddressSelected);

        // Disable additional input fields (if any) when an address is selected
        const additionalInputs = document.querySelectorAll('.inputTxt');
        additionalInputs.forEach(input => input.disabled = isAddressSelected);
    });

    // Event listener for checkout button
    document.getElementById("checkout-btn").addEventListener("click", async () => {
        let address = selectElement.value || addrFields.map(el => el.value).join(' ').trim();
        const phoneNo = document.getElementById('phoneTxt').value;

        // Validate that an address is entered or selected
        if (!address || (selectElement.value === "" && addrFields.some(el => !el.value.trim()))) {
            alert('Please select or enter a valid address to proceed');
            return;
        }

        // Validate that a phone number is entered
        if (!phoneNo) {
            alert('Please enter a phone number to proceed');
            return;
        }

        // Validate pin code using regex (assuming 6 digits numeric pin code for India)
        // const pinCodeRegex = /^\d{6}$/; // 6 digits
        // if (pinCode && !pinCodeRegex.test(pinCode)) {
        //     alert('Please enter a valid 6-digit pin code');
        //     return;
        // }

        // Store data in localStorage and redirect to payment page
        window.localStorage.setItem('address', address);
        window.localStorage.setItem('phoneNo', phoneNo);

        // Redirect to payment page
        window.location.href = './payment-page.html';
    });
});
