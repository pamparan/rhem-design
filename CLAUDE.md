# Flight Control - Development Guidelines

Development documentation for the Flight Control edge management platform. Last updated: 2025-10-01

## Active Technologies
- **React 18** - UI framework with hooks and modern patterns
- **TypeScript** - Type safety and developer experience
- **PatternFly v6** - Enterprise design system components
- **Vite** - Fast build tool and development server

## Project Structure
```
amplify-edge/
├── frontend/         # React TypeScript application
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Masthead.tsx      # Header with branding and user menu
│   │   │   │   └── Sidebar.tsx       # Navigation sidebar
│   │   │   ├── pages/
│   │   │   │   ├── OverviewPage.tsx      # Dashboard with status charts
│   │   │   │   ├── DevicesPage.tsx       # Device management and filtering
│   │   │   │   ├── FleetsPage.tsx        # Fleet status and configuration
│   │   │   │   ├── RepositoriesPage.tsx  # Repository management
│   │   │   │   └── SettingsPage.tsx      # Settings placeholder
│   │   │   └── shared/
│   │   │       └── DeviceModal.tsx       # Device addition workflow
│   │   ├── FlightControlApp.tsx # Main app orchestrator (132 lines)
│   │   └── main.tsx             # Entry point
│   ├── public/                  # Static assets
│   ├── package.json            # Dependencies
│   └── vite.config.ts          # Vite configuration
├── CLAUDE.md                    # This development documentation
└── README.md                    # User-facing documentation
```

