/** 
 * File: user/controller/orderHistoryScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the My Orders page.
 * Created on: 22/10/2024
 * Last Modified: 22/10/2024
*/

import { IP, PORT } from '../../config.js';

// Function to send mail data to server
async function fetchOrders() {
    const token = window.localStorage.getItem("token");

    try {
        const response = await fetch(`http://${IP}:${PORT}/order/order-history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const data = await response.json();
        console.log(data);

        if (data) {
            const productContainer = document.getElementById("productContainer");
            productContainer.innerHTML = ''; // Clear existing content

            data.forEach(order => {
                const productDiv = document.createElement("div");
                productDiv.className = "product-div";

                const productImage = document.createElement("img");
                productImage.src = order.product_image || "../../assets/images/default-image.jpg"; // Fallback image
                productImage.alt = "";
                productImage.className = "product-img";

                const productDesc = document.createElement("div");
                productDesc.className = "product-desc";

                const productTitle = document.createElement("div");
                productTitle.className = "product-title";
                productTitle.innerHTML = `<b>${order.product_name}</b><br><b>${new Date(order.order_date).toLocaleDateString()}</b>`;

                const productPrice = document.createElement("p");
                productPrice.innerHTML = `Rs. ${parseInt(order.product_price).toLocaleString('en-IN')}`; // Format the price

                const productQuantity = document.createElement("p");
                productQuantity.innerHTML = `Qty: ${order.quantity}`;

                productDesc.appendChild(productTitle);
                productDesc.appendChild(productPrice);
                productDesc.appendChild(productQuantity);
                productDiv.appendChild(productImage);
                productDiv.appendChild(productDesc);
                productContainer.appendChild(productDiv);
            });
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}

// Call the function to fetch and display orders
fetchOrders();