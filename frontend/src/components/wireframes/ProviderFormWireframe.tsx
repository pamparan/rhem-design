import React, { useState } from 'react';
import {
  Title,
  Button,
  Form,
  FormGroup,
  TextInput,
  Switch,
  Radio,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Card,
  CardBody,
  Stack,
  StackItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ActionGroup,
  Alert,
  Divider,
  HelperText,
  HelperTextItem,
  Breadcrumb,
  BreadcrumbItem,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Popover
} from '@patternfly/react-core';
import {
  HelpIcon,
} from '@patternfly/react-icons';
import TagInput from '../shared/TagInput';

/**
 * Wireframe Component: Provider Create/Edit Form
 *
 * Purpose: Capture all configuration details for a new OIDC provider
 *
 * Features:
 * - Enabled toggle switch
 * - Provider details (display name, issuer URL, client credentials)
 * - Claim mapping configuration
 * - Organization assignment options (Static, Dynamic, Per-User)
 * - Save/Cancel/Test Connection actions
 */

type OrganizationAssignmentType = 'static' | 'dynamic' | 'perUser';

interface ProviderFormData {
  enabled: boolean;
  name: string;
  type: string;
  issuerUrl: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
  usernameClaim: string;
  roleClaim: string;
  organizationAssignment: string;
  externalOrganizationName: string;
}

interface ProviderFormWireframeProps {
  onCancel?: () => void;
  onSave?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToAuth?: () => void;
}

