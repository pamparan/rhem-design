import React, { useState, useEffect } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Button,
  Alert,
  CodeBlock,
  CodeBlockCode,
  Flex,
  FlexItem,
  Text,
  TextContent,
  TextVariants,
  List,
  ListItem,
  Divider,
  Label,
  Progress,
} from '@patternfly/react-core';
import {
  CopyIcon,
  CheckIcon,
  TerminalIcon,
  ExclamationTriangleIcon,
  TimesIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';

interface CLITokenPageProps {
  token: string;
  onBack: () => void;
}

// Mock auth config
const mockAuthConfig = {
  serviceEndpointUrl: 'https://flightctl-api.example.com',
  authType: 'k8s',
  deploymentType: 'ACM',
};

const CLITokenPage: React.FC<CLITokenPageProps> = ({ token, onBack }) => {
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [showWarning, setShowWarning] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        if (prev <= 60 && !showWarning) {
          setShowWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning]);

  const handleCopy = async () => {
    try {
      const command = generateLoginCommand();
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateLoginCommand = () => {
    const { serviceEndpointUrl } = mockAuthConfig;
    return `flightctl login ${serviceEndpointUrl} -t ${token} -k`;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressVariant = () => {
    if (timeRemaining <= 30) return 'danger';
    if (timeRemaining <= 60) return 'warning';
    return 'success';
  };

  const getProgressPercentage = () => {
    return (timeRemaining / 300) * 100;
  };

  return (
    <>
      {/* Header */}
      <PageSection>
        <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
          <FlexItem>
            <Button variant="link" onClick={onBack} style={{ padding: 0, marginRight: '12px' }}>
              ← Back
            </Button>
          </FlexItem>
          <FlexItem>
            <TerminalIcon style={{ fontSize: '24px', marginRight: '8px', color: '#06c' }} />
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">
              CLI Login Command
            </Title>
          </FlexItem>
        </Flex>

        <TextContent>
          <Text component={TextVariants.p}>
            Your CLI authentication token has been generated. Copy the command below to authenticate with FlightCtl CLI.
          </Text>
        </TextContent>
      </PageSection>

      {/* Token Expiry Warning */}
      {showWarning && (
        <PageSection style={{ paddingTop: 0, paddingBottom: '16px' }}>
          <Alert
            variant="warning"
            isInline
            title="Token expiring soon!"
            actionClose={<Button variant="plain" onClick={() => setShowWarning(false)}><TimesIcon /></Button>}
          >
            This token will expire in {formatTime(timeRemaining)}. Copy the command now or generate a new token.
          </Alert>
        </PageSection>
      )}

      {/* Main Content */}
      <PageSection>
        <div style={{ maxWidth: '800px' }}>
          {/* Token Status */}
          <Card style={{ marginBottom: '24px' }}>
            <CardBody>
              <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                <FlexItem>
                  <div>
                    <Text component={TextVariants.h3} style={{ marginBottom: '8px' }}>
                      Token Status
                    </Text>
                    <Label color="green" icon={<CheckIcon />}>
                      Active
                    </Label>
                    <Text component={TextVariants.small} style={{ marginLeft: '12px', color: '#6a6e73' }}>
                      Generated: {new Date().toLocaleTimeString()}
                    </Text>
                  </div>
                </FlexItem>
                <FlexItem>
                  <div style={{ textAlign: 'right', minWidth: '200px' }}>
                    <Text component={TextVariants.small} style={{ display: 'block', marginBottom: '8px' }}>
                      Expires in: {formatTime(timeRemaining)}
                    </Text>
                    <Progress
                      value={getProgressPercentage()}
                      variant={getProgressVariant()}
                      size="sm"
                    />
                  </div>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>

          {/* Login Command */}
          <Card style={{ marginBottom: '24px' }}>
            <CardBody>
              <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginBottom: '16px' }}>
                <FlexItem>
                  <Title headingLevel="h3" size="lg">
                    CLI Login Command
                  </Title>
                </FlexItem>
                <FlexItem>
                  <Button
                    variant="primary"
                    icon={copied ? <CheckIcon /> : <CopyIcon />}
                    onClick={handleCopy}
                  >
                    {copied ? 'Copied!' : 'Copy Command'}
                  </Button>
                </FlexItem>
              </Flex>

              <CodeBlock style={{ marginBottom: '16px' }}>
                <CodeBlockCode>{generateLoginCommand()}</CodeBlockCode>
              </CodeBlock>

              <Alert variant="info" isInline>
                <strong>Security Note:</strong> This command contains a temporary authentication token. Keep it secure and do not share it.
              </Alert>
            </CardBody>
          </Card>

          {/* Instructions */}
          <Card style={{ marginBottom: '24px' }}>
            <CardBody>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                Next Steps
              </Title>

              <List isOrdered>
                <ListItem style={{ marginBottom: '8px' }}>
                  <strong>Copy the command above</strong> - Click the "Copy Command" button or manually select and copy the command
                </ListItem>
                <ListItem style={{ marginBottom: '8px' }}>
                  <strong>Open your terminal</strong> - Open a command prompt or terminal application
                </ListItem>
                <ListItem style={{ marginBottom: '8px' }}>
                  <strong>Paste and run the command</strong> - The FlightCtl CLI will authenticate using your token
                </ListItem>
                <ListItem style={{ marginBottom: '8px' }}>
                  <strong>Verify the connection</strong> - Run <code>flightctl get devices</code> to test your access
                </ListItem>
              </List>

              <Divider style={{ margin: '24px 0' }} />

              <Title headingLevel="h4" size="md" style={{ marginBottom: '12px' }}>
                Troubleshooting
              </Title>

              <List>
                <ListItem style={{ marginBottom: '4px' }}>
                  If you get a certificate error, the <code>-k</code> flag skips certificate verification (development only)
                </ListItem>
                <ListItem style={{ marginBottom: '4px' }}>
                  If the token expires, return to this page and generate a new one
                </ListItem>
                <ListItem style={{ marginBottom: '4px' }}>
                  Ensure the FlightCtl CLI is installed and in your PATH
                </ListItem>
              </List>
            </CardBody>
          </Card>

          {/* Environment Info */}
          <Card>
            <CardBody>
              <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                <FlexItem>
                  <InfoCircleIcon style={{ marginRight: '8px', color: '#06c' }} />
                </FlexItem>
                <FlexItem>
                  <Title headingLevel="h3" size="lg">
                    Environment Information
                  </Title>
                </FlexItem>
              </Flex>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <Text component={TextVariants.h4} style={{ marginBottom: '4px' }}>
                    FlightCtl API Endpoint:
                  </Text>
                  <Text component={TextVariants.small} style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {mockAuthConfig.serviceEndpointUrl}
                  </Text>
                </div>
                <div>
                  <Text component={TextVariants.h4} style={{ marginBottom: '4px' }}>
                    Authentication Type:
                  </Text>
                  <Text component={TextVariants.small}>
                    {mockAuthConfig.authType.toUpperCase()} ({mockAuthConfig.deploymentType})
                  </Text>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </PageSection>
    </>
  );
};

export default CLITokenPage;