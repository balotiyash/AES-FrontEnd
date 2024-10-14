/** 
 * File: user/controller/contactUsScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the contact us page.
 * Created on: 14/10/2024
 * Last Modified: 14/10/2024
*/

import { IP, PORT } from '../../config.js';

// Function to fetch user data from server via token
async function sendMail() {
    const token = window.localStorage.getItem("token");
    console.log(token)
    const subjectTxt = document.getElementById("subjectTxt").value;
    const messageTxt = document.getElementById("messageTxt").value;
    const mainData = JSON.stringify({
        subject: subjectTxt,
        body: messageTxt
    });

    try {
        const response = await fetch(`http://${IP}:${PORT}/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: mainData
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const data = await response.text();

        if (data) {
            window.open(data, "_blank");
        }
        console.log('User data:', data);
        return data.status;
    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}

document.getElementById("sendEmailBtn").addEventListener("click", sendMail);