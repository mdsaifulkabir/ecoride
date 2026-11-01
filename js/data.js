"use strict";

const initialUsers = [
    {
        id: 1,
        name: "System Admin",
        email: "admin@ecoride.com",
        password: "admin123",
        role: "admin",
        phone: "01700000000",
        status: "Active"
    }
];

const initialRules = [
    {
        id: 1,
        rule: "Hourly Rental Charge",
        value: "150",
        description: "Rental charge per hour"
    },
    {
        id: 2,
        rule: "Security Deposit",
        value: "500",
        description: "Refundable security deposit"
    },
    {
        id: 3,
        rule: "Late Return Fee",
        value: "50",
        description: "Charge per late hour"
    }
];

const initialProducts = [
    {
        id: 1,
        name: "Safety Helmet",
        category: "Safety",
        price: "850",
        stock: "20"
    },
    {
        id: 2,
        name: "Bike Lock",
        category: "Security",
        price: "450",
        stock: "15"
    },
    {
        id: 3,
        name: "Front Light",
        category: "Lighting",
        price: "600",
        stock: "10"
    }
];

const initialBikes = [
    {
        id: 1,
        bike: "Eco City 01",
        station: "Khilkhet Station",
        status: "Available"
    },
    {
        id: 2,
        bike: "Trail Rider 02",
        station: "Uttara Station",
        status: "Rented"
    },
    {
        id: 3,
        bike: "Metro Glide 03",
        station: "Khilkhet Station",
        status: "Maintenance"
    }
];

function initializeData(key, initialValue) {
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(initialValue));
    }
}

initializeData("eride_users", initialUsers);
initializeData("eride_rules", initialRules);
initializeData("eride_products", initialProducts);
initializeData("eride_bikes", initialBikes);

initializeData("eride_activity", []);
initializeData("eride_bookings", []);
initializeData("eride_rides", []);
initializeData("eride_purchases", []);
initializeData("eride_stations", []);
initializeData("eride_orders", []);