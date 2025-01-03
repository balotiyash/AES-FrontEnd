/** 
 * File: user/controller/orderHistoryScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the My Orders page. It consists of functions to fetch order history
 * Created on: 22/10/2024
 * Last Modified: 07/11/2024
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
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data) {
            const productContainer = document.getElementById("productContainer");
            productContainer.innerHTML = ''; // Clear existing content

            data.forEach(order => {
                // Product card
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

                // Create a new div for price and button
                const priceAndButtonDiv = document.createElement("div");
                priceAndButtonDiv.className = "price-and-button"; // Assign a class name

                const productPrice = document.createElement("p");
                const orderPrice = order.product_price * order.quantity;
                productPrice.innerHTML = `Rs. ${parseInt(orderPrice).toLocaleString('en-IN')}`; // Format the price

                // Invoice Downloading
                const invoiceBtn = document.createElement("button");
                invoiceBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-down"></i>`;
                invoiceBtn.className = "invoice-btn btn btn-light";

                invoiceBtn.onclick = () => {
                    if (order.order_id) {
                        const url = `./invoice.html?saleId=${order.sale_id}`;
                        // const newWindow = window.open(url, '_blank', "width=1,height=1");
                        const newWindow = window.open(url, '_blank');

                        // Set a timeout to close the window after a specific duration
                        setTimeout(() => {
                            if (newWindow && !newWindow.closed) {
                                newWindow.close();
                            }
                        }, 1000); // Adjust the timeout duration as needed
                    } else {
                        console.error('Order ID is not defined for this order:', order);
                    }
                };

                // Tally Amount and quantity
                const productQuantity = document.createElement("p");
                productQuantity.innerHTML = `Qty: ${order.quantity}`;

                // Append price and button to the new div
                priceAndButtonDiv.appendChild(productPrice);
                priceAndButtonDiv.appendChild(invoiceBtn);

                productDesc.appendChild(productTitle);
                productDesc.appendChild(priceAndButtonDiv); // Append the new div
                productDesc.appendChild(productQuantity);

                productDiv.appendChild(productImage);
                productDiv.appendChild(productDesc);
                productContainer.appendChild(productDiv);
            });

        }
    } catch (error) {
        console.error('Error during fetching order history:', error);
        throw error;
    }
}

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

// Call the function to fetch and display orders
fetchOrders();