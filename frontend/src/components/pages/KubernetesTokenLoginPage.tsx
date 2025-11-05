import React, { useState } from 'react';
import {
  PageSection,
  Card,
  CardBody,
  Button,
  TextArea,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  Alert,
  ActionGroup,
  Stack,
  StackItem,
  Title,
  Bullseye,
} from '@patternfly/react-core';
import {
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';

interface KubernetesTokenLoginPageProps {
  onBack?: () => void;
  onLogin?: (token: string) => void;
}

const KubernetesTokenLoginPage: React.FC<KubernetesTokenLoginPageProps> = ({
  onBack,
  onLogin,
}) => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTokenChange = (value: string) => {
    setToken(value);
    if (error) {
      setError(''); // Clear error when user starts typing
    }
  };

  const handleLogin = async () => {
    if (!token.trim()) {
      setError('Service account token is required. Enter a token to continue.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate token validation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Basic token format validation (you can adjust this based on your requirements)
      if (token.trim().length < 10) {
        throw new Error('Invalid token format. Please check your token and try again.');
      }

      if (onLogin) {
        onLogin(token.trim());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please check your token and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <PageSection isFilled className="pf-v6-u-p-xl">
      <Bullseye>
        <Card isLarge style={{ width: '600px', maxWidth: '90vw' }}>
          <CardBody>
            <Stack hasGutter style={{ '--pf-v6-l-stack--m-gutter--Gap': '1.5rem' } as React.CSSProperties}>

              {/* Header with back button */}
              <StackItem>
                <Stack hasGutter>
                  <StackItem>
                    <Button
                      variant="link"
                      onClick={handleBack}
                      icon={<ArrowLeftIcon />}
                      style={{
                        color: '#06c',
                        fontSize: '14px',
                        padding: '4px 8px'
                      }}
                    >
                      Back to login options
                    </Button>
                  </StackItem>
                  <StackItem>
                    <Title headingLevel="h1" size="2xl">
                      Enter your Kubernetes token
                    </Title>
                  </StackItem>
                </Stack>
              </StackItem>

              {/* Description */}
              <StackItem>
                <Stack hasGutter>
                  <StackItem>
                    <p style={{ margin: 0, color: '#151515', fontSize: '16px' }}>
                      Enter your Kubernetes service account token to authenticate with the cluster.
                    </p>
                  </StackItem>
                  <StackItem>
                    <p style={{ margin: 0, color: '#6a6e73', fontSize: '14px' }}>
                      You can find this token in your Kubernetes service account credentials.
                    </p>
                  </StackItem>
                </Stack>
              </StackItem>

              {/* Form */}
              <StackItem>
                <Form>
                  <FormGroup
                    label="Service account token"
                    isRequired
                    fieldId="access-token"
                  >
                    <TextArea
                      isRequired
                      id="access-token"
                      value={token}
                      onChange={(_event, value) => handleTokenChange(value)}
                      placeholder="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
                      rows={6}
                      style={{
                        fontFamily: 'var(--pf-v6-global--FontFamily--monospace, "Red Hat Mono", monospace)',
                        fontSize: '0.875rem'
                      }}
                    />

                    {error && (
                      <HelperText>
                        <HelperTextItem variant="error" icon={<ExclamationCircleIcon />}>
                          {error}
                        </HelperTextItem>
                      </HelperText>
                    )}
                  </FormGroup>
                </Form>
              </StackItem>

              {/* Security Warning */}
              <StackItem>
                <Alert
                  variant="warning"
                  isInline
                  title="Keep your token secure"
                >
                  <p style={{ margin: 0 }}>
                    Never share your service account token. It provides full access to your Kubernetes cluster resources.
                  </p>
                </Alert>
              </StackItem>

              {/* Action Buttons - PatternFly 6 Standard */}
              <StackItem>
                <ActionGroup>
                  <Button
                    variant="primary"
                    onClick={handleLogin}
                    isDisabled={!token.trim() || isLoading}
                    isLoading={isLoading}
                  >
                    {isLoading ? 'Authenticating...' : 'Login'}
                  </Button>
                  <Button variant="link" onClick={handleBack}>
                    Cancel
                  </Button>
                </ActionGroup>
              </StackItem>

            </Stack>
          </CardBody>
        </Card>
      </Bullseye>
    </PageSection>
  );
};

export default KubernetesTokenLoginPage;