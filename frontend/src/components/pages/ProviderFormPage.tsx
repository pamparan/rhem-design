import React, { useState, useEffect } from 'react';
import {
  Title,
  Button,
  Form,
  FormGroup,
  TextInput,
  Switch,
  Radio,
  ActionGroup,
  Alert,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  Stack,
  StackItem,
  Flex,
  FlexItem,
  Popover,
  Modal,
  ModalVariant,
  Tooltip
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  InfoAltIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import { NavigationItemId, NavigationParams, ViewType } from '../../types/app';
import TagInput from '../shared/TagInput';
import ScopeInput from '../shared/ScopeInput';
import { useDesignControls } from '../../hooks/useDesignControls';

interface ProviderFormPageProps {
  onNavigate: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
  providerId?: string | null;
}

const ProviderFormPage: React.FC<ProviderFormPageProps> = ({ onNavigate, providerId }) => {
  const isEdit = !!providerId;
  const { getSetting, setSetting } = useDesignControls();

  // Form state
  const [formData, setFormData] = useState({
    name: isEdit ? 'Google Workspace' : '',
    type: isEdit ? 'OIDC' : 'OIDC',
    enabled: isEdit ? true : false,
    clientId: isEdit ? 'google-client-id-example' : '',
    clientSecret: isEdit ? '••••••••••••••••' : '',
    issuerUrl: isEdit ? 'https://accounts.google.com' : '',
    authorizationUrl: isEdit ? '' : '',
    tokenUrl: isEdit ? '' : '',
    userinfoUrl: isEdit ? '' : '',
    scopes: isEdit ? ['a', 'd'] : [],
    usernameClaim: isEdit ? 'preferred_username' : '',
    roleClaim: isEdit ? 'groups' : '',
    organizationAssignment: isEdit ? 'Static' : 'Static',
    externalOrganizationName: isEdit ? '' : '',
    claimPath: isEdit ? '' : '',
    organizationNamePrefix: isEdit ? '' : '',
    organizationNameSuffix: isEdit ? '' : '',
  });

  const [testConnectionStatus, setTestConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  // Auto-fill form if toggle is enabled and this is a new provider (not edit mode)
  useEffect(() => {
    if (getSetting('fillProviderForm') && !isEdit && !hasAutoFilled) {
      setFormData(prev => ({
        ...prev,
        name: 'OIDC Provider',
        type: 'OIDC',
        enabled: true,
        issuerUrl: 'https://example.com/auth/realms/demo',
        clientId: 'demo-client-id',
        clientSecret: 'demo-client-secret',
        scopes: ['openid', 'profile', 'email'],
        usernameClaim: 'preferred_username',
        roleClaim: 'groups',
        organizationAssignment: 'Static',
        externalOrganizationName: 'Demo Organization'
      }));
      setHasAutoFilled(true);
    }
  }, [getSetting('fillProviderForm'), isEdit, hasAutoFilled]);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    setTestConnectionStatus('testing');

    // Simulate test connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random success/failure for demo
    const success = Math.random() > 0.3;
    setTestConnectionStatus(success ? 'success' : 'error');

    if (success) {
      // Mock successful test results
      setTestResults([
        {
          field: 'Authorization URL',
          value: `${formData.issuerUrl}/oauth2/v2/auth`,
          status: 'success',
          details: 'Authorization endpoint is reachable (HTTP 200)'
        },
        {
          field: 'Issuer URL',
          value: formData.issuerUrl,
          status: 'success',
          details: 'Successfully discovered OIDC configuration'
        },
        {
          field: 'Token URL',
          value: `${formData.issuerUrl.replace('accounts.google.com', 'oauth2.googleapis.com')}/token`,
          status: 'success',
          details: 'Token endpoint is reachable (HTTP 404 for GET - endpoint likely accepts POST)'
        },
        {
          field: 'Userinfo URL',
          value: `${formData.issuerUrl.replace('accounts.google.com', 'openidconnect.googleapis.com')}/v1/userinfo`,
          status: 'success',
          details: 'Userinfo endpoint is reachable (HTTP 401 - authentication required, as expected)'
        }
      ]);
      setIsTestModalOpen(true);
    }
  };

  const handleSave = () => {
    console.log('Saving provider configuration:', formData);
    onNavigate('main', 'auth-providers');
  };

  const handleCancel = () => {
    onNavigate('main', 'auth-providers');
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

  const getTestResultAlert = () => {
    if (testConnectionStatus === 'success') {
      return (
        <Alert variant="success" isInline title="Connection test successful">
          Successfully connected to the authentication provider. Configuration appears to be correct.
        </Alert>
      );
    } else if (testConnectionStatus === 'error') {
      return (
        <Alert variant="danger" isInline title="Connection test failed">
          Unable to connect to the authentication provider. Please check your configuration and try again.
        </Alert>
      );
    }
    return null;
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
              onNavigate('main', 'auth-providers');
            }}
          >
            Authentication providers
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{isEdit ? 'Edit Authentication Provider' : 'Add Authentication Provider'}</BreadcrumbItem>
        </Breadcrumb>
      </StackItem>

      {/* Page Header */}
      <StackItem>
        <Title headingLevel="h1" size="2xl">
          {isEdit ? 'Edit Authentication Provider' : 'Add Authentication Provider'}
        </Title>
        <p style={{ marginTop: '8px', color: '#6a6e73' }}>
          Configure an authentication provider for user login and organization assignment.
        </p>
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
            <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '8px' }}>
              When enabled, users can authenticate using this provider. Disable to temporarily stop authentication without deleting the configuration.
            </div>
          </FormGroup>

          {/* Provider Name */}
          <FormGroup
            label="Provider name"
            isRequired
            fieldId="provider-name"
            labelIcon={
              <Tooltip
                content={
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <CheckCircleIcon style={{ color: '#3e8635', marginRight: '8px', fontSize: '14px' }} />
                      <span style={{ fontSize: '14px' }}>Name must be unique</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <CheckCircleIcon style={{ color: '#3e8635', marginRight: '8px', fontSize: '14px' }} />
                      <span style={{ fontSize: '14px' }}>Starts and ends with a lowercase letter or a number</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <CheckCircleIcon style={{ color: '#3e8635', marginRight: '8px', fontSize: '14px' }} />
                      <span style={{ fontSize: '14px' }}>Contains only lowercase letters, numbers, dashes (-), and dots (.)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon style={{ color: '#3e8635', marginRight: '8px', fontSize: '14px' }} />
                      <span style={{ fontSize: '14px' }}>1-50 characters</span>
                    </div>
                  </div>
                }
                position="right"
              >
                <Button variant="plain" aria-label="Provider name help">
                  <InfoAltIcon />
                </Button>
              </Tooltip>
            }
          >
            <TextInput
              isRequired
              type="text"
              id="provider-name"
              value={formData.name}
              onChange={(_event, value) => handleInputChange('name', value)}
              placeholder=""
            />
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
              OIDC provides user identity information. OAuth2 provides access permissions only. Check your provider's documentation for supported protocols.
            </div>
          </FormGroup>

          {/* OIDC Issuer URL - required for OIDC */}
          {formData.type === 'OIDC' && (
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
          )}

          {/* OAuth2 specific fields */}
          {formData.type === 'OAuth2' && (
            <>
              <FormGroup label="Authorization URL" isRequired fieldId="authorization-url">
                <TextInput
                  isRequired
                  type="url"
                  id="authorization-url"
                  value={formData.authorizationUrl || ''}
                  onChange={(_event, value) => handleInputChange('authorizationUrl', value)}
                  placeholder=""
                />
                <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                  Authorization endpoint for user consent. Refer to your provider's OAuth2 documentation.
                </div>
              </FormGroup>

              <FormGroup label="Token URL" isRequired fieldId="token-url">
                <TextInput
                  isRequired
                  type="url"
                  id="token-url"
                  value={formData.tokenUrl || ''}
                  onChange={(_event, value) => handleInputChange('tokenUrl', value)}
                  placeholder=""
                />
                <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                  Token endpoint for exchanging authorization codes for access tokens.
                </div>
              </FormGroup>

              <FormGroup label="Userinfo URL" isRequired fieldId="userinfo-url">
                <TextInput
                  isRequired
                  type="url"
                  id="userinfo-url"
                  value={formData.userinfoUrl || ''}
                  onChange={(_event, value) => handleInputChange('userinfoUrl', value)}
                  placeholder=""
                />
                <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                  User information endpoint for retrieving profile data with access tokens.
                </div>
              </FormGroup>

              <FormGroup label="Issuer URL" fieldId="issuer-url">
                <TextInput
                  type="url"
                  id="issuer-url"
                  value={formData.issuerUrl}
                  onChange={(_event, value) => handleInputChange('issuerUrl', value)}
                  placeholder=""
                />
                <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                  Optional. Provider's base issuer URL for OAuth2 metadata discovery.
                </div>
              </FormGroup>
            </>
          )}

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

          {/* Scopes Section */}
          <ScopeInput
            scopes={formData.scopes}
            onScopesChange={(scopes) => handleInputChange('scopes', scopes)}
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
                    <InfoAltIcon />
                  </Button>
                </Popover>
              </FlexItem>
            </Flex>
            <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '8px' }}>
              Use dot notation to separate segments (e.g. <code>custom_claims.user_id</code>). Each segment must begin with a letter or underscore and may contain only letters, numbers, or underscores. Special characters and spaces are not permitted.
            </div>
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
                    <InfoAltIcon />
                  </Button>
                </Popover>
              </FlexItem>
            </Flex>
            <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '8px' }}>
              Claim containing user roles or group memberships for authorization. Check your provider's documentation for the correct claim name.
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

          {/* Conditional fields based on organization assignment selection */}
          {formData.organizationAssignment === 'Static' && (
            <FormGroup
              label="External organization name"
              isRequired
              fieldId="external-org-name"
            >
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

          {formData.organizationAssignment === 'Dynamic' && (
            <>
              <FormGroup label="Claim path" isRequired fieldId="claim-path">
                <TextInput
                  isRequired
                  type="text"
                  id="claim-path"
                  value={formData.claimPath}
                  onChange={(_event, value) => handleInputChange('claimPath', value)}
                  placeholder=""
                />
                <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                  Dot notation path to the claim (e.g., "groups", "custom_claims.org_id", ...)
                </div>
              </FormGroup>

              <FormGroup label="Organization name prefix" fieldId="org-name-prefix">
                <TextInput
                  type="text"
                  id="org-name-prefix"
                  value={formData.organizationNamePrefix}
                  onChange={(_event, value) => handleInputChange('organizationNamePrefix', value)}
                  placeholder=""
                />
                <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                  Optional prefix for the organization name
                </div>
              </FormGroup>

              <FormGroup label="Organization name suffix" fieldId="org-name-suffix">
                <TextInput
                  type="text"
                  id="org-name-suffix"
                  value={formData.organizationNameSuffix}
                  onChange={(_event, value) => handleInputChange('organizationNameSuffix', value)}
                  placeholder=""
                />
                <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                  Optional suffix for the organization name
                </div>
              </FormGroup>
            </>
          )}

          {formData.organizationAssignment === 'Per user' && (
            <>
              <FormGroup label="Organization name prefix" fieldId="org-name-prefix-peruser">
                <TextInput
                  type="text"
                  id="org-name-prefix-peruser"
                  value={formData.organizationNamePrefix}
                  onChange={(_event, value) => handleInputChange('organizationNamePrefix', value)}
                  placeholder=""
                />
                <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                  Optional prefix for the user-specific organization name
                </div>
              </FormGroup>

              <FormGroup label="Organization name suffix" fieldId="org-name-suffix-peruser">
                <TextInput
                  type="text"
                  id="org-name-suffix-peruser"
                  value={formData.organizationNameSuffix}
                  onChange={(_event, value) => handleInputChange('organizationNameSuffix', value)}
                  placeholder=""
                />
                <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                  Optional suffix for the user-specific organization name
                </div>
              </FormGroup>
            </>
          )}

          {/* Test Connection Status Alert */}
          {getTestResultAlert()}

          {/* Actions */}
          <ActionGroup style={{ marginTop: '32px' }}>
            <Button variant="primary" onClick={handleSave}>
              {isEdit ? 'Update Provider' : 'Create Provider'}
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

      {/* Test Connection Results Modal */}
      <Modal
        variant={ModalVariant.medium}
        title="Test connection results"
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        actions={[
          <Button key="close" variant="primary" onClick={() => setIsTestModalOpen(false)}>
            Close
          </Button>
        ]}
      >
        <Stack hasGutter>
          <StackItem>
            <Alert variant="success" isInline title="OIDC discovery successful" />
            <p style={{ marginTop: '8px', color: '#6a6e73' }}>
              The OIDC discovery was successful. Find the details below for the discovered endpoints:
            </p>
          </StackItem>

          <StackItem>
            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th>Field</Th>
                  <Th>Value</Th>
                  <Th>Status</Th>
                  <Th>Details</Th>
                </Tr>
              </Thead>
              <Tbody>
                {testResults.map((result, index) => (
                  <Tr key={index}>
                    <Td>{result.field}</Td>
                    <Td style={{ fontSize: '0.875rem', color: '#666' }}>
                      {result.value}
                    </Td>
                    <Td>
                      <CheckCircleIcon style={{ color: '#3E8635', marginRight: '4px' }} />
                    </Td>
                    <Td style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                      {result.details}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </StackItem>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default ProviderFormPage;