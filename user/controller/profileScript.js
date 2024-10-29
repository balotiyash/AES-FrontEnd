/** 
 * File: user/controller/profileScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the saved address page.
 * Created on: 28/10/2024
 * Last Modified: 28/10/2024
*/

import { IP, PORT } from '../../config.js';

async function fetchUserProfile() {
    const token = window.localStorage.getItem("token");

    try {
        const response = await fetch(`http://${IP}:${PORT}/user/getUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to Fetch User Data');
        }

        const userData = await response.json();
        console.log('User Data:', userData.addresses);    

        // Clear existing details
        const addressSection = document.querySelector('.saved-details-sec');
        addressSection.innerHTML = '<h5>Saved Details</h5>'; // Resetting the section header

        // Display addresses
        userData.addresses.forEach((address, index) => {
            const addressDiv = document.createElement('div');
            addressDiv.classList.add('address-div');

            // Assuming address is an object, adjust as needed
            addressDiv.innerHTML = `
                <b>Address ${index + 1}:</b>
                <p>${address}</p>
            `;
            addressSection.appendChild(addressDiv);
        });

        // Display user details
        const userDetailsDiv = document.createElement('div');
        userDetailsDiv.classList.add('address-div');
        userDetailsDiv.innerHTML = `
            <p><b>Name: </b>${userData.name}</p>
            <p><b>Email ID: </b>${userData.email}</p>
            <p><b>Contact No.: </b>${userData.phone}</p>
        `;
        addressSection.appendChild(userDetailsDiv);

    } catch (error) {
        console.error('Error during Fetching User Profile:', error);
    }
}

window.onload = fetchUserProfile;
