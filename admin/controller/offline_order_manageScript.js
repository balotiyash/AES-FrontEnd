/** 
 * File: product/controller/offline_order_manageScript.js
 * Author: Atharv Mirgal
 * Description: This file contains JS code for the offline product management page.
 * Created on: 02/11/2024
 * Last Modified: 02/11/2024
 */

import { IP, PORT } from '../../config.js';

function capitalizeFirstLetter(str) {
    return str
      .toLowerCase()
      .split(' ')  // Split the string by spaces
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

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
        console.log(userData.addresses);

        // Clear existing details
        let email = document.getElementById('emailTxt');
        let name = document.getElementById('nameTxt');

        // Display user details
        email.value = userData.email;
        name.value = capitalizeFirstLetter(userData.name);   
    } catch (err) {
        console.error('Error during Fetching User Profile:', err);
    }
};

document.getElementById('usernameTxt').addEventListener('change', (event) => {
    const username = event.target.value;
    fetchUserProfile(username);
});