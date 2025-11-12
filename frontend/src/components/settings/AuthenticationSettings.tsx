import React, { useState } from 'react';
import {
  PageSection,
  Title
} from '@patternfly/react-core';

// Import wireframe components
import ProviderManagementWireframe from '../wireframes/ProviderManagementWireframe';
import ProviderFormPage from '../pages/ProviderFormPage';
import ProviderDetailsWireframe from '../wireframes/ProviderDetailsWireframe';

interface AuthenticationSettingsProps {
  onShowLoginInterface?: () => void;
  onNavigateToSettings?: () => void;
  onNavigationRequest?: (handler: (navigationFn: () => void) => void) => void;
}

const AuthenticationSettings: React.FC<AuthenticationSettingsProps> = ({ onShowLoginInterface, onNavigateToSettings, onNavigationRequest }) => {
  const [activeView, setActiveView] = useState<'management' | 'form' | 'details'>('management');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [selectedProviderData, setSelectedProviderData] = useState<any | null>(null);
  const [navigationHandler, setNavigationHandler] = useState<((navigationFn: () => void) => void) | null>(null);

  const handleViewDetails = (providerId: string) => {
    setSelectedProviderId(providerId);
    setActiveView('details');
  };

  const handleEditProvider = (providerId: string, providerData?: any) => {
    setSelectedProviderId(providerId);

    // If providerData is not provided, we need to get it from ProviderDetailsWireframe
    // This matches the same data structure used in ProviderDetailsWireframe.tsx
    if (!providerData) {
      const providers = {
        'aap': {
          name: 'enterprise-platform',
          type: 'OAuth2',
          enabled: true,
          authorizationUrl: 'https://aap.example.com/api/gateway/v1/social/authorize',
          tokenUrl: 'https://aap.example.com/api/gateway/v1/social/token',
          userinfoUrl: 'https://aap.example.com/api/gateway/v1/social/userinfo',
          issuerUrl: 'https://aap.example.com/api/gateway/v1/social/',
          clientId: 'aap-client-12345',
          clientSecret: '••••••••••••••••',
          scopes: ['read', 'write'],
          usernameClaim: 'preferred_username',
          roleClaim: 'groups',
          organizationAssignment: 'Dynamic',
          externalOrganizationName: '',
          claimPath: 'custom_claims.organization_id',
          organizationNamePrefix: 'org-',
          organizationNameSuffix: '-demo'
        },
        'google': {
          name: 'google',
          type: 'OIDC',
          enabled: true,
          authorizationUrl: 'https://accounts.google.com/oauth2/v2/auth',
          tokenUrl: 'https://oauth2.googleapis.com/token',
          userinfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
          issuerUrl: 'https://accounts.google.com',
          clientId: 'google-client-id-example',
          clientSecret: '••••••••••••••••',
          scopes: ['openid', 'profile', 'email'],
          usernameClaim: 'email',
          roleClaim: 'groups',
          organizationAssignment: 'Static',
          externalOrganizationName: 'Google Users',
          claimPath: '',
          organizationNamePrefix: '',
          organizationNameSuffix: ''
        },
        'okta': {
          name: 'customer-b-okta',
          type: 'OIDC',
          enabled: false,
          authorizationUrl: 'https://customer-b.okta.com/oauth2/default/v1/authorize',
          tokenUrl: 'https://customer-b.okta.com/oauth2/default/v1/token',
          userinfoUrl: 'https://customer-b.okta.com/oauth2/default/v1/userinfo',
          issuerUrl: 'https://customer-b.okta.com/oauth2/default',
          clientId: 'okta-client-abc123',
          clientSecret: '••••••••••••••••',
          scopes: ['openid', 'profile'],
          usernameClaim: 'preferred_username',
          roleClaim: 'groups',
          organizationAssignment: 'Per user',
          externalOrganizationName: '',
          claimPath: '',
          organizationNamePrefix: 'user-',
          organizationNameSuffix: '-org'
        },
        'kubernetes': {
          name: 'k8s-cluster-auth',
          type: 'OIDC',
          enabled: true,
          authorizationUrl: 'https://k8s.cluster.local:6443/oauth2/v1/authorize',
          tokenUrl: 'https://k8s.cluster.local:6443/oauth2/v1/token',
          userinfoUrl: 'https://k8s.cluster.local:6443/oauth2/v1/userinfo',
          issuerUrl: 'https://k8s.cluster.local:6443',
          clientId: 'k8s-client-xyz789',
          clientSecret: '••••••••••••••••',
          scopes: ['openid'],
          usernameClaim: 'sub',
          roleClaim: 'groups',
          organizationAssignment: 'Static',
          externalOrganizationName: 'Kubernetes Cluster',
          claimPath: '',
          organizationNamePrefix: '',
          organizationNameSuffix: ''
        }
      };
      providerData = providers[providerId as keyof typeof providers] || providers.google;
    }

    setSelectedProviderData(providerData);
    setActiveView('form');
  };

  const handleAddProvider = () => {
    setSelectedProviderId(null);
    setSelectedProviderData(null);
    setActiveView('form');
  };

  const handleNavigationToManagement = () => {
    setActiveView('management');
  };

  const handleNavigationRequest = (navigationFn: () => void) => {
    if (navigationHandler) {
      navigationHandler(navigationFn);
    } else {
      navigationFn();
    }
  };

  // Register the navigation handler with the parent when it's available
  React.useEffect(() => {
    if (onNavigationRequest && navigationHandler) {
      onNavigationRequest(navigationHandler);
    }
  }, [onNavigationRequest, navigationHandler]);

  return (
    <PageSection style={{ height: 'fit-content' }}>
      {/* Only show header section when in management view */}
      {activeView === 'management' && (
        <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
          <Title headingLevel="h1" size="2xl">
            Authentication
          </Title>
          <p style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
            Manage authentication providers, security policies, and access controls.
          </p>
        </div>
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
            providerData={selectedProviderData}
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
              handleEditProvider(providerId);
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