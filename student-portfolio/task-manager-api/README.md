# Task Manager API - AWDF Practicals (ITUE301)

RESTful Task Management Backend built with Node.js, Express, MongoDB, and Mongoose.

## 🚀 Covered Practicals
- **Practical 4**: Building a RESTful API with Node.js and Express (CRUD endpoints, custom logging middleware, Content-Type validation middleware, 404 handler, global error handler).
- **Practical 5**: MongoDB Integration and Schema Design with Mongoose (Schema validation, default values, priority enums, pre-save hooks, persistent storage).

---

## 🛠️ Setup & Running

1. **Install Dependencies**:
   ```bash
   cd task-manager-api
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskdb
   ```
   *(If MongoDB is not running locally, the server smoothly falls back to in-memory mode for development and testing).*

3. **Start the Server**:
   ```bash
   npm start
   # or with live reload:
   npm run dev
   ```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API Health & documentation overview | `200 OK` |
| `GET` | `/tasks` | Retrieve all tasks | `200 OK` |
| `GET` | `/tasks/:id` | Retrieve single task by ID | `200 OK` / `404 Not Found` |
| `POST` | `/tasks` | Create a new task | `201 Created` / `400 Bad Request` |
| `PUT` | `/tasks/:id` | Update an existing task | `200 OK` / `404 Not Found` |
| `DELETE` | `/tasks/:id` | Delete a task by ID | `200 OK` / `404 Not Found` |

### Sample JSON Payload for `POST /tasks`:
```json
{
  "title": "Build Full Stack Integration",
  "description": "Connect React UI to Node.js backend (Practical 6)",
  "priority": "high",
  "completed": false
}
```
