# Campus BorrowHub - Technical Specification

## 1. Project Overview

Campus BorrowHub is a comprehensive campus equipment borrowing platform designed to streamline the process of borrowing and managing equipment for students and faculty. The platform provides an intuitive web interface for users to browse available equipment, submit borrowing requests, track their borrowings, and manage their accounts.

### 1.1 Purpose
- Enable efficient equipment sharing across campus
- Reduce equipment procurement costs
- Provide transparent tracking of equipment usage
- Ensure accountability through proper request and approval workflows

### 1.2 Target Users
- **Students**: Primary users who borrow equipment for academic projects
- **Faculty**: Users who may borrow equipment for teaching or research
- **Administrators**: Staff responsible for managing equipment inventory and approving requests

## 2. Features

### 2.1 User Management
- User registration and authentication
- Profile management
- Password change functionality
- Role-based access (Student/Faculty/Admin)

### 2.2 Equipment Management
- Equipment catalog with categories
- Inventory tracking (total and available quantities)
- Equipment search and filtering
- CRUD operations for administrators

### 2.3 Borrowing System
- Equipment browsing and selection
- Borrowing request submission
- Request approval/rejection workflow
- Borrowing tracking and history
- Return processing
- Due date management
- Overdue notifications

### 2.4 Administrative Features
- Equipment inventory management
- User account management
- Borrowing request approval/rejection
- System statistics and reporting

### 2.5 User Interface
- Responsive web interface
- Intuitive navigation with sidebar
- Dashboard with borrowing statistics
- Equipment booking interface
- Personal borrowing history
- Contact and help pages
- FAQ and helpful resources sections

## 3. Architecture

### 3.1 System Architecture
The application follows a modular monolithic architecture using NestJS framework with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (HTML/CSS/JS) │◄──►│   (NestJS)      │◄──►│   (MySQL)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 3.2 Backend Architecture
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: MySQL
- **Static File Serving**: Built-in NestJS ServeStaticModule

### 3.3 Module Structure
```
src/
├── app.module.ts          # Main application module
├── main.ts                # Application bootstrap
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── users/                 # User management module
│   ├── user.entity.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── users.controller.spec.ts
├── equipment/             # Equipment management module
│   ├── item.entity.ts
│   ├── item.controller.ts
│   ├── item.service.ts
│   ├── items.module.ts
│   └── item.controller.spec.ts
└── borrow/               # Borrowing system module
    ├── borrowing.entity.ts
    ├── borrow-request.entity.ts
    ├── borrowing.controller.ts
    ├── borrowing.service.ts
    ├── borrowing.module.ts
    └── borrowing.controller.spec.ts
```

## 4. Technology Stack

### 4.1 Backend
- **Runtime**: Node.js
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript
- **ORM**: TypeORM 0.3.28
- **Database**: MySQL 8.0+ with mysql2 driver 3.20.0
- **Validation**: Class-validator (built into NestJS)
- **Testing**: Jest with Supertest

### 4.2 Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom responsive styles
- **JavaScript**: ES6+ with DOM manipulation
- **Static Hosting**: Served by NestJS ServeStaticModule

### 4.3 Development Tools
- **Build Tool**: NestJS CLI
- **Linting**: ESLint with Prettier
- **Testing**: Jest
- **Package Manager**: npm

### 4.4 Infrastructure
- **Database**: MySQL Server
- **Development Server**: NestJS dev server with hot reload
- **Port**: 3000 (configurable via PORT environment variable)

## 5. Database Schema

### 5.1 Entities

#### User Entity
```typescript
{
  id: number (Primary Key, Auto-generated)
  name: string
  email: string
  borrowings: Borrowing[] (One-to-Many relationship)
}
```

#### Item Entity
```typescript
{
  id: number (Primary Key, Auto-generated)
  name: string
  description: string
  category: string
  totalQuantity: number
  availableQuantity: number (Default: 0)
  borrowings: Borrowing[] (One-to-Many relationship)
}
```

