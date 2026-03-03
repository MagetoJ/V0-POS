# Maria Havens POS - Frontend System

A professional Point of Sale system frontend for retail employees, built with Next.js 16, React 19, and shadcn/ui.

## Features

### 1. Authentication & Security
- **Employee ID + PIN Login**: Secure authentication system with mock employee database
- **Session Management**: HTTP-only cookies and localStorage for session persistence
- **Role-Based Access**: Different interfaces for cashiers, supervisors, managers, and admins
- **Protected Routes**: All features require authentication

### 2. Dashboard
- **Quick Stats**: Real-time sales, transactions, and customer satisfaction metrics
- **Shift Status**: Active shift information with hours worked
- **Quick Actions**: Clock in/out and shift swap request buttons
- **Performance Overview**: Daily sales and satisfaction summaries

### 3. Shift Management
- **Clock In/Out**: Track work hours with timestamp recording
- **Break Tracking**: Monitor break duration and scheduled breaks
- **Shift History**: View past shifts with total hours worked
- **Shift Swap Requests**: Request to swap shifts with other employees
- **Weekly Summary**: Track total hours and average daily hours

### 4. Performance Tracking
- **Sales Analytics**: Weekly sales trends with detailed charts
- **Transaction Metrics**: Daily transaction counts and averages
- **Customer Satisfaction**: Trending satisfaction ratings
- **Category Breakdown**: Sales by product category with pie charts
- **Performance Insights**: AI-generated insights about performance

### 5. Settings & Account
- **Profile Management**: Update name, email, and phone
- **Security**: Change PIN with validation
- **Account Information**: View employee details and hire date
- **Status Monitoring**: Track account status and role

### 6. Help & Support
- **FAQ Section**: Searchable frequently asked questions
- **Contact Information**: Phone, email, and chat support options
- **Support Request Form**: Submit issues directly
- **Extended Help**: Quick access to common support topics

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Framework**: React 19 with Server Components
- **Component Library**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS with custom design tokens
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **State Management**: React Context API + SWR (recommended for data fetching)
- **Authentication**: Custom JWT-based system with HTTP-only cookies

## Project Structure

```
app/
├── layout.tsx                 # Root layout with AuthProvider
├── page.tsx                   # Login page
├── api/
│   └── auth/
│       ├── login/route.ts    # Login endpoint
│       └── logout/route.ts   # Logout endpoint
│   ├── shifts/
│   │   ├── clock/route.ts    # Clock in/out endpoint
│   │   └── swap/route.ts     # Shift swap requests
│   └── performance/route.ts   # Performance data endpoint
├── (protected)/
│   ├── layout.tsx            # Protected routes wrapper
│   ├── dashboard/page.tsx    # Main dashboard
│   ├── shifts/page.tsx       # Shift management
│   ├── performance/page.tsx  # Performance analytics
│   ├── settings/page.tsx     # User settings
│   └── help/page.tsx         # Help & support center

components/
├── sidebar-nav.tsx           # Navigation sidebar
└── ui/                       # shadcn/ui components

lib/
├── auth-context.tsx          # Authentication context
├── types.ts                  # TypeScript types
└── utils.ts                  # Utility functions
```

## Demo Credentials

The system includes 4 demo employees for testing:

| Employee ID | PIN  | Name                | Role       |
|------------|------|---------------------|------------|
| EMP001    | 1234 | Sarah Johnson       | Cashier    |
| EMP002    | 5678 | Michael Chen        | Supervisor |
| EMP003    | 9012 | Jennifer Martinez   | Manager    |
| EMP004    | 3456 | David Wilson        | Cashier    |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Employee login
- `POST /api/auth/logout` - Logout and clear session

### Shifts
- `POST /api/shifts/clock` - Clock in/out
- `GET /api/shifts/clock?employeeId=EMP001` - Get shift history
- `POST /api/shifts/swap` - Request shift swap
- `GET /api/shifts/swap?employeeId=EMP001` - Get swap requests
- `PATCH /api/shifts/swap` - Update swap request status

### Performance
- `GET /api/performance?employeeId=EMP001` - Get performance data
- Query params: `dateFrom`, `dateTo` for date range filtering

## Key Features Implementation

### Authentication Flow
1. User enters Employee ID and PIN on login page
2. Credentials validated against mock database
3. Session token created and stored in HTTP-only cookie
4. Session data stored in localStorage for client-side access
5. Protected routes check authentication status
6. Session expires after 24 hours

### Protected Routes
All dashboard features are wrapped in the `(protected)` layout which:
- Checks if user is authenticated
- Redirects to login if not authenticated
- Shows loading state while checking session

### State Management
- Uses React Context API for global auth state
- Custom `useAuth()` hook for accessing user data
- localStorage for session persistence
- Can be extended with SWR for data fetching

## Styling & Theme

The application uses a modern dark theme with:
- **Primary Color**: Deep Navy Blue (#3b82f6 equivalent)
- **Accent Colors**: Orange and Purple for highlights
- **Background**: Dark slate gray (#0f172a)
- **Text**: Light slate for contrast
- **Border**: Subtle slate-800 for separation

Custom design tokens in `globals.css` allow easy theme customization.

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run development server**:
   ```bash
   pnpm dev
   ```

3. **Open browser**:
   Navigate to `http://localhost:3000`

4. **Login**:
   Use any of the demo credentials above

## Extending the System

### Adding New Pages
1. Create new folder in `app/(protected)/`
2. Add `page.tsx` with SidebarNav component
3. Update navigation items in `sidebar-nav.tsx`

### Adding API Routes
1. Create route file in `app/api/`
2. Implement GET/POST/PATCH handlers
3. Return JSON responses

### Database Integration
Currently uses mock data. To add real database:
1. Replace mock data objects with database queries
2. Update API endpoints to use real database
3. Consider using Supabase, Neon, or Prisma for ORM

### Authentication Enhancement
For production:
1. Replace mock credential validation with real database lookup
2. Implement proper JWT signing with secrets
3. Add password hashing with bcrypt
4. Implement token refresh mechanism
5. Add CSRF protection

## Security Considerations

- HTTP-only cookies prevent XSS attacks on tokens
- Protected routes prevent unauthorized access
- Input validation on API endpoints
- Session expiration (24 hours)
- Type-safe with TypeScript

For production, add:
- Rate limiting on auth endpoints
- CAPTCHA for login
- Audit logging
- Two-factor authentication
- Regular security audits

## Performance Optimizations

- Next.js 16 with Turbopack bundler
- React Server Components where possible
- Optimized chart rendering with Recharts
- Responsive design for mobile devices
- Lazy loading of components

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Real-time notifications for shift updates
- Integration with POS hardware
- Advanced reporting and analytics
- Barcode scanning for inventory
- Mobile app (React Native)
- Offline-first PWA support
- Voice commands for accessibility
- Multi-language support

## Support

For issues or questions, see the Help page in the application or contact support@mariahavenpos.com.

## License

Proprietary - Maria Havens Retail System
