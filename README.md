# Go Business - Referral Dashboard

A secure, fully responsive, and modern Referral Dashboard built for **Go Business** as a productivity tool to help track referrals, earnings, and partner activity in one place.

## 🚀 Live Demo & Repository
* **Framework**: React 19 + Vite 8
* **Styling**: Premium, responsive layouts using Vanilla CSS

---

## 🧭 Application Flow

```
[ User Login ] ──> [ Saved JWT Cookie ] ──> [ Protected Route Guard ]
                                                      │
                                                      ├──> [ Dashboard (/) ]
                                                      │       ├── View Metrics & Copy Links
                                                      │       └── Search, Sort, & Paginate
                                                      │
                                                      ├──> [ Details (/referral/:id) ]
                                                      │       └── Definitions List View
                                                      │
                                                      └──> [ Log out (Clears Cookie) ]
```

1. **Authentication**: Users must log in via a secure POST endpoint. On success, the JWT token is saved in a secure cookie `jwt_token`.
2. **Access Control**: Unauthenticated users trying to access `/` or `/referral/:id` are automatically redirected to `/login`. Authenticated users visiting `/login` are redirected back to the dashboard `/`.
3. **Dashboard Activity**: Users can view metrics, copy referral details to their clipboard, search or sort table rows instantly (client-side), and click on any row to open the detailed view.
4. **Log out**: Log out deletes the cookie and returns the user to the login screen.

---

## ✨ Key Features

* **Secure Authentication**: Connects with the Go Business Sign In API. Displays red validation warnings on incorrect or missing credentials.
* **Instant Client-Side Sorting & Filtering**: The search bar (filtering by name or service name) and date sorting ("Newest first" / "Oldest first") work **entirely in memory** (using `React.useMemo`). No network latency or flickering loading spinners when typing.
* **Responsive Layout**: Fluid grids and collapsible panels built with custom CSS variables, optimized for Desktop, Tablet, and Mobile screens.
* **Defining Detail Card**: Referral details are displayed on a clean card showing the partner's name, ID, service, date, and profit.
* **Clipboard Copies**: Copy links and referral codes to your clipboard with one click, showing success status indicators.

---

## 🛠️ Tech Stack

* **React 19** - Component-based user interface
* **Vite 8** - Lightweight development server and compiler
* **React Router Dom 7** - Path-based client routing
* **js-cookie 3** - Session cookie management
* **Vanilla CSS** - Visual design and layout styling

---

## 📦 Getting Started & Local Development

Follow these steps to run the project on your machine.

### Prerequisites
Make sure you have **Node.js** (version 18+) and **npm** installed.

### 1. Install Dependencies
Navigate into the project root directory and run:
```bash
npm install
```

### 2. Run the Development Server
Start the local server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 3. Build for Production
To compile and bundle the code for production (output inside the `dist/` folder):
```bash
npm run build
```

---

## 🔐 Test Credentials

Use these credentials to sign in and test the protected routes:

* **Email**: `admin@example.com`
* **Password**: `admin123`
