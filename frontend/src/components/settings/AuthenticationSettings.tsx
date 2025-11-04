import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem
} from '@patternfly/react-core';

// Import wireframe components
import ProviderManagementWireframe from '../wireframes/ProviderManagementWireframe';
import ProviderFormWireframe from '../wireframes/ProviderFormWireframe';

interface AuthenticationSettingsProps {
  onShowLoginInterface?: () => void;
  onNavigateToSettings?: () => void;
}

const AuthenticationSettings: React.FC<AuthenticationSettingsProps> = ({ onShowLoginInterface, onNavigateToSettings }) => {
  const [activeView, setActiveView] = useState<'management' | 'form'>('management');

  return (
    <>
      {/* Only show header section when in management view */}
      {activeView === 'management' && (
        <PageSection>
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
          <div style={{ marginTop: '1rem' }}>
            <Title headingLevel="h1" size="2xl">
              Authentication & Security
            </Title>
            <p style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
              Manage authentication providers, security policies, and access controls.
            </p>
          </div>
        </PageSection>
      )}

      {/* Content Section */}
      <PageSection>
        {/* Show provider management by default, with Add Identity Provider button */}
        {activeView === 'management' && (
          <ProviderManagementWireframe
            onAddProvider={() => setActiveView('form')}
          />
        )}
        {activeView === 'form' && (
          <ProviderFormWireframe
            onCancel={() => setActiveView('management')}
            onSave={() => setActiveView('management')}
            onNavigateToSettings={onNavigateToSettings}
            onNavigateToAuth={() => setActiveView('management')}
          />
        )}
      </PageSection>
    </>
  );
};

export default AuthenticationSettings;