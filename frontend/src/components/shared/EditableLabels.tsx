import React, { useState } from 'react';
import {
  Button,
  TextInput,
  Label,
  LabelGroup,
} from '@patternfly/react-core';

interface EditableLabelsProps {
  value: string[];
  onChange: (labels: string[]) => void;
  isDisabled?: boolean;
}

const EditableLabels: React.FC<EditableLabelsProps> = ({
  value,
  onChange,
  isDisabled = false,
}) => {
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  const handleAddLabel = (text: string) => {
    if (!text) {
      return;
    }
    onChange([...value, text]);
    setNewLabel('');
    setIsAddingLabel(false);
  };

  const handleRemoveLabel = (index: number) => {
    const newLabels = [...value];
    newLabels.splice(index, 1);
    onChange(newLabels);
  };

  const handleEditLabel = (index: number, newText: string) => {
    const newLabels = [...value];
    newLabels[index] = newText;
    onChange(newLabels);
  };

  return (
    <LabelGroup
      numLabels={5}
      isEditable={!isDisabled}
      addLabelControl={
        isAddingLabel ? (
          <TextInput
            aria-label="New label"
            autoFocus
            value={newLabel}
            onChange={(_event, val) => setNewLabel(val)}
            onBlur={() => {
              handleAddLabel(newLabel);
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddLabel(newLabel);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setNewLabel('');
                setIsAddingLabel(false);
              }
            }}
          />
        ) : (
          <Button
            variant="link"
            isInline
            isDisabled={isDisabled}
            onClick={() => {
              setIsAddingLabel(true);
              setNewLabel('key=value');
            }}
          >
            Add label
          </Button>
        )
      }
    >
      {value.map((label, index) => (
        <Label
          key={`${label}-${index}`}
          variant="outline"
          onClose={() => handleRemoveLabel(index)}
          onEditCancel={(_, prevText) => handleEditLabel(index, prevText)}
          onEditComplete={(_, newText) => handleEditLabel(index, newText)}
          isEditable={!isDisabled}
        >
          {label}
        </Label>
      ))}
    </LabelGroup>
  );
};

export default EditableLabels;

