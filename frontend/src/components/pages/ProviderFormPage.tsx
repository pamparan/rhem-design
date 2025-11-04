import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  SelectOptionProps,
  Switch,
  Button,
  ActionGroup,
  Breadcrumb,
  BreadcrumbItem,
  Grid,
  GridItem,
  Alert,
  Stack,
  StackItem,
  Divider,
  ExpandableSection,
  Flex,
  FlexItem,
  Radio,
  Popover,
} from '@patternfly/react-core';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  HelpIcon,
} from '@patternfly/react-icons';
import { NavigationItemId, NavigationParams, ViewType } from '../../types/app';
import TagInput from '../shared/TagInput';

interface ProviderFormPageProps {
  onNavigate: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
  providerId?: string | null;
}

const ProviderFormPage: React.FC<ProviderFormPageProps> = ({ onNavigate, providerId }) => {
  const isEdit = !!providerId;

  // Form state
  const [formData, setFormData] = useState({
    name: isEdit ? 'Google Workspace' : '',
    type: isEdit ? 'OIDC' : 'OIDC',
    enabled: isEdit ? true : false,
    clientId: isEdit ? 'google-client-id-example' : '',
    clientSecret: isEdit ? '••••••••••••••••' : '',
    issuerUrl: isEdit ? 'https://accounts.google.com' : '',
    scopes: isEdit ? ['a', 'd'] : [],
    usernameClaim: isEdit ? 'preferred_username' : 'preferred_username',
    roleClaim: isEdit ? 'groups' : 'groups',
    organizationAssignment: isEdit ? 'Static' : 'Static',
    externalOrganizationName: isEdit ? '' : '',
  });

  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random success/failure for demo
    const success = Math.random() > 0.3;
    setTestResult(success ? 'success' : 'error');
    setIsTesting(false);
  };

  const handleSave = () => {
    console.log('Saving provider configuration:', formData);
    // Implementation would save the provider configuration
    onNavigate('main', 'auth-providers');
  };

  const handleCancel = () => {
    onNavigate('main', 'auth-providers');
  };

  const getTestResultAlert = () => {
    if (testResult === 'success') {
      return (
        <Alert variant="success" isInline title="Connection test successful">
          Successfully connected to the authentication provider. Configuration appears to be correct.
        </Alert>
      );
    } else if (testResult === 'error') {
      return (
        <Alert variant="danger" isInline title="Connection test failed">
          Unable to connect to the authentication provider. Please check your configuration and try again.
        </Alert>
      );
    }
    return null;
  };

  return (
    <PageSection>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: '24px' }}>
        <BreadcrumbItem>
          <Button
            variant="link"
            onClick={() => onNavigate('main')}
            style={{ padding: 0 }}
          >
            Authentication providers
          </Button>
        </BreadcrumbItem>
        <BreadcrumbItem isActive>
          Create authentication provider
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <Button
              variant="plain"
              onClick={() => onNavigate('main', 'auth-providers')}
              style={{ padding: '8px' }}
            >
              <ArrowLeftIcon />
            </Button>
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">
              Create authentication provider
            </Title>
          </FlexItem>
        </Flex>
        <p style={{ marginTop: '8px', color: '#6a6e73' }}>
          Configure an authentication provider for user login and organization assignment.
        </p>
      </div>

      {/* Fill form quickly button */}
      <div style={{ marginBottom: '24px' }}>
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
              scopes: ['openid', 'profile', 'email'],
              usernameClaim: 'preferred_username',
              roleClaim: 'groups',
              organizationAssignment: 'Static',
              externalOrganizationName: 'Demo Organization'
            });
          }}
        >
          Fill form quickly
        </Button>
      </div>
      {/* Form updated to match screenshot design */}

      <Grid hasGutter>
        <GridItem span={8}>
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
            </FormGroup>

            <Divider style={{ margin: '24px 0' }} />

            {/* Organization Assignment */}
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
              Organization assignment
            </Title>

            <FormGroup fieldId="organization-assignment">
              <Stack hasGutter>
                <StackItem>
                  <Radio
                    isChecked={formData.organizationAssignment === 'Static'}
                    name="organization-assignment"
                    onChange={() => handleInputChange('organizationAssignment', 'Static')}
                    label="Static"
                    id="radio-static"
                  />
                </StackItem>
                <StackItem>
                  <Radio
                    isChecked={formData.organizationAssignment === 'Dynamic'}
                    name="organization-assignment"
                    onChange={() => handleInputChange('organizationAssignment', 'Dynamic')}
                    label="Dynamic"
                    id="radio-dynamic"
                  />
                </StackItem>
                <StackItem>
                  <Radio
                    isChecked={formData.organizationAssignment === 'Per user'}
                    name="organization-assignment"
                    onChange={() => handleInputChange('organizationAssignment', 'Per user')}
                    label="Per user"
                    id="radio-per-user"
                  />
                </StackItem>
              </Stack>
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

            {/* Actions */}
            <ActionGroup style={{ marginTop: '32px' }}>
              <Button variant="primary" onClick={handleSave}>
                Create Provider
              </Button>
              <Button variant="link" onClick={handleCancel}>
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        </GridItem>

        {/* Help Panel */}
        <GridItem span={4}>
          <Card>
            <CardBody>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
                Configuration Help
              </Title>

              <Stack hasGutter>
                <StackItem>
                  <strong>Provider Types</strong>
                  <p style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                    Choose OIDC for modern OAuth 2.0 / OpenID Connect providers like Google, Microsoft, or Okta.
                    Choose SAML for enterprise identity providers.
                  </p>
                </StackItem>

                <StackItem>
                  <strong>Claim Mapping</strong>
                  <p style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                    Specify which claims from the provider contain user information. Most providers use "email"
                    for both username and email claims.
                  </p>
                </StackItem>

                <StackItem>
                  <strong>Organization Assignment</strong>
                  <p style={{ fontSize: '14px', color: '#6a6e73', marginTop: '4px' }}>
                    Control how users are assigned to organizations. Manual assignment requires admin intervention,
                    while auto-creation can map provider groups to organizations automatically.
                  </p>
                </StackItem>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
  );
};

export default ProviderFormPage;