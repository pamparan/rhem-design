import React, { useState, Fragment } from 'react';
import {
  Title,
  Card,
  CardBody,
  Form,
  FormGroup,
  TextInput,
  Button,
  Alert,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  ClipboardCopyButton,
  ExpandableSection,
  ExpandableSectionToggle,
} from '@patternfly/react-core';
import {
  ArrowLeftIcon,
} from '@patternfly/react-icons';

interface LoginPageProps {
  onBack?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginCommand, setShowLoginCommand] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowLoginCommand(true);
    }, 1500);
  };

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

  const handleCopyClick = (event: React.MouseEvent, text: string) => {
    navigator.clipboard.writeText(text.toString());
    setCopied(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f8f9fa',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        boxSizing: 'border-box'
      }}
    >
      {/* Back button positioned absolutely in top-left */}
      {onBack && (
        <Button
          variant="link"
          icon={<ArrowLeftIcon />}
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            padding: '8px 16px',
            fontSize: '14px',
            color: '#06c',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px'
          }}
        >
          Back to RHEM
        </Button>
      )}

      {/* Centered content container */}
      <div style={{ maxWidth: '700px', width: '100%' }}>
        {/* Logo/Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title headingLevel="h1" size="2xl" style={{ marginBottom: '8px' }}>
            RHEM
          </Title>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
            CLI Authentication Portal
          </p>
        </div>

        {/* Main login card */}
        <Card style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}>
          <CardBody style={{ padding: '32px' }}>
            {!showLoginCommand ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p>
                  Enter your credentials to generate a CLI login command for RHEM.
                </p>

                <Form>
                  <FormGroup label="Username" isRequired fieldId="username">
                    <TextInput
                      isRequired
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(_event, value) => setUsername(value)}
                      placeholder="Enter your username"
                    />
                  </FormGroup>

                  <FormGroup label="Password" isRequired fieldId="password">
                    <TextInput
                      isRequired
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(_event, value) => setPassword(value)}
                      placeholder="Enter your password"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Button
                      variant="primary"
                      isBlock
                      isDisabled={!username || !password || isLoading}
                      isLoading={isLoading}
                      onClick={handleLogin}
                    >
                      {isLoading ? 'Generating...' : 'Login'}
                    </Button>
                  </FormGroup>
                </Form>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Alert
                  variant="success"
                  title="Login successful!"
                  isInline
                />

                <div>
                  <p>
                    Copy and run this command in your terminal to authenticate with RHEM:
                  </p>
                </div>

                <CodeBlock
                  actions={
                    <Fragment>
                      <CodeBlockAction>
                        <ClipboardCopyButton
                          id="copy-button"
                          textId="login-command-code"
                          aria-label="Copy to clipboard"
                          onClick={(e) => handleCopyClick(e, loginCommand)}
                          exitDelay={copied ? 1500 : 600}
                          maxWidth="110px"
                          variant="plain"
                          onTooltipHidden={() => setCopied(false)}
                        >
                          {copied ? 'Successfully copied to clipboard!' : 'Copy to clipboard'}
                        </ClipboardCopyButton>
                      </CodeBlockAction>
                    </Fragment>
                  }
                >
                  <CodeBlockCode id="login-command-code">
                    {isExpanded ? loginCommand : shortLoginCommand}
                    {!isExpanded && (
                      <ExpandableSection
                        isExpanded={isExpanded}
                        isDetached
                        contentId="code-expand"
                        toggleId="toggle-id"
                      >
                        {expandedContent}
                      </ExpandableSection>
                    )}
                  </CodeBlockCode>
                  {!isExpanded && (
                    <ExpandableSectionToggle
                      isExpanded={isExpanded}
                      onToggle={setIsExpanded}
                      contentId="code-expand"
                      direction="up"
                      toggleId="toggle-id"
                    >
                      Show more
                    </ExpandableSectionToggle>
                  )}
                  {isExpanded && (
                    <ExpandableSectionToggle
                      isExpanded={isExpanded}
                      onToggle={setIsExpanded}
                      contentId="code-expand"
                      direction="down"
                      toggleId="toggle-id"
                    >
                      Show less
                    </ExpandableSectionToggle>
                  )}
                </CodeBlock>

                <Alert
                  variant="info"
                  title="Next steps"
                  isInline
                >
                  After running this command, you'll be authenticated and can use the RHEM CLI
                  to manage your edge devices from your terminal.
                </Alert>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;