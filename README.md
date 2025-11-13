# Student Talent Hub Backend

A NestJS backend for the Student Talent Hub - CMU platform. This project connects CMU students with businesses and employers.

## Features
- JWT authentication (students, businesses, admin)
- PostgreSQL with TypeORM and migrations
- Role-based access control
- File uploads (Multer)
- Email notifications (NodeMailer)
- Swagger API docs
- Rate limiting, Helmet, CORS, Winston logging
- Jest unit and e2e testing

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- PostgreSQL >= 13
- Docker (optional, for local dev)

### Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```
cp .env.example .env
```

### Installation
```
cd backend
npm install
```

### Database Setup
- Create a PostgreSQL database (see `.env`)
- Run migrations:
```
npx typeorm migration:run -d src/database/migrations
```
- Seed initial data:
```
npx typeorm migration:run -d src/database/seeds
```

### Running the App
```
npm run start:dev
```

### API Documentation
- Swagger UI: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Docker
To run with Docker Compose:
```
docker-compose up --build
```

### Testing
- Run unit tests:
```
npm run test
```
- Run e2e tests:
```
npm run test:e2e
```
- Test coverage:
```
npm run test:cov
```

## Project Structure
- `src/` - Main source code
- `src/app.module.ts` - Root module
- `src/config/` - Configuration files
- `src/database/` - Migrations and seeds
- `src/uploads/` - File uploads

## License
MIT