#### Borrowing Entity
```typescript
{
  id: number (Primary Key, Auto-generated)
  user: User (Many-to-One relationship)
  userId: number (Foreign Key)
  item: Item (Many-to-One relationship)
  itemId: number (Foreign Key)
  quantity: number
  borrowDate: string
  dueDate: string
  returnDate: string (Nullable)
  status: string (Default: 'borrowed') // 'borrowed', 'returned', 'overdue'
}
```

#### BorrowRequest Entity
```typescript
{
  id: number (Primary Key, Auto-generated)
  item: Item (Many-to-One relationship)
  itemId: number (Foreign Key)
  user: User (Many-to-One relationship)
  userId: number (Foreign Key)
  quantity: number
  status: string (Default: 'pending') // 'pending', 'approved', 'rejected'
  requestDate: string (Nullable)
}
```

### 5.2 Database Configuration
- **Type**: MySQL
- **Host**: localhost
- **Port**: 3306
- **Database**: borrowhub
- **Username**: root
- **Password**: (empty)
- **Synchronization**: Enabled (auto-creates tables)

## 6. API Endpoints

### 6.1 Items API (`/items`)
- `GET /items` - Retrieve all items
- `GET /items/:id` - Retrieve specific item
- `POST /items` - Create new item (Admin)
- `PUT /items/:id` - Update item (Admin)
- `DELETE /items/:id` - Delete item (Admin)

### 6.2 Users API (`/users`)
- `GET /users` - Retrieve all users (Admin)
- `GET /users/:id` - Retrieve specific user
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin)

### 6.3 Borrowings API (`/borrowings`)
- `GET /borrowings` - Retrieve all borrowings (Admin)
- `GET /borrowings/user/:userId` - Retrieve user's borrowings
- `POST /borrowings/request` - Submit borrowing request
- `PUT /borrowings/requests/:id/approve` - Approve request (Admin)
- `PUT /borrowings/requests/:id/reject` - Reject request (Admin)
- `POST /borrowings/return/:id` - Return borrowed item

### 6.4 Borrow Requests API (`/borrowings/requests`)
- `GET /borrowings/requests` - Retrieve all requests (Admin)

## 7. Frontend Pages

### 7.1 Public Pages
- `login.html` - User authentication
- `register.html` - User registration

### 7.2 User Dashboard Pages
- `dashboard.html` - Main dashboard with statistics
- `book-equipment.html` - Equipment browsing and booking
- `my-borrowings.html` - Personal borrowing history
- `profile.html` - User profile management
- `change_password.html` - Password change form
- `contact_help.html` - Contact support
- `helpful-resources.html` - Campus resources
- `faq.html` - Frequently asked questions

### 7.3 Administrative Pages
- `admin.html` - Admin dashboard
- `admin-items.html` - Equipment management
- `admin-requests.html` - Request management

### 7.4 Shared Assets
- `styles.css` - Global styles and responsive design
- `script.js` - Client-side JavaScript functionality

## 8. Installation and Setup

### 8.1 Prerequisites
- Node.js (v18+)
- npm or yarn
- MySQL Server (v8.0+)

### 8.2 Database Setup
```sql
CREATE DATABASE borrowhub;
```

### 8.3 Application Setup
```bash
# Clone repository
git clone <repository-url>
cd campus-borrowhub

# Install dependencies
npm install

# Start development server
npm run start:dev
```

### 8.4 Environment Configuration
The application uses default configuration. For production deployment, configure:
- Database connection settings
- PORT environment variable
- CORS settings (if needed)

## 9. Development Workflow

