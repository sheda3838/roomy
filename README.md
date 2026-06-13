<div align="center">
  <img src="https://roomy-seven-drab.vercel.app/favicon.ico" alt="Roomy Logo" width="80" height="80" />
  <h1>Roomy</h1>
  <p><b>Find compatible roommates. Discover better shared living.</b></p>

  <p>
    <a href="https://roomy-seven-drab.vercel.app/" target="_blank">Live Demo</a> •
    <a href="https://github.com/sheda3838/roomy" target="_blank">GitHub Repository</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </p>
</div>

<br />

## About Roomy

Roomy is a roommate and room discovery platform designed to help users find compatible roommates and suitable accommodations based on lifestyle preferences, budget, location preferences, room facilities, and living habits.

The project was inspired by a real-world problem experienced by the founder while searching for accommodation and roommates. The goal is to reduce mismatches and improve shared living experiences through **compatibility-based matching** rather than simple room listings.

### Key Highlights
- **Compatibility-Based Matching:** Advanced algorithm that calculates lifestyle and habit alignment.
- **Room Discovery:** Search for the perfect room using smart filtering.
- **Roommate Discovery:** Find people who share your values and living habits.
- **Real-Time Messaging:** Connect and chat instantly with potential roommates.
- **Smart Filtering:** Find exact matches based on budget, location, and facilities.
- **Modern Responsive UI:** A sleek, mobile-friendly interface built for a premium user experience.

---

## The Problem

* **Superficial Listings:** Traditional room listing platforms only focus on the physical room attributes (rent, location, size).
* **Ignoring the Human Element:** They completely ignore roommate compatibility, which is often the most critical factor in shared living.
* **Conflict Generation:** Lifestyle mismatches (e.g., night owls vs. early birds, neat freaks vs. messy individuals) create unnecessary conflicts.
* **The Solution:** Roomy solves this problem through structured matching, ensuring that you find both a great room *and* a great roommate.

---

## Features

### Authentication
* **Google Authentication:** Seamless sign-in using Auth.js.
* **Secure Sessions:** JWT-based secure session management.
* **Protected Routes:** Middleware-protected application states.

### User Profiles
* **Lifestyle Preferences:** Configurable habits (sleep schedule, cleanliness, smoking, etc.).
* **Budget Preferences:** Min and max budget ranges.
* **Preferred Locations:** Multi-select desired neighborhoods/cities.
* **Facility Preferences:** Must-have amenities.
* **Profile Management:** Easily activate or deactivate seeker status.

### Room Discovery
* **Room Listings:** Detailed view of available accommodations.
* **Filters:** Drill down by rent, location, and capacity.
* **Facility Matching:** Highlight rooms that have exactly what you need.
* **Compatibility Scoring:** See how well you match with the current occupants of a room.

### Roommate Discovery
* **User Discovery:** Browse other users actively seeking housing.
* **Compatibility Calculation:** Instant percentage match based on profiles.
* **Connection Requests:** Send and manage requests to connect with potential roommates.

### Messaging
* **Real-Time Chat:** Instant messaging powered by Pusher.
* **Connection-Based Messaging:** Chat unlocks only after a successful connection request.

### Room Management
* **Create Room:** List a new room with photos, details, and rules.
* **Edit Room:** Update details as needed.
* **Deactivate Room:** Unlist a room when it's full or no longer available.

---

## Compatibility Scoring System

Roomy uses a proprietary, weighted scoring model out of 100 to determine how well two users—or a user and a room—match. 

The engine evaluates several key dimensions:

1. **Lifestyle Factors:**
   * Cleanliness expectations
   * Smoking habits
   * Drinking habits
   * Guest policy comfort
   * Sleep schedule (Night Owl vs. Early Bird)
   * Gender preference
   * Occupation (Student vs. Professional)
2. **Budget Matching:** Overlap analysis of budget ranges.
3. **Location Matching:** Cross-referencing preferred neighborhoods.
4. **Facility Matching:** Comparing desired amenities against provided ones.

