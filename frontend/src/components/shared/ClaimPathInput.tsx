import React, { useState, KeyboardEvent } from 'react';
import {
  Button,
  TextInput,
  Label,
  Flex,
  FlexItem,
  HelperText,
  HelperTextItem,
  Popover,
  FormGroup,
} from '@patternfly/react-core';
import { InfoAltIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

interface ClaimPathInputProps {
  claimPathSegments: string[];
  onClaimPathSegmentsChange: (segments: string[]) => void;
  isRequired?: boolean;
  hasError?: boolean;
}

const ClaimPathInput: React.FC<ClaimPathInputProps> = ({
  claimPathSegments,
  onClaimPathSegmentsChange,
  isRequired = false,
  hasError = false
}) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Generate the full claim path from segments
  const fullClaimPath = claimPathSegments.join('.');

  const handleAddSegment = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setErrorMessage('Claim path segment is required. Enter a segment to continue.');
      return;
    }

    // Validate segment format - allow dots, letters, numbers, and underscores
    if (!/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(trimmedValue)) {
      setErrorMessage('Invalid format. Use only letters, numbers, underscores, and dots. Must start with a letter or underscore.');
      return;
    }

    if (claimPathSegments.includes(trimmedValue)) {
      setErrorMessage('Segment already exists. Choose a different name.');
      return;
    }

    // Success case
    onClaimPathSegmentsChange([...claimPathSegments, trimmedValue]);
    setInputValue('');
    setErrorMessage('');
    setIsInputVisible(false);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSegment();
    }
    if (event.key === 'Escape') {
      setInputValue('');
      setIsInputVisible(false);
    }
  };

  const removeSegment = (segmentToRemove: string) => {
    onClaimPathSegmentsChange(claimPathSegments.filter(segment => segment !== segmentToRemove));
  };

  const showAddButton = () => {
    setIsInputVisible(true);
    setErrorMessage('');
  };

  return (
    <div style={{ marginBottom: '8px' }}>
      {/* Header with title and info icon */}
      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }} style={{ marginBottom: '4px' }}>
        <FlexItem>
          <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>
            Username claim{isRequired && <span style={{ color: '#c9190b' }}> *</span>}
          </label>
        </FlexItem>
        <FlexItem>
          <Popover
            triggerAction="hover"
            headerContent="Username Claim Path"
            bodyContent={
              <div>
                <p><strong>How it works:</strong> Navigate to the username field in your authentication token by adding path segments in order.</p>
                <p><strong>Example:</strong> For a token with <code>{`{"custom_claims": {"user_id": "john.doe"}}`}</code>, add "custom_claims" then "user_id" to reach the username.</p>
                <p><strong>Allowed characters:</strong> Letters, numbers, underscores, and dots. Must start with a letter or underscore.</p>
              </div>
            }
            position="right"
          >
            <Button
              variant="plain"
              size="sm"
              icon={<InfoAltIcon style={{ color: '#6a6e73' }} />}
              aria-label="Username claim path help"
            />
          </Popover>
        </FlexItem>
      </Flex>

      {/* Description text */}
      <div style={{ fontSize: '0.875rem', color: '#6a6e73', marginBottom: '8px', lineHeight: '1.5' }}>
        Define where to find the username in your authentication token. Add each part of the path as a separate segment to navigate through nested claim structures.
      </div>

      {/* Add segment section */}
      <div style={{ marginBottom: '8px' }}>
        {!isInputVisible ? (
          <Button
            variant="link"
            onClick={showAddButton}
            style={{
              padding: '0',
              fontSize: '14px',
              textDecoration: 'none',
              color: '#0066cc',
              fontWeight: 'normal'
            }}
          >
            Add path segment
          </Button>
        ) : (
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
            <FlexItem>
              <TextInput
                type="text"
                value={inputValue}
                onChange={(_event, value) => {
                  setInputValue(value);
                  if (errorMessage) setErrorMessage(''); // Clear error when user types
                }}
                onKeyDown={handleKeyPress}
                placeholder="Enter segment name"
                autoFocus
                validated={errorMessage ? 'error' : 'default'}
                style={{ fontSize: '14px', width: '300px' }}
              />
            </FlexItem>
            <FlexItem>
              <Button
                variant="primary"
                onClick={handleAddSegment}
                isDisabled={!inputValue.trim()}
                size="sm"
              >
                Add
              </Button>
            </FlexItem>
          </Flex>
        )}

        {/* Error message */}
        {isInputVisible && errorMessage && (
          <HelperText style={{ marginTop: '4px' }}>
            <HelperTextItem variant="error" icon={<ExclamationCircleIcon />}>
              {errorMessage}
            </HelperTextItem>
          </HelperText>
        )}
      </div>

      {/* Display existing segments */}
      {claimPathSegments.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {claimPathSegments.map((segment, index) => (
              <Label
                key={index}
                color="purple"
                variant="outline"
                onClose={() => removeSegment(segment)}
                style={{
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px 8px'
                }}
              >
                {segment}
              </Label>
            ))}
          </div>

        </div>
      )}

      {/* Full claim path display */}
      {claimPathSegments.length > 0 && (
        <FormGroup fieldId="full-claim-path">
          <TextInput
            type="text"
            id="full-claim-path"
            value={fullClaimPath}
            isReadOnly
            style={{
              backgroundColor: '#f5f5f5',
              fontFamily: 'var(--pf-v6-global--FontFamily--monospace, "Red Hat Mono", monospace)',
              fontSize: '0.875rem'
            }}
          />
          <HelperText>
            <HelperTextItem variant="indeterminate">
              The system will look for the username value at: {fullClaimPath}
            </HelperTextItem>
          </HelperText>
        </FormGroup>
      )}

      {/* Required field error message */}
      {hasError && isRequired && claimPathSegments.length === 0 && (
        <HelperText style={{ marginTop: '4px' }}>
          <HelperTextItem variant="error" icon={<ExclamationCircleIcon />}>
            At least one claim path segment is required
          </HelperTextItem>
        </HelperText>
      )}

    </div>
  );
};

export default ClaimPathInput;