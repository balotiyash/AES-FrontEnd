/** 
 * File: admin/controller/orderManageScript.js
 * Author: Atharv Mirgal
 * Description: This file contains JS code for the order management page.
 * Created on: 04/11/2024
 * Last Modified: 04/11/2024
 */

import { IP, PORT } from '../../config.js';

const token = window.localStorage.getItem("token");
let orders = null;

async function fetchOrders(type) {
    try {
        const response = await fetch(`http://${IP}:${PORT}/order/all-sales`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        orders = await response.json();
        console.log('Fetched orders:', orders); // Log the fetched orders

        const ordersBody = document.getElementById('ordersBody');
        ordersBody.innerHTML = ''; // Clear any existing rows

        // Ensure that orders is an array
        if (!Array.isArray(orders)) {
            console.error('Expected an array of orders, but received:', orders);
            return;
        }

        // Sort orders based on type
        switch (type) {
            case "cs_pending":
                orders = orders.filter(order => order.order_confirmation_status === 'PENDING');
                break;

            case "cs_accepted":
                orders = orders.filter(order => order.order_confirmation_status === 'ACCEPTED');
                break;

            case "os_pending":
                orders = orders.filter(order => order.order_status === 'PENDING');
                break;

            case "os_dispatched":
                orders = orders.filter(order => order.order_status === 'DISPATCHED');
                break;

            case "os_delivered":
                orders = orders.filter(order => order.order_status === 'DELIVERED');
                break;

            case "ps_paid":
                orders = orders.filter(order => order.payment_status === 'PAID');
                break;

            case "ps_unpaid":
                orders = orders.filter(order => order.payment_status === 'UNPAID');
                break;

            case "sm_online":
                orders = orders.filter(order => order.sale_mode === 'ONLINE');
                break;

            case "sm_offline":
                orders = orders.filter(order => order.sale_mode === 'OFFLINE');
                break;

            default:
                // If no specific type, sort by order date
                orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
                break;
        }

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="leftRow">${order.sale_id}</td>
                <td>${order.customer_id}</td>
                <td>
                    <select class="statusDropdown" id="accepted-status-${order.sale_id}">
                        <option value="ACCEPTED" ${order.order_confirmation_status === 'ACCEPTED' ? 'selected' : ''}>ACCEPTED</option>
                        <option value="PENDING" ${order.order_confirmation_status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                    </select>
                </td>
                <td>
                    <select class='statusDropdown' id="dispatched-status-${order.order_id}">
                        <option value="PENDING" ${order.order_status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                        <option value="DISPATCHED" ${order.order_status === 'DISPATCHED' ? 'selected' : ''}>DISPATCHED</option>
                        <option value="DELIVERED" ${order.order_status === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
                    </select>
                </td>
                <td>${order.shipping_address}</td>
                <td>${order.contact_phone}</td>
                <td>${order.transaction_id}</td>
                <td>${order.order_id}</td>
                <td>${order.payment_status}</td>
                <td>${order.sale_mode}</td>
                <td class="rightRow">${order.order_date}</td>
            `;

            // Append the row to the table body
            ordersBody.appendChild(row);

            // Attach event listener to the first dropdown
            const acceptedSelectElement = document.getElementById(`accepted-status-${order.sale_id}`);
            acceptedSelectElement.addEventListener('change', function() {
                const result = confirm("Are you sure to update ORDER STATUS to ACCEPTED or PENDING?");
                if (result) updateAcceptedOrderStatus(order.sale_id, this.value);
            });

            // Attach event listener to the second dropdown
            const dispatchedSelectElement = document.getElementById(`dispatched-status-${order.order_id}`);
            dispatchedSelectElement.addEventListener('change', function() {
                const result = confirm("Are you sure to update ORDER STATUS to PENDING, DISPATCHED, or DELIVERED?");
                if (result) updateDispatchedOrderStatus(order.sale_id, this.value);
            });
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}


// Function to update the accepted order status
async function updateAcceptedOrderStatus(saleId, newStatus) {
    const token = window.localStorage.getItem("token");
    
    try {
        const response = await fetch(`http://${IP}:${PORT}/order/update-order-confirmation`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ sale_id: saleId, status: newStatus })
        });

        // Check if the response is OK
        if (!response.ok) {
            const responseText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Successfully updated accepted status:', newStatus); // Optional: handle success message
    } catch (error) {
        console.error('Error updating accepted order status:', error);
    }
}

// Function to update the dispatched order status
async function updateDispatchedOrderStatus(saleId, newStatus) {
    const token = window.localStorage.getItem("token");
    
    try {
        const response = await fetch(`http://${IP}:${PORT}/order/update-order-status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ sale_id: saleId, status: newStatus })
        });

        // Check if the response is OK
        if (!response.ok) {
            const responseText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Successfully updated dispatched status:', newStatus); // Optional: handle success message
    } catch (error) {
        console.error('Error updating dispatched order status:', error);
    }
}

// Fetch orders when the page loads
document.addEventListener('DOMContentLoaded', fetchOrders);

document.querySelectorAll(".filterDropdown").forEach(dropdown => {
    dropdown.addEventListener("change", (event) => {
        // Reset the other dropdowns to their default values
        document.querySelectorAll(".filterDropdown").forEach(d => {
            if (d !== event.target) {
                d.selectedIndex = 0; // Reset to the first option
            }
        });

        const confirmStatus = document.querySelector(".filterDropdown:nth-of-type(1)").value;
        const orderStatus = document.querySelector(".filterDropdown:nth-of-type(2)").value;
        const paymentStatus = document.querySelector(".filterDropdown:nth-of-type(3)").value;
        const salesMode = document.querySelector(".filterDropdown:nth-of-type(4)").value;

        // Create a single type parameter based on selected values
        let type = '';

        if (confirmStatus) {
            type = confirmStatus;
        } else if (orderStatus) {
            type = orderStatus;
        } else if (paymentStatus) {
            type = paymentStatus;
        } else if (salesMode) {
            type = salesMode;
        }

        // Call fetchOrders with the single type parameter
        fetchOrders(type);
    });
});
