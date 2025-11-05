import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Stack,
  StackItem,
  Grid,
  GridItem,
  Flex,
  FlexItem
} from '@patternfly/react-core';
import { NavigationItemId, NavigationParams, ViewType } from '../../types/app';

// Import settings components
import SettingsSidebar, { SettingsSection } from '../shared/SettingsSidebar';
import GeneralSettings from '../settings/GeneralSettings';
import AuthenticationSettings from '../settings/AuthenticationSettings';
import MembersSettings from '../settings/MembersSettings';

interface SystemSettingsPageProps {
  onNavigate: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
}

const SystemSettingsPage: React.FC<SystemSettingsPageProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings />;
      case 'authentication':
        return (
          <AuthenticationSettings
            onNavigateToSettings={() => setActiveSection('general')}
          />
        );
      case 'members':
        return <MembersSettings />;
      case 'user-roles':
        return (
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size="xl">User Roles</Title>
              <p style={{ marginTop: '8px', color: '#6a6e73' }}>
                Define and manage user roles and permissions.
              </p>
            </StackItem>
            <StackItem>
              <Card>
                <CardBody>
                  <p>User role management will be implemented here.</p>
                </CardBody>
              </Card>
            </StackItem>
          </Stack>
        );
      default:
        return <GeneralSettings />;
    }
  };

  const sidebarWidth = isSidebarCollapsed ? '60px' : '250px';

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{
        width: sidebarWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        position: 'relative'
      }}>
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onCollapseChange={setIsSidebarCollapsed}
        />
      </div>
      <div style={{
        flex: 1,
        padding: '24px',
        minWidth: 0, // Allow content to shrink below its intrinsic width
        overflow: 'hidden' // Prevent content from overflowing
      }}>
        {renderSettingsContent()}
      </div>
    </div>
  );
};

export default SystemSettingsPage;