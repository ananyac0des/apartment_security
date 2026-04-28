# Apartment Security Management System

A full-stack web application built using Next.js, Prisma, and MySQL to manage apartment security operations such as resident access, visitor control, entry logs, incidents, and maintenance.

---

## Features

### Access Control

* Resident entry using access cards
* Activate and deactivate cards
* Expiry validation

### Visitor Management

* Approve or reject visitors
* Block and unblock visitors using blacklist
* Only approved visitors are allowed entry

### Entry Logs

* Entry and exit tracking
* Guard-based logging
* Gate-based entry system

### Incidents

* Record incidents with severity levels
* Link incidents to apartments
* Mark incidents as resolved

### Maintenance Requests

* Residents can raise maintenance issues
* Admin can update status:

  * pending
  * in_progress
  * completed

### Database Modules

* Residents
* Visitors
* Security Guards
* Apartments
* Gates and Gate Logs
* Access Cards
* Maintenance Requests
* Incidents

---

## Tech Stack

* Frontend: Next.js (App Router)
* Backend: Next.js API Routes
* Database: MySQL
* ORM: Prisma
* Styling: Tailwind CSS

---

## Setup Instructions

### 1. Clone the repository

```bash id="c1"
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

---

### 2. Install dependencies

```bash id="c2"
npm install
```

---

### 3. Configure environment variables

Create a `.env` file:

```env id="c3"
DATABASE_URL="mysql://root:password@localhost:3306/apartmentsecurity"
```

---

### 4. Setup database

Create database:

```sql id="c4"
CREATE DATABASE apartmentsecurity;
```

Import data (if available):

```bash id="c5"
mysql -u root -p apartmentsecurity < db.sql
```

---

### 5. Generate Prisma client

```bash id="c6"
npx prisma generate
```

---

### 6. Run the application

```bash id="c7"
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Roles

* Admin

  * Manage residents, incidents, maintenance

* Guard

  * Log entries
  * Approve or block visitors

* Resident

  * Raise maintenance requests

---

## Notes

* `.env` is not included for security reasons
* Ensure MySQL is running before starting
* Use sample data or import SQL dump

---

## Future Improvements

* Authentication system (JWT or NextAuth)
* Parking management module
* CCTV monitoring interface
* Notification system

---

## Author

Developed as a database management and full-stack application project.