## Development Commands
```bash
cd frontend
npm install      # Install dependencies
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Application Features

### **Overview Dashboard**
- **Visual Analytics**: Three interactive donut charts (Application Status, Device Status, System Update Status)
- **Health Monitoring**: Color-coded status indicators with percentages
- **Alert System**: Centralized notification area (currently shows "no active alerts")

### **Device Management**
- **Device Inventory**: Table display of 8 sample devices across multiple locations
- **Advanced Filtering**: Multi-criteria search by name, location, status, and fleet assignment
- **Status Tracking**: Real-time status indicators (Healthy, Error, Degraded, Unknown, Pending Sync)
- **Device Operations**: Individual device actions via ellipsis menu
- **Add Device Workflow**: Modal-based device onboarding with installation instructions

### **Fleet Management**
- **Fleet Overview**: Management of 4 sample fleets with system image tracking
- **Status Monitoring**: Up-to-date vs total device counts with color coding
- **System Images**: Git repository and local configuration management
- **Bulk Operations**: Fleet-wide actions and configuration updates
- **Alert Integration**: Suspended device notifications with resolution actions

### **Repository Management**
- **Source Control**: Git repository integration (basic-nginx-demo)
- **HTTP Services**: External service monitoring (HTTP-nginx-demo)
- **Sync Status**: Real-time accessibility indicators
- **Last Transition**: Time-based status tracking

### **Navigation & UI**
- **Multi-page Architecture**: Seamless navigation between 5 main sections
- **Responsive Design**: PatternFly-based enterprise interface
- **User Management**: User dropdown with profile/settings/logout
- **Branding**: Flight Control branded header with logo support

## Data Models

### Sample Devices (8 total)
```typescript
interface Device {
  id: string;
  name: string;
  status: 'ERROR' | 'HEALTHY' | 'DEGRADED' | 'UNKNOWN';
  type: 'Gateway' | 'Sensor' | 'Compute' | 'Router' | 'Storage';
  location: string;
  ip: string;
  firmware: string;
}
```

### Sample Fleets (4 total)
```typescript
interface Fleet {
  id: string;
  name: string;
  systemImage: string;
  upToDate: number;
  total: number;
  status: 'Valid' | 'Selector overlap';
}
```

### Sample Repositories (2 total)
```typescript
interface Repository {
  id: string;
  name: string;
  type: 'Git repository' | 'HTTP service';
  url: string;
  syncStatus: 'Accessible' | 'No access';
  lastTransition: string;
}
```

## Component Architecture

### **Layout Components** (`components/layout/`)
- **Masthead.tsx**: Header with branding, user menu, and sidebar toggle
- **Sidebar.tsx**: Navigation menu with active state management

### **Page Components** (`components/pages/`)
- **OverviewPage.tsx**: Dashboard with SVG-based donut charts
- **DevicesPage.tsx**: Device table with filtering, search, and modal integration
- **FleetsPage.tsx**: Fleet management with status indicators and alerts
- **RepositoriesPage.tsx**: Repository listing with sync status
- **SettingsPage.tsx**: Placeholder for future configuration options

### **Shared Components** (`components/shared/`)
- **DeviceModal.tsx**: Reusable modal for device addition workflow

### **Main Application**
- **FlightControlApp.tsx**: Application orchestrator handling routing, state, and layout

## Development Patterns

### **Component Communication**
- **Props-based interfaces**: Clean type-safe component communication
- **Callback patterns**: Parent components handle state changes and actions
- **State management**: Local React state with hooks (useState)
- **Event handling**: Proper event delegation and state updates

### **Code Organization**
- **Single responsibility**: Each component handles one specific concern
- **Separation of concerns**: Layout, pages, and shared components are isolated
- **Type safety**: All components use TypeScript interfaces
- **Mock data**: Embedded sample data for demonstration reliability

### **PatternFly Component Development**
- **ALWAYS USE PatternFly MCP FIRST**: Before implementing any PatternFly component, use the `mcp__patternfly__usePatternFlyDocs` and `mcp__patternfly__fetchDocs` tools to get official documentation and code examples
- **Check component documentation**: Use MCP to find proper component usage patterns, props, and positioning
- **Follow official examples**: Use the exact patterns shown in PatternFly documentation rather than guessing
- **Common issues to check**: Dropdown positioning, form validation, table functionality, modal behavior

### **Styling & UI**
- **PatternFly consistency**: Use PatternFly components throughout
- **Custom styling**: Minimal inline styles for specific layout needs
- **Responsive design**: PatternFly's built-in responsive patterns
- **Accessibility**: PatternFly's WCAG compliance features

## Development Workflow

### **File Organization**
1. **Create new pages**: Add to `components/pages/` directory
2. **Add shared components**: Place in `components/shared/`
3. **Update routing**: Add to FlightControlApp.tsx routing logic
4. **Update navigation**: Add to Sidebar.tsx navigation items

### **Adding Features**
1. **Design component interface**: Define TypeScript props interface
2. **Implement component**: Use PatternFly components for consistency
3. **Add mock data**: Include representative sample data
4. **Test interactions**: Verify all user interactions work
5. **Update documentation**: Add to this file and README.md

### **Component Guidelines**
- **Use functional components**: with React hooks
- **Type all props**: with TypeScript interfaces
- **Handle loading states**: with appropriate PatternFly components
- **Implement error boundaries**: for robust error handling
- **Follow naming conventions**: Clear, descriptive component names

## Recent Changes

### 2025-10-02 (GitHub Pages Deployment & Component Fixes)
- **GitHub Pages Deployment**: Successfully deployed Flight Control to https://lizsurette.github.io/amplify-edge/
- **Fixed TypeScript Issues**: Resolved PatternFly v6 compatibility issues (PageSectionVariants, alignment props)
- **Updated GitHub Actions**: Configured proper Node.js 20, permissions, and deployment workflow
- **Fixed Dropdown Positioning**: Resolved user avatar dropdown positioning using PatternFly MCP guidance
- **Added MCP Development Guidelines**: Added prominent guidance to always use PatternFly MCP for component implementation

### 2025-10-01 (Evening): Documentation Updates
- **Updated README.md**: Comprehensive user-facing documentation with proper branding
- **Enhanced CLAUDE.md**: Detailed development guidelines and technical specifications
- **Added Data Models**: TypeScript interfaces for devices, fleets, and repositories
- **Documented Architecture**: Complete component structure and communication patterns

### 2025-10-01 (Afternoon): Component Architecture Refactoring
- **Major Refactoring**: Broke down 900+ line monolithic component into modular architecture
- **Created Component Structure**: Organized into layout/, pages/, and shared/ directories
- **Extracted Components**: Masthead, Sidebar, DeviceModal, and all page components
- **Improved Maintainability**: Main app reduced from 1000+ lines to 132 lines
- **Better Naming**: Renamed DevicePrototype.tsx → FlightControlApp.tsx
- **Changed Default Page**: Set Overview as landing page instead of Devices
- **Preserved Functionality**: All existing features work identically after refactoring
- **Enhanced Type Safety**: All components properly typed with TypeScript interfaces

### 2025-10-01 (Morning): Initial Implementation
- **Core Platform Development**: Complete multi-page application implementation
- **Overview Dashboard**: Interactive donut charts with SVG-based visualizations
- **Device Management**: Advanced filtering, search, and device table functionality
- **Fleet Operations**: Fleet status monitoring and management interface
- **Repository Integration**: Git and HTTP service management capabilities
- **UI/UX Implementation**: Professional PatternFly-based interface design

## Technical Notes

### **Performance Considerations**
- **Component memoization**: Consider React.memo for complex components
- **State optimization**: Use useCallback and useMemo for expensive operations
- **Bundle size**: PatternFly tree-shaking reduces final bundle size
- **Development speed**: Vite provides fast hot module replacement

### **Browser Support**
- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **TypeScript target**: ES2020 for modern JavaScript features
- **CSS support**: CSS Grid and Flexbox for layout
- **PatternFly compatibility**: Follows PatternFly browser support matrix

### **Deployment Ready**
- **Production build**: `npm run build` creates optimized bundle
- **Static hosting**: Can be deployed to any static hosting service
- **Environment variables**: Vite support for environment-specific configuration
- **CI/CD ready**: Standard npm scripts for automated deployment

---
*This documentation is maintained alongside code changes to ensure accuracy and completeness.*