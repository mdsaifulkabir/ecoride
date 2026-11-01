"use strict";

/* GET DATA */

function getData(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
}

/* SAVE DATA */

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/* GENERATE ID */

function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

/* ESCAPE HTML */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

/* CURRENT USER */

function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem("eride_current_user") || "null");
}

/* ACTIVITY LOG */

function addActivity(action, details) {
    const user = getCurrentUser();

    const activities = getData("eride_activity");

    activities.unshift({
        id: generateId(),
        user: user ? user.name : "System",
        role: user ? user.role : "System",
        action: action,
        details: details,
        date: new Date().toLocaleString()
    });

    saveData("eride_activity", activities);
}

/* MESSAGE */

function showMessage(message, type = "success") {
    const box = document.getElementById("formMessage");

    if (!box) return;

    box.innerHTML = `
        <div class="notice ${type}">
            ${escapeHTML(message)}
        </div>
    `;
}

/* LOGIN PROTECTION */

function protectDashboard(role) {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    if (user.role !== role) {
        window.location.href = user.role + ".html";
        return null;
    }

    const userLabel = document.getElementById("loggedUser");

    if (userLabel) {
        userLabel.textContent = user.name;
    }

    return user;
}

/* LOGOUT */

document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function(event) {
            event.preventDefault();

            sessionStorage.removeItem("eride_current_user");

            window.location.href = "login.html";
        });
    }
});

/* DASHBOARD OVERVIEW */

function renderOverview(role, title, cards) {
    const content = document.getElementById("dashboardContent");

    const cardHTML = cards.map(card => `
        <div class="stat-card">
            <h2>${escapeHTML(card.value)}</h2>
            <p>${escapeHTML(card.label)}</p>
        </div>
    `).join("");

    content.innerHTML = `
        <div class="dashboard-heading">
            <div>
                <h1>${escapeHTML(title)}</h1>
                <p class="muted">Welcome to your dashboard.</p>
            </div>
            <span class="badge">${escapeHTML(role)}</span>
        </div>

        <div class="dashboard-cards">
            ${cardHTML}
        </div>

        <div class="content-panel">
            <h2>Welcome to EcoRide</h2>
            <p class="muted">
                Use the navigation menu to access your dashboard features.
            </p>
        </div>
    `;
}

/* GENERIC CRUD PAGE */

