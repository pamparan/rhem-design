import React, { useState } from 'react';
import { Page, Alert } from '@patternfly/react-core';

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
import SettingsPage from './components/pages/SettingsPage';
import ResumeSuspendedDevicesPage from './components/pages/ResumeSuspendedDevicesPage';
import DeviceDetailsPage from './components/pages/DeviceDetailsPage';
import LoginPage from './components/pages/LoginPage';
import DeviceModal from './components/shared/DeviceModal';
// import CLILoginModal from './components/shared/CLILoginModal';
// import LoginCommandModal from './components/shared/LoginCommandModal';

// Import data
import { mockDevices, mockDevicesPendingApproval } from './data/mockData';

// Import hooks
import { useDesignControls } from './hooks/useDesignControls';


const FlightControlApp: React.FC = () => {
  const { getSetting } = useDesignControls();
  const showDevicesPendingApproval = getSetting('showDevicesPendingApproval');
  const pendingDevicesCount = showDevicesPendingApproval ? mockDevicesPendingApproval.length : 0;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('overview');
  const [currentView, setCurrentView] = useState<'main' | 'suspended-devices' | 'device-details' | 'fleet-details' | 'login'>('main');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedDeviceDetails, setSelectedDeviceDetails] = useState<any>(null);
  const [selectedFleetId, setSelectedFleetId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  // const [isCLILoginModalOpen, setIsCLILoginModalOpen] = useState(false);
  // const [isLoginCommandModalOpen, setIsLoginCommandModalOpen] = useState(false);
  // const [generatedToken, setGeneratedToken] = useState<string>('');

  const onSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarNavigation = (itemId: string) => {
    setActiveItem(itemId);
    setCurrentView('main');
    setSelectedDeviceDetails(null);
    setSelectedFleetId(null);
  };

  const handleNavigate = (view: string) => {
    // Handle special views
    if (view === 'suspended-devices') {
      setCurrentView('suspended-devices');
      setActiveItem('devices'); // Keep devices active in sidebar
      setSelectedDeviceDetails(null);
      setSelectedFleetId(null);
    } else {
      // Handle standard navigation items
      setActiveItem(view);
      setCurrentView('main');
      setSelectedDeviceDetails(null);
      setSelectedFleetId(null);
    }
  };

  const handleCopyLoginCommand = () => {
    console.log('Get login command clicked!');
    setCurrentView('login');
  };

  const handleDeviceClick = (deviceId: string) => {
    setSelectedDevice(deviceId);
    const device = mockDevices.find(d => d.id === deviceId);
    if (device) {
      setSelectedDeviceDetails(device);
      setCurrentView('device-details');
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleFleetClick = (fleetId: string) => {
    setSelectedFleetId(fleetId);
    setCurrentView('fleet-details');
  };

  const navigateToMain = () => {
    setCurrentView('main');
    setSelectedDeviceDetails(null);
    setSelectedFleetId(null);
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
      {/* Main Application - hidden when login is active */}
      {currentView !== 'login' && (
        <Page masthead={masthead} sidebar={sidebar}>
          {/* Alert for device interactions */}
          {showAlert && (
            <Alert
              variant="info"
              title={`Device ${selectedDevice} selected`}
              isInline
              timeout={3000}
              onTimeout={() => setShowAlert(false)}
            />
          )}

          {/* Add Device Modal */}
          <DeviceModal
            isOpen={isAddDeviceModalOpen}
            onClose={() => setIsAddDeviceModalOpen(false)}
          />

          {/* CLI Login Modal */}
          {/* <CLILoginModal
            isOpen={isCLILoginModalOpen}
            onClose={() => setIsCLILoginModalOpen(false)}
            onSuccess={handleLoginSuccess}
          /> */}

          {/* Login Command Modal */}
          {/* <LoginCommandModal
            isOpen={isLoginCommandModalOpen}
            onClose={() => setIsLoginCommandModalOpen(false)}
            token="sample_token_12345"
          /> */}

          {/* SubNav with Get login command button */}
          <SubNav onCopyLoginCommand={handleCopyLoginCommand} />

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
                  onDeviceSelect={handleDeviceClick}
                  onNavigate={handleNavigate}
                />
              )}

              {activeItem === 'fleets' && (
                <FleetsPage
                  onNavigate={handleNavigate}
                  onFleetClick={handleFleetClick}
                />
              )}

              {activeItem === 'repositories' && (
                <RepositoriesPage />
              )}

              {activeItem === 'settings' && (
                <SettingsPage />
              )}
            </>
          )}

          {/* Resume Suspended Devices Page */}
          {currentView === 'suspended-devices' && (
            <ResumeSuspendedDevicesPage onBack={navigateToMain} />
          )}

          {/* Device Details Page */}
          {currentView === 'device-details' && selectedDeviceDetails && (
            <DeviceDetailsPage
              device={selectedDeviceDetails}
              onNavigate={handleNavigate}
              onBack={navigateToMain}
            />
          )}

          {/* Fleet Details Page */}
          {currentView === 'fleet-details' && selectedFleetId && (
            <FleetDetailsPage
              fleetId={selectedFleetId}
              onBack={navigateToMain}
            />
          )}
        </Page>
      )}

      {/* Full-screen Login Overlay - renders outside of Page component */}
      {currentView === 'login' && (
        <LoginPage onBack={navigateToMain} />
      )}
    </DesignControls>
  );
};

export default FlightControlApp;