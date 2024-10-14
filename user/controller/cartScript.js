/** 
 * File: user/controller/cartScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the cart page.
 * Created on: 14/10/2024
 * Last Modified: 15/10/2024
*/

import { IP, PORT } from '../../config.js';

// Function to fetch user data from server via token
async function fetchProducts() {
    const token = window.localStorage.getItem("token");

    if (!token) {
        window.location.href = "../../";
        return;
    }

    try {
        const response = await fetch(`http://${IP}:${PORT}/public/allProducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const products = await response.json();
        console.log('User data:', products);

        if (products) {
            // TODO
        };

    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}

fetchProducts();