function renderCRUDPage(config) {
    const content = document.getElementById("dashboardContent");

    const records = getData(config.storage);

    const fieldHTML = config.fields.map(field => {
        let input;

        if (field.options) {
            input = `
                <select id="field_${field.name}" required>
                    <option value="">Select ${escapeHTML(field.label)}</option>
                    ${field.options.map(option => `
                        <option value="${escapeHTML(option)}">
                            ${escapeHTML(option)}
                        </option>
                    `).join("")}
                </select>
            `;
        } else {
            input = `
                <input
                    type="${field.type || "text"}"
                    id="field_${field.name}"
                    ${field.type === "number" ? 'min="0" step="any"' : ""}
                    required
                >
            `;
        }

        return `
            <div class="form-group">
                <label>${escapeHTML(field.label)}</label>
                ${input}
            </div>
        `;
    }).join("");

    content.innerHTML = `
        <div class="dashboard-heading">
            <div>
                <h1>${escapeHTML(config.title)}</h1>
                <p class="muted">${escapeHTML(config.description)}</p>
            </div>
        </div>

        <div id="formMessage"></div>

        <section class="content-panel">
            <h2 id="formHeading">Add New Record</h2>

            <form id="dataForm">
                <input type="hidden" id="editId">

                <div class="form-grid">
                    ${fieldHTML}
                </div>

                <button type="submit" id="saveButton">
                    Add Record
                </button>

                <button type="button"
                        class="btn-secondary"
                        id="cancelButton"
                        hidden>
                    Cancel
                </button>
            </form>
        </section>

        <section class="content-panel">
            <div class="panel-heading">
                <h2>${escapeHTML(config.tableTitle || "Manage Records")}</h2>
                <span class="badge">${records.length} Records</span>
            </div>

            <div class="toolbar">
                <input type="search"
                       id="searchBox"
                       placeholder="Search records...">
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            ${config.columns.map(column => `
                                <th>${escapeHTML(column.label)}</th>
                            `).join("")}
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody id="tableData"></tbody>
                </table>
            </div>
        </section>
    `;

    const form = document.getElementById("dataForm");
    const tableBody = document.getElementById("tableData");
    const searchBox = document.getElementById("searchBox");

    function displayRecords(data) {
        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="${config.columns.length + 1}"
                        class="empty-row">
                        No records found.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = data.map(record => `
            <tr>
                ${config.columns.map(column => `
                    <td>${escapeHTML(record[column.key])}</td>
                `).join("")}

                <td>
                    <div class="action-buttons">
                        <button class="btn-small"
                                data-edit="${record.id}">
                            Edit
                        </button>

                        <button class="btn-small btn-danger"
                                data-delete="${record.id}">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");
    }

    function resetForm() {
        form.reset();

        document.getElementById("editId").value = "";

        document.getElementById("formHeading").textContent =
            "Add New Record";

        document.getElementById("saveButton").textContent =
            "Add Record";

        document.getElementById("cancelButton").hidden = true;
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const id = document.getElementById("editId").value;

        const record = {
            id: id ? Number(id) : generateId()
        };

        config.fields.forEach(field => {
            record[field.name] = document
                .getElementById("field_" + field.name)
                .value.trim();
        });
        if (config.calculate) {
    config.calculate(record);
}

        let currentRecords = getData(config.storage);

        if (id) {
            currentRecords = currentRecords.map(item =>
                item.id === Number(id) ? record : item
            );

            addActivity("Updated Record", config.title);
        } else {
            currentRecords.push(record);

            addActivity("Added Record", config.title);
        }

        saveData(config.storage, currentRecords);

        showMessage("Record saved successfully.");

        resetForm();
        displayRecords(currentRecords);
    });

    tableBody.addEventListener("click", function(event) {
        const editId = event.target.dataset.edit;
        const deleteId = event.target.dataset.delete;

        let currentRecords = getData(config.storage);

        if (editId) {
            const record = currentRecords.find(
                item => item.id === Number(editId)
            );

            if (!record) return;

            config.fields.forEach(field => {
                document.getElementById(
                    "field_" + field.name
                ).value = record[field.name];
            });

            document.getElementById("editId").value = record.id;

            document.getElementById("formHeading").textContent =
                "Update Record";

            document.getElementById("saveButton").textContent =
                "Update Record";

            document.getElementById("cancelButton").hidden = false;

            return;
        }

        if (deleteId) {
            if (!confirm("Are you sure you want to delete this record?")) {
                return;
            }

            currentRecords = currentRecords.filter(
                item => item.id !== Number(deleteId)
            );

            saveData(config.storage, currentRecords);

            addActivity("Deleted Record", config.title);

            displayRecords(currentRecords);
        }
    });

    document.getElementById("cancelButton").addEventListener(
        "click",
        resetForm
    );

    searchBox.addEventListener("input", function() {
        const keyword = searchBox.value.toLowerCase();

        const currentRecords = getData(config.storage);

        const filtered = currentRecords.filter(record =>
            config.fields.some(field =>
                String(record[field.name] || "")
                    .toLowerCase()
                    .includes(keyword)
            )
        );

        displayRecords(filtered);
    });

    displayRecords(records);
}

/* SIDEBAR NAVIGATION */

function setupNavigation(pages) {
    const buttons = document.querySelectorAll(".sidebar button");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            buttons.forEach(btn => btn.classList.remove("active"));

            this.classList.add("active");

            const page = this.dataset.page;

            pages[page]();
        });
    });
}