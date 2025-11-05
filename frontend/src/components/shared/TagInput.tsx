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
  addButtonText?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  fieldId,
  tags,
  onTagsChange,
  placeholder,
  helperText,
  isRequired = false,
  addButtonText = "Add scope",
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
        {/* Input Section */}
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '12px' }}>
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
              style={{ padding: '6px 12px', fontSize: '14px', textDecoration: 'none' }}
            >
              {addButtonText}
            </Button>
          </FlexItem>
        </Flex>

        {/* Tags Display */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            {tags.map((tag, index) => (
              <Label
                key={index}
                color="blue"
                variant="outline"
                onClose={() => removeTag(tag)}
                style={{
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px 8px'
                }}
              >
                {tag}
              </Label>
            ))}
          </div>
        )}

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