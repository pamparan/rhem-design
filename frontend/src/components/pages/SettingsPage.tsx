import React from 'react';
import {
  PageSection,
  Title,
} from '@patternfly/react-core';
import GlobalPostRestoreBanner from '../shared/GlobalPostRestoreBanner';

interface SettingsPageProps {
  showPostRestoreBanner?: boolean;
  onDismissPostRestoreBanner?: () => void;
  onNavigateToDevices?: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  showPostRestoreBanner = false,
  onDismissPostRestoreBanner = () => console.log('Dismiss banner'),
  onNavigateToDevices = () => console.log('Navigate to devices')
}) => {
  return (
    <>
      {/* Header */}
      <PageSection >
        <Title headingLevel="h1" size="2xl">
          Settings
        </Title>
        <p>Settings content coming soon...</p>
      </PageSection>

      {/* Global Post-Restore Banner */}
      {showPostRestoreBanner && (
        <PageSection style={{ paddingTop: 0, paddingBottom: '16px' }}>
          <GlobalPostRestoreBanner
            isVisible={showPostRestoreBanner}
            onDismiss={onDismissPostRestoreBanner}
            onViewDevices={onNavigateToDevices}
          />
        </PageSection>
      )}
    </>
  );
};

export default SettingsPage;