# Evently

Evently is a web application built using the **MERN** stack (MongoDB, Express, React, Node.js), designed to help college clubs and students manage events.  
It allows admins to create and manage events, while students can view and register for them.

---

## 📌 Features

- Admins can **create**, **edit**, and **delete** events  
- Students can **view** and **register** for events  
- Event details include title, description, date, time, and location  
- Authentication & Authorization with JWT (role-based access)  
- Responsive UI for desktop and mobile  

---

## 🛠️ Tech Stack

- **Frontend**: React.js  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB  
- **Authentication**: JWT  
- **Styling**: (Tailwind / CSS / Bootstrap – specify if used)  

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (v16 or above recommended)  
- [MongoDB](https://www.mongodb.com/) (local or Atlas cloud instance)  
- npm or yarn  

### Installation

1. Clone the repository  

   ```bash
   git clone https://github.com/Gnaneswar1183/Evently.git
   cd Evently
2.Install backend dependencies

cd Backend
npm install

3.Install frontend dependencies

cd ../Frontend
npm install

4.Create a .env file inside Backend/ with the following variables:

MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=5000

▶️ Running the App

Start the backend server:

cd Backend
npm run dev

Start the frontend app:

cd ../Frontend
npm start
Frontend will run on http://localhost:3000
Backend will run on http://localhost:5000

📂 Project Structure
Evently/
├── Backend/
│   ├── controllers/    # Route logic
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middleware/     # Auth & other middleware
│   ├── config/         # DB connection & env config
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # React pages
│   │   ├── services/   # API calls
│   │   └── App.js
│   └── public/
│
└── README.md
