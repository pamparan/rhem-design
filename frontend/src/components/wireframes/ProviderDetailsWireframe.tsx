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
  ToolbarItem,
  Content,
  ClipboardCopy
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

  // Style constants using PatternFly 6 typography standards
  const codeStyle = {
    fontFamily: 'var(--pf-v6-global--FontFamily--monospace, "Red Hat Mono", monospace)',
    fontSize: '0.875rem', // Standard body text (14px)
    lineHeight: '1.5',
    backgroundColor: '#f5f5f5',
    padding: '2px 4px',
    borderRadius: '3px'
  };

  const smallTextStyle = {
    fontFamily: 'var(--pf-v6-global--FontFamily--text, "Red Hat Text", sans-serif)',
    fontSize: '0.875rem', // Standard body text (14px)
    color: '#6a6e73',
    marginTop: '4px',
    lineHeight: '1.5'
  };

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


  // Mock provider data based on ID - matching ProviderManagementWireframe data
  const getProviderData = (id: string) => {
    const providers = {
      'aap': {
        name: 'enterprise-platform',
        type: 'OAuth2',
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
        externalOrgName: '',
        claimPath: 'custom_claims.organization_id',
        organizationNamePrefix: 'org-',
        organizationNameSuffix: '-demo'
      },
      'google': {
        name: 'google',
        type: 'OIDC',
        enabled: true,
        authorizationUrl: 'https://accounts.google.com/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userinfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
        issuerUrl: 'https://accounts.google.com',
        clientId: 'google-client-id-example',
        scopes: ['openid', 'profile', 'email'],
        usernameClaim: 'email',
        roleClaim: 'groups',
        organizationAssignment: 'Static',
        externalOrgName: 'Google Users'
      },
      'okta': {
        name: 'customer-b-okta',
        type: 'OIDC',
        enabled: false,
        authorizationUrl: 'https://customer-b.okta.com/oauth2/default/v1/authorize',
        tokenUrl: 'https://customer-b.okta.com/oauth2/default/v1/token',
        userinfoUrl: 'https://customer-b.okta.com/oauth2/default/v1/userinfo',
        issuerUrl: 'https://customer-b.okta.com/oauth2/default',
        clientId: 'okta-client-abc123',
        scopes: ['openid', 'profile'],
        usernameClaim: 'preferred_username',
        roleClaim: 'groups',
        organizationAssignment: 'Per user',
        externalOrgName: '',
        organizationNamePrefix: 'user-',
        organizationNameSuffix: '-org'
      },
      'kubernetes': {
        name: 'k8s-cluster-auth',
        type: 'OIDC',
        enabled: true,
        authorizationUrl: 'https://k8s.cluster.local:6443/oauth2/v1/authorize',
        tokenUrl: 'https://k8s.cluster.local:6443/oauth2/v1/token',
        userinfoUrl: 'https://k8s.cluster.local:6443/oauth2/v1/userinfo',
        issuerUrl: 'https://k8s.cluster.local:6443',
        clientId: 'k8s-client-xyz789',
        scopes: ['openid'],
        usernameClaim: 'sub',
        roleClaim: 'groups',
        organizationAssignment: 'Static',
        externalOrgName: 'Kubernetes Cluster'
      }
    };
    return providers[id as keyof typeof providers] || providers.google;
  };

  const provider = getProviderData(providerId);

  const generateProviderYAML = (providerData: any) => {
    // Generate organization assignment configuration based on type
    let orgAssignmentConfig = `  organizationAssignment:
    type: "${providerData.organizationAssignment}"`;

    if (providerData.organizationAssignment === 'Static' && providerData.externalOrgName) {
      orgAssignmentConfig += `\n    externalOrganizationName: "${providerData.externalOrgName}"`;
    } else if (providerData.organizationAssignment === 'Dynamic') {
      if (providerData.claimPath) {
        orgAssignmentConfig += `\n    claimPath: "${providerData.claimPath}"`;
      }
      if (providerData.organizationNamePrefix) {
        orgAssignmentConfig += `\n    organizationNamePrefix: "${providerData.organizationNamePrefix}"`;
      }
      if (providerData.organizationNameSuffix) {
        orgAssignmentConfig += `\n    organizationNameSuffix: "${providerData.organizationNameSuffix}"`;
      }
    } else if (providerData.organizationAssignment === 'Per user') {
      if (providerData.organizationNamePrefix) {
        orgAssignmentConfig += `\n    organizationNamePrefix: "${providerData.organizationNamePrefix}"`;
      }
      if (providerData.organizationNameSuffix) {
        orgAssignmentConfig += `\n    organizationNameSuffix: "${providerData.organizationNameSuffix}"`;
      }
    }

    // Generate configuration fields based on type
    let configFields = '';
    if (providerData.type === 'OIDC') {
      // OIDC only needs issuer URL - other endpoints are auto-discovered
      configFields = `    issuerURL: "${providerData.issuerUrl || 'N/A'}"`;
    } else if (providerData.type === 'OAuth2') {
      // OAuth2 needs explicit endpoint URLs
      configFields = `    authorizationURL: "${providerData.authorizationUrl}"
    tokenURL: "${providerData.tokenUrl}"
    userinfoURL: "${providerData.userinfoUrl}"`;

      // Add optional issuer URL for OAuth2 if present
      if (providerData.issuerUrl) {
        configFields += `\n    issuerURL: "${providerData.issuerUrl}"  # Optional for OAuth2 metadata discovery`;
      }
    }

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
    description: "${providerData.type} Authentication Provider for ${providerData.name}"
    created: "${new Date().toISOString()}"
spec:
  type: ${providerData.type}
  enabled: ${providerData.enabled}
  config:
${configFields}
    clientID: "${providerData.clientId}"
    clientSecretRef:
      name: ${providerData.name.toLowerCase().replace(/\s+/g, '-')}-client-secret
      key: client-secret
    scopes:${providerData.scopes.length > 0 ? providerData.scopes.map((scope: string) => `\n      - "${scope}"`).join('') : '\n      - "openid"'}
    usernameClaim: "${providerData.usernameClaim || 'preferred_username'}"
    roleClaim: "${providerData.roleClaim || 'groups'}"
${orgAssignmentConfig}
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
              <TabContent className="pf-v6-u-mt-md">
                <Stack hasGutter>
                  {/* Combined Overview & Configuration Section */}
                  <StackItem>
                    <Card>
                      <CardBody>
                        <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-md">
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

                        <Divider style={{ margin: '24px 0' }} />

                        <Title headingLevel="h3" size="md" className="pf-v6-u-mb-md">
                          {provider.type} Configuration
                        </Title>
                        <Stack hasGutter>
                          {/* OIDC providers only show Issuer URL (required) */}
                          {provider.type === 'OIDC' && (
                            <StackItem>
                              <div style={{ marginBottom: '8px' }}>
                                <strong style={{ fontSize: '0.875rem', color: '#151515' }}>Issuer URL</strong>
                              </div>
                              <ClipboardCopy
                                variant="inline-compact"
                                truncation={true}
                                isCode={true}
                                style={{
                                  fontFamily: 'var(--pf-v6-global--FontFamily--monospace, "Red Hat Mono", monospace)',
                                  fontSize: '0.875rem',
                                  lineHeight: '1.5'
                                }}
                              >
                                {provider.issuerUrl || 'N/A'}
                              </ClipboardCopy>
                            </StackItem>
                          )}

                          {/* OAuth2 providers show Authorization, Token, Userinfo URLs (required) + optional Issuer URL */}
                          {provider.type === 'OAuth2' && (
                            <>
                              <StackItem>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong style={{ fontSize: '0.875rem', color: '#151515' }}>Authorization URL</strong>
                                </div>
                                <ClipboardCopy
                                  variant="inline-compact"
                                  truncation={true}
                                  isCode={true}
                                  style={{
                                    fontFamily: 'var(--pf-v6-global--FontFamily--monospace, "Red Hat Mono", monospace)',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.5'
                                  }}
                                >
                                  {provider.authorizationUrl}
                                </ClipboardCopy>
                              </StackItem>

                              <StackItem>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong style={{ fontSize: '0.875rem', color: '#151515' }}>Token URL</strong>
                                </div>
                                <ClipboardCopy
                                  variant="inline-compact"
                                  truncation={true}
                                  isCode={true}
                                  style={{
                                    fontFamily: 'var(--pf-v6-global--FontFamily--monospace, "Red Hat Mono", monospace)',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.5'
                                  }}
                                >
                                  {provider.tokenUrl}
                                </ClipboardCopy>
                              </StackItem>

                              <StackItem>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong style={{ fontSize: '0.875rem', color: '#151515' }}>Userinfo URL</strong>
                                </div>
                                <ClipboardCopy
                                  variant="inline-compact"
                                  truncation={true}
                                  isCode={true}
                                  style={{
                                    fontFamily: 'var(--pf-v6-global--FontFamily--monospace, "Red Hat Mono", monospace)',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.5'
                                  }}
                                >
                                  {provider.userinfoUrl}
                                </ClipboardCopy>
                              </StackItem>

                              {provider.issuerUrl && (
                                <StackItem>
                                  <div style={{ marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '0.875rem', color: '#151515' }}>Issuer URL</strong>
                                  </div>
                                  <ClipboardCopy
                                    variant="inline-compact"
                                    truncation={true}
                                    isCode={true}
                                    style={{
                                      fontFamily: 'var(--pf-v6-global--FontFamily--monospace, "Red Hat Mono", monospace)',
                                      fontSize: '0.875rem',
                                      lineHeight: '1.5'
                                    }}
                                  >
                                    {provider.issuerUrl}
                                  </ClipboardCopy>
                                </StackItem>
                              )}
                            </>
                          )}
                        </Stack>
                      </CardBody>
                    </Card>
                  </StackItem>

                  {/* Client & Claims Configuration Section */}
                  <StackItem>
                    <Card>
                      <CardBody>
                        <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-md">
                          Client & Claims Configuration
                        </Title>
                        <Grid hasGutter>
                          <GridItem span={6}>
                            <DescriptionList>
                              <DescriptionListGroup>
                                <DescriptionListTerm style={{
                                  fontFamily: 'var(--pf-v6-global--FontFamily--text, "Red Hat Text", sans-serif)',
                                  fontSize: '0.875rem',
                                  lineHeight: '1.5'
                                }}>Client ID</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <code style={codeStyle}>
                                    {provider.clientId}
                                  </code>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                              <DescriptionListGroup>
                                <DescriptionListTerm style={{
                                  fontFamily: 'var(--pf-v6-global--FontFamily--text, "Red Hat Text", sans-serif)',
                                  fontSize: '0.875rem',
                                  lineHeight: '1.5'
                                }}>Username claim</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <code style={codeStyle}>
                                    {provider.usernameClaim || 'preferred_username'}
                                  </code>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            </DescriptionList>
                          </GridItem>
                          <GridItem span={6}>
                            <DescriptionList>
                              <DescriptionListGroup>
                                <DescriptionListTerm style={{
                                  fontFamily: 'var(--pf-v6-global--FontFamily--text, "Red Hat Text", sans-serif)',
                                  fontSize: '0.875rem',
                                  lineHeight: '1.5'
                                }}>Scopes</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <Flex gap={{ default: 'gapXs' }} flexWrap={{ default: 'wrap' }}>
                                    {provider.scopes.length > 0 ? provider.scopes.map((scope, index) => (
                                      <Label key={index} color="blue" variant="outline">
                                        {scope}
                                      </Label>
                                    )) : (
                                      <div style={{...smallTextStyle, fontStyle: "italic"}}>
                                        No scopes configured
                                      </div>
                                    )}
                                  </Flex>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                              <DescriptionListGroup>
                                <DescriptionListTerm style={{
                                  fontFamily: 'var(--pf-v6-global--FontFamily--text, "Red Hat Text", sans-serif)',
                                  fontSize: '0.875rem',
                                  lineHeight: '1.5'
                                }}>Role claim</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <code style={codeStyle}>
                                    {provider.roleClaim || 'groups'}
                                  </code>
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
                        <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-md">
                          Organization Assignment
                        </Title>
                        <DescriptionList isHorizontal>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Assignment type</DescriptionListTerm>
                            <DescriptionListDescription>
                              <Label color="purple">{provider.organizationAssignment}</Label>
                            </DescriptionListDescription>
                          </DescriptionListGroup>

                          {/* Static assignment - show external organization name */}
                          {provider.organizationAssignment === 'Static' && provider.externalOrgName && (
                            <DescriptionListGroup>
                              <DescriptionListTerm>Organization</DescriptionListTerm>
                              <DescriptionListDescription>
                                <div style={{fontWeight: "bold"}}>
                                  {provider.externalOrgName}
                                </div>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          )}

                          {/* Dynamic assignment - show claim path and naming options */}
                          {provider.organizationAssignment === 'Dynamic' && (
                            <>
                              {(provider as any).claimPath && (
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Claim path</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    <code style={codeStyle}>
                                      {(provider as any).claimPath}
                                    </code>
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              )}
                              {(provider as any).organizationNamePrefix && (
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Name prefix</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    <code style={codeStyle}>
                                      {(provider as any).organizationNamePrefix}
                                    </code>
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              )}
                              {(provider as any).organizationNameSuffix && (
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Name suffix</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    <code style={codeStyle}>
                                      {(provider as any).organizationNameSuffix}
                                    </code>
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              )}
                            </>
                          )}

                          {/* Per user assignment - show naming options */}
                          {provider.organizationAssignment === 'Per user' && (
                            <>
                              {(provider as any).organizationNamePrefix && (
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Name prefix</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    <code style={codeStyle}>
                                      {(provider as any).organizationNamePrefix}
                                    </code>
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              )}
                              {(provider as any).organizationNameSuffix && (
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Name suffix</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    <code style={codeStyle}>
                                      {(provider as any).organizationNameSuffix}
                                    </code>
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              )}
                            </>
                          )}
                        </DescriptionList>
                      </CardBody>
                    </Card>
                  </StackItem>
                </Stack>
              </TabContent>
            </Tab>
            <Tab eventKey={1} title="YAML">
              <TabContent className="pf-v6-u-mt-md">
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