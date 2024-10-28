/** 
 * File: user/controller/forgotPassword.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code for the Forgot Password page
 * Created on: 28/10/2024
 * Last Modified: 28/10/2024
*/

import { IP, PORT } from '../../config.js';

// Send email to reset passeord
document.getElementById("signinBtn").addEventListener("click", async () => {
    const emailId = document.getElementById("emailTxt").value;
    window.localStorage.setItem("email", emailId);

    const formData = new FormData();
    formData.append('email', emailId);
    
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/password-reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ 'email': emailId })
        });

        if (!response.ok) {
            throw new Error('Email Not Sent');
        }
    } catch (error) {
        console.error('Error during sending email:', error);
    }
});