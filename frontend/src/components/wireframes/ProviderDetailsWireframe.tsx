import React from 'react';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  Stack,
  StackItem,
  Grid,
  GridItem,
  Label,
  Switch,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Divider,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Flex,
  FlexItem,
  Tabs,
  Tab,
  TabContent,
  CodeBlock,
  CodeBlockCode,
  Toolbar,
  ToolbarContent,
  ToolbarItem
} from '@patternfly/react-core';
import { CaretDownIcon, CopyIcon, DownloadIcon } from '@patternfly/react-icons';

/**
 * Provider Details Page Component
 *
 * Purpose: Display comprehensive information about an authentication provider
 * with proper PatternFly 6 hierarchy and layout
 */

interface ProviderDetailsProps {
  providerId: string;
  onNavigateBack?: () => void;
  onEdit?: (providerId: string) => void;
  onDelete?: (providerId: string) => void;
}

const ProviderDetailsWireframe: React.FC<ProviderDetailsProps> = ({
  providerId,
  onNavigateBack,
  onEdit,
  onDelete
}) => {
  const [actionsOpen, setActionsOpen] = React.useState(false);
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  const handleCopyYAML = () => {
    navigator.clipboard.writeText(generateProviderYAML(provider));
    console.log('YAML copied to clipboard');
  };

  const handleDownloadYAML = () => {
    const yamlContent = generateProviderYAML(provider);
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${provider.name.toLowerCase().replace(/\s+/g, '-')}-identity-provider.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Mock provider data based on ID
  const getProviderData = (id: string) => {
    const providers = {
      'google': {
        name: 'Google',
        type: 'OIDC',
        enabled: true,
        authorizationUrl: 'https://accounts.google.com/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userinfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
        issuerUrl: 'https://accounts.google.com',
        clientId: 'Ov23litEUO8O8bbv6Jhs',
        scopes: ['read:user', 'user:email'],
        usernameClaim: 'login',
        roleClaim: 'groups',
        organizationAssignment: 'Static',
        externalOrgName: 'default'
      },
      'aap': {
        name: 'AAP',
        type: 'Ansible Automation Platform',
        enabled: true,
        authorizationUrl: 'https://aap.example.com/api/gateway/v1/social/authorize',
        tokenUrl: 'https://aap.example.com/api/gateway/v1/social/token',
        userinfoUrl: 'https://aap.example.com/api/gateway/v1/social/userinfo',
        issuerUrl: 'https://aap.example.com/api/gateway/v1/social/',
        clientId: 'aap-client-12345',
        scopes: ['read', 'write'],
        usernameClaim: 'preferred_username',
        roleClaim: 'groups',
        organizationAssignment: 'Dynamic',
        externalOrgName: ''
      }
    };
    return providers[id as keyof typeof providers] || providers.google;
  };

  const provider = getProviderData(providerId);

  const generateProviderYAML = (providerData: any) => {
    return `apiVersion: v1
kind: IdentityProvider
metadata:
  name: ${providerData.name.toLowerCase().replace(/\s+/g, '-')}
  namespace: default
  labels:
    app.kubernetes.io/name: identity-provider
    app.kubernetes.io/component: authentication
    app.kubernetes.io/part-of: flight-control
  annotations:
    description: "OIDC Authentication Provider for ${providerData.name}"
    created: "${new Date().toISOString()}"
spec:
  type: ${providerData.type}
  enabled: ${providerData.enabled}
  config:
    authorizationURL: "${providerData.authorizationUrl}"
    tokenURL: "${providerData.tokenUrl}"
    userinfoURL: "${providerData.userinfoUrl}"
    issuerURL: "${providerData.issuerUrl || 'N/A'}"
    clientID: "${providerData.clientId}"
    clientSecretRef:
      name: ${providerData.name.toLowerCase().replace(/\s+/g, '-')}-client-secret
      key: client-secret
    scopes:${providerData.scopes.length > 0 ? providerData.scopes.map((scope: string) => `\n      - "${scope}"`).join('') : '\n      - "openid"'}
    usernameClaim: "${providerData.usernameClaim || 'preferred_username'}"
    roleClaim: "${providerData.roleClaim || 'groups'}"
  organizationAssignment:
    type: "${providerData.organizationAssignment}"${providerData.externalOrgName ? `\n    externalOrganizationName: "${providerData.externalOrgName}"` : ''}
  security:
    validateCertificates: true
    timeout: 30s
    retryAttempts: 3`;
  };

  const colorizeYAMLLine = (line: string) => {
    // Handle different YAML syntax elements with colors
    if (line.trim().startsWith('#')) {
      // Comments
      return <span style={{ color: '#6a6e73' }}>{line}</span>;
    } else if (line.match(/^[a-zA-Z_][a-zA-Z0-9_]*:/)) {
      // Top-level keys
      const [key, ...rest] = line.split(':');
      return (
        <>
          <span style={{ color: '#0066cc', fontWeight: 'bold' }}>{key}</span>
          <span>:</span>
          {rest.length > 0 && <span>{rest.join(':')}</span>}
        </>
      );
    } else if (line.match(/^\s+[a-zA-Z_][a-zA-Z0-9_./\-]*:/)) {
      // Nested keys
      const match = line.match(/^(\s+)([a-zA-Z_][a-zA-Z0-9_./\-]*)(:.*)$/);
      if (match) {
        return (
          <>
            <span>{match[1]}</span>
            <span style={{ color: '#d73502' }}>{match[2]}</span>
            <span>{match[3]}</span>
          </>
        );
      }
    } else if (line.match(/^\s*-\s+/)) {
      // List items
      const match = line.match(/^(\s*-\s+)(.*)$/);
      if (match) {
        return (
          <>
            <span style={{ color: '#d73502' }}>{match[1]}</span>
            <span style={{ color: '#008000' }}>{match[2]}</span>
          </>
        );
      }
    } else if (line.match(/:\s*".*"$/)) {
      // String values in quotes
      const match = line.match(/^(.*:\s*)"(.*)"$/);
      if (match) {
        return (
          <>
            <span>{match[1]}</span>
            <span style={{ color: '#008000' }}>"{match[2]}"</span>
          </>
        );
      }
    } else if (line.match(/:\s*(true|false)$/)) {
      // Boolean values
      const match = line.match(/^(.*:\s*)(true|false)$/);
      if (match) {
        return (
          <>
            <span>{match[1]}</span>
            <span style={{ color: '#0066cc' }}>{match[2]}</span>
          </>
        );
      }
    } else if (line.match(/:\s*\d+[a-zA-Z]*$/)) {
      // Numbers and values with units
      const match = line.match(/^(.*:\s*)(\d+[a-zA-Z]*)$/);
      if (match) {
        return (
          <>
            <span>{match[1]}</span>
            <span style={{ color: '#0066cc' }}>{match[2]}</span>
          </>
        );
      }
    }

    return <span>{line}</span>;
  };

  return (
    <PageSection>
      <Stack hasGutter>
        {/* Breadcrumb Navigation */}
        <StackItem>
          <Breadcrumb>
            <BreadcrumbItem
              to="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigateBack?.();
              }}
            >
              Authentication providers
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{provider.name}</BreadcrumbItem>
          </Breadcrumb>
        </StackItem>

        {/* Page Header with Actions */}
        <StackItem>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Title headingLevel="h1" size="2xl">
                {provider.name}
              </Title>
            </FlexItem>
            <FlexItem>
              <Dropdown
                isOpen={actionsOpen}
                onSelect={() => setActionsOpen(false)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="primary"
                    onClick={() => setActionsOpen(!actionsOpen)}
                    isExpanded={actionsOpen}
                  >
                    Actions
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="edit" onClick={() => onEdit?.(providerId)}>
                    Edit
                  </DropdownItem>
                  <DropdownItem key="test" onClick={() => console.log('Test connection')}>
                    Test connection
                  </DropdownItem>
                  <DropdownItem key="export" onClick={() => console.log('Export YAML')}>
                    Export YAML
                  </DropdownItem>
                  <DropdownItem key="delete" onClick={() => onDelete?.(providerId)}>
                    Delete
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>
          </Flex>
        </StackItem>

        {/* Tabs Section */}
        <StackItem>
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
            <Tab eventKey={0} title="Details">
              <TabContent style={{ marginTop: '1rem' }}>
                <Stack hasGutter>
                  {/* Overview Section */}
                  <StackItem>
                    <Card>
                      <CardBody>
                        <Title headingLevel="h2" size="lg" style={{ marginBottom: '1rem' }}>
                          Provider Overview
                        </Title>
                        <Grid hasGutter>
                          <GridItem span={4}>
                            <DescriptionList>
                              <DescriptionListGroup>
                                <DescriptionListTerm>Name</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <strong>{provider.name}</strong>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            </DescriptionList>
                          </GridItem>
                          <GridItem span={4}>
                            <DescriptionList>
                              <DescriptionListGroup>
                                <DescriptionListTerm>Type</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <Label color="blue">{provider.type}</Label>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            </DescriptionList>
                          </GridItem>
                          <GridItem span={4}>
                            <DescriptionList>
                              <DescriptionListGroup>
                                <DescriptionListTerm>Status</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <Label color={provider.enabled ? 'green' : 'grey'}>
                                    {provider.enabled ? 'Enabled' : 'Disabled'}
                                  </Label>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            </DescriptionList>
                          </GridItem>
                        </Grid>
                      </CardBody>
                    </Card>
                  </StackItem>

                  {/* OIDC Configuration Section */}
                  <StackItem>
                    <Card>
                      <CardBody>
                        <Title headingLevel="h2" size="lg" style={{ marginBottom: '1rem' }}>
                          OIDC Configuration
                        </Title>
                        <DescriptionList isHorizontal>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Issuer URL</DescriptionListTerm>
                            <DescriptionListDescription>
                              <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                {provider.issuerUrl || 'N/A'}
                              </span>
                            </DescriptionListDescription>
                          </DescriptionListGroup>

                          <DescriptionListGroup>
                            <DescriptionListTerm>Authorization URL</DescriptionListTerm>
                            <DescriptionListDescription>
                              <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                {provider.authorizationUrl}
                              </span>
                            </DescriptionListDescription>
                          </DescriptionListGroup>

                          <DescriptionListGroup>
                            <DescriptionListTerm>Token URL</DescriptionListTerm>
                            <DescriptionListDescription>
                              <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                {provider.tokenUrl}
                              </span>
                            </DescriptionListDescription>
                          </DescriptionListGroup>

                          <DescriptionListGroup>
                            <DescriptionListTerm>Userinfo URL</DescriptionListTerm>
                            <DescriptionListDescription>
                              <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                {provider.userinfoUrl}
                              </span>
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                      </CardBody>
                    </Card>
                  </StackItem>

                  {/* Client Configuration Section */}
                  <StackItem>
                    <Card>
                      <CardBody>
                        <Title headingLevel="h2" size="lg" style={{ marginBottom: '1rem' }}>
                          Client Configuration
                        </Title>
                        <Grid hasGutter>
                          <GridItem span={6}>
                            <DescriptionList>
                              <DescriptionListGroup>
                                <DescriptionListTerm>Client ID</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                    {provider.clientId}
                                  </span>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            </DescriptionList>
                          </GridItem>
                          <GridItem span={6}>
                            <DescriptionList>
                              <DescriptionListGroup>
                                <DescriptionListTerm>Scopes</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {provider.scopes.length > 0 ? provider.scopes.map((scope, index) => (
                                      <Label key={index} color="blue" variant="outline">
                                        {scope}
                                      </Label>
                                    )) : (
                                      <span style={{ color: '#6a6e73', fontStyle: 'italic' }}>No scopes configured</span>
                                    )}
                                  </div>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            </DescriptionList>
                          </GridItem>
                        </Grid>
                      </CardBody>
                    </Card>
                  </StackItem>

                  {/* Claims Mapping Section */}
                  <StackItem>
                    <Card>
                      <CardBody>
                        <Title headingLevel="h2" size="lg" style={{ marginBottom: '1rem' }}>
                          Claims Mapping
                        </Title>
                        <Grid hasGutter>
                          <GridItem span={6}>
                            <DescriptionList>
                              <DescriptionListGroup>
                                <DescriptionListTerm>Username claim</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <span style={{ fontFamily: 'monospace' }}>
                                    {provider.usernameClaim || 'preferred_username'}
                                  </span>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            </DescriptionList>
                          </GridItem>
                          <GridItem span={6}>
                            <DescriptionList>
                              <DescriptionListGroup>
                                <DescriptionListTerm>Role claim</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <span style={{ fontFamily: 'monospace' }}>
                                    {provider.roleClaim || 'groups'}
                                  </span>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            </DescriptionList>
                          </GridItem>
                        </Grid>
                      </CardBody>
                    </Card>
                  </StackItem>

                  {/* Organization Assignment Section */}
                  <StackItem>
                    <Card>
                      <CardBody>
                        <Title headingLevel="h2" size="lg" style={{ marginBottom: '1rem' }}>
                          Organization Assignment
                        </Title>
                        <DescriptionList>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Assignment type</DescriptionListTerm>
                            <DescriptionListDescription>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Label color="purple">{provider.organizationAssignment}</Label>
                                </FlexItem>
                                {provider.externalOrgName && (
                                  <>
                                    <FlexItem>
                                      <span style={{ color: '#6a6e73' }}>→</span>
                                    </FlexItem>
                                    <FlexItem>
                                      <strong>{provider.externalOrgName}</strong>
                                    </FlexItem>
                                  </>
                                )}
                              </Flex>
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                      </CardBody>
                    </Card>
                  </StackItem>
                </Stack>
              </TabContent>
            </Tab>
            <Tab eventKey={1} title="YAML">
              <TabContent style={{ marginTop: '1rem' }}>
                <Stack hasGutter>
                  <StackItem>
                    <Toolbar>
                      <ToolbarContent>
                        <ToolbarItem>
                          <Title headingLevel="h3" size="md">
                            Authentication Provider Configuration
                          </Title>
                        </ToolbarItem>
                        <ToolbarItem variant="separator" />
                        <ToolbarItem>
                          <Button
                            variant="secondary"
                            icon={<CopyIcon />}
                            onClick={handleCopyYAML}
                          >
                            Copy YAML
                          </Button>
                        </ToolbarItem>
                        <ToolbarItem>
                          <Button
                            variant="secondary"
                            icon={<DownloadIcon />}
                            onClick={handleDownloadYAML}
                          >
                            Download
                          </Button>
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>
                  </StackItem>
                  <StackItem>
                    <Card style={{ backgroundColor: '#f5f5f5' }}>
                      <CardBody style={{ backgroundColor: '#f5f5f5', padding: '1rem' }}>
                        <CodeBlock style={{ backgroundColor: '#f5f5f5' }}>
                          <CodeBlockCode
                            style={{
                              backgroundColor: '#f5f5f5',
                              fontFamily: 'monospace',
                              fontSize: '14px',
                              display: 'block',
                              whiteSpace: 'pre',
                              counterReset: 'line-numbering',
                              paddingLeft: '3em'
                            }}
                          >
                            {generateProviderYAML(provider).split('\n').map((line, index) => (
                              <div
                                key={index}
                                style={{
                                  counterIncrement: 'line-numbering',
                                  position: 'relative'
                                }}
                              >
                                <span
                                  style={{
                                    position: 'absolute',
                                    left: '-3em',
                                    width: '2.5em',
                                    textAlign: 'right',
                                    color: '#6a6e73',
                                    fontSize: '14px',
                                    userSelect: 'none'
                                  }}
                                >
                                  {index + 1}
                                </span>
                                {colorizeYAMLLine(line)}
                              </div>
                            ))}
                          </CodeBlockCode>
                        </CodeBlock>
                      </CardBody>
                    </Card>
                  </StackItem>
                </Stack>
              </TabContent>
            </Tab>
          </Tabs>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

export default ProviderDetailsWireframe;