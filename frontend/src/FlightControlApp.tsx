import React, { useState } from 'react';
import { Page } from '@patternfly/react-core';

// Import layout components
import AppMasthead from './components/layout/Masthead';
import AppSidebar from './components/layout/Sidebar';
import SubNav from './components/layout/SubNav';
import DesignControls from './components/shared/DesignControls';

// Import page components
import OverviewPage from './components/pages/OverviewPage';
import DevicesPage from './components/pages/DevicesPage';
import FleetsPage from './components/pages/FleetsPage';
import FleetDetailsPage from './components/pages/FleetDetailsPage';
import RepositoriesPage from './components/pages/RepositoriesPage';
import ResumeSuspendedDevicesPage from './components/pages/ResumeSuspendedDevicesPage';
import DeviceDetailsPage from './components/pages/DeviceDetailsPage';
import LoginPage from './components/pages/LoginPage';
import CLIAuthPage from './components/pages/CLIAuthPage';
import SystemSettingsPage from './components/pages/SystemSettingsPage';
import KubernetesTokenLoginPage from './components/pages/KubernetesTokenLoginPage';
import DeviceModal from './components/shared/DeviceModal';

import { mockDevicesPendingApproval } from './data/mockData';
import { useDesignControls } from './hooks/useDesignControls';
import { ViewType, NavigationItemId, NavigationParams } from './types/app';

const FlightControlApp: React.FC = () => {
  const { getSetting } = useDesignControls();
  const showDevicesPendingApproval = getSetting('showDevicesPendingApproval');
  const pendingDevicesCount = showDevicesPendingApproval ? mockDevicesPendingApproval.length : 0;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<NavigationItemId>('overview');
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedFleetId, setSelectedFleetId] = useState<string | null>(null);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);

  const onSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarNavigation = (itemId: NavigationItemId) => {
    setActiveItem(itemId);
    setCurrentView('main');
    setSelectedDeviceId(null);
    setSelectedFleetId(null);
    // Sidebar stays open - user controls it manually
  };

  const handleNavigate = (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => {
    setCurrentView(view);
    if (activeItem) {
      setActiveItem(activeItem);
    }

    // Handle navigation parameters
    setSelectedFleetId(params?.fleetId || null);
    setSelectedDeviceId(params?.deviceId || null);
  };

  const handleDeviceClick = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setCurrentView('device-details');
  };

  const handleFleetClick = (fleetId: string) => {
    setSelectedFleetId(fleetId);
    setCurrentView('fleet-details');
  };

  const handleShowLoginInterface = () => {
    setCurrentView('login');
  };

  const masthead = (
    <AppMasthead
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={onSidebarToggle}
      onShowLoginInterface={handleShowLoginInterface}
    />
  );

  const sidebar = (
    <AppSidebar
      isSidebarOpen={isSidebarOpen}
      activeItem={activeItem}
      setActiveItem={handleSidebarNavigation}
      pendingDevicesCount={pendingDevicesCount}
    />
  );

  return (
    <DesignControls>
      {/* Main Application - hidden when login, cli-auth, or kubernetes-token-login is active */}
      {currentView !== 'login' && currentView !== 'cli-auth' && currentView !== 'kubernetes-token-login' && (
        <Page masthead={masthead} sidebar={sidebar}>
          <div style={{ paddingTop: '48px' }}>
            {/* Add Device Modal */}
            <DeviceModal
              isOpen={isAddDeviceModalOpen}
              onClose={() => setIsAddDeviceModalOpen(false)}
            />

            {/* SubNav with Get login command button */}
            <SubNav
              onCopyLoginCommand={() => handleNavigate('login')}
              onSystemSettings={() => handleNavigate('system-settings')}
            />

            {/* Content based on current view and active navigation item */}
            {currentView === 'main' && (
              <>
                {activeItem === 'overview' && (
                  <OverviewPage
                    onNavigate={handleNavigate}
                  />
                )}

                {activeItem === 'devices' && (
                  <DevicesPage
                    onAddDeviceClick={() => setIsAddDeviceModalOpen(true)}
                    onNavigate={handleNavigate}
                  />
                )}

                {activeItem === 'fleets' && (
                  <FleetsPage
                    onNavigate={handleNavigate}
                  />
                )}

                {activeItem === 'repositories' && (
                  <RepositoriesPage onNavigate={handleNavigate} />
                )}
              </>
            )}

            {/* Resume Suspended Devices Page */}
            {currentView === 'suspended-devices' && (
              <ResumeSuspendedDevicesPage onBack={() => handleNavigate('main')} />
            )}

            {/* Device Details Page */}
            {currentView === 'device-details' && selectedDeviceId && (
              <DeviceDetailsPage
                deviceId={selectedDeviceId}
                onNavigate={handleNavigate}
              />
            )}

            {/* Fleet Details Page */}
            {currentView === 'fleet-details' && selectedFleetId && (
              <FleetDetailsPage
                fleetId={selectedFleetId}
                onNavigate={handleNavigate}
              />
            )}

            {/* System Settings Page */}
            {currentView === 'system-settings' && (
              <SystemSettingsPage onNavigate={handleNavigate} />
            )}

          </div>
        </Page>
      )}

      {/* Full-screen Login Overlay - renders outside of Page component */}
      {currentView === 'login' && (
        <LoginPage
          onBack={() => handleNavigate('main')}
          onNavigate={handleNavigate}
        />
      )}

      {/* Full-screen CLI Auth Overlay - renders outside of Page component */}
      {currentView === 'cli-auth' && (
        <CLIAuthPage onBack={() => handleNavigate('main')} />
      )}

      {/* Full-screen Kubernetes Token Login Overlay - renders outside of Page component */}
      {currentView === 'kubernetes-token-login' && (
        <KubernetesTokenLoginPage
          onBack={() => handleNavigate('login')}
          onLogin={(token) => {
            console.log('Kubernetes token login successful with token:', token.substring(0, 10) + '...');
            // Here you would implement the actual token authentication logic
            // For now, we'll just navigate back to main
            handleNavigate('main');
          }}
        />
      )}

    </DesignControls>
  );
};

export default FlightControlApp;