import React from 'react';
import {
  PageSidebar,
  PageSidebarBody,
  Nav,
  NavList,
  NavItem,
} from '@patternfly/react-core';

interface AppSidebarProps {
  isSidebarOpen: boolean;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  isSidebarOpen,
  activeItem,
  setActiveItem,
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