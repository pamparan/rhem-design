import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem
} from '@patternfly/react-core';

// Import wireframe components
import ProviderManagementWireframe from '../wireframes/ProviderManagementWireframe';
import ProviderFormPage from '../pages/ProviderFormPage';
import ProviderDetailsWireframe from '../wireframes/ProviderDetailsWireframe';

interface AuthenticationSettingsProps {
  onShowLoginInterface?: () => void;
  onNavigateToSettings?: () => void;
}

const AuthenticationSettings: React.FC<AuthenticationSettingsProps> = ({ onShowLoginInterface, onNavigateToSettings }) => {
  const [activeView, setActiveView] = useState<'management' | 'form' | 'details'>('management');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [selectedProviderData, setSelectedProviderData] = useState<any | null>(null);

  const handleViewDetails = (providerId: string) => {
    setSelectedProviderId(providerId);
    setActiveView('details');
  };

  const handleEditProvider = (providerId: string, providerData?: any) => {
    setSelectedProviderId(providerId);
    setSelectedProviderData(providerData || null);
    setActiveView('form');
  };

  const handleAddProvider = () => {
    setSelectedProviderId(null);
    setSelectedProviderData(null);
    setActiveView('form');
  };

  return (
    <PageSection>
      {/* Only show header section when in management view */}
      {activeView === 'management' && (
        <>
          <Breadcrumb>
            <BreadcrumbItem
              to="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToSettings?.();
              }}
            >
              Settings
            </BreadcrumbItem>
            <BreadcrumbItem isActive>Authentication & Security</BreadcrumbItem>
          </Breadcrumb>
          <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
            <Title headingLevel="h1" size="2xl">
              Authentication & Security
            </Title>
            <p style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
              Manage authentication providers, security policies, and access controls.
            </p>
          </div>
        </>
      )}

      {/* Content Section */}
        {/* Show provider management by default, with Add Authentication Provider button */}
        {activeView === 'management' && (
          <ProviderManagementWireframe
            onAddProvider={handleAddProvider}
            onViewDetails={handleViewDetails}
            onEditProvider={handleEditProvider}
          />
        )}
        {activeView === 'form' && (
          <ProviderFormPage
            providerId={selectedProviderId}
            onNavigate={(view, activeItem) => {
              if (view === 'main' && activeItem === 'auth-providers') {
                setActiveView('management');
              }
            }}
          />
        )}
        {activeView === 'details' && selectedProviderId && (
          <ProviderDetailsWireframe
            providerId={selectedProviderId}
            onNavigateBack={() => setActiveView('management')}
            onEdit={(providerId) => {
              setSelectedProviderId(providerId);
              setActiveView('form');
            }}
            onDelete={(providerId) => {
              console.log('Delete provider:', providerId);
              setActiveView('management');
            }}
          />
        )}
    </PageSection>
  );
};

export default AuthenticationSettings;