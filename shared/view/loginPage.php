<!-- 
    File: shared/view/loginPage.php
    Author: Yash Balotiya
    Description: This page contains all the HTML5 code for the Login Page
    Created on: 01/10/2024
    Last Modified: 01/10/2024
-->

<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Meta Data -->
    <?php include_once "./metaData.html" ?>

    <!-- Title -->
    <title>AES - Analytical Equipment Solutions</title>

    <!-- Stylesheets -->
    <link rel="stylesheet" href="../style/loginStyle.css">
    <link rel="stylesheet" href="../style/navbarStyle.css">
</head>

<body>
    <!-- Navbar -->
    <?php  include_once "./navbar.html" ?>

    <!-- Main Content -->
    <main id="mainContainer">
        <!-- Left Side: Login -->
        <section id="loginSec">
            <!-- Intro -->
            <div>
                <b>Registered Customers</b>
                <div class="horizontalDivider"></div>
                <p class="greyFont">If you have an account, sign in with your email address.</p>
            </div>

            <!-- Email -->
            <div class="inputDiv">
                <b>Email</b>
                <input type="text" class="inputDetails">
            </div>

            <!-- Password -->
            <div class="inputDiv">
                <b>Password</b>
                <input type="password" class="inputDetails">
            </div>

            <!-- Checkbox -->
            <div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                    <label class="form-check-label greyFont" for="flexCheckDefault">
                        Show Password
                    </label>
                </div>
                <br>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                    <label class="form-check-label greyFont" for="flexCheckDefault">
                        By using this form you agree with the storage and handling of your data by this website
                    </label>
                </div>
            </div>

            <br>
            <!-- Button -->
            <div id="signinDiv">
                <button type="button" class="btn btn-info" id="signinBtn">Sign In</button>
                <a href="#" class="greyFont">Forgot your password?</a>
            </div>
        </section>

        <!-- VerticalDivider -->
        <div class="verticalDivider"></div>

        <!-- Right Side: New Registration -->
        <section id="newAccountSec">
            <!-- Info -->
            <div>
                <b>New Customers</b>
                <div class="horizontalDivider"></div>
                <p>Creating an account has many benefits: check out faster, keep more than one address, track orders<br>and more.</p>
            </div>

            <!-- Button -->
            <button type="button" class="btn btn-light" id="loginBtn">Create an Account</button>
        </section>
    </main>

    <!-- Footer -->
</body>

</html>