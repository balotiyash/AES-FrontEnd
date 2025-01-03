/** 
 * File: user/controller/cartScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the cart page. It contains functions to fetch cart details, to handle empty cart, to update cart and to display summary to amount dynamically
 * Created on: 14/10/2024
 * Last Modified: 07/11/2024
*/

import { IP, PORT } from '../../config.js';

const token = window.localStorage.getItem("token");
let grandTotal = 0;

// Utility function to format numbers with commas
function formatCurrency(amount) {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}

// function to fetch cart details along to handle functionality to dynamically generating increment/decrement buttons and to handle their click events
async function fetchCartDetails() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/cart/items`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not OK');
        }

        const products = await response.json();

        if (products.length === 0) {
            document.querySelector('.main-sec').style.display = 'none';
            document.querySelector('.empty-cart-sec').style.display = 'block';
            return;
        } else {
            document.querySelector('.main-sec').style.display = 'flex';
            document.querySelector('.empty-cart-sec').style.display = 'none';
        }

        const tbody = document.getElementById('item-body');
        tbody.innerHTML = ''; // Clear existing rows

        let subtotal = 0;

        products.forEach((item) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>
                    <div class="item-desc">
                        <img src="${item.product_image}" alt="" class="product-img">
                        <p>${item.product_name}</p>
                    </div>
                </td>
                <td>${formatCurrency(item.price)}</td>
                <td>
                    <span class="tally-divv">
                        <p class="quantity">${item.quantity}</p>
                        <span class="tally-div-child">
                            <button class="tally-btns decrease">-</button>
                            <button class="tally-btns increase">+</button>
                        </span>
                    </span>
                </td>
                <td class="total-price">${formatCurrency(item.price * item.quantity)}</td>
                <td><i class="fa-solid fa-xmark deleteItem"></i></td>
            `;

            tbody.appendChild(row);

            const quantityElement = row.querySelector('.quantity');
            const totalPriceElement = row.querySelector('.total-price');

            // Calculate subtotal
            subtotal += item.price * item.quantity;
            window.localStorage.setItem("subtotal", subtotal);

            const updatePrice = () => {
                const quantity = parseInt(quantityElement.textContent);
                totalPriceElement.textContent = formatCurrency(item.price * quantity);
                subtotal = 0; // Reset subtotal
                window.localStorage.setItem("subtotal", subtotal);
                document.querySelectorAll('.total-price').forEach(el => {
                    subtotal += parseFloat(el.textContent.replace(/[^0-9.-]+/g, ""));
                    window.localStorage.setItem("subtotal", subtotal);
                });
                updateSummary(subtotal); // Update summary whenever price changes
            };

            // Increment Btn Click event
            row.querySelector('.increase').addEventListener('click', () => {
                let quantity = parseInt(quantityElement.textContent);
                quantity++;
                quantityElement.textContent = quantity;
                updatePrice();
                updateCart(item.product_id, quantity, item.item_id); // Pass product ID and updated quantity
            });

            // Decrement Btn Click event
            row.querySelector('.decrease').addEventListener('click', () => {
                let quantity = parseInt(quantityElement.textContent);
                quantity--;
                if (quantity > 0) {
                    quantityElement.textContent = quantity;
                    updatePrice();
                    updateCart(item.product_id, quantity, item.item_id); // Pass product ID and updated quantity
                } else if (quantity === 0) {
                    deleteItem(item.item_id);
                    window.location.reload();
                }
            });

            // Delete icon click event
            row.querySelector('.deleteItem').addEventListener('click', () => {
                deleteItem(item.item_id);
                window.location.reload();
            });
        });

        // Update the summary section after processing all items
        updateSummary(subtotal);

    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Function to update the summary section
function updateSummary(subtotal) {
    const shipping = 3000; // Define shipping cost
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;
    grandTotal = total;

    document.querySelector('.summary-sec .subtotal').textContent = formatCurrency(subtotal);
    document.querySelector('.summary-sec .tax').textContent = formatCurrency(tax);
    document.querySelector('.summary-sec .shipping').textContent = formatCurrency(shipping);
    document.querySelector('.summary-sec .total-text').textContent = formatCurrency(total);
}

// Function to update quantity
async function updateCart(product_id, quantity, item_id) {
    const formdata = {
        product_id: product_id,
        item_id: item_id,
        quantity: quantity
    };

    try {
        const response = await fetch(`http://${IP}:${PORT}/cart/update-quantity`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formdata)
        });

        if (!response.ok) {
            throw new Error('Failed to update cart quantity');
        }

        const data = await response.text();
        console.log('Update Cart:', data);
    } catch (error) {
        console.error('Error updating cart:', error);
    }
}

// Function to delete item
async function deleteItem(item_id) {
    const formdata = {
        item_id: item_id
    };

    try {
        const response = await fetch(`http://${IP}:${PORT}/cart/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formdata)
        });

        if (!response.ok) {
            throw new Error('Failed to delete cart item');
        }

        const data = await response.text();
        console.log('Delete Cart Item:', data);
    } catch (error) {
        console.error('Error deleting cart item:', error);
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

fetchCartDetails();