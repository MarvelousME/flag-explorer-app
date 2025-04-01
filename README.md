# Flag Explorer App

A full-stack application for exploring country flags with user authentication, role-based permissions, and administrative features.

## Tech Stack

### Frontend
- React 18
- Material UI 5.15
- React Router DOM 6.27
- Axios for API calls
- Recharts for data visualization
- Jest & React Testing Library for testing
- LogLevel for logging

### Backend
- .NET 8.0
- SQLite database
- JWT authentication

## Features

### Authentication & Security
- User registration with email verification
- Login with JWT token authentication
- Password hashing and salting
- Protected API routes and endpoints
- Role-based access control (RBAC)
- Session management and persistence
- Account lockout after failed attempts
- Password complexity requirements
- HTTPS/TLS encryption

### Core Features
- Interactive dashboard with data visualizations
- Country statistics and demographics
- Advanced country search and filtering
- Flag image gallery with zoom capabilities
- Detailed country information pages
- Flag comparison tool
- Regional grouping and analysis
- Favorite countries list
- Download flags in multiple formats
- Share country details via social media

### User Features
- Customizable user profiles
- Profile picture upload
- Email preferences management
- Activity history tracking
- Saved searches
- Custom country collections
- Personal notes on countries
- Theme customization
- Language preferences
- Export data to CSV/PDF

### Administrative Features
- Comprehensive user management
  - Create/Edit/Delete users
  - Assign/revoke roles
  - Reset passwords
  - View user activity
- Permission management system
  - Create custom roles
  - Granular permission control
  - Permission inheritance
- Detailed audit logging
  - User actions tracking
  - System events
  - Security incidents
  - Login attempts
- System Configuration
  - Email templates
  - System parameters
  - Feature toggles
  - API rate limiting

### Data Management
- Automated data updates
- Data validation
- Backup and restore
- Data import/export
- Cache management
- API versioning
- Error logging and monitoring

### Integration Features
- REST API endpoints
- Webhook support
- External API integration
- Single Sign-On (SSO) support
- OAuth2 compatibility
- API documentation
- Rate limiting

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- npm

### Backend Setup
1. Navigate to the backend directory: