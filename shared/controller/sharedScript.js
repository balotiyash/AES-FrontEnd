document.getElementById("loginBtn").addEventListener("click", () => {
    window.location.href = '../../shared/view/loginPage.html';
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    console.log('Logging out...');
    window.localStorage.removeItem("token");
    window.location.reload();
});