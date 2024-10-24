/** 
 * File: shared/controller/tokenVerification.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for token verification for session management.
 * Created on: 14/10/2024
 * Last Modified: 24/10/2024
*/

import { IP, PORT } from '../../config.js';

// Function to run onload to validate user login
window.onload = async () => {
    console.log('Running token verification');
    let session = window.localStorage.getItem("token");
    console.log(session)

    if (session) {
        try {
            // Await the result of fetchUserData
            let data = await fetchUserData(session);
            console.log('Data:', data);

            if (!data) {
                console.log('User not authenticated');
                document.getElementById("loginBtn").style.display = "inline";
                document.getElementById("dropDownBtn").style.display = "none";
            } else {
                document.getElementById("loginBtn").style.display = "none";
                document.getElementById("dropDownBtn").style.display = "inline";
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            console.log('User not authenticated due to an error');
            document.getElementById("loginBtn").style.display = "inline";
            document.getElementById("dropDownBtn").style.display = "none";
        }
    } else {
        document.getElementById("loginBtn").style.display = "inline";
        document.getElementById("dropDownBtn").style.display = "none";
        console.log('No token found'); 
    }
};

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