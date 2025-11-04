import React from 'react';
import {
  Nav,
  NavList,
  NavItem
} from '@patternfly/react-core';
import {
  CogIcon,
  ShieldAltIcon,
  UsersIcon,
  UserIcon
} from '@patternfly/react-icons';

export type SettingsSection =
  | 'general'
  | 'authentication'
  | 'members'
  | 'user-roles';

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
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
    {
      id: 'members' as SettingsSection,
      label: 'Members',
      icon: <UsersIcon />
    },
    {
      id: 'user-roles' as SettingsSection,
      label: 'User roles',
      icon: <UserIcon />
    }
  ];

  return (
    <div
      style={{
        position: 'sticky',
        top: '80px', // Reduced from 112px for tighter spacing
        alignSelf: 'flex-start',
        zIndex: 999
      }}
    >
      <Nav
        onSelect={(_event, result) => {
          if (result.itemId) {
            onSectionChange(result.itemId as SettingsSection);
          }
        }}
        aria-label="Settings navigation"
      >
        <NavList>
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              itemId={item.id}
              isActive={activeSection === item.id}
              icon={item.icon}
            >
              {item.label}
            </NavItem>
          ))}
        </NavList>
      </Nav>
    </div>
  );
};

export default SettingsSidebar;