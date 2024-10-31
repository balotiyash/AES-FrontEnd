/** 
 * File: user/controller/paymentScrpt.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the payments page.
 * Created on: 30/10/2024
 * Last Modified: 30/10/2024
*/

import { IP, PORT } from '../../config.js';

// Utility function to format numbers with commas
function formatCurrency(amount) {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}

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

        if (!response.ok) throw new Error('Failed to Fetch User Data');

        userData = await response.json();
    } catch (error) {
        console.error('Error during Fetching User Profile:', error);
    }

    // Define Razorpay options with dynamic order_id
    var options = {
        "key": "rzp_test_hD75gZIHGX2XGb", // Razorpay Key
        "amount": order.amount, // Amount in paise
        "currency": "INR",
        "name": "Analtical Equipment Solution",
        "description": "AES Payment Gateway",
        "image": "../../assets/images/AES Logo.jpg",
        "order_id": order.id, // Pass dynamic order_id from backend
        "handler": function (response) {
            // alert("Payment successful with Payment ID: " + response.razorpay_payment_id);
            updateOrderStatus(response.razorpay_payment_id, response.razorpay_order_id);
            window.location.href = "./my-orders.html";
            // window.localStorage.removeItem('subtotal');
            // window.location.reload();
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
            throw new Error('Failed to make payment');
        }

        // const responsee = await fetch("http://localhost:3000/payment/create-order/1"); // 500 is the amount in INR
        const order = await response.json();
        return order;

    } catch (error) {
        console.error('Error making payment:', error);
    }
}

async function updateOrderStatus(paymentId, orderId) {
    try {
        const response = await fetch(`http://${IP}:${PORT}/order/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                shipping_address: window.localStorage.getItem('address'),
                contact_phone: window.localStorage.getItem('phoneNo'),
                transaction_id: paymentId,
                order_id: orderId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to delete cart item');
        }
    } catch (error) {
        console.error('Error deleting cart item:', error);
    }
}

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
