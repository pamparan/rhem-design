import React, { useState } from 'react';
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
  Label,
  Divider,
  Grid,
  GridItem,
  ClipboardCopy,
} from '@patternfly/react-core';
import {
  CopyIcon,
  CheckIcon,
  KeyIcon,
  InfoCircleIcon,
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';

interface TokenDisplayPageProps {
  token?: string;
  onBack?: () => void;
}

// Mock token for demonstration
const DEMO_TOKEN = 'flightctl_eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZmxpZ2h0Y3RsOnVzZXItdG9rZW4iLCJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50IiwiYXVkIjpbImZsaWdodGN0bCJdLCJleHAiOjE3MzU4MjQwMDB9.kNX8V4YjQc9fDxM2';

const TokenDisplayPage: React.FC<TokenDisplayPageProps> = ({
  token = DEMO_TOKEN,
  onBack
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  const truncateToken = (fullToken: string, length: number = 40) => {
    if (fullToken.length <= length) return fullToken;
    return `${fullToken.substring(0, length)}...`;
  };

  return (
    <>
      {/* Header */}
      <PageSection>
        <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
          {onBack && (
            <FlexItem>
              <Button variant="link" onClick={onBack} style={{ padding: 0, marginRight: '12px' }}>
                ← Back
              </Button>
            </FlexItem>
          )}
          <FlexItem>
            <KeyIcon style={{ fontSize: '24px', marginRight: '8px', color: '#06c' }} />
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">
              Your Access Token
            </Title>
          </FlexItem>
        </Flex>

        <TextContent>
          <Text component={TextVariants.p}>
            Use this token to authenticate with FlightCtl services and CLI tools.
          </Text>
        </TextContent>
      </PageSection>

      {/* Main Content */}
      <PageSection>
        <Grid hasGutter>
          <GridItem span={8}>
            {/* Primary Token Card */}
            <Card style={{ marginBottom: '24px' }}>
              <CardBody>
                <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginBottom: '16px' }}>
                  <FlexItem>
                    <Title headingLevel="h2" size="lg">
                      Access Token
                    </Title>
                  </FlexItem>
                  <FlexItem>
                    <Label color="green" icon={<CheckIcon />}>
                      Active
                    </Label>
                  </FlexItem>
                </Flex>

                {/* Token Display with Copy Button */}
                <div style={{ marginBottom: '16px' }}>
                  <ClipboardCopy
                    hoverTip="Copy"
                    clickTip="Copied"
                    variant="expansion"
                    isReadOnly
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '14px'
                    }}
                  >
                    {token}
                  </ClipboardCopy>
                </div>

                {/* Quick Copy Button */}
                <Flex justifyContent={{ default: 'justifyContentCenter' }} style={{ marginTop: '24px' }}>
                  <FlexItem>
                    <Button
                      variant="primary"
                      size="lg"
                      icon={copied ? <CheckIcon /> : <CopyIcon />}
                      onClick={handleCopy}
                      style={{ minWidth: '200px' }}
                    >
                      {copied ? 'Token Copied!' : 'Copy Token'}
                    </Button>
                  </FlexItem>
                </Flex>

                <Alert variant="info" isInline style={{ marginTop: '16px' }}>
                  <strong>Quick Access:</strong> Click the button above or use the expandable field to copy your token instantly.
                </Alert>
              </CardBody>
            </Card>

            {/* Usage Examples */}
            <Card style={{ marginBottom: '24px' }}>
              <CardBody>
                <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                  How to Use This Token
                </Title>

                <div style={{ marginBottom: '24px' }}>
                  <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>
                    CLI Authentication:
                  </Text>
                  <CodeBlock>
                    <CodeBlockCode>
                      flightctl login https://api.flightctl.example.com -t {truncateToken(token)}
                    </CodeBlockCode>
                  </CodeBlock>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>
                    API Headers:
                  </Text>
                  <CodeBlock>
                    <CodeBlockCode>
                      Authorization: Bearer {truncateToken(token)}
                    </CodeBlockCode>
                  </CodeBlock>
                </div>

                <div>
                  <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>
                    cURL Example:
                  </Text>
                  <CodeBlock>
                    <CodeBlockCode>
                      {`curl -H "Authorization: Bearer ${truncateToken(token)}" \\
  https://api.flightctl.example.com/api/v1/devices`}
                    </CodeBlockCode>
                  </CodeBlock>
                </div>
              </CardBody>
            </Card>

            {/* Security Notice */}
            <Card>
              <CardBody>
                <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                  <FlexItem>
                    <ExclamationTriangleIcon style={{ color: '#f0ab00', marginRight: '8px' }} />
                  </FlexItem>
                  <FlexItem>
                    <Title headingLevel="h3" size="lg">
                      Security Guidelines
                    </Title>
                  </FlexItem>
                </Flex>

                <Alert variant="warning" isInline style={{ marginBottom: '16px' }}>
                  <strong>Keep this token secure!</strong> Anyone with access to this token can authenticate as you.
                </Alert>

                <TextContent>
                  <Text component={TextVariants.p} style={{ marginBottom: '12px' }}>
                    <strong>Best Practices:</strong>
                  </Text>
                  <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                    <li>Store tokens securely (use environment variables or secure credential stores)</li>
                    <li>Never commit tokens to version control systems</li>
                    <li>Rotate tokens regularly for enhanced security</li>
                    <li>Use tokens with appropriate scope and permissions</li>
                    <li>Monitor token usage and revoke if compromised</li>
                  </ul>
                </TextContent>
              </CardBody>
            </Card>
          </GridItem>

          {/* Right Sidebar */}
          <GridItem span={4}>
            <Card style={{ position: 'sticky', top: '20px' }}>
              <CardBody>
                <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                  <FlexItem>
                    <InfoCircleIcon style={{ marginRight: '8px', color: '#06c' }} />
                  </FlexItem>
                  <FlexItem>
                    <Title headingLevel="h3" size="lg">
                      Token Details
                    </Title>
                  </FlexItem>
                </Flex>

                <div style={{ marginBottom: '16px' }}>
                  <Text component={TextVariants.h4} style={{ marginBottom: '4px' }}>
                    Type:
                  </Text>
                  <Text component={TextVariants.small}>
                    Bearer Token
                  </Text>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <Text component={TextVariants.h4} style={{ marginBottom: '4px' }}>
                    Format:
                  </Text>
                  <Text component={TextVariants.small}>
                    JWT (JSON Web Token)
                  </Text>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <Text component={TextVariants.h4} style={{ marginBottom: '4px' }}>
                    Scope:
                  </Text>
                  <Text component={TextVariants.small}>
                    Full API Access
                  </Text>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <Text component={TextVariants.h4} style={{ marginBottom: '4px' }}>
                    Generated:
                  </Text>
                  <Text component={TextVariants.small}>
                    {new Date().toLocaleString()}
                  </Text>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <div style={{ marginBottom: '16px' }}>
                  <Text component={TextVariants.h4} style={{ marginBottom: '8px' }}>
                    Quick Actions:
                  </Text>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Button variant="secondary" size="sm" onClick={handleCopy}>
                      {copied ? 'Copied!' : 'Copy Token'}
                    </Button>
                    <Button variant="link" size="sm" style={{ padding: 0, justifyContent: 'flex-start' }}>
                      View Token Details
                    </Button>
                    <Button variant="link" size="sm" style={{ padding: 0, justifyContent: 'flex-start', color: '#c9190b' }}>
                      Revoke Token
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export default TokenDisplayPage;