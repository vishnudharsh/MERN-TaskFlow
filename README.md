# TaskFlow - MERN Stack Task Management System

A robust Task Management System built with the MERN stack (MongoDB, Express, React, Node.js) featuring Role-Based Access Control (RBAC) for efficient team collaboration.

🚀 Features

- Role-Based Access Control: Separate dashboards and permissions for Managers and Employees
- Task Management: Create, assign, update, and track tasks with priority levels (High, Medium, Low)
- Status Tracking: Monitor task progress through Todo, In Progress, and Completed stages
- Team Collaboration: Assign multiple team members to tasks
- Activity Timeline: Track all task activities and comments with timestamps
- Sub-Tasks: Break down complex tasks into manageable sub-tasks
- User Management: Admin panel to manage team members and their roles
- Real-time Notifications: Get instant updates on task assignments and changes
- Dark Mode Support: Toggle between light and dark themes
- Responsive Design: Fully optimized for desktop, tablet, and mobile devices
- Dashboard Analytics: Visual charts showing task statistics and team performance
- Trash Management: Soft delete functionality with restore options

🛠️ Tech Stack

🎨 Frontend
- React.js - UI library
- Redux Toolkit - State management with RTK Query for API calls
- Tailwind CSS - Utility-first CSS framework with custom teal theme
- Headless UI - Accessible UI components
- React Icons - Icon library
- Recharts - Data visualization
- Moment.js - Date formatting
- Sonner - Toast notifications

⚙️ Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - NoSQL database
- Mongoose - ODM for MongoDB
- JWT - Authentication
- Bcrypt - Password hashing

⚙️ Installation & Setup

1. Clone the repository
```bash
git clone https://github.com/vishnudharsh/MERN-TaskFlow
cd taskflow

▶️ Run the application

# Run backend (from root)
npm start

# Run frontend (from client folder)
cd client
npm run dev
