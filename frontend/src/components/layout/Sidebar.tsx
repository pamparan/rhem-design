import React from 'react';
import {
  PageSidebar,
  PageSidebarBody,
  Nav,
  NavList,
  NavItem,
  Badge,
} from '@patternfly/react-core';

interface AppSidebarProps {
  isSidebarOpen: boolean;
  activeItem: string;
  setActiveItem: (item: string) => void;
  pendingDevicesCount?: number;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  isSidebarOpen,
  activeItem,
  setActiveItem,
  pendingDevicesCount = 0,
}) => {
  // Navigation items
  const navigationItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'fleets', label: 'Fleets' },
    { id: 'devices', label: 'Devices' },
    { id: 'repositories', label: 'Repositories' },
    { id: 'settings', label: 'Settings' },
  ];

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const navigation = (
    <Nav>
      <NavList>
        {navigationItems.map((item) => (
          <NavItem
            key={item.id}
            itemId={item.id}
            isActive={activeItem === item.id}
            onClick={() => handleNavClick(item.id)}
          >
            {item.label}
            {item.id === 'devices' && pendingDevicesCount > 0 && (
              <Badge style={{ marginLeft: '8px' }}>
                {pendingDevicesCount}
              </Badge>
            )}
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );

  return (
    <PageSidebar isSidebarOpen={isSidebarOpen}>
      <PageSidebarBody>
        {navigation}
      </PageSidebarBody>
    </PageSidebar>
  );
};

export default AppSidebar;