import React, { useState } from 'react';
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  Button,
  Flex,
  FlexItem,
  Tooltip,
} from '@patternfly/react-core';
import {
  ExternalLinkAltIcon,
} from '@patternfly/react-icons';

interface SubNavProps {
  activeItem?: string;
  currentView?: 'main' | 'suspended-devices' | 'device-details';
  selectedDeviceDetails?: any;
  onNavigateToMain?: () => void;
  onCopyLoginCommand?: () => void;
}

const SubNav: React.FC<SubNavProps> = ({ onCopyLoginCommand }) => {
  const [isServiceSelectorOpen, setIsServiceSelectorOpen] = useState(false);

  // Simple subnav with organization switch and CLI login button - appears on all pages
  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #d1d5db',
      padding: '8px 24px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      minHeight: '48px'
    }}>
      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
        <FlexItem>
          <Tooltip content="You will be directed to login in order to generate your login token command">
            <Button
              variant="link"
              icon={<ExternalLinkAltIcon />}
              onClick={onCopyLoginCommand}
              style={{
                fontSize: '14px',
                padding: '4px 8px',
                color: '#06c'
              }}
            >
              Get login command
            </Button>
          </Tooltip>
        </FlexItem>

        <FlexItem>
          <Select
            isOpen={isServiceSelectorOpen}
            selected="Charlie Services"
            onSelect={() => setIsServiceSelectorOpen(false)}
            onOpenChange={setIsServiceSelectorOpen}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                variant="secondary"
                style={{ fontSize: '14px' }}
                onClick={() => setIsServiceSelectorOpen(!isServiceSelectorOpen)}
              >
                Charlie Services
              </MenuToggle>
            )}
          >
            <SelectList>
              <SelectOption value="charlie">Charlie Services</SelectOption>
              <SelectOption value="bravo">Bravo Services</SelectOption>
              <SelectOption value="alpha">Alpha Services</SelectOption>
            </SelectList>
          </Select>
        </FlexItem>
      </Flex>
    </div>
  );
};

export default SubNav;