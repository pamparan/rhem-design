import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Button,
  TextContent,
  Text,
} from '@patternfly/react-core';
import {
  CopyIcon,
  CheckIcon,
  KeyIcon,
} from '@patternfly/react-icons';

interface SimpleTokenDisplayPageProps {
  token?: string;
  onBack?: () => void;
}

// Mock token for demonstration
const DEMO_TOKEN = 'flightctl_eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZmxpZ2h0Y3RsOnVzZXItdG9rZW4iLCJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50IiwiYXVkIjpbImZsaWdodGN0bCJdLCJleHAiOjE3MzU4MjQwMDB9.kNX8V4YjQc9fDxM2';

const SimpleTokenDisplayPage: React.FC<SimpleTokenDisplayPageProps> = ({
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

  return (
    <>
      {/* Header */}
      <PageSection>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          {onBack && (
            <Button variant="link" onClick={onBack} style={{ padding: 0, marginRight: '12px' }}>
              ← Back
            </Button>
          )}
          <KeyIcon style={{ fontSize: '24px', marginRight: '8px', color: '#06c' }} />
          <Title headingLevel="h1" size="2xl">
            Your Access Token
          </Title>
        </div>

        <TextContent>
          <Text>
            Use this token to authenticate with FlightCtl services and CLI tools.
          </Text>
        </TextContent>
      </PageSection>

      {/* Main Content */}
      <PageSection>
        <div style={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#fff',
          marginBottom: '24px'
        }}>
          <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>
            Access Token
          </Title>

          {/* Token Display */}
          <div style={{
            fontFamily: 'monospace',
            fontSize: '14px',
            backgroundColor: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            wordBreak: 'break-all'
          }}>
            {token}
          </div>

          {/* Copy Button */}
          <div style={{ textAlign: 'center' }}>
            <Button
              variant="primary"
              size="lg"
              icon={copied ? <CheckIcon /> : <CopyIcon />}
              onClick={handleCopy}
              style={{ minWidth: '200px' }}
            >
              {copied ? 'Token Copied!' : 'Copy Token'}
            </Button>
          </div>
        </div>

        {/* Usage Instructions */}
        <div style={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#fff'
        }}>
          <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
            How to Use This Token
          </Title>

          <div style={{ marginBottom: '16px' }}>
            <Text style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
              CLI Authentication:
            </Text>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              backgroundColor: '#f5f5f5',
              padding: '8px',
              borderRadius: '4px'
            }}>
              flightctl login https://api.flightctl.example.com -t {token.substring(0, 40)}...
            </div>
          </div>

          <div>
            <Text style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
              API Headers:
            </Text>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              backgroundColor: '#f5f5f5',
              padding: '8px',
              borderRadius: '4px'
            }}>
              Authorization: Bearer {token.substring(0, 40)}...
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
};

export default SimpleTokenDisplayPage;