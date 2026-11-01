"use strict";

document.addEventListener("DOMContentLoaded", function() {

    const admin = protectDashboard("admin");

    if (!admin) return;

    const pages = {

        overview: function() {

            const users = getData("eride_users");
            const bikes = getData("eride_bikes");
            const bookings = getData("eride_bookings");
            const purchases = getData("eride_purchases");

            const revenue = purchases.reduce(
                (total, item) => total + Number(item.amount || 0),
                0
            );

            renderOverview("Admin", "Dashboard Overview", [
                { label: "Total Users", value: users.length },
                { label: "Total E-Bikes", value: bikes.length },
                { label: "Total Bookings", value: bookings.length },
                { label: "Accessories Sales", value: "৳" + revenue }
            ]);
        },

        users: function() {

            renderCRUDPage({
                title: "Manage Users",
                description: "Add, view, update, delete and search system users.",
                storage: "eride_users",
                fields: [
                    { name: "name", label: "Full Name" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "password", label: "Password", type: "password" },
                    {
                        name: "role",
                        label: "User Role",
                        options: ["admin", "customer", "manager", "seller"]
                    },
                    { name: "phone", label: "Phone Number" },
                    {
                        name: "status",
                        label: "Account Status",
                        options: ["Active", "Inactive"]
                    }
                ],
                columns: [
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
                    { key: "role", label: "Role" },
                    { key: "phone", label: "Phone" },
                    { key: "status", label: "Status" }
                ]
            });

        },

        activity: function() {

            const content = document.getElementById("dashboardContent");
            const activities = getData("eride_activity");

            content.innerHTML = `
                <div class="dashboard-heading">
                    <div>
                        <h1>Activity Log</h1>
                        <p class="muted">
                            Monitor important activities performed by system users.
                        </p>
                    </div>
                </div>

                <section class="content-panel">
                    <div class="panel-heading">
                        <h2>Recent Activities</h2>
                        <span class="badge">${activities.length} Activities</span>
                    </div>

                    <div class="toolbar">
                        <input type="search" id="activitySearch"
                               placeholder="Search activities...">
                    </div>

                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Activity</th>
                                    <th>Details</th>
                                    <th>Date & Time</th>
                                </tr>
                            </thead>
                            <tbody id="activityTable"></tbody>
                        </table>
                    </div>
                </section>
            `;

            const table = document.getElementById("activityTable");
            const search = document.getElementById("activitySearch");

            function showActivities(data) {

                if (data.length === 0) {
                    table.innerHTML = `
                        <tr>
                            <td colspan="5" class="empty-row">
                                No activities found.
                            </td>
                        </tr>
                    `;
                    return;
                }

                table.innerHTML = data.map(item => `
                    <tr>
                        <td>${escapeHTML(item.user)}</td>
                        <td>${escapeHTML(item.role)}</td>
                        <td>${escapeHTML(item.action)}</td>
                        <td>${escapeHTML(item.details)}</td>
                        <td>${escapeHTML(item.date)}</td>
                    </tr>
                `).join("");
            }

            search.addEventListener("input", function() {

                const keyword = this.value.toLowerCase();

                const filtered = getData("eride_activity").filter(item =>
                    Object.values(item).some(value =>
                        String(value).toLowerCase().includes(keyword)
                    )
                );

                showActivities(filtered);
            });

            showActivities(activities);

        },

        rules: function() {

            renderCRUDPage({
                title: "Rental Rules & Pricing Management",
                description: "Manage rental charges and conditions.",
                storage: "eride_rules",
                fields: [
                    { name: "rule", label: "Rule Name" },
                    { name: "value", label: "Value" },
                    { name: "description", label: "Description" }
                ],
                columns: [
                    { key: "rule", label: "Rule" },
                    { key: "value", label: "Value" },
                    { key: "description", label: "Description" }
                ]
            });

        }

    };

    setupNavigation(pages);

    pages.overview();

});