"use strict";

document.addEventListener("DOMContentLoaded", function() {

    const customer = protectDashboard("customer");

    if (!customer) return;

    const pages = {

        overview: function() {

            const bookings = getData("eride_bookings");
            const rides = getData("eride_rides");
            const purchases = getData("eride_purchases");

            renderOverview("Customer", "Dashboard Overview", [
                { label: "My Bookings", value: bookings.length },
                { label: "My Rides", value: rides.length },
                { label: "Accessories Purchases", value: purchases.length },
                {
                    label: "Total Purchase Amount",
                    value: "৳" + purchases.reduce(
                        (total, item) => total + Number(item.amount || 0), 0
                    )
                }
            ]);
        },

        booking: function() {

            renderCRUDPage({
                title: "E-Bike Booking",
                description: "Book an e-bike by selecting a bike, station and date.",
                storage: "eride_bookings",
                fields: [
                    { name: "bike", label: "E-Bike Model" },
                    { name: "station", label: "Pickup Station" },
                    { name: "date", label: "Booking Date", type: "date" },
                    { name: "hours", label: "Rental Hours", type: "number" }
                ],
                columns: [
                    { key: "bike", label: "E-Bike" },
                    { key: "station", label: "Pickup Station" },
                    { key: "date", label: "Booking Date" },
                    { key: "hours", label: "Hours" }
                ]
            });

        },

        rides: function() {

            renderCRUDPage({
                title: "Ride Management & Fare Calculation",
                description: "Enter ride duration and hourly rate to calculate the fare.",
                storage: "eride_rides",
                fields: [
                    { name: "bike", label: "E-Bike Model" },
                    { name: "hours", label: "Ride Duration (Hours)", type: "number" },
                    { name: "hourlyRate", label: "Hourly Rate (৳)", type: "number" }
                ],
                calculate: function(record) {
                    record.fare = Number(record.hours) *
                                  Number(record.hourlyRate);
                },
                columns: [
                    { key: "bike", label: "E-Bike" },
                    { key: "hours", label: "Duration" },
                    { key: "hourlyRate", label: "Hourly Rate (৳)" },
                    { key: "fare", label: "Calculated Fare (৳)" }
                ]
            });

        },

        accessories: function() {

            renderCRUDPage({
                title: "Accessories Purchase",
                description: "Record accessories selected for purchase.",
                storage: "eride_purchases",
                fields: [
                    { name: "product", label: "Product Name" },
                    { name: "quantity", label: "Quantity", type: "number" },
                    { name: "amount", label: "Total Amount (৳)", type: "number" }
                ],
                columns: [
                    { key: "product", label: "Product" },
                    { key: "quantity", label: "Quantity" },
                    { key: "amount", label: "Amount (৳)" }
                ]
            });

        }

    };

    setupNavigation(pages);

    pages.overview();

});