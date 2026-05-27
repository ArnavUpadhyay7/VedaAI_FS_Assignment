# VedaAI — AI Assessment Creator

Full-stack assignment generator with Express, Next.js, MongoDB, Redis/BullMQ, Socket.io, and OpenRouter.

### Prerequisites

- Node.js 20+
- MongoDB
- Redis

## Setup instructions

### Backend

```bash
cd server
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

Runs on `http://localhost:4000`.

### Frontend

```bash
cd client
cp .env.local.example .env.local
npm install
npm run dev
```

Runs on `http://localhost:3000`.


## Approach

The development process started with the backend implementation to establish all core functionality and APIs first. This included database integration, AI-powered workflows, queue handling with Redis/BullMQ, and the main business logic required for the assignment. Once the backend workflows were stable and functioning end-to-end, the frontend was developed and integrated with the APIs. The UI was built with focus on closely matching the provided Figma design while maintaining responsiveness and usability across different screen sizes. After completing the core requirements, the remaining time was used to implement bonus features, improve UX, and refine the overall application flow.

## Architecture overview

The application follows a decoupled fullstack architecture with separate frontend and backend deployments for better scalability and maintainability.

The frontend was built using Next.js and React, with a component-based structure to keep the UI modular and reusable. State management and API integration were handled in a way that ensured smooth communication with the backend while maintaining responsive client-side interactions. The UI layer was designed to closely replicate the provided Figma design and provide a clean user experience across desktop and mobile devices.

The backend was built using Node.js and Express, structured around REST APIs for handling assignments, AI operations, PDF generation, and data management. MongoDB Atlas was used as the primary database for persistent storage. Redis and BullMQ were integrated to manage background jobs and asynchronous task processing efficiently. OpenRouter APIs were used for AI-related functionality within the platform.

For deployment, the frontend was hosted on Vercel while the backend was deployed on Render. Environment-based configuration was used to separate development and production setups, with proper CORS handling and API communication between services.