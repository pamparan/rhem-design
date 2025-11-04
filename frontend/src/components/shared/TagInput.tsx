import React, { useState, KeyboardEvent } from 'react';
import {
  FormGroup,
  TextInput,
  Flex,
  FlexItem,
  Button,
  Label,
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';

interface TagInputProps {
  label: string;
  fieldId: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  helperText?: string;
  isRequired?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  fieldId,
  tags,
  onTagsChange,
  placeholder,
  helperText,
  isRequired = false,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onTagsChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddClick = () => {
    addTag();
  };

  return (
    <FormGroup
      label={label}
      fieldId={fieldId}
      isRequired={isRequired}
    >
      <div>
        {/* Tags Display */}
        {tags.length > 0 && (
          <div style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {tags.map((tag, index) => (
              <Label
                key={index}
                color="blue"
                onClose={() => removeTag(tag)}
                style={{ cursor: 'pointer' }}
              >
                {tag}
              </Label>
            ))}
          </div>
        )}

        {/* Input Section */}
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem grow={{ default: 'grow' }}>
            <TextInput
              type="text"
              id={fieldId}
              value={inputValue}
              onChange={(_event, value) => setInputValue(value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
            />
          </FlexItem>
          <FlexItem>
            <Button
              variant="link"
              onClick={handleAddClick}
              isDisabled={!inputValue.trim()}
              style={{ padding: '6px 12px' }}
            >
              Add scope
            </Button>
          </FlexItem>
        </Flex>

      </div>

      {helperText && (
        <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
          {helperText}
        </div>
      )}
    </FormGroup>
  );
};

export default TagInput;