const ProviderFormWireframe: React.FC<ProviderFormWireframeProps> = ({ onCancel, onSave, onNavigateToSettings, onNavigateToAuth }) => {
  const [formData, setFormData] = useState<ProviderFormData>({
    enabled: false,
    name: '',
    type: 'OIDC',
    issuerUrl: '',
    clientId: '',
    clientSecret: '',
    scopes: [],
    usernameClaim: 'preferred_username',
    roleClaim: 'groups',
    organizationAssignment: 'Static',
    externalOrganizationName: ''
  });

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [testConnectionStatus, setTestConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Sample organizations for dropdown
  const organizations = ['Default Organization', 'Engineering Team', 'Sales Team', 'Marketing Team'];

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving provider configuration:', formData);
    // Implementation would validate and save the configuration
    onSave?.();
  };

  const handleCancel = () => {
    console.log('Cancelling provider configuration');
    // Implementation would navigate back to the list view
    onCancel?.();
  };

  const handleTestConnection = async () => {
    setTestConnectionStatus('testing');
    // Simulate test connection
    setTimeout(() => {
      setTestConnectionStatus(Math.random() > 0.3 ? 'success' : 'error');
    }, 2000);
  };

  const getTestConnectionVariant = () => {
    switch (testConnectionStatus) {
      case 'success': return 'primary';
      case 'error': return 'danger';
      default: return 'secondary';
    }
  };

  const getTestConnectionText = () => {
    switch (testConnectionStatus) {
      case 'testing': return 'Testing...';
      case 'success': return 'Connection Successful';
      case 'error': return 'Connection Failed';
      default: return 'Test Connection';
    }
  };

  return (
    <Stack hasGutter>
      {/* Breadcrumb Navigation */}
      <StackItem>
        <Breadcrumb>
          <BreadcrumbItem
            to="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigateToSettings?.();
            }}
          >
            Settings
          </BreadcrumbItem>
          <BreadcrumbItem
            to="#"
            onClick={(e) => {
              e.preventDefault();
              onCancel?.();
            }}
          >
            Authentication & Security
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Add OIDC Provider</BreadcrumbItem>
        </Breadcrumb>
      </StackItem>

      {/* Page Header */}
      <StackItem>
        <Title headingLevel="h1" size="2xl">
          Add OIDC Provider
        </Title>
        <p style={{ marginTop: '8px', color: '#6a6e73' }}>
          Configure an authentication provider for user login and organization assignment.
        </p>
      </StackItem>

      {/* Fill form quickly button */}
      <StackItem>
        <Button
          variant="primary"
          onClick={() => {
            // Auto-fill the form with demo data
            setFormData({
              ...formData,
              name: 'OIDC Provider',
              type: 'OIDC',
              enabled: true,
              issuerUrl: 'https://example.com/auth/realms/demo',
              clientId: 'demo-client-id',
              clientSecret: 'demo-client-secret',
              scopes: ['a', 'd'],
              usernameClaim: 'preferred_username',
              roleClaim: 'groups',
              organizationAssignment: 'Static',
              externalOrganizationName: 'Demo Organization'
            });
          }}
        >
          Fill form quickly
        </Button>
      </StackItem>

      {/* Main Form */}
      <StackItem>
        <Form>
              {/* Enabled Switch */}
              <FormGroup label="Enabled" fieldId="provider-enabled">
                <Switch
                  id="provider-enabled"
                  isChecked={formData.enabled}
                  onChange={(_event, checked) => handleInputChange('enabled', checked)}
                />
              </FormGroup>

              {/* Provider Name */}
              <FormGroup label="Provider name" isRequired fieldId="provider-name">
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem grow={{ default: 'grow' }}>
                    <TextInput
                      isRequired
                      type="text"
                      id="provider-name"
                      value={formData.name}
                      onChange={(_event, value) => handleInputChange('name', value)}
                      placeholder=""
                    />
                  </FlexItem>
                  <FlexItem>
                    <Popover
                      bodyContent="Enter a descriptive name for this authentication provider"
                      position="right"
                    >
                      <Button variant="plain" aria-label="Provider name help">
                        <HelpIcon />
                      </Button>
                    </Popover>
                  </FlexItem>
                </Flex>
              </FormGroup>

              {/* Provider Type Radio Buttons */}
              <FormGroup fieldId="provider-type">
                <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                  <FlexItem>
                    <Radio
                      isChecked={formData.type === 'OIDC'}
                      name="provider-type"
                      onChange={() => handleInputChange('type', 'OIDC')}
                      label="OIDC"
                      id="radio-oidc"
                    />
                  </FlexItem>
                  <FlexItem>
                    <Radio
                      isChecked={formData.type === 'OAuth2'}
                      name="provider-type"
                      onChange={() => handleInputChange('type', 'OAuth2')}
                      label="OAuth2"
                      id="radio-oauth2"
                    />
                  </FlexItem>
                </Flex>
                <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '8px' }}>
                  Choose OIDC for modern OAuth 2.0 / OpenID Connect providers like Google, Microsoft, or Okta. Choose SAML for enterprise identity providers.
                </div>
              </FormGroup>

              {/* Issuer URL */}
              <FormGroup label="Issuer URL" isRequired fieldId="issuer-url">
                <TextInput
                  isRequired
                  type="url"
                  id="issuer-url"
                  value={formData.issuerUrl}
                  onChange={(_event, value) => handleInputChange('issuerUrl', value)}
                  placeholder=""
                />
                <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                  The OIDC issuer URL
                </div>
              </FormGroup>

              {/* Client ID */}
              <FormGroup label="Client ID" isRequired fieldId="client-id">
                <TextInput
                  isRequired
                  type="text"
                  id="client-id"
                  value={formData.clientId}
                  onChange={(_event, value) => handleInputChange('clientId', value)}
                  placeholder=""
                />
              </FormGroup>

              {/* Client Secret */}
              <FormGroup label="Client secret" isRequired fieldId="client-secret">
                <TextInput
                  isRequired
                  type="password"
                  id="client-secret"
                  value={formData.clientSecret}
                  onChange={(_event, value) => handleInputChange('clientSecret', value)}
                  placeholder=""
                />
              </FormGroup>

              {/* Scopes with Tag Input */}
              <TagInput
                label="Scopes"
                fieldId="scopes"
                tags={formData.scopes}
                onTagsChange={(tags) => handleInputChange('scopes', tags)}
                placeholder=""
                helperText="All scopes necessary to retrieve the claims below"
              />

              {/* Username Claim */}
              <FormGroup label="Username claim" fieldId="username-claim">
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem grow={{ default: 'grow' }}>
                    <TextInput
                      type="text"
                      id="username-claim"
                      value={formData.usernameClaim}
                      onChange={(_event, value) => handleInputChange('usernameClaim', value)}
                      placeholder="preferred_username"
                    />
                  </FlexItem>
                  <FlexItem>
                    <Popover
                      bodyContent="The claim that contains the username"
                      position="right"
                    >
                      <Button variant="plain" aria-label="Username claim help">
                        <HelpIcon />
                      </Button>
                    </Popover>
                  </FlexItem>
                </Flex>
              </FormGroup>

              {/* Role Claim */}
              <FormGroup label="Role claim" fieldId="role-claim">
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem grow={{ default: 'grow' }}>
                    <TextInput
                      type="text"
                      id="role-claim"
                      value={formData.roleClaim}
                      onChange={(_event, value) => handleInputChange('roleClaim', value)}
                      placeholder="groups"
                    />
                  </FlexItem>
                  <FlexItem>
                    <Popover
                      bodyContent="The claim that contains user roles"
                      position="right"
                    >
                      <Button variant="plain" aria-label="Role claim help">
                        <HelpIcon />
                      </Button>
                    </Popover>
                  </FlexItem>
                </Flex>
                <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '8px' }}>
                  Specify which claims from the provider contain user information. Most providers use "email" for both username and email claims.
                </div>
              </FormGroup>

              <Divider style={{ margin: '24px 0' }} />

              {/* Organization Assignment */}
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                Organization assignment
              </Title>

              <FormGroup fieldId="organization-assignment">
                <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                  <FlexItem>
                    <Radio
                      isChecked={formData.organizationAssignment === 'Static'}
                      name="organization-assignment"
                      onChange={() => handleInputChange('organizationAssignment', 'Static')}
                      label="Static"
                      id="radio-static"
                    />
                  </FlexItem>
                  <FlexItem>
                    <Radio
                      isChecked={formData.organizationAssignment === 'Dynamic'}
                      name="organization-assignment"
                      onChange={() => handleInputChange('organizationAssignment', 'Dynamic')}
                      label="Dynamic"
                      id="radio-dynamic"
                    />
                  </FlexItem>
                  <FlexItem>
                    <Radio
                      isChecked={formData.organizationAssignment === 'Per user'}
                      name="organization-assignment"
                      onChange={() => handleInputChange('organizationAssignment', 'Per user')}
                      label="Per user"
                      id="radio-per-user"
                    />
                  </FlexItem>
                </Flex>
              </FormGroup>

              {/* External Organization Name - shown when Static is selected */}
              {formData.organizationAssignment === 'Static' && (
                <FormGroup label="External organization name" isRequired fieldId="external-org-name">
                  <TextInput
                    isRequired
                    type="text"
                    id="external-org-name"
                    value={formData.externalOrganizationName}
                    onChange={(_event, value) => handleInputChange('externalOrganizationName', value)}
                    placeholder=""
                  />
                  <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                    Users from this provider will be assigned to this organization
                  </div>
                </FormGroup>
              )}

              <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '8px' }}>
                Control how users are assigned to organizations. Manual assignment requires admin intervention, while auto-creation can map provider groups to organizations automatically.
              </div>

              {/* Test Connection Status */}
              {testConnectionStatus === 'success' && (
                <Alert variant="success" title="Connection test successful" isInline style={{ marginTop: '16px' }} />
              )}
              {testConnectionStatus === 'error' && (
                <Alert variant="danger" title="Connection test failed" isInline style={{ marginTop: '16px' }} />
              )}

              {/* Actions */}
              <ActionGroup style={{ marginTop: '32px' }}>
                <Button variant="primary" onClick={handleSave}>
                  Create Provider
                </Button>
                <Button variant="link" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant={getTestConnectionVariant()}
                  onClick={handleTestConnection}
                  isLoading={testConnectionStatus === 'testing'}
                  isDisabled={!formData.issuerUrl || !formData.clientId || !formData.clientSecret}
                >
                  {getTestConnectionText()}
                </Button>
              </ActionGroup>
            </Form>
      </StackItem>
    </Stack>
  );
};

export default ProviderFormWireframe;