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

<img width="672" alt="Screenshot 2025-01-08 at 6 52 38 PM" src="https://github.com/user-attachments/assets/d194565e-cf2a-4adc-a2f0-a1a4af73f5f1" />

<img width="668" alt="Screenshot 2025-01-08 at 6 53 07 PM" src="https://github.com/user-attachments/assets/04201835-8f5e-425b-9a7c-66ff5e079258" />

<img width="640" alt="Screenshot 2025-01-08 at 6 53 27 PM" src="https://github.com/user-attachments/assets/c0f46e0d-7417-4b67-bf33-d6a8386ff108" />

<img width="671" alt="Screenshot 2025-01-08 at 6 53 41 PM" src="https://github.com/user-attachments/assets/69ca10ab-8257-46c8-8dee-23aeb8ad5050" />

<img width="669" alt="Screenshot 2025-01-08 at 6 53 54 PM" src="https://github.com/user-attachments/assets/24d31e31-b6af-40e9-93ec-f7ca85c09b20" />

<img width="673" alt="Screenshot 2025-01-08 at 6 54 05 PM" src="https://github.com/user-attachments/assets/9e4add5f-fc82-4a24-86a2-9effa19c69f0" />

<img width="673" alt="Screenshot 2025-01-08 at 6 54 17 PM" src="https://github.com/user-attachments/assets/ec0a2c5d-95a3-41b9-a5aa-122c75cfe166" />

<img width="674" alt="Screenshot 2025-01-08 at 6 54 30 PM" src="https://github.com/user-attachments/assets/67c89ae9-8b81-454c-8e58-fc839ca21bc7" />
