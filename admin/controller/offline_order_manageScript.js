/** 
 * File: product/controller/offline_order_manageScript.js
 * Author: Atharv Mirgal
 * Description: This file contains JS code for the offline product management page.
 * Created on: 02/11/2024
 * Last Modified: 02/11/2024
 */

import { IP, PORT } from '../../config.js';

const token = window.localStorage.getItem('token');

let user = {}; // Object to store user details

const products = []; // Array to store all products

const selectedProductIds = []; // Array to track selected product IDs

const selectedProducts = []; // Array to store selected products in the required format

// Variables for order totals
let subtotal = 0;
const taxRate = 0.18; // 18% tax
const shippingCharges = 3000; // Fixed shipping cost
let taxAmount = 0;
let grandTotal = 0;

window.onload = async () => {
    await fetchProducts();
};

function capitalizeFirstLetter(str) {
    return str
        .toLowerCase()
        .split(' ')  // Split the string by spaces
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const fetchProducts = async () => {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/getAllProducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const localProducts = await response.json();

        products.push(...localProducts);

        // console.log('Products:', products);
    } catch (err) {
        console.error('Error during Fetching Products:', err);
    }
};

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
        user = userData;
        // console.log(userData.addresses);

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

const submitOrder = async () => {
    // Get the values from input fields
    const selectedAddress = document.getElementById('addressSelect').value;
    const line1 = document.getElementById('streetAdd1').value.trim();
    const line2 = document.getElementById('streetAdd2').value.trim();
    const line3 = document.getElementById('streetAdd3').value.trim();
    const city = document.getElementById('cityTxt').value.trim();
    const state = document.getElementById('stateTxt').value.trim();
    const postalCode = document.getElementById('pinCode').value.trim();
    const landmark = document.getElementById('landmarkTxt').value.trim();
    const phone = document.getElementById('phoneTxt').value.trim();

    // Check if all required fields have values
    if (
        (!selectedAddress && (line1 === "" || city === "" || state === "" || postalCode === "")) ||
        phone === ""
    ) {
        alert("All address fields and contact phone must be filled out.");
        return;
    }

    // Check if at least one product has been selected
    if (selectedProducts.length < 1) {
        alert("Please select at least one product for the order.");
        return;
    }

    // Construct the new address if necessary
    let newAddress = line1 + ', ' + line2 + ', ' + line3 + ', ' + city + ', ' + state + ', ' + postalCode + ', ' + landmark;
    const isNewAddress = !selectedAddress; // True if no address is selected

    const customer_id = user.id;

    const salesData = {
        customer_id: customer_id,
        shipping_address: isNewAddress ? newAddress : selectedAddress,
        contact_phone: phone,
        transaction_id: Math.floor(Math.random() * 1000000).toString(), // Random transaction ID
        order_id: Math.floor(Math.random() * 1000000).toString(), // Random order ID
    };

    const productsData = selectedProducts.map(product => {
        return {
            product_id: product.product_id,
            product_quantity: product.product_quantity,
            product_price: product.product_price,
            product_profit: product.product_profit
        };
    });

    const orderData = {
        sale: salesData,
        customer_id: customer_id,
        isNewAddress: isNewAddress,
        products: productsData
    };

    console.log('Order Data:', orderData);

    try {
        const response = await fetch(`http://${IP}:${PORT}/order/offline-checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Failed to Submit Order');
        }

        const orderResponse = await response.text();
        console.log('Order Response:', orderResponse);

        // Redirect to the order summary page
        // window.location.href = `./order_management.html`;
        alert('Order Submitted Successfully');
    } catch (err) {
        console.error('Error during Order Submission:', err);
        alert('Error during Order Submission: ' + err.message);
    }
};

document.getElementById('usernameTxt').addEventListener('change', (event) => {
    const username = event.target.value;
    fetchUserProfile(username);
});

// Function to update order totals
function updateOrderTotals() {
    // Calculate subtotal by summing up the product prices multiplied by their quantities
    subtotal = selectedProducts.reduce((total, product) => {
        return total + (product.product_price * product.product_quantity);
    }, 0);

    // Calculate tax
    taxAmount = subtotal * taxRate;

    // Calculate grand total
    grandTotal = subtotal + taxAmount + shippingCharges;

    // Log results to the console
    // console.log('Subtotal:', subtotal);
    // console.log('Tax (18%):', taxAmount);
    // console.log('Shipping Charges:', shippingCharges);
    // console.log('Grand Total:', grandTotal);

    // Display totals in the UI if needed
    document.getElementById('subtotal').textContent = `Rs. ${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `Rs. ${taxAmount.toFixed(2)}`;
    document.getElementById('shipping').textContent = `Rs. ${shippingCharges}`;
    document.getElementById('total-text').textContent = `Rs. ${grandTotal.toFixed(2)}`;
}

document.getElementById('addProductButton').addEventListener('click', function () {
    // Create a new div to hold the product fields
    const productFieldsDiv = document.createElement('div');
    productFieldsDiv.classList.add('input-div');

    // Create and append the select element for product
    const select = document.createElement('select');
    select.name = 'product';
    select.id = `productSelect-${Date.now()}`; // Unique ID for each select
    productFieldsDiv.appendChild(select);

    // Create and append the options for the select element, including a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a product';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Create and append the options for the select element, excluding already selected products
    products.forEach(product => {
        if (!selectedProductIds.includes(product.product_id)) {
            const option = document.createElement('option');
            option.value = product.product_id;
            option.textContent = product.product_name;
            select.appendChild(option);
        }
    });

    // Create and append the price input
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.placeholder = 'Price';
    priceInput.name = 'price';
    priceInput.id = 'priceInput';
    priceInput.readOnly = true; // Make it read-only
    productFieldsDiv.appendChild(priceInput);

    // Create and append the profit input
    const profitInput = document.createElement('input');
    profitInput.type = 'number';
    profitInput.placeholder = 'Profit';
    profitInput.name = 'profit';
    profitInput.id = 'profitInput';
    profitInput.readOnly = true; // Make it read-only
    productFieldsDiv.appendChild(profitInput);

    // Create and append the quantity input
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.placeholder = 'Quantity';
    quantityInput.name = 'quantity';
    productFieldsDiv.appendChild(quantityInput);

    // Insert the new fields above the button
    document.getElementById('productFieldsContainer').appendChild(productFieldsDiv);

    // Add event listener for product selection
    select.addEventListener('change', function () {
        const selectedProductId = select.value;
        const selectedProduct = products.find(product => product.product_id === selectedProductId);

        if (selectedProduct) {
            // Add the selected product ID to the tracking array
            selectedProductIds.push(selectedProductId);

            // Populate the price and profit inputs
            priceInput.value = selectedProduct.product_price || 0; // Replace with actual product property if different
            profitInput.value = selectedProduct.product_profit || 0; // Replace with actual product property if different
            quantityInput.value = 1; // Set default quantity to 1

            // Create or update the selected product object in the array
            const productObject = {
                product_id: selectedProduct.product_id,
                product_price: parseFloat(priceInput.value),
                product_profit: parseFloat(profitInput.value),
                product_quantity: parseFloat(quantityInput.value) || 0
            };

            // Check if the product is already in the array and update it, otherwise push it
            const existingProductIndex = selectedProducts.findIndex(
                product => product.product_id === selectedProduct.product_id
            );

            if (existingProductIndex > -1) {
                selectedProducts[existingProductIndex] = productObject;
            } else {
                selectedProducts.push(productObject);
            }

            // console.log('Selected Products:', selectedProducts);
            updateOrderTotals();

            // Disable the selected option in all other select elements
            document.querySelectorAll('select[name="product"]').forEach((otherSelect) => {
                if (otherSelect !== select) {
                    const optionToDisable = otherSelect.querySelector(`option[value="${selectedProductId}"]`);
                    if (optionToDisable) optionToDisable.disabled = true;
                }
            });
        } else {
            // Clear the inputs if no valid product is selected
            priceInput.value = '';
            profitInput.value = '';
        }
    });

    // Add event listener for quantity input change to update the selectedProducts array
    quantityInput.addEventListener('input', function () {
        const productId = select.value;
        const productIndex = selectedProducts.findIndex(product => product.product_id === productId);
        if (productIndex > -1) {
            selectedProducts[productIndex].product_quantity = parseFloat(quantityInput.value) || 0;
            // console.log('Updated Product Quantity:', selectedProducts);
        }

        updateOrderTotals();
    });
});

document.getElementById('checkout-btn').addEventListener('click', async () => {
    await submitOrder();
});

document.getElementById('addressSelect').addEventListener('change', function () {
    const addressSelect = document.getElementById('addressSelect');
    const streetAdd1 = document.getElementById('streetAdd1');
    const streetAdd2 = document.getElementById('streetAdd2');
    const streetAdd3 = document.getElementById('streetAdd3');
    const cityTxt = document.getElementById('cityTxt');
    const pinCode = document.getElementById('pinCode');
    const stateTxt = document.getElementById('stateTxt');
    const landmarkTxt = document.getElementById('landmarkTxt');

    // Check if a valid address is selected from the dropdown
    if (addressSelect.value) {
        // Disable and clear all address input fields
        streetAdd1.disabled = true;
        streetAdd1.value = '';
        streetAdd2.disabled = true;
        streetAdd2.value = '';
        streetAdd3.disabled = true;
        streetAdd3.value = '';
        cityTxt.disabled = true;
        cityTxt.value = '';
        pinCode.disabled = true;
        pinCode.value = '';
        stateTxt.disabled = true;
        stateTxt.value = '';
        landmarkTxt.disabled = true;
        landmarkTxt.value = '';
    } else {
        // Enable all address input fields if "Select Address" is chosen
        streetAdd1.disabled = false;
        streetAdd2.disabled = false;
        streetAdd3.disabled = false;
        cityTxt.disabled = false;
        pinCode.disabled = false;
        stateTxt.disabled = false;
        landmarkTxt.disabled = false;
    }
});

document.getElementById('addressSelect').addEventListener('change', function () {
    const addressSelect = document.getElementById('addressSelect');
    const streetAdd1 = document.getElementById('streetAdd1');
    const streetAdd2 = document.getElementById('streetAdd2');
    const streetAdd3 = document.getElementById('streetAdd3');
    const cityTxt = document.getElementById('cityTxt');
    const pinCode = document.getElementById('pinCode');
    const stateTxt = document.getElementById('stateTxt');
    const landmarkTxt = document.getElementById('landmarkTxt');

    // Check if a valid address is selected from the dropdown
    if (addressSelect.value) {
        // Clear and disable all address input fields
        streetAdd1.value = '';
        streetAdd1.disabled = true;
        streetAdd2.value = '';
        streetAdd2.disabled = true;
        streetAdd3.value = '';
        streetAdd3.disabled = true;
        cityTxt.value = '';
        cityTxt.disabled = true;
        pinCode.value = '';
        pinCode.disabled = true;
        stateTxt.value = '';
        stateTxt.disabled = true;
        landmarkTxt.value = '';
        landmarkTxt.disabled = true;
    } else {
        // Enable all address input fields if "Select Address" is chosen
        streetAdd1.disabled = false;
        streetAdd2.disabled = false;
        streetAdd3.disabled = false;
        cityTxt.disabled = false;
        pinCode.disabled = false;
        stateTxt.disabled = false;
        landmarkTxt.disabled = false;
    }
});

// Add event listeners to address input fields to monitor changes
const addressInputs = ['streetAdd1', 'streetAdd2', 'streetAdd3', 'cityTxt', 'pinCode', 'stateTxt', 'landmarkTxt'];
addressInputs.forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
        const addressSelect = document.getElementById('addressSelect');

        // Check if any of the address fields have a value
        const isAnyFieldFilled = addressInputs.some(id => document.getElementById(id).value.trim() !== '');

        // Keep the dropdown enabled even if data is filled
        if (isAnyFieldFilled) {
            addressSelect.disabled = false; // Ensure the dropdown stays enabled
        }
    });
});





