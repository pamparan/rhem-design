import React, { useState } from 'react';
import {
  Title,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
  Label,
  Stack,
  StackItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Card,
  CardBody
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import { EllipsisVIcon } from '@patternfly/react-icons';

/**
 * Wireframe Component: Provider Management List View
 *
 * Purpose: Show the admin the state of all authentication providers
 *
 * Features:
 * - Page title: "Identity Providers"
 * - "Add Identity Provider" button (primary action)
 * - Table with provider details and controls
 * - Enable/disable toggle switches
 * - Edit/Delete actions for dynamic providers
 */

interface IdentityProvider {
  id: string;
  name: string;
  type: string;
  issuerUrl: string;
  status: boolean; // enabled/disabled
  isBuiltIn: boolean; // cannot be deleted if true
}

interface ProviderManagementWireframeProps {
  onAddProvider?: () => void;
}

const ProviderManagementWireframe: React.FC<ProviderManagementWireframeProps> = ({ onAddProvider }) => {
  const [providers, setProviders] = useState<IdentityProvider[]>([
    { id: 'internal', name: 'Internal', type: 'Internal OIDC', issuerUrl: 'https://flightcontrol.internal/auth', status: true, isBuiltIn: true },
    { id: 'aap', name: 'AAP', type: 'Ansible Automation Platform', issuerUrl: 'https://aap.example.com/api/gateway/v1/social/', status: true, isBuiltIn: false },
    { id: 'google', name: 'Google', type: 'OIDC', issuerUrl: 'https://accounts.google.com', status: true, isBuiltIn: false },
    { id: 'okta', name: 'Customer-B Okta', type: 'OIDC', issuerUrl: 'https://customer-b.okta.com/oauth2/default', status: false, isBuiltIn: false },
    { id: 'kubernetes', name: 'K8s Cluster Auth', type: 'Kubernetes', issuerUrl: 'https://k8s.cluster.local:6443', status: true, isBuiltIn: false },
  ]);

  const [actionDropdownOpen, setActionDropdownOpen] = useState<string | null>(null);


  const handleAddProvider = () => {
    console.log('Navigate to add provider form');
    // Implementation would navigate to the create form
    onAddProvider?.();
  };

  const handleEditProvider = (providerId: string) => {
    console.log(`Edit provider: ${providerId}`);
    // Implementation would navigate to edit form
  };

  const handleDeleteProvider = (providerId: string) => {
    console.log(`Delete provider: ${providerId}`);
    // Implementation would show confirmation dialog
    setProviders(prev => prev.filter(provider => provider.id !== providerId));
  };

  const toggleActionDropdown = (providerId: string) => {
    setActionDropdownOpen(actionDropdownOpen === providerId ? null : providerId);
  };

  const getStatusLabel = (enabled: boolean) => (
    <Label color={enabled ? 'green' : 'grey'}>
      {enabled ? 'Enabled' : 'Disabled'}
    </Label>
  );

  return (
    <Stack hasGutter>
      {/* Page Header */}
      <StackItem>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Title headingLevel="h2" size="xl">
                Identity Providers
              </Title>
            </ToolbarItem>
            <ToolbarItem variant="separator" />
            <ToolbarItem>
              <Button variant="primary" onClick={handleAddProvider}>
                Add Identity Provider
              </Button>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </StackItem>

      {/* Providers Table */}
      <StackItem>
        <Card>
          <CardBody>
            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Type</Th>
                  <Th>Issuer URL</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {providers.map((provider) => (
                  <Tr key={provider.id}>
                    <Td>
                      <strong>{provider.name}</strong>
                      {provider.isBuiltIn && (
                        <Label
                          variant="outline"
                          color="blue"
                          style={{ marginLeft: '8px' }}
                        >
                          Built-in
                        </Label>
                      )}
                    </Td>
                    <Td>{provider.type}</Td>
                    <Td>
                      <span style={{ fontSize: '0.875rem', color: '#666' }}>
                        {provider.issuerUrl}
                      </span>
                    </Td>
                    <Td>{getStatusLabel(provider.status)}</Td>
                    <Td>
                      {!provider.isBuiltIn ? (
                        <Dropdown
                          isOpen={actionDropdownOpen === provider.id}
                          onSelect={() => setActionDropdownOpen(null)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              variant="plain"
                              onClick={() => toggleActionDropdown(provider.id)}
                              isExpanded={actionDropdownOpen === provider.id}
                              aria-label={`Actions for ${provider.name}`}
                            >
                              <EllipsisVIcon />
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem
                              key="edit"
                              onClick={() => handleEditProvider(provider.id)}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              onClick={() => handleDeleteProvider(provider.id)}
                            >
                              Delete
                            </DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      ) : (
                        <span style={{ color: '#666', fontSize: '0.875rem' }}>
                          Built-in
                        </span>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </StackItem>

    </Stack>
  );
};

export default ProviderManagementWireframe;