import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Stack,
  StackItem,
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  TabContentBody,
} from '@patternfly/react-core';

// Import wireframe components
import StandaloneLoginWireframe from '../wireframes/StandaloneLoginWireframe';
import ProviderManagementWireframe from '../wireframes/ProviderManagementWireframe';
import ProviderFormPage from './ProviderFormPage';

/**
 * Wireframes Page - Authentication Provider Feature Mockups
 *
 * This page contains low-fidelity wireframes for the new authentication provider feature.
 * It allows switching between different wireframes using tabs for easy review and discussion.
 */

import { ViewType, NavigationItemId, NavigationParams } from '../../types/app';

interface WireframesPageProps {
  onNavigate?: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
}

const WireframesPage: React.FC<WireframesPageProps> = () => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>('login-screen');

  const handleTabClick = (
    _event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <PageSection>
      <Stack hasGutter>
        {/* Page Header */}
        <StackItem>
          <Title headingLevel="h1" size="2xl">
            Authentication Provider Wireframes
          </Title>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Low-fidelity mockups for the new authentication provider feature. These wireframes
            facilitate engineering discussions and demonstrate the proposed user experience.
          </p>
        </StackItem>

        {/* Wireframe Tabs */}
        <StackItem>
          <Card>
            <CardBody>
              <Tabs
                activeKey={activeTabKey}
                onSelect={handleTabClick}
                isBox
                aria-label="Authentication wireframes tabs"
              >
                {/* Standalone Login Screen Tab */}
                <Tab
                  eventKey="login-screen"
                  title={<TabTitleText>1. Standalone Login Screen</TabTitleText>}
                >
                  <TabContent eventKey="login-screen" id="login-screen-tab">
                    <TabContentBody>
                      <div style={{ marginBottom: '1rem' }}>
                        <Title headingLevel="h3" size="lg">
                          Standalone Login Screen
                        </Title>
                        <p style={{ color: '#666', marginTop: '0.5rem' }}>
                          Purpose: Show the end-user's login choice with available authentication providers.
                          Features application title and buttons for each enabled provider.
                        </p>
                      </div>
                      <div style={{
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <StandaloneLoginWireframe />
                      </div>
                    </TabContentBody>
                  </TabContent>
                </Tab>

                {/* Provider Management Tab */}
                <Tab
                  eventKey="provider-management"
                  title={<TabTitleText>2. Provider Management</TabTitleText>}
                >
                  <TabContent eventKey="provider-management" id="provider-management-tab">
                    <TabContentBody>
                      <div style={{ marginBottom: '1rem' }}>
                        <Title headingLevel="h3" size="lg">
                          Provider Management List View
                        </Title>
                        <p style={{ color: '#666', marginTop: '0.5rem' }}>
                          Purpose: Show the admin the state of all authentication providers.
                          Includes enable/disable toggles and management actions.
                        </p>
                      </div>
                      <div style={{
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <ProviderManagementWireframe />
                      </div>
                    </TabContentBody>
                  </TabContent>
                </Tab>

                {/* Provider Form Tab */}
                <Tab
                  eventKey="provider-form"
                  title={<TabTitleText>3. Provider Create/Edit Form</TabTitleText>}
                >
                  <TabContent eventKey="provider-form" id="provider-form-tab">
                    <TabContentBody>
                      <div style={{ marginBottom: '1rem' }}>
                        <Title headingLevel="h3" size="lg">
                          Provider Create/Edit Form
                        </Title>
                        <p style={{ color: '#666', marginTop: '0.5rem' }}>
                          Purpose: Capture all configuration details for a new OIDC provider.
                          Includes provider details, claim mapping, and organization assignment options.
                        </p>
                      </div>
                      <div style={{
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <ProviderFormPage
                          onNavigate={() => {}}
                        />
                      </div>
                    </TabContentBody>
                  </TabContent>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </StackItem>

        {/* Implementation Notes */}
        <StackItem>
          <Card>
            <CardBody>
              <Title headingLevel="h3" size="lg">
                Implementation Notes
              </Title>
              <Stack hasGutter style={{ marginTop: '1rem' }}>
                <StackItem>
                  <strong>Authentication Flow:</strong>
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                    <li>Users see only enabled providers on the login screen</li>
                    <li>Provider selection redirects to appropriate OAuth/OIDC flow</li>
                    <li>Successful authentication creates or updates user account</li>
                    <li>Organization assignment follows configured rules</li>
                  </ul>
                </StackItem>
                <StackItem>
                  <strong>Administrative Features:</strong>
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                    <li>Toggle providers enabled/disabled without deletion</li>
                    <li>Built-in providers cannot be deleted (only disabled)</li>
                    <li>Test connection validates OIDC configuration</li>
                    <li>Dynamic organization mapping supports flexible rules</li>
                  </ul>
                </StackItem>
                <StackItem>
                  <strong>Technical Considerations:</strong>
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                    <li>Use PatternFly components for consistency</li>
                    <li>Implement proper form validation and error handling</li>
                    <li>Secure storage of client secrets and sensitive data</li>
                    <li>Responsive design for mobile and desktop access</li>
                  </ul>
                </StackItem>
              </Stack>
            </CardBody>
          </Card>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

export default WireframesPage;