# Employee Management System - Frontend

A modern Angular application for managing employees with authentication, CRUD operations, and data visualization using AG-Grid.
![image](https://github.com/user-attachments/assets/5c2a8f13-d9e9-446e-bb63-c6fc9adf015a)

![image](https://github.com/user-attachments/assets/910ed599-939e-4b61-82f7-13fb0e3666b5)

![image](https://github.com/user-attachments/assets/1acb70f3-2afe-410d-a59e-412a747e22d3)


## 🚀 Technologies Used

- **Angular 14**
- **TypeScript**
- **RxJS** - Reactive programming
- **AG-Grid** - Data table component
- **Bootstrap** - CSS framework
- **SCSS** - Styling
- **Angular Reactive Forms**
- **Angular Router** - Navigation
- **HttpClient** - API communication

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- Angular CLI (v14.x)
- Backend API running on http://localhost:8080

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd employee-management-frontend
```

### 2. Install Dependencies

```bash
npm install
```

If you encounter peer dependency issues:
```bash
npm install --legacy-peer-deps
```

### 3. Install Angular CLI (if not already installed)

```bash
npm install -g @angular/cli@14
```

### 4. Configure API Endpoint

If your backend runs on a different port, update the API URLs in the service files:

`src/app/services/employee-profile.service.ts`:
```typescript
private baseUrl = 'http://localhost:8080/api/v1/employees';
```

`src/app/service/employee-registation.service.ts`:
```typescript
private baseUrl = 'http://localhost:8080/api/v1/users';
```

## 🏃‍♂️ Running the Application

### Development Server

```bash
ng serve
```

Or with a specific port:
```bash
ng serve --port 4201
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Build for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## 🌐 Application Features & Navigation

### 1. **Login Page** (`/login`)
- Default route when not authenticated
- Enter email and password
- Redirects to Employee Profile after successful login

### 2. **Registration** (`/register`)
- New user registration
- Complete form with all employee details
- Auto-login after successful registration

### 3. **Employee Profile** (`/profile`)
- Dashboard with employee statistics
- AG-Grid table showing all employees
- Add new employee (modal)
- Edit employee (modal)
- Delete employee with confirmation
- Export data to CSV

### 4. **Search Employee** (`/search`)
- Search employees by various criteria
- Real-time search results

### 5. **Logout** (`/logout`)
- Clears session data
- Shows logout confirmation
- Options to login again or go home

## 🔐 Default Login Credentials

For testing, you can use:
```
Email: test@example.com
Password: Test123!
```

(Make sure this user exists in your database)

## 📱 Application Structure

```
src/
├── app/
│   ├── components/
│   │   ├── employee-profile/     # Main dashboard
│   │   ├── login/               # Login component
│   │   ├── logout/              # Logout component
│   │   ├── registration/        # User registration
│   │   └── header/              # Navigation header
│   ├── services/
│   │   ├── employee-profile.service.ts
│   │   └── employee-registation.service.ts
│   ├── auth/
│   │   ├── service.guard.ts     # Authentication service
│   │   └── guard.guard.ts       # Route guard
│   ├── types/
│   │   ├── employee-dto.ts
│   │   └── user.ts
│   ├── app-routing.module.ts
│   ├── app.module.ts
│   └── app.component.ts
├── assets/
├── environments/
└── styles.scss                   # Global styles
```

## 🎨 Key Components

### Employee Profile Component
- Welcome message with user name
- Statistics cards (Total Employees, Active Today, Departments)
- AG-Grid table with sorting, filtering, and pagination
- Add/Edit employee modals
- Export functionality

### Header Component
- Dynamic navigation based on auth state
- User avatar with initials
- Dropdown menu with profile options
- Responsive mobile menu

## 🧪 Testing the Application

1. **Start the backend server first** (port 8080)
2. **Start the frontend**: `ng serve`
3. **Open browser**: http://localhost:4200

### Test Flow:

1. **Register a new user** at `/register`
2. **Login** with the registered credentials
3. **View Employee Dashboard** - you'll see the AG-Grid table
4. **Add Employee** - Click "Add Employee" button
5. **Edit Employee** - Click edit icon in Actions column
6. **Delete Employee** - Click delete icon with confirmation
7. **Search** - Navigate to Search Employee
8. **Logout** - Click user avatar → Logout

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Error**
   - Ensure backend has `@CrossOrigin(origins = "*")` on controllers
   - Or configure proxy in Angular

2. **AG-Grid Not Showing**
   ```bash
   npm install ag-grid-angular@28.2.1 ag-grid-community@28.2.1 --legacy-peer-deps
   ```

3. **Module Not Found Errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

4. **Authentication Issues**
   - Clear localStorage: Press F12 → Application → Local Storage → Clear
   - Check backend is running
   - Verify API endpoints are correct

5. **Styling Issues**
   - Ensure styles are imported in angular.json
   - Check if AG-Grid CSS is loaded

## 🚀 Production Deployment

### Build for Production:
```bash
ng build --configuration production
```

### Deploy to a Web Server:
1. Copy contents of `dist/manage-employees/` to your web server
2. Configure server to redirect all routes to `index.html` for Angular routing

### Example Nginx Configuration:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 📦 Important Dependencies

```json
{
  "dependencies": {
    "@angular/animations": "^14.2.0",
    "@angular/common": "^14.2.0",
    "@angular/compiler": "^14.2.0",
    "@angular/core": "^14.2.0",
    "@angular/forms": "^14.2.0",
    "@angular/platform-browser": "^14.2.0",
    "@angular/platform-browser-dynamic": "^14.2.0",
    "@angular/router": "^14.2.0",
    "ag-grid-angular": "^28.2.1",
    "ag-grid-community": "^28.2.1",
    "bootstrap": "^5.2.0",
    "rxjs": "~7.5.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.11.4"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Angular Documentation
- AG-Grid Documentation
- Bootstrap Team
- The amazing Angular community
