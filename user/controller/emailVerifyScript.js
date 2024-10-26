/** 
 * File: user/controller/emailVerifyScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for email verification page after signup page.
 * Created on: 26/10/2024
 * Last Modified: 26/10/2024
*/

import { IP, PORT } from '../../config.js';

// Function to verify email
async function verifyEmail() {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const token = url.searchParams.get('token');
    console.log(token);

    // if (token === null) {
    //     alert("Please login to verify E-mail.");
    //     return;
    // }

    try {
        const response = await fetch(`http://${IP}:${PORT}/email/verify`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formdata,
        });

        if (!response.ok) {
            document.getElementById("not-verified").style.display = "flex";
            throw new Error('Authentication failed');
        } else {
            document.getElementById("verified").style.display = "flex";
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}

verifyEmail();