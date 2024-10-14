/** 
 * File: user/controller/homeServerScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the home page (index) Server interaction, session management.
 * Created on: 13/10/2024
 * Last Modified: 14/10/2024
*/

import { IP, PORT } from './config.js';

// Function to fetch user data from server via token
async function fetchUserData(token) {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/authenticate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const data = await response.json();
        console.log('User data:', data);
        return data.status;
    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}