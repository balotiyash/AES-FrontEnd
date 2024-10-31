/** 
 * File: user/controller/resetPassword.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code for the Reset Password page
 * Created on: 28/10/2024
 * Last Modified: 28/10/2024
*/

import { IP, PORT } from '../../config.js';

const emailId = window.localStorage.getItem("email");
document.getElementById("emailTxt").value = emailId;

// to reset passeord
document.getElementById("signinBtn").addEventListener("click", async () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const token = url.searchParams.get('token');

    const pass1 = document.getElementById("password").value;
    const pass2 = document.getElementById("password2").value;

    if (pass1 !== pass2) {
        alert("Confirm Password Not Matched.");
        return;
    }

    try {
        const response = await fetch(`http://${IP}:${PORT}/user/password-reset`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`
            },
            body: new URLSearchParams({ password: pass1 })
        });

        if (!response.ok) {
            throw new Error('Failed to Reset Password');
        }

        alert("Password Changed Successfully.");
        window.location.href = "../../shared/view/loginPage.html";
    } catch (error) {
        console.error('Error during Reseting Password:', error);
    }
});