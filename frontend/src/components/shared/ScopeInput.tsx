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
} from '@patternfly/react-core';
import { InfoAltIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

interface ScopeInputProps {
  scopes: string[];
  onScopesChange: (scopes: string[]) => void;
  isRequired?: boolean;
  hasError?: boolean;
}

const ScopeInput: React.FC<ScopeInputProps> = ({ scopes, onScopesChange, isRequired = false, hasError = false }) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddScope = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setErrorMessage('Scope name is required. Enter a scope to continue.');
      return;
    }

    if (scopes.includes(trimmedValue)) {
      setErrorMessage('Scope already exists. Choose a different name.');
      return;
    }

    // Success case
    onScopesChange([...scopes, trimmedValue]);
    setInputValue('');
    setErrorMessage('');
    setIsInputVisible(false);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddScope();
    }
    if (event.key === 'Escape') {
      setInputValue('');
      setIsInputVisible(false);
    }
  };

  const removeScope = (scopeToRemove: string) => {
    onScopesChange(scopes.filter(scope => scope !== scopeToRemove));
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
            Scopes{isRequired && <span style={{ color: '#c9190b' }}> *</span>}
          </label>
        </FlexItem>
        <FlexItem>
          <Popover
            triggerAction="hover"
            headerContent="Authentication Scopes"
            bodyContent={
              <div>
                <p><strong>Purpose:</strong> Scopes define the permissions your application requests from the provider.</p>
                <p><strong>Configuration:</strong> Check your provider's documentation for required scopes.</p>
                <p><strong>Common examples:</strong> openid, profile, email, groups</p>
              </div>
            }
            position="right"
          >
            <Button
              variant="plain"
              size="sm"
              icon={<InfoAltIcon style={{ color: '#6a6e73' }} />}
              aria-label="Scopes help"
            />
          </Popover>
        </FlexItem>
      </Flex>

      {/* Description text */}
      <div style={{ fontSize: '0.875rem', color: '#6a6e73', marginBottom: '8px', lineHeight: '1.5' }}>
        Add scopes required to access username and role claims from your authentication provider.
      </div>

      {/* Add scope section */}
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
            Add scope
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
                placeholder="Enter scope name"
                autoFocus
                validated={errorMessage ? 'error' : 'default'}
                style={{ fontSize: '14px', width: '300px' }}
              />
            </FlexItem>
            <FlexItem>
              <Button
                variant="primary"
                onClick={handleAddScope}
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

      {/* Display existing scopes */}
      {scopes.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          {scopes.map((scope, index) => (
            <Label
              key={index}
              color="blue"
              variant="outline"
              onClose={() => removeScope(scope)}
              style={{
                cursor: 'pointer',
                fontSize: '14px',
                padding: '4px 8px'
              }}
            >
              {scope}
            </Label>
          ))}
        </div>
      )}

      {/* Required field error message */}
      {hasError && isRequired && scopes.length === 0 && (
        <HelperText style={{ marginTop: '4px' }}>
          <HelperTextItem variant="error" icon={<ExclamationCircleIcon />}>
            At least one scope is required
          </HelperTextItem>
        </HelperText>
      )}

    </div>
  );
};

export default ScopeInput;