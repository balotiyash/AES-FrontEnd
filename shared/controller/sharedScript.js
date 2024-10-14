/** 
 * File: shared/controller/sharedScript.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code which is shared between all pages for login & logout button functionalities
 * Created on: 11/10/2024
 * Last Modified: 15/10/2024
*/

// Login button handling
document.getElementById("loginBtn").addEventListener("click", () => {
    window.location.href = '../../shared/view/loginPage.html';
});

// Logout button handling
document.getElementById("logoutBtn").addEventListener("click", () => {
    console.log('Logging out...');
    window.localStorage.removeItem("token");
    window.location.reload();
});