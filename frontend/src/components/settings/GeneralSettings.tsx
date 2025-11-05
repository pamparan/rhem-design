import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Form,
  FormGroup,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Stack,
  StackItem
} from '@patternfly/react-core';

const GeneralSettings: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState('System default');
  const [isThemeSelectOpen, setIsThemeSelectOpen] = useState(false);

  const themeOptions = [
    { value: 'System default', label: 'System default' },
    { value: 'Light', label: 'Light' },
    { value: 'Dark', label: 'Dark' }
  ];

  const onThemeSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelectedTheme(value as string);
    setIsThemeSelectOpen(false);
  };


  return (
    <PageSection style={{ height: 'fit-content' }}>
      {/* Header section to match Authentication & Security style */}
      <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
        <Title headingLevel="h1" size="2xl">
          General Settings
        </Title>
        <p style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
          Customize your user experience and interface preferences.
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardBody>
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size="lg">
                Theme
              </Title>
              <p style={{ marginTop: '8px', color: '#6a6e73', fontSize: '0.875rem' }}>
                Choose how Flight Control appears to you. Select a single theme, or sync with your system and automatically switch between day and night themes.
              </p>
            </StackItem>

            <StackItem>
              <Form>
                <FormGroup fieldId="theme-select">
                  <Select
                    id="theme-select"
                    isOpen={isThemeSelectOpen}
                    selected={selectedTheme}
                    onSelect={onThemeSelect}
                    onOpenChange={(isOpen) => setIsThemeSelectOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsThemeSelectOpen(!isThemeSelectOpen)}
                        isExpanded={isThemeSelectOpen}
                        style={{ width: '200px' }}
                      >
                        {selectedTheme}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      {themeOptions.map((option) => (
                        <SelectOption key={option.value} value={option.value}>
                          {option.label}
                        </SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                </FormGroup>

              </Form>
            </StackItem>
          </Stack>
        </CardBody>
      </Card>
    </PageSection>
  );
};

export default GeneralSettings;