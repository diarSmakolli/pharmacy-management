# Instructions

### Overview

The pharmacy management system is a comprehesive software solution designed to streamline and simplify daily operations of a pharmacy especially in Kosovo(customized for fiscalization). It features modules for managing users, suppiers, products, categories, stock, taxes, sales, invoices and custom fiscalization to comply with regulatory requirements.

This application is built using Node.js, React and PostgreSQL and incorporates best practices for using it locally.

### Features

#### 1. Authentication and Authorization
#### 2. Organizations and Members
##### - Manage multiple pharmacy branches under one system.
##### - Assign roles and permissions to staff members for branch-level operations.
#### 3. Suppliers and Products 
##### - Maintain detailed records of suppliers and their product catalogs.
##### - Add, update, or delete products with categories, types, and stock levels.
#### 4. Stock Management
##### - Real-time stock tracking across branches.
##### - Notifications for low-stock products.
#### 5. Invoices and Orders
##### - Generate professional invoices for customer transactions.
##### - Manage orders, returns, and refunds.
#### 6. Fiscalization Compliance
##### - Generate fiscal receipts for sales based on country regulations.
##### - Integrated with fiscal printers for legal compliance.

## Installation

## Prerequisites
##### - Node.js and npm installed.
##### - PostgreSQL installed and configured.

#### Steps:

```
  git clone https://github.com/diarSmakolli/pharmacy-management.git
  cd pharmacy-management
  npm install
  cd client && npm install

  # update the .env file with your configurations on your device
  DB_DIALECT=
  DB_HOST=
  DB_USERNAME=
  DB_PASSWORD=
  DB_DATABASE=
  DB_PORT=
  JWT_SECRET=

  # databse migration or setup manually if you want
  npx sequelize-cli db:migrate

  # start the server
  npm run dev

  # start the client in path: pharmacy-management/client
  npm start

```

## Screenshoots








