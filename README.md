
# 🔗 Link Coder – Developer Connection Platform (Backend)

**Link Coder** is a production-ready backend server for a developer networking platform (similar to DevTinder), where users can connect, collaborate, and grow together. Built with robust authentication, modular routing, and optimized MongoDB queries, it ensures scalability, security, and clean API architecture.

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Cookie-based Auth Flow**

## 🧩 Features Implemented

### 🔐 Authentication & Security

- Secure **user registration and login** using JWT and cookies
- **Password hashing** using bcrypt
- **Route protection** middleware
- **Data sanitization** and **schema validation**

### 👤 User Profile & Connections

- Send, receive, accept, and reject **connection requests**
- Prevent duplicate and self-requests using Mongoose validations and .pre middleware
- View and manage connection status

### ⚙️ Core Backend Functionality

- Modular **Express routing** for scalability
- **Error handling middleware** for clean API responses
- Optimized queries using **indexes** and **compound filters**
- Implemented **pagination** using MongoDB skip & limit
- Structured folder layout for production-readiness

## 📦 Getting Started

### Clone the Repository

```git clone https://github.com/yourusername/link-coder.git
cd link-coder
```

### Install Dependencies

`  npm install  `

### Setup Environment Variables

Create a .env file in the root and configure:

```
envPORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret  
COOKIE_SECRET=your_cookie_secret
[sorry currently can't provide this sensetive information]
```

### Run the Server

 ```  npm run dev  ```

Server runs at: http://localhost:7777/

## 📁 Folder Structure (Simplified)

 ```  
 link-coder/  │  
 ├── controllers/  
 ├── models/  
 ├── routes/  
 ├── middlewares/ 
 ├── utils/ 
 ├── config/  
 └── app.js 
 ```

## 🛠️ Future Plans

- Add frontend using React and Tailwind CSS
- Implement rate limiting and caching
- Enable deployment to cloud (Render/Vercel/Netlify)
- Enhance analytics for user interactions

## 🙋‍♂️ Author

**Alapan Pal** – \_Solo project built for learning and production-readiness_GitHub: [@codeAlapan](https://github.com/codeAlapan)

## 📄 License

This project is licensed under the MIT License.
