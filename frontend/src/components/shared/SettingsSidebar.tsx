import React, { useState } from 'react';
import {
  Nav,
  NavList,
  NavItem,
  Button
} from '@patternfly/react-core';
import {
  CogIcon,
  ShieldAltIcon,
  UsersIcon,
  UserIcon,
  PanelOpenIcon,
  PanelCloseIcon
} from '@patternfly/react-icons';

export type SettingsSection =
  | 'general'
  | 'authentication'
  | 'members'
  | 'user-roles';

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSectionChange,
  onCollapseChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigationItems = [
    {
      id: 'general' as SettingsSection,
      label: 'General',
      icon: <CogIcon />
    },
    {
      id: 'authentication' as SettingsSection,
      label: 'Authentication & security',
      icon: <ShieldAltIcon />
    },
    // TODO: Uncomment these when ready to implement Members and User roles features
    // {
    //   id: 'members' as SettingsSection,
    //   label: 'Members',
    //   icon: <UsersIcon />
    // },
    // {
    //   id: 'user-roles' as SettingsSection,
    //   label: 'User roles',
    //   icon: <UserIcon />
    // }
  ];

  return (
    <div
      className={`settings-sidebar-container ${isCollapsed ? 'settings-sidebar-collapsed' : ''}`}
      style={{
        height: '100%',
        minHeight: 'calc(100vh - 120px)', // Full height minus top navigation
        backgroundColor: '#f8f9fa', // Light gray background
        paddingLeft: '16px',
        paddingRight: isCollapsed ? '16px' : '24px', // Adjust padding when collapsed
        boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)', // Light shadow on the right side
        width: isCollapsed ? '60px' : '250px', // Collapsed vs expanded width
        transition: 'width 0.3s ease, padding-right 0.3s ease', // Smooth transition
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: '16px', // Much reduced sticky positioning
          zIndex: 999,
          paddingTop: '4px' // Minimal top padding
        }}
      >
        {/* Toggle Button - consistent positioning */}
        <div className="toggle-button-container">
          <Button
            variant="plain"
            onClick={() => {
              const newCollapsedState = !isCollapsed;
              setIsCollapsed(newCollapsedState);
              onCollapseChange?.(newCollapsedState);
            }}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelOpenIcon /> : <PanelCloseIcon />}
          </Button>
        </div>
        <div className="nav-container">
          <Nav
            onSelect={(_event, result) => {
              if (result.itemId) {
                onSectionChange(result.itemId as SettingsSection);
              }
            }}
            aria-label="Settings navigation"
            style={{
              ...(isCollapsed && {
                paddingLeft: '0',
                paddingRight: '0',
                textAlign: 'center'
              })
            }}
          >
            <NavList>
              {navigationItems.map((item) => (
                <NavItem
                  key={item.id}
                  itemId={item.id}
                  isActive={activeSection === item.id}
                  icon={item.icon}
                >
                  {!isCollapsed && item.label}
                </NavItem>
              ))}
            </NavList>
          </Nav>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;