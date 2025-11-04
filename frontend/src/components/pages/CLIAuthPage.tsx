import React, { useState } from 'react';
import {
  Title,
  Button,
  Bullseye,
  Stack,
  StackItem,
  PageSection,
} from '@patternfly/react-core';
import {
  ArrowLeftIcon,
} from '@patternfly/react-icons';
import LoginForm from '../shared/LoginForm';
import LoginCommandDisplay from '../shared/LoginCommandDisplay';

interface CLIAuthPageProps {
  onBack?: () => void;
}

const CLIAuthPage: React.FC<CLIAuthPageProps> = ({ onBack }) => {
  const [showLoginCommand, setShowLoginCommand] = useState(false);

  // Generate a long, realistic JWT-style token
  const generateLongToken = () => {
    const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    const payload = 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ';
    const signature = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return `${header}.${payload}.${signature}${Math.random().toString(36).substring(2, 25)}${Math.random().toString(36).substring(2, 25)}${Math.random().toString(36).substring(2, 25)}`;
  };

  const longToken = generateLongToken();

  const loginCommand = String.raw`flightctl login https://flightctl-api.example.com \
  --token ${longToken} \
  --insecure-skip-tls-verify \
  --namespace production \
  --config-file ~/.flightctl/config`;

  const shortLoginCommand = String.raw`flightctl login https://flightctl-api.example.com \
  --token ${longToken.substring(0, 50)}...`;

  const expandedContent = String.raw`  --insecure-skip-tls-verify \
  --namespace production \
  --config-file ~/.flightctl/config`;

  const handleLoginSuccess = () => {
    setShowLoginCommand(true);
  };

  return (
    <PageSection isFilled className="pf-v6-u-p-xl">
      <Stack hasGutter style={{ '--pf-v6-l-stack--m-gutter--Gap': '3rem' } as React.CSSProperties}>
          {onBack && (
            <StackItem>
              <Button variant="secondary" icon={<ArrowLeftIcon />} onClick={onBack}>
                Back to Flight Control
              </Button>
            </StackItem>
          )}

          <StackItem>
            <Bullseye>
              <Stack hasGutter style={{ width: showLoginCommand ? '80vw' : '40vw' }}>
                <StackItem>
                  <Stack hasGutter style={{ textAlign: 'center' } as React.CSSProperties}>
                    <StackItem>
                      <Title headingLevel="h1" size="2xl">
                        Flight Control
                      </Title>
                    </StackItem>
                    <StackItem>
                      <Title headingLevel="h4" size="md">
                        CLI Authentication Portal
                      </Title>
                    </StackItem>
                  </Stack>
                </StackItem>

                <StackItem>
                  {showLoginCommand ? (
                    <LoginCommandDisplay
                      loginCommand={loginCommand}
                      shortLoginCommand={shortLoginCommand}
                      expandedContent={expandedContent}
                    />
                  ) : (
                    <LoginForm onLoginSuccess={handleLoginSuccess} />
                  )}
                </StackItem>
              </Stack>
            </Bullseye>
          </StackItem>
      </Stack>
    </PageSection>
  );
};

export default CLIAuthPage;