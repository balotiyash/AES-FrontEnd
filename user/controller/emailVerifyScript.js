/** 
 * File: user/controller/emailVerifyScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for email verification page after signup page. It contains function to validate user via email.
 * Created on: 26/10/2024
 * Last Modified: 07/11/2024
*/

import { IP, PORT } from '../../config.js';

// Function to verify email
async function verifyEmail() {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const token = url.searchParams.get('token');
    const emailId = url.searchParams.get('email');

    // const emailId = window.localStorage.getItem("email");

    try {
        const response = await fetch(`http://${IP}:${PORT}/public/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailId,
                token: token
            })
        });

        if (!response.ok) {
            document.getElementById("not-verified").style.display = "flex";
            throw new Error('Network response was not OK');
        } else {
            document.getElementById("verified").style.display = "flex";
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}

verifyEmail();