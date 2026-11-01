"use strict";

document.addEventListener("DOMContentLoaded", function() {

    const manager = protectDashboard("manager");

    if (!manager) return;

    const pages = {

        overview: function() {

            const stations = getData("eride_stations");
            const bikes = getData("eride_bikes");

            const available = bikes.filter(
                bike => bike.status === "Available"
            ).length;

            const rented = bikes.filter(
                bike => bike.status === "Rented"
            ).length;

            renderOverview("Station Manager", "Dashboard Overview", [
                { label: "Total Stations", value: stations.length },
                { label: "Total Bikes", value: bikes.length },
                { label: "Available Bikes", value: available },
                { label: "Rented Bikes", value: rented }
            ]);
        },

        station: function() {

            renderCRUDPage({
                title: "Station Information Management",
                description: "Manage station name, location and capacity.",
                storage: "eride_stations",
                fields: [
                    { name: "station", label: "Station Name" },
                    { name: "location", label: "Station Location" },
                    { name: "capacity", label: "Bike Capacity", type: "number" }
                ],
                columns: [
                    { key: "station", label: "Station Name" },
                    { key: "location", label: "Location" },
                    { key: "capacity", label: "Capacity" }
                ]
            });

        },

        bikes: function() {

            renderCRUDPage({
                title: "Bike Status Management",
                description: "Update and manage the current status of station bikes.",
                storage: "eride_bikes",
                fields: [
                    { name: "bike", label: "Bike Model" },
                    { name: "station", label: "Station Name" },
                    {
                        name: "status",
                        label: "Bike Status",
                        options: ["Available", "Rented", "Maintenance"]
                    }
                ],
                columns: [
                    { key: "bike", label: "Bike Model" },
                    { key: "station", label: "Station" },
                    { key: "status", label: "Status" }
                ]
            });

        },

        availability: function() {

            const content = document.getElementById("dashboardContent");

            const bikes = getData("eride_bikes");

            const available = bikes.filter(
                bike => bike.status === "Available"
            ).length;

            const rented = bikes.filter(
                bike => bike.status === "Rented"
            ).length;

            const maintenance = bikes.filter(
                bike => bike.status === "Maintenance"
            ).length;

            content.innerHTML = `
                <div class="dashboard-heading">
                    <div>
                        <h1>Station Availability Monitoring</h1>
                        <p class="muted">
                            Monitor the availability of e-bikes at stations.
                        </p>
                    </div>
                </div>

                <div class="dashboard-cards">
                    <div class="stat-card">
                        <h2>${available}</h2>
                        <p>Available Bikes</p>
                    </div>

                    <div class="stat-card">
                        <h2>${rented}</h2>
                        <p>Rented Bikes</p>
                    </div>

                    <div class="stat-card">
                        <h2>${maintenance}</h2>
                        <p>Under Maintenance</p>
                    </div>

                    <div class="stat-card">
                        <h2>${bikes.length}</h2>
                        <p>Total Bikes</p>
                    </div>
                </div>

                <section class="content-panel">
                    <h2>Bike Availability Details</h2>

                    <div class="toolbar">
                        <input type="search" id="availabilitySearch"
                               placeholder="Search bikes or stations...">
                    </div>

                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Bike Model</th>
                                    <th>Station</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody id="availabilityTable"></tbody>
                        </table>
                    </div>
                </section>
            `;

            const table = document.getElementById("availabilityTable");
            const search = document.getElementById("availabilitySearch");

            function showBikes(data) {

                if (data.length === 0) {
                    table.innerHTML = `
                        <tr>
                            <td colspan="3" class="empty-row">
                                No bikes found.
                            </td>
                        </tr>
                    `;
                    return;
                }

                table.innerHTML = data.map(bike => `
                    <tr>
                        <td>${escapeHTML(bike.bike)}</td>
                        <td>${escapeHTML(bike.station)}</td>
                        <td>${escapeHTML(bike.status)}</td>
                    </tr>
                `).join("");
            }

            search.addEventListener("input", function() {

                const keyword = this.value.toLowerCase();

                const filtered = getData("eride_bikes").filter(bike =>
                    bike.bike.toLowerCase().includes(keyword) ||
                    bike.station.toLowerCase().includes(keyword) ||
                    bike.status.toLowerCase().includes(keyword)
                );

                showBikes(filtered);
            });

            showBikes(bikes);

        }

    };

    setupNavigation(pages);

    pages.overview();

});