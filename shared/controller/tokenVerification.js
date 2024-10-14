/** 
 * File: shared/controller/tokenVerification.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for token verification for session management.
 * Created on: 14/10/2024
 * Last Modified: 14/10/2024
*/

// Function to run onload to validate user login
window.onload = async () => {
    const session = window.localStorage.getItem("token");

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