# Flag Explorer App
- Objective of my code is display my knowledge of architecting an application, enforcing best practices, principles, concepts and   general flow of how I would start any application because complimenting the de-coupling, scalable, extensible, maintainable and testible fundamentals in mind so as the application expands and grows the foundation basis of the application is concrete and solid.

## Overview
A full-stack application with user authentication, country flag exploration, admin management, audit logging, and role-based permissions.

## Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- npm

## Setup and Run

### Backend
1. Navigate to `FlagExplorerApp.API`
2. Run `dotnet restore`
3. Run `dotnet run`
   - This will create and seed the SQLite database (`FlagExplorerApp.db`)

### Frontend
1. Navigate to `FlagExplorerApp.Frontend`
2. Run `npm install`
3. Run `npm start`

## Features
- **Login/Register**: User authentication with JWT
- **Dashboard**: Pie chart of country count (Permission: ViewDashboard)
- **Country Explorer**: Grid of flags with details view (Permission: ViewCountries)
- **Profile**: Update user details (Permission: ViewProfile)
- **Manage Users**: Admin CRUD operations with soft delete (Permissions: ViewUsers, DeleteUsers)
- **Audit Log**: View all database operations (Permission: ViewAudit)
- **Manage Permissions**: Assign permissions to roles (Permission: ManagePermissions)
- **Logout**: Available in navbar when logged in

## Database
- SQLite database with tables: Users, Roles, AuditLogs, Permissions, RolePermissions
- Soft delete implemented
- Auditing for all CRUD operations
- Permissions system with Admin role having all permissions by default

## Notes
- Default admin credentials: Username: Admin, Password: Admin123!
- Ensure the backend is running on `https://localhost:5001`
- Update `appsettings.json` with a secure JWT key in production

## Permissions
- ViewUsers: View user list
- EditUsers: Edit users
- DeleteUsers: Delete users
- ViewAudit: View audit logs
- ManagePermissions: Manage role permissions
- ViewDashboard: View dashboard
- ViewCountries: View country explorer
- ViewProfile: View and edit profile

## Testing
- Backend: `dotnet test` in `FlagExplorerApp.Tests` (add tests as needed)
- Frontend: `npm test` in `FlagExplorerApp.Frontend` (add tests as needed)