*(Note: The exact algorithmic weights are kept hidden to prevent gamification, keeping the experience natural and user-friendly.)*

---

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend** | Next.js Server Actions, MongoDB, Mongoose, Auth.js |
| **Realtime** | Pusher |
| **Media Management** | Cloudinary |
| **Data Validation** | Zod, React Hook Form |
| **Testing** | Cypress (E2E), Vitest (Unit/Integration) |
| **Deployment** | Vercel (Hosting), MongoDB Atlas (Database) |

---

## System Architecture

Roomy is built on a modern, **Server-First Architecture** leveraging the Next.js App Router:

* **Next.js Server Actions:** Handles direct database mutations and complex logic securely on the server, eliminating the need for a separate REST API layer for internal operations.
* **MongoDB Data Layer:** Mongoose ORM handles the NoSQL data modeling for Users, Rooms, Connections, and Messages.
* **Auth.js Authentication Layer:** Manages secure, stateless authentication flows and OAuth providers.
* **Compatibility Engine:** A pure server-side calculation module that dynamically cross-references user profiles on read requests.
* **Realtime Messaging Layer:** Pusher WebSockets integrate with the frontend to deliver instant chat updates without polling.

---

## Screenshots

### Home Page
![Home Page](./images/home-page.png)

### Discover Rooms
![Discover Rooms](./images/discover-rooms.png)

### Compatibility View
![Compatibility View](./images/compatibilty-view.png)

### Chat System
![Chat System](./images/chat-system.png)

### Profile
![Profile](./images/my-profile.png)

---

## Installation

Follow these steps to set up Roomy locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sheda3838/roomy.git
   cd roomy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:** (See section below)

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:3000`.*

---

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

| Variable | Description | Example Placeholder |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB Atlas Connection String | `mongodb+srv://user:pass@cluster.mongodb.net/roomy` |
| `AUTH_SECRET` | Auth.js Secret Key | `your-random-secure-string` |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | `12345-abcde.apps.googleusercontent.com` |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | `GOCSPX-your-google-secret` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `dxxxxxxxx` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_cloudinary_secret` |
| `PUSHER_APP_ID` | Pusher Application ID | `1234567` |
| `PUSHER_KEY` | Pusher Key | `your_pusher_key` |
| `PUSHER_SECRET` | Pusher Secret | `your_pusher_secret` |
| `PUSHER_CLUSTER` | Pusher Cluster | `ap2` |
| `NEXT_PUBLIC_PUSHER_KEY`| Client-side Pusher Key | `your_pusher_key` |
| `NEXT_PUBLIC_PUSHER_CLUSTER`| Client-side Pusher Cluster | `ap2` |
| `NEXT_PUBLIC_APP_URL` | Application Base URL | `http://localhost:3000` |

---

## Running Tests

Roomy is equipped with comprehensive testing.

**Run Unit & Integration Tests (Vitest):**
```bash
npm run test
```

**Run End-to-End Tests (Cypress):**
```bash
# Open Cypress UI
npx cypress open

# Or run headlessly
npx cypress run
```

---

## Future Improvements

* **AI-Assisted Roommate Recommendations:** Leverage LLMs to analyze user bios and predict personality matches.
* **Advanced Search Filters:** Interactive map-based searching and commute-time calculators.
* **Room Availability Calendar:** Let room owners block out dates.
* **Mobile Application:** React Native / Expo wrapper for native iOS and Android apps.
* **Notifications:** Push notifications and email alerts for new messages or high-match users.
* **Enhanced Analytics:** Dashboards for room owners to track views and engagement.

---

## Author

**Kamil Zaid**  
*(Full Stack Engineer)*

* **GitHub:** [@sheda3838](https://github.com/sheda3838)
* **LinkedIn:** [https://www.linkedin.com/in/kamilzaid/]

---
<div align="center">
  <sub>Built with ❤️ for a better shared living experience.</sub>
</div>
