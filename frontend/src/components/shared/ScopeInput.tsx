import React, { useState, KeyboardEvent } from 'react';
import {
  Button,
  TextInput,
  Label,
  Flex,
  FlexItem,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { InfoCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

interface ScopeInputProps {
  scopes: string[];
  onScopesChange: (scopes: string[]) => void;
}

const ScopeInput: React.FC<ScopeInputProps> = ({ scopes, onScopesChange }) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddScope = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setErrorMessage('Scope name cannot be empty');
      return;
    }

    if (scopes.includes(trimmedValue)) {
      setErrorMessage('This scope already exists');
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
    <div style={{ marginBottom: '24px' }}>
      {/* Header with title and info icon */}
      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
        <FlexItem>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#151515' }}>
            Scopes
          </span>
        </FlexItem>
        <FlexItem>
          <InfoCircleIcon style={{ color: '#6a6e73', fontSize: '16px' }} />
        </FlexItem>
      </Flex>

      {/* Description text */}
      <div style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>
        Scopes control what information your app can access. Check your provider's documentation for required scopes.
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

    </div>
  );
};

export default ScopeInput;