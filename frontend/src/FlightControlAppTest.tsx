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
import DeviceModal from './components/shared/DeviceModal';

import { mockDevicesPendingApproval } from './data/mockData';
import { useDesignControls } from './hooks/useDesignControls';
import { ViewType, NavigationItemId, NavigationParams } from './types/app';

const FlightControlAppTest: React.FC = () => {
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

  const masthead = (
    <AppMasthead
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={onSidebarToggle}
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
      {/* Main Application */}
      {currentView !== 'login' && (
        <Page masthead={masthead} sidebar={sidebar}>
          <div style={{ minHeight: '100%' }}>
            {/* Add Device Modal */}
            <DeviceModal
              isOpen={isAddDeviceModalOpen}
              onClose={() => setIsAddDeviceModalOpen(false)}
            />

            {/* SubNav */}
            <SubNav onCopyLoginCommand={() => handleNavigate('login')} />

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
          </div>
        </Page>
      )}

      {/* Simple Login Page */}
      {currentView === 'login' && (
        <LoginPage onBack={() => handleNavigate('main')} />
      )}
    </DesignControls>
  );
};

export default FlightControlAppTest;