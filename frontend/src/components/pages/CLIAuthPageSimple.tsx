import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Form,
  FormGroup,
  TextInput,
  Button,
  ActionGroup,
  Alert,
  Text,
  TextContent,
  TextVariants,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import {
  TerminalIcon,
  UserIcon,
  LockIcon,
} from '@patternfly/react-icons';

interface CLIAuthPageSimpleProps {
  showPostRestoreBanner?: boolean;
  onDismissPostRestoreBanner?: () => void;
  onNavigateToDevices?: () => void;
}

const CLIAuthPageSimple: React.FC<CLIAuthPageSimpleProps> = ({
  showPostRestoreBanner = false,
  onDismissPostRestoreBanner = () => console.log('Dismiss banner'),
  onNavigateToDevices = () => console.log('Navigate to devices')
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginCommand, setShowLoginCommand] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate authentication API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, generate a mock token
      if (username === 'demo' || username.length > 0) {
        setShowLoginCommand(true);
        setUsername('');
        setPassword('');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShowLoginCommand(false);
    setUsername('');
    setPassword('');
    setError('');
    setIsLoading(false);
  };

  return (
    <>
      {/* Header */}
      <PageSection>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
          <FlexItem>
            <TerminalIcon style={{ fontSize: '32px', color: '#06c' }} />
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">
              Flight Control
            </Title>
          </FlexItem>
        </Flex>
        <TextContent style={{ marginTop: '8px' }}>
          <Text component={TextVariants.p} style={{ color: '#6b7280', fontSize: '16px' }}>
            CLI Authentication Portal
          </Text>
        </TextContent>
      </PageSection>

      {/* Main Content */}
      <PageSection>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Card style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardBody style={{ padding: '32px' }}>
              {!showLoginCommand ? (
                <div>
                  {/* Authentication Form */}
                  <TextContent style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <Text component={TextVariants.h2} style={{ marginBottom: '8px' }}>
                      CLI Access Authentication
                    </Text>
                    <Text component={TextVariants.p}>
                      Please authenticate to generate your CLI login command.
                    </Text>
                  </TextContent>

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="danger" isInline style={{ marginBottom: '16px' }}>
                      {error}
                    </Alert>
                  )}

                  {/* Login Form */}
                  <Form onSubmit={handleSubmit}>
                    <FormGroup
                      label="Username"
                      isRequired
                      fieldId="cli-username"
                    >
                      <TextInput
                        isRequired
                        type="text"
                        id="cli-username"
                        name="cli-username"
                        value={username}
                        onChange={(_event, value) => setUsername(value)}
                        isDisabled={isLoading}
                        placeholder="Enter your username"
                        icon={<UserIcon />}
                      />
                    </FormGroup>

                    <FormGroup
                      label="Password"
                      isRequired
                      fieldId="cli-password"
                    >
                      <TextInput
                        isRequired
                        type="password"
                        id="cli-password"
                        name="cli-password"
                        value={password}
                        onChange={(_event, value) => setPassword(value)}
                        isDisabled={isLoading}
                        placeholder="Enter your password"
                        icon={<LockIcon />}
                      />
                    </FormGroup>

                    <ActionGroup>
                      <Button
                        variant="primary"
                        type="submit"
                        isLoading={isLoading}
                        isDisabled={isLoading || !username || !password}
                        size="lg"
                        isBlock
                      >
                        {isLoading ? 'Authenticating...' : 'Generate CLI Token'}
                      </Button>
                    </ActionGroup>
                  </Form>
                </div>
              ) : (
                <div>
                  {/* Success State */}
                  <Alert
                    variant="success"
                    title="Login successful!"
                    isInline
                    style={{ marginBottom: '24px' }}
                  />

                  <TextContent style={{ marginBottom: '24px' }}>
                    <Text component={TextVariants.p}>
                      Your CLI authentication token has been generated successfully.
                    </Text>
                  </TextContent>

                  <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <code style={{ wordBreak: 'break-all' }}>
                      flightctl login https://flightctl-api.example.com --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                    </code>
                  </div>

                  <ActionGroup>
                    <Button
                      variant="secondary"
                      onClick={handleReset}
                    >
                      Generate New Token
                    </Button>
                  </ActionGroup>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </PageSection>
    </>
  );
};

export default CLIAuthPageSimple;