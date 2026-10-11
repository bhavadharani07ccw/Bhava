
"use strict";

// Reusable function to display messages
const showMessage = (elementId, message, success = false) => {
    const element = document.getElementById(elementId);

    if (element) {
        element.innerText = message;
        element.style.color = success ? "green" : "red";
    }

    return message;
};

// Validate email format
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Get registered user from browser storage
const getUser = () => {
    const data = localStorage.getItem("registeredUser");
    return data ? JSON.parse(data) : null;
};

// REGISTER FORM
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (!name || !email || !password || !confirmPassword) {
            showMessage("message", "Please fill in all fields.");
            return;
        }

        if (!isValidEmail(email)) {
            showMessage("message", "Enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            showMessage(
                "message",
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            showMessage("message", "Passwords do not match.");
            return;
        }

        const existingUser = getUser();

        if (existingUser &&
            existingUser.email.toLowerCase() === email.toLowerCase()) {
            showMessage("message", "This email is already registered.");
            return;
        }

        const user = {
            name: name,
            email: email,
            password: password
        };

        localStorage.setItem("registeredUser", JSON.stringify(user));

        showMessage(
            "message",
            "Account created successfully! Redirecting to login...",
            true
        );

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    });
}

// LOGIN FORM
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password =
            document.getElementById("loginPassword").value;

        if (!email || !password) {
            showMessage("message", "Please enter email and password.");
            return;
        }

        if (!isValidEmail(email)) {
            showMessage("message", "Enter a valid email address.");
            return;
        }

        const user = getUser();

        if (
            user &&
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
        ) {
            sessionStorage.setItem(
                "loggedInUser",
                JSON.stringify({ name: user.name, email: user.email })
            );

            window.location.href = "dashboard.html";
        } else {
            showMessage(
                "message",
                "Invalid email or password. Please register first."
            );
        }
    });
}

// DASHBOARD
const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage) {
    const loggedInUser = sessionStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        window.location.replace("login.html");
    } else {
        const user = JSON.parse(loggedInUser);
        welcomeMessage.innerText = `Welcome, ${user.name}!`;
    }
}

// LOGOUT
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });
}
