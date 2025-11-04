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

interface LoginPageProps {
  onBack?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
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
            <StandaloneLoginWireframe />
          </StackItem>
      </Stack>
    </PageSection>
  );
};

export default LoginPage;