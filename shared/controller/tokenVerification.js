/** 
 * File: shared/controller/tokenVerification.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for token verification for session management accross pages and also for navbar to show and hide profile icon accordingly.
 * Created on: 14/10/2024
 * Last Modified: 06/11/2024
*/

import { IP, PORT } from '../../config.js';

// Function to run onload to validate user login
window.onload = async () => {
    // For admin navigation
    if (window.localStorage.getItem("isLoggedin") && window.localStorage.getItem("role") == "admin") {
        document.getElementById("dropDownBtn").style.display = "none";
        document.getElementById("loginBtn").style.display = "inline";
        document.getElementById("loginBtn").addEventListener("click", () => {
            window.location.href = "./admin/view/dashboard.html";
        });
        return;
    }

    let session = window.localStorage.getItem("token");

    if (session) {
        try {
            // Await the result of fetchUserData
            let data = await fetchUserData(session);

            if (!data) {
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
            throw new Error('HTTP request was not ok. Authentication failed');
        }

        const data = await response.json();
        return data.status;

    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}