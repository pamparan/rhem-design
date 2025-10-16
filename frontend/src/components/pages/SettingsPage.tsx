import React from 'react';
import {
  PageSection,
  Title,
} from '@patternfly/react-core';
import PostRestoreBanners from '../shared/PostRestoreBanners';
import { NavigationItemId, NavigationParams, ViewType } from '../../types/app';

interface SettingsPageProps {
  onNavigate: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  onNavigate,
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

      <PostRestoreBanners onNavigate={onNavigate} />
    </>
  );
};

export default SettingsPage;