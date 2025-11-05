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
  CardBody,
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
  Alert,
  Flex,
  FlexItem
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import { EllipsisVIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';

/**
 * Wireframe Component: Provider Management List View
 *
 * Purpose: Show the admin the state of all authentication providers
 *
 * Features:
 * - Page title: "Authentication Providers"
 * - "Add Authentication Provider" button (primary action)
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
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  usernameClaim?: string;
  roleClaim?: string;
  organizationAssignment?: string;
  externalOrganizationName?: string;
}

interface ProviderManagementWireframeProps {
  onAddProvider?: () => void;
  onViewDetails?: (providerId: string) => void;
  onEditProvider?: (providerId: string, providerData?: IdentityProvider) => void;
}

const ProviderManagementWireframe: React.FC<ProviderManagementWireframeProps> = ({ onAddProvider, onViewDetails, onEditProvider }) => {
  const [providers, setProviders] = useState<IdentityProvider[]>([
    {
      id: 'aap',
      name: 'Enterprise Platform',
      type: 'Ansible Automation Platform',
      issuerUrl: 'https://aap.example.com/api/gateway/v1/social/',
      status: true,
      isBuiltIn: false,
      clientId: 'aap-client-12345',
      clientSecret: 'aap-secret-67890',
      scopes: ['read', 'write'],
      usernameClaim: 'preferred_username',
      roleClaim: 'groups',
      organizationAssignment: 'Dynamic',
      externalOrganizationName: ''
    },
    {
      id: 'google',
      name: 'Google',
      type: 'OIDC',
      issuerUrl: 'https://accounts.google.com',
      status: true,
      isBuiltIn: false,
      clientId: 'google-client-id-example',
      clientSecret: 'google-secret-example',
      scopes: ['openid', 'profile', 'email'],
      usernameClaim: 'email',
      roleClaim: 'groups',
      organizationAssignment: 'Static',
      externalOrganizationName: 'Google Users'
    },
    {
      id: 'okta',
      name: 'Customer-B Okta',
      type: 'OIDC',
      issuerUrl: 'https://customer-b.okta.com/oauth2/default',
      status: false,
      isBuiltIn: false,
      clientId: 'okta-client-abc123',
      clientSecret: 'okta-secret-def456',
      scopes: ['openid', 'profile'],
      usernameClaim: 'preferred_username',
      roleClaim: 'groups',
      organizationAssignment: 'Per user',
      externalOrganizationName: ''
    },
    {
      id: 'kubernetes',
      name: 'K8s Cluster Auth',
      type: 'Kubernetes',
      issuerUrl: 'https://k8s.cluster.local:6443',
      status: true,
      isBuiltIn: false,
      clientId: 'k8s-client-xyz789',
      clientSecret: 'k8s-secret-uvw123',
      scopes: ['openid'],
      usernameClaim: 'sub',
      roleClaim: 'groups',
      organizationAssignment: 'Static',
      externalOrganizationName: 'Kubernetes Cluster'
    },
  ]);

  const [actionDropdownOpen, setActionDropdownOpen] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProviderForDelete, setSelectedProviderForDelete] = useState<IdentityProvider | null>(null);
  const [confirmationText, setConfirmationText] = useState('');


  const handleAddProvider = () => {
    console.log('Navigate to add provider form');
    // Implementation would navigate to the create form
    onAddProvider?.();
  };

  const handleViewDetails = (providerId: string) => {
    console.log(`View details for provider: ${providerId}`);
    onViewDetails?.(providerId);
  };

  const handleEditProvider = (providerId: string) => {
    console.log(`Edit provider: ${providerId}`);
    const providerData = providers.find(provider => provider.id === providerId);
    onEditProvider?.(providerId, providerData);
  };

  const handleDeleteProvider = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (provider) {
      setSelectedProviderForDelete(provider);
      setDeleteModalOpen(true);
      setConfirmationText('');
    }
  };

  const confirmDelete = () => {
    if (selectedProviderForDelete && confirmationText === selectedProviderForDelete.name) {
      console.log(`Deleting provider: ${selectedProviderForDelete.id}`);
      setProviders(prev => prev.filter(provider => provider.id !== selectedProviderForDelete.id));
      setDeleteModalOpen(false);
      setSelectedProviderForDelete(null);
      setConfirmationText('');
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectedProviderForDelete(null);
    setConfirmationText('');
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
    <>
    <Stack hasGutter>
      {/* Page Header */}
      <StackItem>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Title headingLevel="h2" size="lg">
                Authentication Providers
              </Title>
            </ToolbarItem>
            <ToolbarItem variant="separator" />
            <ToolbarItem>
              <Button variant="primary" onClick={handleAddProvider}>
                Add Authentication Provider
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
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {providers.map((provider) => (
                  <Tr key={provider.id}>
                    <Td>
                      <Button
                        variant="link"
                        onClick={() => handleViewDetails(provider.id)}
                        style={{
                          padding: 0,
                          textAlign: 'left',
                          fontWeight: 'bold',
                          fontSize: 'inherit'
                        }}
                      >
                        {provider.name}
                      </Button>
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
                              key="view-details"
                              onClick={() => handleViewDetails(provider.id)}
                            >
                              View details
                            </DropdownItem>
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

    {/* Delete Confirmation Modal */}
    <Modal
      variant={ModalVariant.medium}
      isOpen={deleteModalOpen}
      onClose={cancelDelete}
      aria-label="Delete Authentication Provider confirmation modal"
    >
      <ModalHeader
        title="Delete Authentication Provider"
        titleIconVariant="warning"
      />
      <ModalBody tabIndex={0} style={{ padding: '1.5rem' }}>
        <Stack hasGutter spaceItems={{ default: 'spaceItemsLg' }}>
          <StackItem>
            <p style={{ fontSize: '16px', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
              This will permanently delete the authentication provider "{selectedProviderForDelete?.name}" and remove all associated configurations.
            </p>
          </StackItem>

          <StackItem>
            <Alert
              variant="warning"
              isInline
              title="Users who currently authenticate through this provider will lose access until alternative authentication is configured."
            />
          </StackItem>

          <StackItem style={{ marginTop: '1.5rem' }}>
            <p style={{ marginBottom: '0.75rem' }}>
              Type <strong>{selectedProviderForDelete?.name}</strong> to confirm deletion:
            </p>
            <TextInput
              value={confirmationText}
              onChange={(_event, value) => setConfirmationText(value)}
              placeholder={`Type "${selectedProviderForDelete?.name}" to confirm`}
              aria-label="Confirmation text"
            />
          </StackItem>

        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button
          key="delete"
          variant="danger"
          onClick={confirmDelete}
          isDisabled={confirmationText !== selectedProviderForDelete?.name}
        >
          Delete Authentication Provider
        </Button>
        <Button key="cancel" variant="link" onClick={cancelDelete}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
    </>
  );
};

export default ProviderManagementWireframe;