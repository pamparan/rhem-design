import React, { useState } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Alert,
  Text,
  TextContent,
  TextVariants,
  Progress,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import {
  TerminalIcon,
  UserIcon,
  LockIcon,
} from '@patternfly/react-icons';

interface CLILoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

const CLILoginModal: React.FC<CLILoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      // In real implementation, this would come from the authentication API
      const mockToken = `flightctl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate successful authentication
      if (username === 'demo' || username.length > 0) {
        onSuccess(mockToken);
        onClose();
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

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title=""
      isOpen={isOpen}
      onClose={handleClose}
      hasNoBodyWrapper
    >
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
          <FlexItem>
            <TerminalIcon style={{ fontSize: '24px', color: '#06c', marginRight: '12px' }} />
          </FlexItem>
          <FlexItem>
            <TextContent>
              <Text component={TextVariants.h2}>CLI Access Authentication</Text>
            </TextContent>
          </FlexItem>
        </Flex>

        <TextContent style={{ marginBottom: '24px' }}>
          <Text component={TextVariants.p}>
            Please authenticate to generate your CLI login command. This will create a secure token for command-line access.
          </Text>
        </TextContent>

        {/* Loading Progress */}
        {isLoading && (
          <div style={{ marginBottom: '16px' }}>
            <Progress
              variant="primary"
              title="Authenticating..."
              style={{ marginBottom: '8px' }}
            />
            <Text component={TextVariants.small} style={{ color: '#6a6e73' }}>
              Verifying credentials and generating token...
            </Text>
          </div>
        )}

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
            >
              {isLoading ? 'Authenticating...' : 'Generate CLI Token'}
            </Button>
            <Button
              variant="link"
              onClick={handleClose}
              isDisabled={isLoading}
            >
              Cancel
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
    </Modal>
  );
};

export default CLILoginModal;