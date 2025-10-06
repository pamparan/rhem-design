import React, { useState } from 'react';
import { Page, Alert } from '@patternfly/react-core';

// Import layout components
import AppMasthead from './components/layout/Masthead';
import AppSidebar from './components/layout/Sidebar';
import SubNav from './components/layout/SubNav';

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
import { mockDevices, mockSystemState } from './data/mockData';


const FlightControlApp: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('overview');
  const [currentView, setCurrentView] = useState<'main' | 'suspended-devices' | 'device-details' | 'fleet-details' | 'login'>('main');
  const [showPostRestoreBanner, setShowPostRestoreBanner] = useState(mockSystemState.isPostRestore);
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

  const navigateToSuspendedDevices = () => {
    setCurrentView('suspended-devices');
    setActiveItem('devices'); // Keep devices active in sidebar
  };

  const navigateToMain = () => {
    setCurrentView('main');
    setSelectedDeviceDetails(null);
    setSelectedFleetId(null);
  };

  const navigateToDevices = () => {
    setActiveItem('devices');
    setCurrentView('main');
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
    />
  );

  return (
    <>
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
                  onNavigateToSuspendedDevices={navigateToSuspendedDevices}
                  showPostRestoreBanner={showPostRestoreBanner}
                  onDismissPostRestoreBanner={() => setShowPostRestoreBanner(false)}
                  onNavigateToDevices={navigateToDevices}
                />
              )}

              {activeItem === 'devices' && (
                <DevicesPage
                  onAddDeviceClick={() => setIsAddDeviceModalOpen(true)}
                  onDeviceSelect={handleDeviceClick}
                  onNavigateToSuspendedDevices={navigateToSuspendedDevices}
                  showPostRestoreBanner={showPostRestoreBanner}
                  onDismissPostRestoreBanner={() => setShowPostRestoreBanner(false)}
                  onNavigateToDevices={navigateToDevices}
                />
              )}

              {activeItem === 'fleets' && (
                <FleetsPage
                  onNavigateToSuspendedDevices={navigateToSuspendedDevices}
                  showPostRestoreBanner={showPostRestoreBanner}
                  onDismissPostRestoreBanner={() => setShowPostRestoreBanner(false)}
                  onNavigateToDevices={navigateToDevices}
                  onFleetClick={handleFleetClick}
                />
              )}

              {activeItem === 'repositories' && (
                <RepositoriesPage
                  showPostRestoreBanner={showPostRestoreBanner}
                  onDismissPostRestoreBanner={() => setShowPostRestoreBanner(false)}
                  onNavigateToDevices={navigateToDevices}
                />
              )}

              {activeItem === 'settings' && (
                <SettingsPage
                  showPostRestoreBanner={showPostRestoreBanner}
                  onDismissPostRestoreBanner={() => setShowPostRestoreBanner(false)}
                  onNavigateToDevices={navigateToDevices}
                />
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
              onNavigateToSuspendedDevices={navigateToSuspendedDevices}
              onBack={navigateToMain}
            />
          )}

          {/* Fleet Details Page */}
          {currentView === 'fleet-details' && selectedFleetId && (
            <FleetDetailsPage
              fleetId={selectedFleetId}
              onBack={navigateToMain}
              showPostRestoreBanner={showPostRestoreBanner}
              onDismissPostRestoreBanner={() => setShowPostRestoreBanner(false)}
              onNavigateToDevices={navigateToDevices}
            />
          )}
        </Page>
      )}

      {/* Full-screen Login Overlay - renders outside of Page component */}
      {currentView === 'login' && (
        <LoginPage onBack={navigateToMain} />
      )}
    </>
  );
};

export default FlightControlApp;