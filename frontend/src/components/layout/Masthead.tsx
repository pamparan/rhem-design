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

interface AppMastheadProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const AppMasthead: React.FC<AppMastheadProps> = ({
  isSidebarOpen,
  onSidebarToggle,
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
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
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'white' }}>Flight Control</span>
            <img
              src={`${(import.meta as any).env?.BASE_URL || '/'}logo.png`}
              alt="Flight Control Logo"
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
      <MastheadContent style={{ marginLeft: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
      </MastheadContent>
    </Masthead>
  );
};

export default AppMasthead;