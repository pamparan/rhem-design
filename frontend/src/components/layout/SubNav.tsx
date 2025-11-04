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
  CogIcon,
} from '@patternfly/react-icons';
import OrganizationSelectorModal from '../shared/OrganizationSelectorModal';

interface SubNavProps {
  activeItem?: string;
  currentView?: 'main' | 'suspended-devices' | 'device-details';
  selectedDeviceDetails?: any;
  onNavigateToMain?: () => void;
  onCopyLoginCommand?: () => void;
  onSystemSettings?: () => void;
}

const SubNav: React.FC<SubNavProps> = ({ onCopyLoginCommand, onSystemSettings }) => {
  const [isServiceSelectorOpen, setIsServiceSelectorOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState('charlie');

  const organizationNames = {
    'alpha': 'Alpha Corp',
    'bravo': 'Bravo Industries',
    'charlie': 'Charlie Services'
  };

  const handleOrganizationSelect = (orgId: string) => {
    setCurrentOrganization(orgId);
    console.log('Organization switched to:', orgId);
  };

  // Simple subnav with organization switch and CLI login button - appears on all pages
  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #d1d5db',
      padding: '8px 24px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      minHeight: '48px',
      position: 'sticky',
      top: 0,
      zIndex: 1000
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
            selected={organizationNames[currentOrganization as keyof typeof organizationNames]}
            onSelect={(event, value) => {
              setIsServiceSelectorOpen(false);
              if (value === 'change-org') {
                setIsOrgModalOpen(true);
              }
            }}
            onOpenChange={setIsServiceSelectorOpen}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                variant="secondary"
                style={{ fontSize: '14px' }}
                onClick={() => setIsServiceSelectorOpen(!isServiceSelectorOpen)}
              >
                {organizationNames[currentOrganization as keyof typeof organizationNames]}
              </MenuToggle>
            )}
          >
            <SelectList>
              <SelectOption value="change-org">Change Organization</SelectOption>
            </SelectList>
          </Select>
        </FlexItem>

        <FlexItem style={{ marginLeft: 'auto' }}>
          <Tooltip content="Manage authentication providers and system configuration">
            <Button
              variant="plain"
              icon={<CogIcon />}
              onClick={onSystemSettings}
              style={{
                fontSize: '16px',
                padding: '8px',
                color: '#06c'
              }}
            />
          </Tooltip>
        </FlexItem>

      </Flex>

      {/* Organization Selector Modal */}
      <OrganizationSelectorModal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
        onOrganizationSelect={handleOrganizationSelect}
        currentOrganization={currentOrganization}
      />
    </div>
  );
};

export default SubNav;