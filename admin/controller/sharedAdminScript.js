/** 
 * File: admin/controller/sharedAdminScript.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code which is shared between all pages logout button functionalities, Session Management
 * Created on: 07/11/2024
 * Last Modified: 07/11/2024
*/

import { IP, PORT } from '../../config.js';

// Session Handling for a particular time period
const timer = setInterval(() => {
    let time = parseInt(window.localStorage.getItem("timer")); // Default to 60 seconds if not set

    if (time <= 0) {
        clearInterval(timer);
        logout();
    } else {
        time--;
        window.localStorage.setItem("timer", time);
    }
}, 1000);

// Check if the user is logged in then only this page will be accessable
if (window.localStorage.getItem('isLoggedin') != "true" || window.localStorage.getItem("role") == "user") {
    history.replaceState(null, '', '../../shared/view/loginPage.html');
    window.localStorage.clear();

    window.onpopstate = function (event) {
        if (window.localStorage.getItem('isLoggedin') != "true" || localStorage.getItem("role") == "user") {
            window.location.replace('../../shared/view/loginPage.html');
        }
    };
} else {
    window.onpopstate = function (event) { };
}

// Function to run onload to validate user login
window.onload = async () => {
    let session = window.localStorage.getItem("token");

    if (session) {
        try {
            let data = await fetchUserData(session);

            if (!data) {
                logout();
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
            logout(); // Logout if there's an error fetching user data
        }
    } else {
        logout();
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

// Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", logout);

// Function to logout
function logout() {
    window.localStorage.clear();
    window.location.reload();
    history.replaceState(null, '', '../../shared/view/loginPage.html');
    window.location.replace('../../shared/view/loginPage.html');
}

// Code to disble other websites to use our URL in their IFRAME tag or security reasons
if (window.top !== window.self) {
    // Hide important elements if the page is embedded in an iframe
    document.body.classList.add('iframe-blocker');
}