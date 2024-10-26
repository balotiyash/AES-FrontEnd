/** 
 * File: user/controller/emailVerifyScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the contact us page.
 * Created on: 14/10/2024
 * Last Modified: 24/10/2024
*/

import { IP, PORT } from '../../config.js';

// Function to verify email
async function verifyEmail() {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const token = url.searchParams.get('token');
    console.log(token);

    if (token === null) {
        alert("Please login to send E-mail to the seller.");
        return;
    }

    try {
        const formdata = new FormData();
        formdata.append('email', "atharv.mirgal@somaiya.edu");
        formdata.append('token', token);
        const response = await fetch(`http://${IP}:${PORT}/public/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formdata,
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        } else {
            console.log("Email verified successfully");
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}

verifyEmail();