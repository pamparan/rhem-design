import React, { useState } from 'react';
import {
  Masthead,
  MastheadMain,
  MastheadToggle,
  MastheadBrand,
  MastheadContent,
  PageToggleButton,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
} from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons';
import OrganizationSelectorModal from '../shared/OrganizationSelectorModal';

interface AppMastheadProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const AppMasthead: React.FC<AppMastheadProps> = ({
  isSidebarOpen,
  onSidebarToggle,
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState('charlie');

  const organizationNames = {
    'alpha': 'Alpha Corp',
    'bravo': 'Bravo Industries',
    'charlie': 'Charlie Services'
  };

  const handleOrganizationSelect = (orgId: string) => {
    setCurrentOrganization(orgId);
    // Here you would typically refresh the application data
    console.log('Organization switched to:', orgId);
  };

  return (
    // Organization Selector with Change Organization option
    <Masthead style={{ backgroundColor: '#151515' }}>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            variant="plain"
            isHamburgerButton
            aria-label="Global navigation"
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={onSidebarToggle}
            id="nav-toggle"
            style={{
              color: 'white',
              '--pf-v6-c-button--Color': 'white',
              '--pf-v6-c-button--hover--Color': 'white',
              '--pf-v6-c-button--focus--Color': 'white',
              filter: 'invert(1)'
            } as React.CSSProperties}
          />
        </MastheadToggle>
        <MastheadBrand>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'white' }}>RHEM</span>
            <img
              src={`${(import.meta as any).env?.BASE_URL || '/'}logo.png`}
              alt="RHEM Logo"
              style={{ width: '32px', height: '24px', flexShrink: 0 }}
              onError={(e) => {
                // Fallback to simple icon if image doesn't load
                e.currentTarget.style.display = 'none';
                const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextSibling) {
                  nextSibling.style.display = 'block';
                }
              }}
            />
            <div style={{
              width: '32px',
              height: '24px',
              backgroundColor: '#00D4AA',
              display: 'none',
              flexShrink: 0,
              borderRadius: '4px'
            }}></div>
          </div>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          {/* Organization Switcher */}
          <div style={{ marginLeft: '32px' }}>
            <Dropdown
              isOpen={isOrgDropdownOpen}
              onOpenChange={(isOpen: boolean) => setIsOrgDropdownOpen(isOpen)}
              popperProps={{
                placement: 'bottom-start',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 8]
                    }
                  }
                ]
              } as any}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                  variant="plain"
                  isExpanded={isOrgDropdownOpen}
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    border: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{organizationNames[currentOrganization as keyof typeof organizationNames]}</span>
                    <CaretDownIcon size="sm" style={{ color: 'white' }} />
                  </div>
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem
                  key="change-org"
                  onClick={() => {
                    setIsOrgDropdownOpen(false);
                    setIsOrgModalOpen(true);
                  }}
                >
                  Change Organization
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </div>

          {/* User area - pushed to the right */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button variant="plain" style={{ color: 'white', fontSize: '16px', padding: '8px' }}>
              ?
            </Button>
            <span style={{ fontSize: '14px', color: 'white' }}>Demo User</span>
            <Dropdown
              isOpen={isUserDropdownOpen}
              onOpenChange={(isOpen: boolean) => setIsUserDropdownOpen(isOpen)}
              popperProps={{
                placement: 'bottom-end',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [-8, 8]
                    }
                  }
                ]
              } as any}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  variant="plain"
                  isExpanded={isUserDropdownOpen}
                  style={{ padding: '4px' }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    DU
                  </div>
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem value="profile" key="profile">Profile</DropdownItem>
                <DropdownItem value="settings" key="settings">Settings</DropdownItem>
                <DropdownItem value="logout" key="logout">Logout</DropdownItem>
              </DropdownList>
            </Dropdown>
          </div>
        </div>
      </MastheadContent>

      {/* Organization Selector Modal */}
      <OrganizationSelectorModal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
        onOrganizationSelect={handleOrganizationSelect}
        currentOrganization={currentOrganization}
      />
    </Masthead>
  );
};

export default AppMasthead;