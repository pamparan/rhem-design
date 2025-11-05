import React from 'react';
import {
  Button,
  Stack,
  StackItem,
  PageSection,
} from '@patternfly/react-core';
import {
  ArrowLeftIcon,
} from '@patternfly/react-icons';
import StandaloneLoginWireframe from '../wireframes/StandaloneLoginWireframe';
import { ViewType, NavigationItemId, NavigationParams } from '../../types/app';

interface LoginPageProps {
  onBack?: () => void;
  onNavigate?: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onNavigate }) => {
  return (
    <PageSection isFilled className="pf-v6-u-p-xl">
      <Stack hasGutter style={{ '--pf-v6-l-stack--m-gutter--Gap': '2rem' } as React.CSSProperties}>
          {onBack && (
            <StackItem>
              <Button variant="secondary" icon={<ArrowLeftIcon />} onClick={onBack}>
                Back to Flight Control
              </Button>
            </StackItem>
          )}

          <StackItem>
            <StandaloneLoginWireframe onNavigate={onNavigate} />
          </StackItem>
      </Stack>
    </PageSection>
  );
};

export default LoginPage;