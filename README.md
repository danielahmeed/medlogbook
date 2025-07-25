# Medical Logbook Backend API

A Node.js/Express backend API for the Medical Logbook application, providing secure authentication and operation management for medical professionals.

## Features

- 🔐 **JWT Authentication** - Secure user login and session management
- 📋 **Operation Management** - CRUD operations for medical procedures
- 🔍 **Search & Filtering** - Advanced search and pagination
- 📊 **Analytics** - Operation statistics and insights
- 🛡️ **Security** - Rate limiting, CORS, and data validation
- 🗄️ **MySQL Database** - Robust data storage with Knex.js ORM
- ✅ **Validation** - Request validation with Joi
- 📝 **TypeScript** - Full type safety and better development experience

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Knex.js
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Language**: TypeScript
- **Security**: Helmet, bcryptjs, express-rate-limit

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medlogbook-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Configure your database**
   Update the `.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=medlogbook
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

5. **Create the database**
   ```bash
   mysql -u root -p
   CREATE DATABASE medlogbook;
   ```

6. **Run migrations**
   ```bash
   npm run migrate
   ```

7. **Seed the database** (optional - creates default user)
   ```bash
   npm run seed
   ```

## Development

Start the development server with hot reloading:

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info

### Operations
- `GET /api/operations` - Get user's operations (with pagination/search)
- `POST /api/operations` - Create new operation
- `GET /api/operations/:id` - Get specific operation
- `PUT /api/operations/:id` - Update operation
- `DELETE /api/operations/:id` - Delete operation
- `GET /api/operations/stats` - Get operation statistics

### Utility
- `GET /api/health` - Health check endpoint
- `GET /` - API info and available endpoints

## Default User

The seed data creates a default user for testing:
- **User ID**: `Yaser jabbar`
- **Password**: `12345`

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `user_id` (Unique identifier for login)
- `password_hash` (Bcrypt hashed password)
- `full_name` (Optional full name)
- `email` (Optional email)
- `specialty` (Medical specialty)
- `hospital_affiliation` (Hospital affiliation)
- `created_at`, `updated_at` (Timestamps)

### Operations Table
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key to Users)
- `patient_id` (Patient identifier)
- `patient_age` (Patient age)
- `date_of_birth` (Optional patient DOB)
- `operation_date` (Date of operation)
- `operator_name` (Name of operator)
- `operator_level` (Level: Consultant, Registrar, etc.)
- `urgency` (Elective, Urgent, Emergency, Immediate)
- `asa_grade` (ASA I-VI)
- `operation_name` (Name/description of operation)
- `hospital` (Hospital where operation performed)
- `notes` (Additional notes)
- `complications` (Any complications)
- `is_private` (Privacy flag)
- `created_at`, `updated_at` (Timestamps)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `medlogbook` | Database name |
| `DB_USER` | `root` | Database username |
| `DB_PASSWORD` | - | Database password |
| `JWT_SECRET` | - | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | JWT expiration |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL for CORS |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback last migration
- `npm run seed` - Run database seeds
- `npm test` - Run tests (when implemented)

## Security Features

- **Password Hashing**: Uses bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Protection**: Configured for specific frontend origin
- **Input Validation**: Comprehensive validation with Joi schemas
- **SQL Injection Protection**: Parameterized queries via Knex.js
- **Security Headers**: Helmet.js for secure HTTP headers

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional details (optional)"
}
```

## Pagination

List endpoints support pagination with query parameters:

```
GET /api/operations?page=1&limit=10&search=surgery&sortBy=operation_date&sortOrder=desc
```

Response includes pagination metadata:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.