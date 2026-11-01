# PAGETURN — Modern Library Management System

A professional, full-featured Library Management System built with pure **HTML5, CSS3, and Vanilla JavaScript**. Designed with an editorial aesthetic, responsive layout, and robust client-side **LocalStorage** database.

---

## 📖 Live Demo & Deployment
- Ready to deploy directly to **GitHub Pages** (root-level `index.html`).
- Zero external dependencies, build tools, or backend setup required.

---

## 🌟 Key Features

### 1. Modern Dashboard
- **Four Live Statistic Cards**:
  1. **Total Books**: Total copies and unique titles in the catalog.
  2. **Available Books**: Shelf copies ready for immediate borrowing.
  3. **Issued Books**: Active checkouts awaiting return with overdue counter.
  4. **Registered Students**: Total active student member registrations.
- **Recent Activities**: Real-time log of additions, checkouts, returns, and registrations.
- **Recent Book Issues**: High-priority table of current checkouts with one-click return action.
- **Library Statistics**: Circulation utilization progress bar, top category distribution chips, and stock health indicators.
- **Quick Action Shortcuts**: Direct jump to add a book, register a member, issue, or return.
- **Automatic Real-time Sync**: Every dashboard metric updates instantly on any data modification.

### 2. Seamless Single-Page Navigation
- Fixed / responsive collapsible sidebar with brand logo, profile, and badge indicators.
- Working sections switch instantly without reloading the page:
  - **Dashboard**
  - **Manage Books**
  - **Manage Students**
  - **Issue Books**
  - **Return Books**
  - **Issue History**

### 3. Complete Book Management (`Manage Books`)
- **Add Book**: Book ID, Title, Author, Category, and Total Quantity.
- **Edit Book**: Update details, categories, and adjust total/available stock.
- **Delete Book**: Guarded against deleting titles with actively issued copies, protected with a custom confirmation modal.
- **Duplicate ID Prevention**: Enforces strictly unique Book IDs.
- **Validation**: Enforces positive quantities, required fields, and non-negative stock.
- **Real-time Search & Filter**: Instant search across titles, authors, IDs, and dynamic category filtering.

### 4. Student Member Management (`Manage Students`)
- **Register Student**: Full Name, Roll Number, Department, Email, and Phone Number.
- **Edit Student**: In-place modal editing with automatic synchronization across transaction history.
- **Delete Student**: Prevents deletion if student holds unreturned books; custom confirmation modal.
- **Duplicate Roll Number Prevention**: Enforces strictly unique student roll numbers.
- **Email & Phone Validation**: Validates formats and required inputs.
- **Instant Search**: Filter members by name, roll number, or department.

### 5. Issue Books Circulation
- Student selection from active registered members.
- Book selection automatically restricted to titles with available copies (`availableQty > 0`).
- Automated 14-day borrowing period calculation with customizable issue and due dates.
- Automatic **stock decrement** on checkout.
- Blocks checkouts when copies are zero.
- Displays active loans with **visual overdue badges and highlighted rows**.

### 6. Return Books Circulation
- Displays all currently borrowed titles awaiting return.
- One-click **Return Book** action with confirmation.
- Automatically increments catalog available stock.
- Logs exact return date and changes status to `Returned`.
- Prevents duplicate returns.

### 7. Complete Issue History & Transaction Ledger
- Searchable transaction ledger displaying:
  - Transaction ID
  - Student Name & Roll Number
  - Book Title & Book ID
  - Issue Date
  - Due Date
  - Return Date
  - Live Status Badge (`Issued`, `Returned`, or `Overdue`)
- Status filtering (`All`, `Issued (Active)`, `Returned`, `Overdue`).
- **Export to CSV**: Instant download of the full transaction archive for external reporting.

### 8. LocalStorage Database Engine
- Persists all books, students, checkouts, and activity logs across browser refreshes and sessions.
- **Safe Initialization**: Only populates sample demo data when LocalStorage is empty—never overwriting user data.
- Built-in **JSON Database Export** and **Restore Demo Data** utilities.

### 9. Admin Authentication
- Split-screen editorial sign-in page matching the design.
- Built-in demo credentials autofill:
  - **Username**: `admin`
  - **Password**: `Library@123`
- Session persistence and secure sign-out.

---

## 📂 Project Directory Structure

```text
library-management-system/
│
├── index.html          # Main application file (Root for GitHub Pages)
├── css/
│   └── style.css       # Design system, responsive layout & animations
├── js/
│   └── script.js       # App logic, CRUD operations, LocalStorage database
└── README.md           # Documentation and deployment guide
```

---

## 🚀 How to Run Locally

1. **Direct Browser Execution**:
   - Double-click `index.html` or open it with any web browser (Chrome, Edge, Firefox, Safari).
   - No web server or Node.js required!

2. **Using a Local Static Server (Optional)**:
   - Python 3:
     ```bash
     python -m http.server 8000
     ```
     Visit `http://localhost:8000`
   - VS Code:
     Right-click `index.html` and click **"Open with Live Server"**.

---

## 🌐 GitHub Pages Deployment Guide

Deploy this project for free on GitHub Pages in under 2 minutes:

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Library Management System"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages** (under the "Code and automation" section).
   - Under **Build and deployment**:
     - **Source**: `Deploy from a branch`
     - **Branch**: `main`
     - **Folder**: `/ (root)`
   - Click **Save**.

3. **View Live Application**:
   - GitHub will generate your live URL (e.g., `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`).
   - Your Library Management System is now live, functional, and persistent!

---

## 🛡️ Validation & Business Rules Enforced

| Rule | Behavior |
| :--- | :--- |
| **Duplicate Book ID** | Alert shown, creation blocked. |
| **Negative / Zero Quantity** | Total quantity must be $\ge 1$. Available cannot exceed Total. |
| **Stock Consistency** | Issuing decrements stock by 1; returning increments stock by 1. |
| **Out-of-Stock Issue** | Disabled in selection dropdown and rejected on submission. |
| **Duplicate Roll Number** | Blocked with notification during registration or editing. |
| **Active Borrower Deletion** | Prevents deleting students or books with active loans. |
| **Overdue Highlighting** | Real-time comparison with current system date flags overdue items in red. |
| **Duplicate Return Prevention** | Returned records cannot be returned again. |

---

## 🎨 Design & Palette Tokens

- **Brand Dark Spruce**: `#19382b` / `#12281f`
- **Background Surface**: `#f5f7f4`
- **Card Background**: `#ffffff`
- **Serif Editorial Header**: `Fraunces` / `Playfair Display`
- **Clean UI Sans**: `Plus Jakarta Sans`
- **Badges**: Pill-shaped with soft backgrounds (`#e1f4e7`, `#fef3c7`, `#fef2f2`).
