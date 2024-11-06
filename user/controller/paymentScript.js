/** 
 * File: user/controller/paymentScrpt.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the payments page. It consists function for razorpay integration to complete transaction, update cart/order and save transaction details.
 * Created on: 30/10/2024
 * Last Modified: 06/11/2024
*/

import { IP, PORT, RAZORPAY_KEY } from '../../config.js';

// Utility function to format numbers with commas
function formatCurrency(amount) {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}

// Function to handle transaction using razorpay
document.getElementById('rzp-button1').onclick = async function (e) {
    e.preventDefault();

    // Get order details
    const order = await payment();
    let userData = null;

    try {
        const response = await fetch(`http://${IP}:${PORT}/user/getUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) throw new Error('Network response was not ok');

        userData = await response.json();
    } catch (error) {
        console.error('Error during Fetching User Profile:', error);
    }

    // Define Razorpay options with dynamic order_id
    var options = {
        "key": RAZORPAY_KEY, // Razorpay Key
        "amount": order.amount, // Amount in paise
        "currency": "INR",
        "name": "Analtical Equipment Solution",
        "description": "AES Payment Gateway",
        "image": "../../assets/images/AES Logo.jpg",
        "order_id": order.id, // Pass dynamic order_id from backend
        "handler": function (response) {
            updateOrderStatus(response.razorpay_payment_id, response.razorpay_order_id);
            window.location.href = "./my-orders.html";
        },
        "prefill": {
            "name": userData.customer_name,
            "email": userData.customer_email,
            "contact": window.localStorage.getItem('phoneNo')
        },
        "notes": {
            "address": "Payment to AES"
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
}

// Function to generate payment ticket
async function payment() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/payment/create-order/${grandTotal}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const order = await response.json();
        return order;
    } catch (error) {
        console.error('Error making payment:', error);
    }
}

// Function to update order status after successful payment
async function updateOrderStatus(paymentId, orderId) {
    try {
        const sale = {
            shipping_address: window.localStorage.getItem('address'),
            contact_phone: window.localStorage.getItem('phoneNo'),
            transaction_id: paymentId,
            order_id: orderId
        }
        const response = await fetch(`http://${IP}:${PORT}/order/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                sale: sale,
                isNewAddress: true
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error deleting cart item:', error);
    }
}

// Check if the user is logged in then only this page will be accessable
if (!window.localStorage.getItem('isLoggedIn') || window.localStorage.getItem("role") == "admin") {
    history.replaceState(null, '', '../../shared/view/loginPage.html');
    window.localStorage.clear();

    window.onpopstate = function (event) {
        if (!localStorage.getItem('isLoggedIn') || localStorage.getItem("role") == "admin") {
            window.location.replace('../../shared/view/loginPage.html');
        }
    };
} else {
    window.onpopstate = function (event) { };
}

// Update summary section
const subtotal = parseFloat(window.localStorage.getItem("subtotal"));
const tax = subtotal * 0.18;
const shipping = 3000;
const total = subtotal + shipping + tax;
const grandTotal = total;
const token = window.localStorage.getItem('token');

document.querySelector('.summary-sec .subtotal').textContent = formatCurrency(subtotal);
document.querySelector('.summary-sec .tax').textContent = formatCurrency(tax);
document.querySelector('.summary-sec .shipping').textContent = formatCurrency(shipping);
document.querySelector('.summary-sec .total-text').textContent = formatCurrency(total);