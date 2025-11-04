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
  CheckCircleIcon,
  CopyIcon,
} from '@patternfly/react-icons';

interface CLIAuthPageWorkingProps {
  showPostRestoreBanner?: boolean;
  onDismissPostRestoreBanner?: () => void;
  onNavigateToDevices?: () => void;
}

const CLIAuthPageWorking: React.FC<CLIAuthPageWorkingProps> = ({
  showPostRestoreBanner = false,
  onDismissPostRestoreBanner = () => console.log('Dismiss banner'),
  onNavigateToDevices = () => console.log('Navigate to devices')
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginCommand, setShowLoginCommand] = useState(false);
  const [copied, setCopied] = useState(false);

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
    setCopied(false);
  };

  // Generate a realistic token
  const generateToken = () => {
    const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    const payload = 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ';
    const signature = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return `${header}.${payload}.${signature}`;
  };

  const token = generateToken();
  const loginCommand = `flightctl login https://flightctl-api.example.com \\
  --token ${token} \\
  --insecure-skip-tls-verify \\
  --namespace production \\
  --config-file ~/.flightctl/config`;

  const handleCopy = () => {
    navigator.clipboard.writeText(loginCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                      Please authenticate to generate your CLI login command. This will create a secure token for command-line access.
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

                  {/* Help Text */}
                  <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
                    <TextContent>
                      <Text component={TextVariants.small} style={{ color: '#004080' }}>
                        <strong>Demo credentials:</strong> Use any username (e.g., "demo") with any password to generate a test token.
                      </Text>
                    </TextContent>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Success State */}
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <CheckCircleIcon style={{ fontSize: '48px', color: '#92d400', marginBottom: '16px' }} />
                    <Alert
                      variant="success"
                      title="Login successful!"
                      isInline
                      style={{ marginBottom: '16px' }}
                    />
                  </div>

                  <TextContent style={{ marginBottom: '24px' }}>
                    <Text component={TextVariants.p}>
                      Copy and run this command in your terminal to authenticate with Flight Control:
                    </Text>
                  </TextContent>

                  {/* Command Display */}
                  <div style={{
                    marginBottom: '24px',
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    position: 'relative'
                  }}>
                    <code style={{
                      wordBreak: 'break-all',
                      fontSize: '14px',
                      fontFamily: 'Monaco, "Courier New", monospace',
                      lineHeight: '1.4'
                    }}>
                      {loginCommand}
                    </code>

                    {/* Copy button */}
                    <Button
                      variant="plain"
                      onClick={handleCopy}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        minHeight: '32px',
                        padding: '4px 8px'
                      }}
                    >
                      <CopyIcon style={{ marginRight: '4px' }} />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>

                  {/* Next Steps */}
                  <Alert
                    variant="info"
                    title="Next steps"
                    isInline
                    style={{ marginBottom: '24px' }}
                  >
                    After running this command, you'll be authenticated and can use the Flight Control CLI
                    to manage your edge devices from your terminal.
                  </Alert>

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

export default CLIAuthPageWorking;