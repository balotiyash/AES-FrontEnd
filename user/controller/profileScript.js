/** 
 * File: user/controller/profileScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the saved address page. It consists of functions to fetch and display the user profile and delete addresses.
 * Created on: 28/10/2024
 * Last Modified: 07/11/2024
*/

import { IP, PORT } from '../../config.js';

// Function to convert into Pascal Case
function capitalizeFirstLetterOfEachWord(str) {
    return str
        .split(' ')  // Split the string into words by spaces
        .map(word => {
            // Capitalize the first letter and keep the rest of the word as is
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');  // Join the words back into a single string with spaces
}

// Function to fetch user profile
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
            throw new Error('Network response was not ok');
        }

        const userData = await response.json();
        console.log(userData);

        // Clear existing details
        const addressSection = document.querySelector('.saved-details-sec');
        addressSection.innerHTML = '<h5>Saved Details</h5>'; // Resetting the section header

        // Display addresses
        userData.addresses.forEach((address, index) => {
            const addressDiv = document.createElement('div');
            addressDiv.classList.add('address-div');

            // Display address
            addressDiv.innerHTML = `
                <b>Address ${index + 1}:</b>
                <p>${address.address.toUpperCase()}</p>
                <button class="btn btn-danger" id="delete-${address.id}">Delete</button>
            `;
            addressSection.appendChild(addressDiv);

            // Add event listener for delete button
            const deleteButton = document.getElementById(`delete-${address.id}`);
            deleteButton.addEventListener('click', () => deleteAddress(address.id));
        });


        // Display user details
        const userDetailsDiv = document.createElement('div');
        userDetailsDiv.classList.add('address-div');
        userDetailsDiv.innerHTML = `
            <p><b>Name: </b>${capitalizeFirstLetterOfEachWord(userData.name)}</p>
            <p><b>Email ID: </b>${userData.email.toLowerCase()}</p>
            <p><b>Contact No.: </b>${userData.phone}</p>
        `;
        addressSection.appendChild(userDetailsDiv);

    } catch (error) {
        console.error('Error during Fetching User Profile:', error);
        alert('There was an error fetching your profile. Please try again later.');
    }
}

// Function to delete address
async function deleteAddress(index) {
    const token = window.localStorage.getItem("token");

    try {
        // Send the DELETE request to the server using the address index as part of the URL
        const response = await fetch(`http://${IP}:${PORT}/user/delete-address/${index}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete address');
        }

        // Optionally, re-fetch the profile to reflect the updated address list
        fetchUserProfile();

    } catch (error) {
        console.error('Failed to delete address:', error);
        alert('There was an error deleting the address. Please try again later.');
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

fetchUserProfile();