### 9.1 Available Scripts
```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger

# Building
npm run build              # Build for production
npm run start:prod         # Run production build

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run tests with coverage

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

### 9.2 Project Structure Guidelines
- Controllers handle HTTP requests and responses
- Services contain business logic
- Entities define database schema
- Modules organize related functionality
- Tests ensure code reliability

## 10. Security Considerations

### 10.1 Current Implementation
- Basic input validation through NestJS pipes
- SQL injection prevention via TypeORM
- No authentication/authorization system implemented yet

### 10.2 Recommended Enhancements
- JWT-based authentication
- Role-based access control (RBAC)
- Input sanitization
- Rate limiting
- HTTPS enforcement
- Password hashing

## 11. Future Enhancements

### 11.1 High Priority
- User authentication and authorization
- Email notifications for requests and returns
- Equipment reservation system
- Advanced search and filtering
- Mobile-responsive improvements

### 11.2 Medium Priority
- Barcode/QR code integration for equipment tracking
- Equipment maintenance scheduling
- Usage analytics and reporting
- Bulk import/export functionality
- API documentation (Swagger)

### 11.3 Low Priority
- Multi-campus support
- Equipment categories hierarchy
- User groups and permissions
- Integration with campus LMS
- Mobile application

## 12. Testing Strategy

### 12.1 Unit Tests
- Service layer business logic
- Controller request/response handling
- Utility functions

### 12.2 Integration Tests
- Database operations
- API endpoint functionality
- Module interactions

### 12.3 End-to-End Tests
- Complete user workflows
- Frontend-backend integration

## 13. Deployment

### 13.1 Development
- Local MySQL database
- NestJS dev server with hot reload
- File watching for automatic restarts

### 13.2 Production
- Compiled TypeScript to JavaScript
- Production MySQL database
- Static file optimization
- Environment variable configuration
- Process management (PM2 recommended)

## 14. Contributing

### 14.1 Code Standards
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Pre-commit hooks for quality checks

### 14.2 Git Workflow
- Feature branches for new development
- Pull requests for code review
- Semantic commit messages
- Main branch protection

## 15. Support and Maintenance

### 15.1 Documentation
- Inline code documentation
- API endpoint documentation
- User guide and admin manual

### 15.2 Monitoring
- Application logs
- Database performance monitoring
- Error tracking and alerting

## 16. Implementation Details - Helpful Resources & FAQ Pages

### 16.1 Helpful Resources Page Implementation

#### 16.1.1 What Was Implemented
- **File**: `helpful-resources.html`
- **Purpose**: Provide centralized access to campus resources and services
- **Features Implemented**:
  - Comprehensive resource grid layout with categorized links
  - Resource categories: Academic Services, Student Services, IT Services, Health & Wellness, Campus Facilities, Financial Services
  - Each resource card includes title, description, and direct link
  - Responsive design with hover effects and visual appeal
  - Consistent sidebar navigation integration
  - Professional styling with proper spacing and visual hierarchy

#### 16.1.2 Problems/Challenges Encountered
- **Content Organization**: Determining the most logical categorization of campus resources
- **Link Validation**: Ensuring all resource links are current and functional
- **Responsive Design**: Creating a grid layout that works well on different screen sizes
- **Visual Consistency**: Matching the design language of other pages in the application

#### 16.1.3 Technical Implementation Notes
- Used CSS Grid for responsive card layout
- Implemented hover effects for better user interaction
- Added proper semantic HTML structure for accessibility
- Integrated with existing sidebar navigation system

#### 16.1.4 Testing and Validation
- Verified all resource links are functional
- Tested responsive design across different screen sizes
- Confirmed proper integration with navigation system
- Validated content accuracy and completeness

### 16.2 FAQ Section Implementation

#### 16.2.1 What Was Implemented
- **File**: `faq.html`
- **Purpose**: Address common user questions about equipment borrowing and campus services
- **Features Implemented**:
  - Organized FAQ structure with multiple categories:
    - Equipment Borrowing (borrowing process, duration, late returns, extensions)
    - Account & Login (registration, password reset, profile updates)
    - Technical Issues (website problems, bug reporting)
    - Policies & Rules (responsibility, sharing equipment, damage reporting)
  - Expandable question-answer format with clear typography
  - Contact help link for unanswered questions
  - Professional styling with proper spacing and readability
  - Comprehensive coverage of common user concerns

#### 16.2.2 Problems/Challenges Encountered
- **Content Creation**: Developing comprehensive and accurate FAQ content
- **Question Prioritization**: Determining which questions are most frequently asked
- **Answer Clarity**: Writing clear, concise answers that address user needs
- **Content Maintenance**: Ensuring FAQ content stays current with system changes
- **Categorization Logic**: Organizing questions into logical, user-friendly categories

#### 16.2.3 Technical Implementation Notes
- Used semantic HTML for question-answer structure
- Implemented proper heading hierarchy for accessibility
- Added contact help integration for seamless user support
- Maintained consistent styling with other application pages

#### 16.2.4 Testing and Validation
- Reviewed FAQ content for completeness and accuracy
- Tested readability and clarity of answers
- Verified contact help link functionality
- Confirmed proper categorization and organization

### 16.3 Navigation Updates Implementation

#### 16.3.1 What Was Implemented
- **Consistent Sidebar Implementation**: Updated all user-facing pages to include unified navigation
- **Pages Updated**: dashboard.html, book-equipment.html, contact_help.html, my-borrowings.html, profile.html, change_password.html, faq_section.html
- **Navigation Structure**: Dashboard, Book Equipment, Contact Help, All of My Borrowings, Profile, Helpful Resources, FAQ
- **Active State Highlighting**: Proper CSS classes for current page indication
- **Cross-Page Consistency**: Ensured identical navigation experience across all pages

#### 16.3.2 Problems/Challenges Encountered
- **Sidebar Navigation Inconsistency**: Different pages had varying sidebar structures and link names
- **Examples**:
  - Some pages used "Borrow Items" while others used "Book Equipment"
  - Inconsistent inclusion of navigation items (Dashboard, Profile missing from some pages)
  - Different ordering of navigation links
- **File Management**: Multiple HTML files required simultaneous updates for navigation changes
- **Active State Management**: Ensuring proper highlighting of current page across all navigation instances

#### 16.3.3 Technical Implementation Notes
- Standardized navigation HTML structure across all pages
- Implemented consistent CSS classes for active states
- Maintained proper link ordering and naming conventions
- Ensured responsive behavior of sidebar navigation

#### 16.3.4 Testing and Validation
- Verified navigation consistency across all updated pages
- Tested active state highlighting functionality
- Confirmed proper link destinations and functionality
- Validated responsive navigation behavior

### 16.4 Development Environment Challenges

#### 16.4.1 Port Conflicts (EADDRINUSE Errors)
- **Problem**: Multiple attempts to start the NestJS server resulted in "Error: listen EADDRINUSE: address already in use :::3000"
- **Root Cause**: Previous server instances not properly terminated, leaving processes running on port 3000
- **Solution**: 
  - Used `netstat -ano | findstr :3000` to identify running processes
  - Terminated processes using `taskkill /PID <PID> /F`
  - Successfully restarted server after clearing port conflicts
- **Prevention**: Implement proper process management or use different ports for development

#### 16.4.2 Development Workflow Interruptions
- **Problem**: Server restarts and port conflicts interrupted development workflow
- **Impact**: Required manual intervention to resolve port issues before continuing development
- **Mitigation**: 
  - Improved process of checking and clearing ports
  - Better understanding of NestJS development server behavior
  - Established pattern for handling port conflicts

### 16.5 Overall Testing and Validation

#### Server Functionality
- Verified successful compilation with 0 TypeScript errors
- Confirmed all NestJS modules loaded properly
- Validated API routes mapping correctly

#### Frontend Consistency
- Tested navigation links across all updated pages
- Verified responsive design on different screen sizes
- Confirmed proper active state highlighting

#### Content Accuracy
- Reviewed FAQ content for completeness and clarity
- Validated resource links for functionality
- Ensured contact information accuracy

### 16.6 Lessons Learned

1. **Process Management**: Importance of proper server process management in development
2. **Consistency**: Value of maintaining consistent UI/UX across all application pages
3. **Systematic Updates**: Benefits of methodical approach when updating multiple files
4. **Error Handling**: Better preparedness for common development environment issues
5. **Documentation**: Importance of documenting implementation details and challenges
6. **Content Strategy**: Need for comprehensive and maintainable content in user-facing pages
7. **User Experience**: Significance of intuitive navigation and clear information architecture
8. **Testing Thoroughness**: Value of comprehensive testing across multiple dimensions (functionality, responsiveness, content accuracy)

---

**Version**: 0.0.1
**Last Updated**: March 19, 2026
**Authors**: Campus BorrowHub Development Team