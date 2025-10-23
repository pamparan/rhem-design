# Flight Control - Edge Management Platform

A comprehensive, interactive prototype showcasing a complete edge device and fleet management platform built with React and PatternFly. Flight Control provides a unified interface for managing edge devices, fleets, and repositories across distributed environments.

## 🚀 Features

### **Overview Dashboard**
- **Visual Analytics**: Interactive donut charts for Application, Device, and System Update status
- **Health Monitoring**: Live status indicators and trend analysis
- **Alert Management**: Centralized notification system

### **Fleet Management**
- **Fleet Overview**: Manage device collections with system image tracking
- **Status Monitoring**: Real-time fleet health with up-to-date device counts
- **Configuration Management**: System image versioning and deployment status
- **Bulk Operations**: Fleet-wide actions and updates

### **Device Management**
- **Device Inventory**: Comprehensive device listing with advanced filtering
- **Real-time Status**: Live status tracking (Healthy, Error, Degraded, Unknown)
- **Search & Filter**: Multi-criteria search by name, location, status, and fleet
- **Device Actions**: Individual device operations and configuration

### **Repository Management**
- **Source Control**: Git repository integration and management
- **HTTP Services**: External service configuration and monitoring
- **Sync Status**: Real-time repository accessibility and sync monitoring
- **Deployment Tracking**: Last transition times and status updates

### **Professional UI**
- **PatternFly Design**: Enterprise-grade design system components
- **Responsive Layout**: Optimized for desktop and mobile interfaces
- **Interactive Elements**: Rich user interactions and feedback
- **Accessibility**: WCAG compliant interface design

## 🏃‍♂️ Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 to view the prototype.

## 📁 Project Structure

```
amplify-edge/
├── frontend/                    # React TypeScript application
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
│   │   │   │   └── SettingsPage.tsx      # Settings and configuration
│   │   │   └── shared/
│   │   │       └── DeviceModal.tsx       # Device addition workflow
│   │   ├── FlightControlApp.tsx # Main application orchestrator
│   │   └── main.tsx             # Application entry point
│   ├── package.json            # Dependencies and scripts
│   └── vite.config.ts          # Vite build configuration
├── CLAUDE.md                   # Development documentation
└── README.md                   # Project documentation
```

## 🛠 Technologies

- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **PatternFly v6** - Enterprise design system components
- **Vite** - Fast build tool and dev server
- **Component Architecture** - Modular, maintainable design

## ✨ Key Capabilities

- **Multi-page Navigation** - Seamless navigation between Overview, Devices, Fleets, Repositories, and Settings
- **Advanced Filtering** - Search by name, location, status, and fleet assignments
- **Real-time Status** - Live device and fleet health monitoring
- **Bulk Operations** - Fleet-wide device management and operations
- **Repository Integration** - Git and HTTP service management
- **Device Onboarding** - Guided device addition with installation instructions
- **Professional Branding** - Flight Control branded interface with user management
- **Responsive Design** - Optimized for various screen sizes and devices

## 🎯 Use Cases

Perfect for demonstrating:
- **Edge Computing Platforms** - Distributed device management scenarios
- **IoT Fleet Management** - Large-scale device deployment and monitoring
- **Enterprise Dashboards** - Executive and operational status views
- **DevOps Workflows** - Repository and deployment management
- **System Administration** - Comprehensive platform management interfaces