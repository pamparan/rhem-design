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
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Text,
  TextContent,
  TextVariants,
  List,
  ListItem,
  Divider,
  ExpandableSection,
} from '@patternfly/react-core';
import {
  CopyIcon,
  CheckIcon,
  ExternalLinkAltIcon,
  InfoCircleIcon,
  TerminalIcon,
} from '@patternfly/react-icons';
import PostRestoreBanners from '../shared/PostRestoreBanners';

interface CLIOnboardingPageProps {}

// Mock auth config and service info
const mockAuthConfig = {
  serviceEndpointUrl: 'https://flightctl-api.example.com',
  authType: 'k8s', // 'k8s' | 'oidc' | 'aap' | 'none'
  deploymentType: 'ACM', // ACM | AAP | Standalone
};

// Mock token (in real implementation, this would come from session/cookies)
const mockUserToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZmxpZ2h0Y3RsOnVzZXItdG9rZW4iLCJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50IiwiYXVkIjpbImZsaWdodGN0bCJdLCJleHAiOjE3MzU4MjQwMDB9';

const CLIOnboardingPage: React.FC<CLIOnboardingPageProps> = () => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>('quickstart');
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [authConfig, setAuthConfig] = useState(mockAuthConfig);
  const [userToken, setUserToken] = useState<string | null>(null);

  // Simulate fetching auth config and user token
  useEffect(() => {
    // In real implementation, fetch from /api/v1/auth/config
    setAuthConfig(mockAuthConfig);

    // Extract token from session/cookies
    setUserToken(mockUserToken);
  }, []);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateLoginCommand = () => {
    const { serviceEndpointUrl, authType } = authConfig;

    switch (authType) {
      case 'k8s':
        return `flightctl login ${serviceEndpointUrl} -t $(oc whoami -t) -k`;
      case 'oidc':
        return `flightctl login ${serviceEndpointUrl} --web -k`;
      case 'aap':
        return `flightctl login ${serviceEndpointUrl} --token YOUR_AAP_TOKEN -k`;
      default:
        return `flightctl login ${serviceEndpointUrl} -k`;
    }
  };

  const generateTokenCommand = () => {
    if (!userToken) return '';
    const { serviceEndpointUrl } = authConfig;
    return `flightctl login ${serviceEndpointUrl} -t ${userToken} -k`;
  };

  const getEnvironmentInstructions = () => {
    switch (authConfig.authType) {
      case 'k8s':
        return {
          title: 'OpenShift/Kubernetes Authentication',
          description: 'This FlightCtl instance is integrated with OpenShift. Use your existing OpenShift session to authenticate.',
          prerequisites: [
            'You must be logged into OpenShift CLI (oc)',
            'Your OpenShift user must have FlightCtl access permissions',
          ],
          steps: [
            'Ensure you are logged into OpenShift: oc whoami',
            'Copy and run the login command below',
            'The command will use your current OpenShift token automatically',
          ],
        };
      case 'oidc':
        return {
          title: 'OIDC/Web Authentication',
          description: 'This FlightCtl instance uses OIDC authentication. You will authenticate via web browser.',
          prerequisites: [
            'Access to the FlightCtl web interface',
            'Valid OIDC credentials',
          ],
          steps: [
            'Run the login command below',
            'Your web browser will open automatically',
            'Complete authentication in the browser',
            'Return to the CLI to continue',
          ],
        };
      case 'aap':
        return {
          title: 'AAP Gateway Authentication',
          description: 'This FlightCtl instance is integrated with Ansible Automation Platform.',
          prerequisites: [
            'Access to AAP Gateway',
            'Valid AAP user account with FlightCtl permissions',
          ],
          steps: [
            'Generate a token in AAP Gateway',
            'Replace YOUR_AAP_TOKEN in the command below',
            'Run the login command',
          ],
        };
      default:
        return {
          title: 'Direct Authentication',
          description: 'This FlightCtl instance uses direct authentication.',
          prerequisites: ['Valid FlightCtl credentials'],
          steps: ['Run the login command below', 'Enter your credentials when prompted'],
        };
    }
  };

  const instructions = getEnvironmentInstructions();

  return (
    <>
      {/* Header */}
      <PageSection>
        <Title headingLevel="h1" size="2xl">
          CLI Setup
        </Title>
        <TextContent>
          <Text component={TextVariants.p}>
            Get started with the FlightCtl command-line interface. Follow the steps below to install and configure the CLI for your environment.
          </Text>
        </TextContent>
      </PageSection>

      <PostRestoreBanners />

      {/* Main Content */}
      <PageSection>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(event, tabIndex) => setActiveTabKey(tabIndex)}
        >
          <Tab eventKey="quickstart" title={<TabTitleText>Quick Start</TabTitleText>} />
          <Tab eventKey="installation" title={<TabTitleText>Installation</TabTitleText>} />
          <Tab eventKey="advanced" title={<TabTitleText>Advanced</TabTitleText>} />
        </Tabs>

        <TabContent id="quickstart" eventKey="quickstart" activeKey={activeTabKey} hidden={activeTabKey !== 'quickstart'}>
          <Grid hasGutter style={{ marginTop: '24px' }}>
            <GridItem span={8}>
              {/* Environment Info */}
              <Card style={{ marginBottom: '24px' }}>
                <CardBody>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                    <FlexItem>
                      <Title headingLevel="h3" size="lg">
                        <TerminalIcon style={{ marginRight: '8px' }} />
                        {instructions.title}
                      </Title>
                    </FlexItem>
                  </Flex>

                  <TextContent style={{ marginBottom: '16px' }}>
                    <Text>{instructions.description}</Text>
                  </TextContent>

                  <Alert variant="info" isInline style={{ marginBottom: '16px' }}>
                    <strong>Detected Environment:</strong> {authConfig.deploymentType} ({authConfig.authType})
                  </Alert>

                  <div style={{ marginBottom: '16px' }}>
                    <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>Prerequisites:</Text>
                    <List>
                      {instructions.prerequisites.map((prereq, index) => (
                        <ListItem key={index}>{prereq}</ListItem>
                      ))}
                    </List>
                  </div>
                </CardBody>
              </Card>

              {/* Login Command */}
              <Card style={{ marginBottom: '24px' }}>
                <CardBody>
                  <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                    Login Command
                  </Title>

                  <div style={{ marginBottom: '16px' }}>
                    <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>Steps:</Text>
                    <List isOrdered>
                      {instructions.steps.map((step, index) => (
                        <ListItem key={index}>{step}</ListItem>
                      ))}
                    </List>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '8px' }}>
                      <FlexItem>
                        <Text component={TextVariants.h4}>Recommended Command:</Text>
                      </FlexItem>
                      <FlexItem>
                        <Button
                          variant="link"
                          icon={copiedStates['login-cmd'] ? <CheckIcon /> : <CopyIcon />}
                          onClick={() => handleCopy(generateLoginCommand(), 'login-cmd')}
                          style={{ padding: '4px 8px' }}
                        >
                          {copiedStates['login-cmd'] ? 'Copied!' : 'Copy'}
                        </Button>
                      </FlexItem>
                    </Flex>
                    <CodeBlock>
                      <CodeBlockCode>{generateLoginCommand()}</CodeBlockCode>
                    </CodeBlock>
                  </div>

                  {/* Token-based command if available */}
                  {userToken && (
                    <div>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '8px' }}>
                        <FlexItem>
                          <Text component={TextVariants.h4}>Using Your Current Session Token:</Text>
                        </FlexItem>
                        <FlexItem>
                          <Button
                            variant="link"
                            icon={copiedStates['token-cmd'] ? <CheckIcon /> : <CopyIcon />}
                            onClick={() => handleCopy(generateTokenCommand(), 'token-cmd')}
                            style={{ padding: '4px 8px' }}
                          >
                            {copiedStates['token-cmd'] ? 'Copied!' : 'Copy'}
                          </Button>
                        </FlexItem>
                      </Flex>
                      <CodeBlock>
                        <CodeBlockCode>{generateTokenCommand()}</CodeBlockCode>
                      </CodeBlock>
                      <Alert variant="warning" isInline style={{ marginTop: '8px' }}>
                        This command includes your current session token. Keep it secure and do not share it.
                      </Alert>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Verification */}
              <Card>
                <CardBody>
                  <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                    Verify Installation
                  </Title>

                  <TextContent style={{ marginBottom: '16px' }}>
                    <Text>After running the login command, verify your connection:</Text>
                  </TextContent>

                  <div style={{ marginBottom: '16px' }}>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '8px' }}>
                      <FlexItem>
                        <Text component={TextVariants.h4}>Check Connection:</Text>
                      </FlexItem>
                      <FlexItem>
                        <Button
                          variant="link"
                          icon={copiedStates['verify-cmd'] ? <CheckIcon /> : <CopyIcon />}
                          onClick={() => handleCopy('flightctl get devices', 'verify-cmd')}
                          style={{ padding: '4px 8px' }}
                        >
                          {copiedStates['verify-cmd'] ? 'Copied!' : 'Copy'}
                        </Button>
                      </FlexItem>
                    </Flex>
                    <CodeBlock>
                      <CodeBlockCode>flightctl get devices</CodeBlockCode>
                    </CodeBlock>
                  </div>

                  <Alert variant="success" isInline>
                    If the command returns a list of devices (or an empty list), you're successfully connected!
                  </Alert>
                </CardBody>
              </Card>
            </GridItem>

            {/* Right sidebar - Quick info */}
            <GridItem span={4}>
              <Card style={{ position: 'sticky', top: '20px' }}>
                <CardBody>
                  <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                    <InfoCircleIcon style={{ marginRight: '8px' }} />
                    Quick Info
                  </Title>

                  <div style={{ marginBottom: '16px' }}>
                    <Text component={TextVariants.h4} style={{ marginBottom: '4px' }}>FlightCtl API Endpoint:</Text>
                    <Text component={TextVariants.small} style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {authConfig.serviceEndpointUrl}
                    </Text>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <Text component={TextVariants.h4} style={{ marginBottom: '4px' }}>Authentication Type:</Text>
                    <Text component={TextVariants.small}>{authConfig.authType.toUpperCase()}</Text>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <Text component={TextVariants.h4} style={{ marginBottom: '4px' }}>Deployment:</Text>
                    <Text component={TextVariants.small}>{authConfig.deploymentType}</Text>
                  </div>

                  <Divider style={{ margin: '16px 0' }} />

                  <div style={{ marginBottom: '16px' }}>
                    <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>Need Help?</Text>
                    <List>
                      <ListItem>
                        <Button variant="link" isInline style={{ padding: 0 }}>
                          FlightCtl Documentation <ExternalLinkAltIcon style={{ marginLeft: '4px' }} />
                        </Button>
                      </ListItem>
                      <ListItem>
                        <Button variant="link" isInline style={{ padding: 0 }}>
                          CLI Command Reference <ExternalLinkAltIcon style={{ marginLeft: '4px' }} />
                        </Button>
                      </ListItem>
                      <ListItem>
                        <Button variant="link" isInline style={{ padding: 0 }}>
                          Troubleshooting Guide <ExternalLinkAltIcon style={{ marginLeft: '4px' }} />
                        </Button>
                      </ListItem>
                    </List>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </TabContent>

        <TabContent eventKey="installation" activeKey={activeTabKey} hidden={activeTabKey !== 'installation'}>
          <Card style={{ marginTop: '24px' }}>
            <CardBody>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                Install FlightCtl CLI
              </Title>

              <ExpandableSection toggleText="Linux Installation" style={{ marginBottom: '16px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>Download and Install:</Text>
                  <CodeBlock>
                    <CodeBlockCode>{`curl -L -o flightctl https://github.com/flightctl/flightctl/releases/latest/download/flightctl-linux-amd64
chmod +x flightctl
sudo mv flightctl /usr/local/bin/`}</CodeBlockCode>
                  </CodeBlock>
                </div>
              </ExpandableSection>

              <ExpandableSection toggleText="macOS Installation" style={{ marginBottom: '16px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>Using Homebrew:</Text>
                  <CodeBlock>
                    <CodeBlockCode>brew install flightctl/tap/flightctl</CodeBlockCode>
                  </CodeBlock>
                </div>
                <div>
                  <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>Manual Installation:</Text>
                  <CodeBlock>
                    <CodeBlockCode>{`curl -L -o flightctl https://github.com/flightctl/flightctl/releases/latest/download/flightctl-darwin-amd64
chmod +x flightctl
sudo mv flightctl /usr/local/bin/`}</CodeBlockCode>
                  </CodeBlock>
                </div>
              </ExpandableSection>

              <ExpandableSection toggleText="Windows Installation">
                <div>
                  <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>PowerShell:</Text>
                  <CodeBlock>
                    <CodeBlockCode>{`Invoke-WebRequest -Uri "https://github.com/flightctl/flightctl/releases/latest/download/flightctl-windows-amd64.exe" -OutFile "flightctl.exe"
# Move to a directory in your PATH`}</CodeBlockCode>
                  </CodeBlock>
                </div>
              </ExpandableSection>
            </CardBody>
          </Card>
        </TabContent>

        <TabContent eventKey="advanced" activeKey={activeTabKey} hidden={activeTabKey !== 'advanced'}>
          <Card style={{ marginTop: '24px' }}>
            <CardBody>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                Advanced Configuration
              </Title>

              <div style={{ marginBottom: '24px' }}>
                <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>Custom Configuration Directory:</Text>
                <CodeBlock>
                  <CodeBlockCode>flightctl login {authConfig.serviceEndpointUrl} --config-dir ~/.custom-flightctl -k</CodeBlockCode>
                </CodeBlock>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>Using Custom CA Certificate:</Text>
                <CodeBlock>
                  <CodeBlockCode>flightctl login {authConfig.serviceEndpointUrl} --certificate-authority /path/to/ca.crt</CodeBlockCode>
                </CodeBlock>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>OAuth2 Client ID:</Text>
                <CodeBlock>
                  <CodeBlockCode>flightctl login {authConfig.serviceEndpointUrl} --client-id your-client-id --web</CodeBlockCode>
                </CodeBlock>
              </div>

              <Alert variant="info" isInline>
                <strong>Note:</strong> The -k flag skips TLS certificate verification. Only use this in development environments or when using self-signed certificates.
              </Alert>
            </CardBody>
          </Card>
        </TabContent>
      </PageSection>
    </>
  );
};

export default CLIOnboardingPage;