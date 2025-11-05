import React, { useState } from 'react';
import {
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  TextArea,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  Alert,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import {
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';

interface TokenLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (token: string) => void;
  onBack?: () => void;
}

const TokenLoginModal: React.FC<TokenLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onBack,
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
      setError('Access token is required. Enter a token to continue.');
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

      onLogin(token.trim());
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please check your token and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setToken('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  const handleBack = () => {
    if (onBack) {
      handleClose();
      onBack();
    } else {
      // If no onBack prop is provided, just close the modal to return to login options
      handleClose();
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={handleClose}
      position="top"
    >
      <ModalHeader>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
          {onBack && (
            <FlexItem>
              <Button
                variant="plain"
                icon={<ArrowLeftIcon />}
                onClick={handleBack}
                aria-label="Select a different authentication provider"
              />
            </FlexItem>
          )}
          <FlexItem>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
              Enter your Kubernetes token
            </h1>
          </FlexItem>
        </Flex>
      </ModalHeader>

      <ModalBody>
        {/* Back button at the top */}
        <Button
          variant="link"
          onClick={handleBack}
          icon={<ArrowLeftIcon />}
          style={{
            color: '#06c',
            fontSize: '14px',
            padding: '4px 8px',
            marginBottom: '24px'
          }}
        >
          Back to login options
        </Button>

        {/* Brief description */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ margin: '0 0 8px 0', color: '#151515', fontSize: '14px' }}>
            Enter your Kubernetes service account token to authenticate with the cluster.
          </p>
          <p style={{ margin: 0, color: '#6a6e73', fontSize: '13px' }}>
            You can find this token in your Kubernetes service account credentials.
          </p>
        </div>

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

        <Alert
          variant="warning"
          isInline
          title="Keep your token secure"
          style={{ marginTop: '20px' }}
        >
          <p style={{ margin: 0 }}>
            Never share your service account token. It provides full access to your Kubernetes cluster resources.
          </p>
        </Alert>
      </ModalBody>

      <ModalFooter>
        <Button
          variant="primary"
          onClick={handleLogin}
          isDisabled={!token.trim() || isLoading}
          isLoading={isLoading}
          style={{ minWidth: '120px' }}
        >
          {isLoading ? 'Authenticating...' : 'Login'}
        </Button>
        <Button variant="link" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TokenLoginModal;