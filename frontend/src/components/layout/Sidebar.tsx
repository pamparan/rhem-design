import React from 'react';
import {
  PageSidebar,
  PageSidebarBody,
  Nav,
  NavList,
  NavItem,
  Badge,
} from '@patternfly/react-core';
import { NavigationItemId } from '../../types/app';

interface AppSidebarProps {
  isSidebarOpen: boolean;
  activeItem: NavigationItemId;
  setActiveItem: (item: NavigationItemId) => void;
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
  ];

  const navigation = (
    <Nav>
      <NavList>
        {navigationItems.map((item) => (
          <NavItem
            key={item.id}
            itemId={item.id}
            isActive={activeItem === item.id}
            onClick={() => setActiveItem(item.id as NavigationItemId)}
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