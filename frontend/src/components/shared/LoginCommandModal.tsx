import React, { useState } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import {
  CopyIcon,
  CheckIcon,
} from '@patternfly/react-icons';

interface LoginCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

const LoginCommandModal: React.FC<LoginCommandModalProps> = ({
  isOpen,
  onClose,
  token,
}) => {
  const [copied, setCopied] = useState(false);

  const loginCommand = `flightctl login https://flightctl-api.example.com -t ${token} -k`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(loginCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      title=""
      isOpen={isOpen}
      onClose={onClose}
      hasNoBodyWrapper
    >
      <div style={{ padding: '24px' }}>
        <TextContent style={{ marginBottom: '24px' }}>
          <Text component={TextVariants.h2}>CLI Login Command</Text>
          <Text component={TextVariants.p}>
            Copy the command below to authenticate with FlightCtl CLI. This token provides secure access to your account.
          </Text>
        </TextContent>

        {/* Code Block - matching the style from the image */}
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '20px',
          fontFamily: '"Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace',
          fontSize: '13px',
          lineHeight: '1.6',
          marginBottom: '16px',
          wordBreak: 'break-all',
          position: 'relative',
          color: '#24292e',
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          <div style={{ marginBottom: '8px', color: '#6a737d', fontSize: '12px' }}>
            # FlightCtl CLI Login Command
          </div>
          <div style={{ color: '#032f62' }}>
            {loginCommand}
          </div>
        </div>

        {/* Additional Context */}
        <div style={{
          backgroundColor: '#f0f8ff',
          border: '1px solid #b6d7ff',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          <Text component={TextVariants.small}>
            <strong>Instructions:</strong> Copy this command and run it in your terminal to authenticate with the FlightCtl CLI. Keep this token secure and do not share it.
          </Text>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="primary"
            icon={copied ? <CheckIcon /> : <CopyIcon />}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy Command'}
          </Button>
          <Button variant="link" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginCommandModal;