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

  return (
    <PageSection>
      <Grid hasGutter>
        <GridItem span={2}>
          <SettingsSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </GridItem>
        <GridItem span={10}>
          {renderSettingsContent()}
        </GridItem>
      </Grid>
    </PageSection>
  );
};

export default SystemSettingsPage;