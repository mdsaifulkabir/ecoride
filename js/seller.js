"use strict";

document.addEventListener("DOMContentLoaded", function() {

    const seller = protectDashboard("seller");

    if (!seller) return;

    const pages = {

        overview: function() {

            const products = getData("eride_products");
            const orders = getData("eride_orders");

            const lowStock = products.filter(
                product => Number(product.stock) <= 5
            ).length;

            renderOverview("Seller", "Dashboard Overview", [
                { label: "Total Products", value: products.length },
                { label: "Total Orders", value: orders.length },
                { label: "Low Stock Products", value: lowStock },
                {
                    label: "Total Stock Units",
                    value: products.reduce(
                        (total, product) => total + Number(product.stock || 0),
                        0
                    )
                }
            ]);
        },

        products: function() {

            renderCRUDPage({
                title: "Product Listing Management",
                description: "Add, update, delete and search accessories products.",
                storage: "eride_products",
                fields: [
                    { name: "name", label: "Product Name" },
                    { name: "category", label: "Category" },
                    { name: "price", label: "Price (৳)", type: "number" },
                    { name: "stock", label: "Stock Quantity", type: "number" }
                ],
                columns: [
                    { key: "name", label: "Product" },
                    { key: "category", label: "Category" },
                    { key: "price", label: "Price (৳)" },
                    { key: "stock", label: "Stock" }
                ]
            });

        },

        stock: function() {

            const content = document.getElementById("dashboardContent");

            content.innerHTML = `
                <div class="dashboard-heading">
                    <div>
                        <h1>Stock Management</h1>
                        <p class="muted">
                            Monitor stock quantities and identify low-stock products.
                        </p>
                    </div>
                </div>

                <section class="content-panel">
                    <h2>Low Stock Alert</h2>
                    <div id="lowStockList"></div>
                </section>

                <section class="content-panel">
                    <h2>Update Product Stock</h2>

                    <div id="formMessage"></div>

                    <form id="stockForm">
                        <div class="form-group">
                            <label>Select Product</label>
                            <select id="stockProduct" required></select>
                        </div>

                        <div class="form-group">
                            <label>New Stock Quantity</label>
                            <input type="number" id="newStock"
                                   min="0" required>
                        </div>

                        <button type="submit">Update Stock</button>
                    </form>
                </section>

                <section class="content-panel">
                    <h2>Current Stock</h2>

                    <div class="toolbar">
                        <input type="search" id="stockSearch"
                               placeholder="Search products...">
                    </div>

                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Stock Quantity</th>
                                    <th>Stock Status</th>
                                </tr>
                            </thead>
                            <tbody id="stockTable"></tbody>
                        </table>
                    </div>
                </section>
            `;

            const productSelect = document.getElementById("stockProduct");
            const stockForm = document.getElementById("stockForm");
            const stockTable = document.getElementById("stockTable");
            const lowStockList = document.getElementById("lowStockList");

            function refreshStock() {

                const products = getData("eride_products");

                productSelect.innerHTML = `
                    <option value="">Select Product</option>
                    ${products.map(product => `
                        <option value="${product.id}">
                            ${escapeHTML(product.name)}
                        </option>
                    `).join("")}
                `;

                const lowProducts = products.filter(
                    product => Number(product.stock) <= 5
                );

                lowStockList.innerHTML = lowProducts.length
                    ? lowProducts.map(product => `
                        <p class="notice">
                            ${escapeHTML(product.name)}:
                            Only ${escapeHTML(product.stock)} units left.
                        </p>
                    `).join("")
                    : `<p class="notice success">No low-stock products.</p>`;

                showStock(products);
            }

            function showStock(products) {

                stockTable.innerHTML = products.length
                    ? products.map(product => `
                        <tr>
                            <td>${escapeHTML(product.name)}</td>
                            <td>${escapeHTML(product.category)}</td>
                            <td>${escapeHTML(product.stock)}</td>
                            <td>
                                ${Number(product.stock) <= 5
                                    ? '<span class="badge">Low Stock</span>'
                                    : '<span class="badge">Available</span>'}
                            </td>
                        </tr>
                    `).join("")
                    : `<tr><td colspan="4" class="empty-row">No products found.</td></tr>`;
            }

            stockForm.addEventListener("submit", function(event) {

                event.preventDefault();

                if (!stockForm.reportValidity()) return;

                const id = Number(productSelect.value);
                const quantity = document.getElementById("newStock").value;

                let products = getData("eride_products");

                products = products.map(product => {
                    if (product.id === id) {
                        return { ...product, stock: quantity };
                    }
                    return product;
                });

                saveData("eride_products", products);

                addActivity("Stock Updated", "Product stock quantity changed");

                showMessage("Stock updated successfully.");

                stockForm.reset();

                refreshStock();

            });

            document.getElementById("stockSearch").addEventListener(
                "input",
                function() {

                    const keyword = this.value.toLowerCase();

                    const filtered = getData("eride_products").filter(product =>
                        product.name.toLowerCase().includes(keyword) ||
                        product.category.toLowerCase().includes(keyword)
                    );

                    showStock(filtered);
                }
            );

            refreshStock();

        },

        orders: function() {

            renderCRUDPage({
                title: "Customer Order Management",
                description: "Record customer orders and update order status.",
                storage: "eride_orders",
                fields: [
                    { name: "customer", label: "Customer Name" },
                    { name: "product", label: "Product Name" },
                    { name: "quantity", label: "Quantity", type: "number" },
                    {
                        name: "status",
                        label: "Order Status",
                        options: ["Pending", "Processing", "Delivered", "Cancelled"]
                    }
                ],
                columns: [
                    { key: "customer", label: "Customer" },
                    { key: "product", label: "Product" },
                    { key: "quantity", label: "Quantity" },
                    { key: "status", label: "Order Status" }
                ]
            });

        }

    };

    setupNavigation(pages);

    pages.overview();

});