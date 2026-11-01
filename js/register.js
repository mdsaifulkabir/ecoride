"use strict";

document.addEventListener("DOMContentLoaded", function() {

    const roleSelect = document.getElementById("registerRole");
    const fieldsContainer = document.getElementById("registrationFields");
    const registerButton = document.getElementById("registerButton");
    const form = document.getElementById("registerForm");

    const registrationForms = {

        customer: `
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="regName" required>
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="email" id="regEmail" required>
            </div>

            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="regPhone"
                       pattern="[0-9+ -]{8,15}" required>
            </div>

            <div class="form-group">
                <label>Address</label>
                <textarea id="regAddress" required></textarea>
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" id="regPassword"
                       minlength="6" required>
            </div>

            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" id="regConfirm"
                       minlength="6" required>
            </div>
        `,

        manager: `
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="regName" required>
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="email" id="regEmail" required>
            </div>

            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="regPhone"
                       pattern="[0-9+ -]{8,15}" required>
            </div>

            <div class="form-group">
                <label>Station Name</label>
                <input type="text" id="regStation" required>
            </div>

            <div class="form-group">
                <label>Station Location</label>
                <input type="text" id="regLocation" required>
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" id="regPassword"
                       minlength="6" required>
            </div>

            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" id="regConfirm"
                       minlength="6" required>
            </div>
        `,

        seller: `
            <div class="form-group">
                <label>Owner Name</label>
                <input type="text" id="regName" required>
            </div>

            <div class="form-group">
                <label>Shop Name</label>
                <input type="text" id="regShop" required>
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="email" id="regEmail" required>
            </div>

            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="regPhone"
                       pattern="[0-9+ -]{8,15}" required>
            </div>

            <div class="form-group">
                <label>Shop Address</label>
                <textarea id="regAddress" required></textarea>
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" id="regPassword"
                       minlength="6" required>
            </div>

            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" id="regConfirm"
                       minlength="6" required>
            </div>
        `
    };

    roleSelect.addEventListener("change", function() {

        const role = this.value;

        fieldsContainer.innerHTML = registrationForms[role] || "";

        registerButton.hidden = !role;

    });

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        if (!form.reportValidity()) return;

        const role = roleSelect.value;

        if (!registrationForms[role]) return;

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value
            .trim().toLowerCase();

        const phone = document.getElementById("regPhone").value.trim();

        const password = document.getElementById("regPassword").value;

        const confirmPassword =
            document.getElementById("regConfirm").value;

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        const users = getData("eride_users");

        if (users.some(user => user.email.toLowerCase() === email)) {
            showMessage("This email is already registered.", "error");
            return;
        }

        const newUser = {
            id: generateId(),
            name: name,
            email: email,
            password: password,
            phone: phone,
            role: role,
            status: "Active"
        };

        if (role === "customer") {
            newUser.address =
                document.getElementById("regAddress").value.trim();
        }

        if (role === "manager") {
            newUser.station =
                document.getElementById("regStation").value.trim();

            newUser.location =
                document.getElementById("regLocation").value.trim();
        }

        if (role === "seller") {
            newUser.shop =
                document.getElementById("regShop").value.trim();

            newUser.address =
                document.getElementById("regAddress").value.trim();
        }

        users.push(newUser);

        saveData("eride_users", users);

        alert("Registration successful! Please login.");

        window.location.href = "login.html";

    });

});