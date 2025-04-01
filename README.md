Overview
A full-stack application featuring user authentication, country flag exploration, admin management, audit logging, and role-based permissions. The backend is built with .NET 8.0, and the frontend is built with React 18, using modern APIs like createRoot for rendering.

Prerequisites
.NET 8.0 SDK
Node.js 18+
npm (comes with Node.js)
Setup and Run
Backend
Navigate to the backend directory:
powershell

Collapse

Wrap

Copy
cd FlagExplorerApp.API
Restore dependencies:
powershell

Collapse

Wrap

Copy
dotnet restore
Run the backend:
powershell

Collapse

Wrap

Copy
dotnet run
This will create and seed the SQLite database (FlagExplorerApp.db).
The backend will run on https://localhost:5001 by default.
Frontend
Navigate to the frontend directory:
powershell

Collapse

Wrap

Copy
cd FlagExplorerApp.Frontend
Install dependencies:
powershell

Collapse

Wrap

Copy
npm install
Start the development server:
powershell

Collapse

Wrap

Copy
npm start
The app will run on http://localhost:3000.
Note: Ensure the backend is running before starting the frontend, as the frontend may make API calls to https://localhost:5001.
Frontend Notes
The frontend uses React 18’s createRoot API for rendering. The src/index.js file has been updated to wait for the DOM to load before rendering, resolving the Uncaught Error: createRoot(...): Target container is not a DOM element issue.
If you encounter Webpack Dev Server deprecation warnings (e.g., onBeforeSetupMiddleware or onAfterSetupMiddleware), update react-scripts to the latest version:
powershell

Collapse

Wrap

Copy
npm install react-scripts@latest
This ensures compatibility with Webpack Dev Server 4+ and uses the modern setupMiddlewares option.
Features
Login/Register: User authentication with JWT.
Dashboard: Displays a pie chart of country counts (Permission: ViewDashboard).
Country Explorer: A grid of country flags with a details view (Permission: ViewCountries).
Profile: Allows users to update their details (Permission: ViewProfile).
Manage Users: Admin CRUD operations with soft delete (Permissions: ViewUsers, DeleteUsers).
Audit Log: View all database operations (Permission: ViewAudit).
Manage Permissions: Assign permissions to roles (Permission: ManagePermissions).
Logout: Available in the navbar when logged in.
Database
SQLite Database: Includes tables for Users, Roles, AuditLogs, Permissions, and RolePermissions.
Soft Delete: Implemented for user management.
Auditing: Tracks all CRUD operations.
Permissions System: The Admin role has all permissions by default.
Notes
Default Admin Credentials:
Username: Admin
Password: Admin123!
Ensure the backend is running on https://localhost:5001. Update the frontend’s API base URL in FlagExplorerApp.Frontend/src (e.g., in an API client or environment file) if the backend port changes.
For production, update appsettings.json in FlagExplorerApp.API with a secure JWT key.
The frontend has been updated to use React 18’s createRoot API, ensuring modern rendering practices. The index.js file waits for the DOM to load, preventing rendering issues.
If you encounter Webpack Dev Server deprecation warnings, ensure react-scripts is updated to version 5.0.1 or higher.
Permissions
ViewUsers: View the list of users.
EditUsers: Edit user details.
DeleteUsers: Delete users (soft delete).
ViewAudit: View audit logs.
ManagePermissions: Manage role permissions.
ViewDashboard: View the dashboard.
ViewCountries: View the country explorer.
ViewProfile: View and edit user profile.
Testing
Backend:
Run tests in the FlagExplorerApp.Tests project:
powershell

Collapse

Wrap

Copy
cd FlagExplorerApp.Tests
dotnet test
Add tests as needed to improve coverage.
Frontend:
Run tests in the FlagExplorerApp.Frontend directory:
powershell

Collapse

Wrap

Copy
cd FlagExplorerApp.Frontend
npm test
Add tests as needed (e.g., using Jest and React Testing Library).
Production Build (Frontend)
To create an optimized production build of the frontend:

Build the app:
powershell

Collapse

Wrap

Copy
cd FlagExplorerApp.Frontend
npm run build
Serve the build locally to test:
powershell

Collapse

Wrap

Copy
npm install -g serve
serve -s build
The app will be available on http://localhost:5000 (or the port shown by serve).
CI-CD Integration
A GitHub Actions workflow (ci-cd.yml) is provided in .github/workflows/ to automate building, testing, and deployment. Ensure the following:

The backend and frontend dependencies are installed in the CI pipeline.
Tests are implemented, or the test steps are skipped if not applicable.
The production build is created and deployed to your hosting provider (e.g., Azure, AWS).