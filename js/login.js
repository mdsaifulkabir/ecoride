"use strict";

document.addEventListener("DOMContentLoaded", function() {

    const form = document.getElementById("loginForm");

    if (!form) return;

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const email = document.getElementById("loginEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("loginPassword").value;

        const role = document.getElementById("loginRole").value;

        const users = getData("eride_users");

        const user = users.find(item =>
            item.email.toLowerCase() === email &&
            item.password === password &&
            item.role === role
        );

        if (!user) {
            showMessage(
                "Incorrect email, password or selected role.",
                "error"
            );
            return;
        }

        if (user.status && user.status !== "Active") {
            showMessage(
                "Your account is not active. Please contact the Admin.",
                "error"
            );
            return;
        }

        sessionStorage.setItem(
            "eride_current_user",
            JSON.stringify(user)
        );

        addActivity("Login", "User logged into the system");

        window.location.href = role + ".html";
    });

});