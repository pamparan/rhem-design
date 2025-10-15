import React from 'react';
import {
  PageSection,
  Title,
} from '@patternfly/react-core';
import PostRestoreBanners from '../shared/PostRestoreBanners';

interface SettingsPageProps {}

const SettingsPage: React.FC<SettingsPageProps> = () => {
  return (
    <>
      {/* Header */}
      <PageSection >
        <Title headingLevel="h1" size="2xl">
          Settings
        </Title>
        <p>Settings content coming soon...</p>
      </PageSection>

      <PostRestoreBanners />
    </>
  );
};

export default SettingsPage;