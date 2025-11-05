import React, { useState, useEffect } from 'react';
import {
  Title,
  Button,
  Form,
  FormGroup,
  FormGroupLabelHelp,
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
  ModalHeader,
  ModalBody,
  ModalFooter,
  HelperText,
  HelperTextItem
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  InfoAltIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  TimesCircleIcon,
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
  providerData?: any;
}

const ProviderFormPage: React.FC<ProviderFormPageProps> = ({ onNavigate, providerId, providerData }) => {
  const isEdit = !!providerId;
  const { getSetting, setSetting } = useDesignControls();

  // Form state
  const [formData, setFormData] = useState({
    name: isEdit && providerData ? providerData.name : '',
    type: isEdit && providerData ? providerData.type : 'OIDC',
    enabled: isEdit && providerData ? providerData.enabled : false,
    clientId: isEdit && providerData ? providerData.clientId : '',
    clientSecret: isEdit && providerData ? providerData.clientSecret : '',
    issuerUrl: isEdit && providerData ? providerData.issuerUrl : '',
    authorizationUrl: isEdit && providerData ? (providerData.authorizationUrl || '') : '',
    tokenUrl: isEdit && providerData ? (providerData.tokenUrl || '') : '',
    userinfoUrl: isEdit && providerData ? (providerData.userinfoUrl || '') : '',
    scopes: isEdit && providerData ? providerData.scopes : [],
    usernameClaim: isEdit && providerData ? providerData.usernameClaim : '',
    roleClaim: isEdit && providerData ? providerData.roleClaim : '',
    organizationAssignment: isEdit && providerData ? providerData.organizationAssignment : 'Static',
    externalOrganizationName: isEdit && providerData ? (providerData.externalOrganizationName || '') : '',
    claimPath: isEdit && providerData ? (providerData.claimPath || '') : '',
    organizationNamePrefix: isEdit && providerData ? (providerData.organizationNamePrefix || '') : '',
    organizationNameSuffix: isEdit && providerData ? (providerData.organizationNameSuffix || '') : '',
  });

  const [testConnectionStatus, setTestConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error' | 'partial'>('idle');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [hasAutoFilled, setHasAutoFilled] = useState(false);
  const [testCycle, setTestCycle] = useState(0); // 0: success, 1: partial, 2: error
  const [nameError, setNameError] = useState<string>('');
  const [scopesError, setScopesError] = useState<boolean>(false);
  const [hasInteractedWithScopes, setHasInteractedWithScopes] = useState<boolean>(false);
  const [usernameClaimError, setUsernameClaimError] = useState<string>('');
  const [roleClaimError, setRoleClaimError] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // Store initial form state to detect changes
  const [initialFormData] = useState(() => ({ ...formData }));

  // Auto-fill form if toggle is enabled and this is a new provider (not edit mode)
  useEffect(() => {
    if (getSetting('fillProviderForm') && !isEdit && !hasAutoFilled) {
      setFormData(prev => ({
        ...prev,
        name: 'demo-oidc-provider',
        type: 'OIDC',
        enabled: true,
        issuerUrl: 'https://example.com/auth/realms/demo',
        authorizationUrl: 'https://example.com/auth/realms/demo/protocol/openid-connect/auth',
        tokenUrl: 'https://example.com/auth/realms/demo/protocol/openid-connect/token',
        userinfoUrl: 'https://example.com/auth/realms/demo/protocol/openid-connect/userinfo',
        clientId: 'demo-client-id',
        clientSecret: 'demo-client-secret',
        scopes: ['openid', 'profile', 'email'],
        usernameClaim: 'preferred_username',
        roleClaim: 'groups',
        organizationAssignment: 'Dynamic',
        externalOrganizationName: 'demo-organization',
        claimPath: 'custom_claims.organization_id',
        organizationNamePrefix: 'org-',
        organizationNameSuffix: '-demo'
      }));
      setHasAutoFilled(true);
    }
  }, [getSetting('fillProviderForm'), isEdit, hasAutoFilled]);

  // Update form data when providerData prop changes (for edit mode)
  useEffect(() => {
    if (isEdit && providerData) {
      setFormData({
        name: providerData.name || '',
        type: providerData.type || 'OIDC',
        enabled: providerData.enabled || false,
        clientId: providerData.clientId || '',
        clientSecret: providerData.clientSecret || '',
        issuerUrl: providerData.issuerUrl || '',
        authorizationUrl: providerData.authorizationUrl || '',
        tokenUrl: providerData.tokenUrl || '',
        userinfoUrl: providerData.userinfoUrl || '',
        scopes: providerData.scopes || [],
        usernameClaim: providerData.usernameClaim || '',
        roleClaim: providerData.roleClaim || '',
        organizationAssignment: providerData.organizationAssignment || 'Static',
        externalOrganizationName: providerData.externalOrganizationName || '',
        claimPath: providerData.claimPath || '',
        organizationNamePrefix: providerData.organizationNamePrefix || '',
        organizationNameSuffix: providerData.organizationNameSuffix || '',
      });
    }
  }, [isEdit, providerData]);

  // Track when scopes are autofilled to mark as interacted
  useEffect(() => {
    if (getSetting('fillProviderForm') && formData.scopes.length > 0 && !hasInteractedWithScopes) {
      setHasInteractedWithScopes(true);
    }
  }, [formData.scopes, getSetting('fillProviderForm'), hasInteractedWithScopes]);

  // Detect unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialFormData]);

  // Validate provider name
  const validateProviderName = (name: string): string => {
    if (!name.trim()) {
      return 'Provider name is required. Enter a name to continue.';
    }

    // Check length first
    if (name.length > 50) {
      return 'Name is too long. Use 50 characters or fewer.';
    }

    // Check for invalid characters early
    if (!/^[a-z0-9.-]+$/.test(name)) {
      return 'Name contains invalid characters. Use only lowercase letters, numbers, dashes, and dots.';
    }

    // Check start/end characters
    if (!/^[a-z0-9]/.test(name) || !/[a-z0-9]$/.test(name)) {
      return 'Name format is invalid. Start and end with a letter or number.';
    }

    // Check for known duplicates (simulated uniqueness check)
    const knownDuplicates = ['existing-provider', 'duplicate-name'];
    if (knownDuplicates.includes(name.toLowerCase())) {
      return 'Name is already taken. Choose a different name.';
    }

    return '';
  };

  // Individual validation functions for tooltip - show green by default, red only when user types and violates rules
  const validateUniqueness = (name: string): boolean => {
    if (!name.trim()) return true; // Show green for empty field - encouraging default state
    // Check against known duplicates
    const knownDuplicates = ['existing-provider', 'duplicate-name'];
    return !knownDuplicates.includes(name.toLowerCase());
  };

  const validateStartsAndEnds = (name: string): boolean => {
    if (!name.trim()) return true; // Show green for empty field - encouraging default state
    return /^[a-z0-9]/.test(name) && /[a-z0-9]$/.test(name);
  };

  const validateCharacters = (name: string): boolean => {
    if (!name.trim()) return true; // Show green for empty field - encouraging default state
    return /^[a-z0-9.-]+$/.test(name);
  };

  const validateLength = (name: string): boolean => {
    if (!name.trim()) return true; // Show green for empty field - encouraging default state
    return name.length >= 1 && name.length <= 50;
  };

  // Provider Name Validation Tooltip component
  const ProviderNameValidationTooltip = ({ name }: { name: string }) => {
    const validations = [
      {
        message: 'Must be 1-50 characters long',
        isValid: validateLength(name)
      },
      {
        message: 'Only lowercase letters, numbers, dashes (-), and dots (.)',
        isValid: validateCharacters(name)
      },
      {
        message: 'Must start and end with a letter or number',
        isValid: validateStartsAndEnds(name)
      },
      {
        message: 'Must be unique (not already in use)',
        isValid: validateUniqueness(name)
      }
    ];

    return (
      <div style={{ fontSize: '0.75rem', color: '#151515' }}>
        {validations.map((validation, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '6px',
            textAlign: 'left'
          }}>
            <div style={{
              width: '14px',
              height: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '6px',
              flexShrink: 0
            }}>
              {validation.isValid ? (
                <CheckCircleIcon style={{ color: '#3E8635', fontSize: '0.75rem' }} />
              ) : (
                <TimesCircleIcon style={{ color: '#C9190B', fontSize: '0.75rem' }} />
              )}
            </div>
            <span style={{ textAlign: 'left', lineHeight: '1.3', color: '#151515', fontSize: '0.75rem' }}>{validation.message}</span>
          </div>
        ))}
      </div>
    );
  };


  // Validate claim fields (username and role claims)
  const validateClaim = (claim: string): string => {
    if (!claim.trim()) {
      return '';
    }

    // Split by dots for segment validation
    const segments = claim.split('.');

    for (const segment of segments) {
      // Each segment must begin with a letter or underscore
      if (!/^[a-zA-Z_]/.test(segment)) {
        return 'Claim format is invalid. Each part must start with a letter or underscore.';
      }

      // Each segment may contain only letters, numbers, or underscores
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(segment)) {
        return 'Claim contains invalid characters. Use only letters, numbers, and underscores.';
      }
    }

    // Check for special characters and spaces
    if (/[^a-zA-Z0-9_.]/g.test(claim)) {
      return 'Claim contains invalid characters. Remove spaces and special characters.';
    }

    return '';
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validate provider name on change
    if (field === 'name' && typeof value === 'string') {
      const error = validateProviderName(value);
      setNameError(error);
    }

    // Validate username claim on change
    if (field === 'usernameClaim' && typeof value === 'string') {
      const error = validateClaim(value);
      setUsernameClaimError(error);
    }

    // Validate role claim on change
    if (field === 'roleClaim' && typeof value === 'string') {
      const error = validateClaim(value);
      setRoleClaimError(error);
    }

    // Validate scopes on change
    if (field === 'scopes' && Array.isArray(value)) {
      setHasInteractedWithScopes(true);
      // Only show error if user has interacted with scopes and they're now empty
      setScopesError(value.length === 0);
    }
  };

  const handleTestConnection = async () => {
    setTestConnectionStatus('testing');

    // Simulate test connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Cycle through three states: success -> partial -> error -> success...
    const currentCycle = testCycle;
    const nextCycle = (testCycle + 1) % 3;
    setTestCycle(nextCycle);

    if (currentCycle === 0) {
      // Full success
      setTestConnectionStatus('success');
      if (formData.type === 'OIDC') {
        setTestResults([
          {
            field: 'Issuer URL',
            value: formData.issuerUrl,
            status: 'success',
            details: 'Successfully discovered OIDC configuration from .well-known/openid_configuration'
          },
          {
            field: 'Authorization URL',
            value: 'Auto-discovered from OIDC metadata',
            status: 'success',
            details: 'Authorization endpoint discovered and reachable (HTTP 200)'
          },
          {
            field: 'Token URL',
            value: 'Auto-discovered from OIDC metadata',
            status: 'success',
            details: 'Token endpoint discovered and reachable (HTTP 404 for GET - endpoint accepts POST)'
          },
          {
            field: 'Userinfo URL',
            value: 'Auto-discovered from OIDC metadata',
            status: 'success',
            details: 'Userinfo endpoint discovered and reachable (HTTP 401 - authentication required)'
          },
          {
            field: 'JWKs URL',
            value: 'Auto-discovered from OIDC metadata',
            status: 'success',
            details: 'JSON Web Key Set endpoint discovered for token verification'
          }
        ]);
      } else {
        // OAuth2
        setTestResults([
          {
            field: 'Authorization URL',
            value: formData.authorizationUrl || 'Not configured',
            status: 'success',
            details: 'Authorization endpoint is reachable (HTTP 200)'
          },
          {
            field: 'Token URL',
            value: formData.tokenUrl || 'Not configured',
            status: 'success',
            details: 'Token endpoint is reachable (HTTP 404 for GET - endpoint accepts POST)'
          },
          {
            field: 'Userinfo URL',
            value: formData.userinfoUrl || 'Not configured',
            status: 'success',
            details: 'Userinfo endpoint is reachable (HTTP 401 - authentication required)'
          },
          ...(formData.issuerUrl ? [{
            field: 'Issuer URL (Optional)',
            value: formData.issuerUrl,
            status: 'success',
            details: 'Optional issuer URL is reachable for metadata discovery'
          }] : [])
        ]);
      }
    } else if (currentCycle === 1) {
      // Partial success - some validations failed
      setTestConnectionStatus('partial');
      if (formData.type === 'OIDC') {
        setTestResults([
          {
            field: 'Issuer URL',
            value: formData.issuerUrl,
            status: 'success',
            details: 'Successfully discovered OIDC configuration from .well-known/openid_configuration'
          },
          {
            field: 'Authorization URL',
            value: 'Auto-discovered from OIDC metadata',
            status: 'success',
            details: 'Authorization endpoint discovered and reachable (HTTP 200)'
          },
          {
            field: 'Token URL',
            value: 'Auto-discovered from OIDC metadata',
            status: 'error',
            details: 'Token endpoint discovered but not reachable: Connection timeout after 30 seconds'
          },
          {
            field: 'Userinfo URL',
            value: 'Auto-discovered from OIDC metadata',
            status: 'success',
            details: 'Userinfo endpoint discovered and reachable (HTTP 401 - authentication required)'
          },
          {
            field: 'JWKs URL',
            value: 'Auto-discovered from OIDC metadata',
            status: 'error',
            details: 'JSON Web Key Set endpoint discovered but not reachable: SSL certificate error'
          }
        ]);
      } else {
        // OAuth2
        setTestResults([
          {
            field: 'Authorization URL',
            value: formData.authorizationUrl || 'Not configured',
            status: 'success',
            details: 'Authorization endpoint is reachable (HTTP 200)'
          },
          {
            field: 'Token URL',
            value: formData.tokenUrl || 'Not configured',
            status: 'error',
            details: 'Token endpoint is not reachable: Connection timeout after 30 seconds'
          },
          {
            field: 'Userinfo URL',
            value: formData.userinfoUrl || 'Not configured',
            status: 'success',
            details: 'Userinfo endpoint is reachable (HTTP 401 - authentication required)'
          },
          ...(formData.issuerUrl ? [{
            field: 'Issuer URL (Optional)',
            value: formData.issuerUrl,
            status: 'error',
            details: 'Optional issuer URL is not reachable for metadata discovery'
          }] : [])
        ]);
      }
    } else {
      // Full error
      setTestConnectionStatus('error');
      if (formData.type === 'OIDC') {
        setTestResults([
          {
            field: 'Issuer URL',
            value: formData.issuerUrl,
            status: 'error',
            details: 'Unable to connect to issuer URL. Please check the URL and network connectivity.'
          },
          {
            field: 'OIDC Discovery',
            value: '.well-known/openid_configuration',
            status: 'error',
            details: 'Cannot discover OIDC configuration metadata due to issuer URL connection failure.'
          },
          {
            field: 'Authorization URL',
            value: 'Cannot be discovered',
            status: 'error',
            details: 'Authorization endpoint cannot be discovered without OIDC metadata.'
          },
          {
            field: 'Token URL',
            value: 'Cannot be discovered',
            status: 'error',
            details: 'Token endpoint cannot be discovered without OIDC metadata.'
          },
          {
            field: 'Userinfo URL',
            value: 'Cannot be discovered',
            status: 'error',
            details: 'Userinfo endpoint cannot be discovered without OIDC metadata.'
          },
          {
            field: 'JWKs URL',
            value: 'Cannot be discovered',
            status: 'error',
            details: 'JSON Web Key Set endpoint cannot be discovered without OIDC metadata.'
          }
        ]);
      } else {
        // OAuth2
        setTestResults([
          {
            field: 'Authorization URL',
            value: formData.authorizationUrl || 'Not configured',
            status: 'error',
            details: 'Unable to connect to authorization URL. Please check the URL and network connectivity.'
          },
          {
            field: 'Token URL',
            value: formData.tokenUrl || 'Not configured',
            status: 'error',
            details: 'Unable to connect to token URL. Please check the URL and network connectivity.'
          },
          {
            field: 'Userinfo URL',
            value: formData.userinfoUrl || 'Not configured',
            status: 'error',
            details: 'Unable to connect to userinfo URL. Please check the URL and network connectivity.'
          },
          ...(formData.issuerUrl ? [{
            field: 'Issuer URL (Optional)',
            value: formData.issuerUrl,
            status: 'error',
            details: 'Unable to connect to optional issuer URL. Please check the URL and network connectivity.'
          }] : [])
        ]);
      }
    }

    // Always open the modal to show results
    setIsTestModalOpen(true);
  };

  // Validate if all required fields are filled
  const isFormValid = () => {
    // Check provider name
    if (!formData.name.trim() || nameError) {
      return false;
    }

    // Check scopes
    if (formData.scopes.length === 0) {
      return false;
    }

    // Check client ID and secret
    if (!formData.clientId.trim() || !formData.clientSecret.trim()) {
      return false;
    }

    // Check protocol-specific required fields
    if (formData.type === 'OIDC') {
      if (!formData.issuerUrl.trim()) {
        return false;
      }
    } else if (formData.type === 'OAuth2') {
      if (!formData.authorizationUrl?.trim() ||
          !formData.tokenUrl?.trim() ||
          !formData.userinfoUrl?.trim()) {
        return false;
      }
    }

    // Check organization assignment fields
    if (formData.organizationAssignment === 'Static') {
      if (!formData.externalOrganizationName.trim()) {
        return false;
      }
    } else if (formData.organizationAssignment === 'Dynamic') {
      if (!formData.claimPath.trim()) {
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    console.log('Saving provider configuration:', formData);
    onNavigate('main', 'auth-providers');
  };

  // Navigation functions with unsaved changes detection
  const navigateWithConfirmation = React.useCallback((navigationFn: () => void) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => () => navigationFn());
      setIsLeaveModalOpen(true);
    } else {
      navigationFn();
    }
  }, [hasUnsavedChanges]);


  const handleCancel = () => {
    navigateWithConfirmation(() => onNavigate('main', 'auth-providers'));
  };

  const confirmLeave = () => {
    setIsLeaveModalOpen(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const cancelLeave = () => {
    setIsLeaveModalOpen(false);
    setPendingNavigation(null);
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
              navigateWithConfirmation(() => onNavigate('main', 'auth-providers'));
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
        <p style={{ marginTop: '8px', color: '#6a6e73', fontSize: '0.875rem', lineHeight: '1.5' }}>
          Set up how users will sign in and which organization they'll be assigned to.
        </p>
      </StackItem>


      {/* Main Form */}
      <StackItem>
        <Form>
          {/* Enabled Switch */}
          <FormGroup fieldId="provider-enabled">
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
              <FlexItem>
                <label htmlFor="provider-enabled" style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                  Enabled
                </label>
              </FlexItem>
              <FlexItem>
                <Popover
                  triggerAction="hover"
                  headerContent="Provider Status"
                  bodyContent={
                    <div>
                      <p>Turn this on to let users sign in with this provider.</p>
                      <p>You can turn it off anytime without losing your settings.</p>
                    </div>
                  }
                  position="right"
                >
                  <Button
                    variant="plain"
                    size="sm"
                    icon={<InfoAltIcon style={{ color: '#6a6e73' }} />}
                    aria-label="Enabled help"
                  />
                </Popover>
              </FlexItem>
            </Flex>
            <Switch
              id="provider-enabled"
              aria-label="Enable authentication provider"
              isChecked={formData.enabled}
              onChange={(_event, checked) => handleInputChange('enabled', checked)}
              style={{ marginTop: '16px' }}
            />
          </FormGroup>

          {/* Provider Name */}
          <FormGroup
            fieldId="provider-name"
            validated={nameError ? 'error' : 'default'}
          >
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
              <FlexItem>
                <label htmlFor="provider-name" style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                  Provider name {!isEdit && <span style={{ color: '#c9190b' }}>*</span>}
                </label>
              </FlexItem>
              {!isEdit && (
                <FlexItem>
                  <Popover
                    triggerAction="hover"
                    headerContent="Provider Name Requirements"
                    bodyContent={<ProviderNameValidationTooltip name={formData.name} />}
                    position="right"
                  >
                    <Button
                      variant="plain"
                      size="sm"
                      icon={<InfoAltIcon style={{ color: '#6a6e73' }} />}
                      aria-label="Provider name requirements"
                    />
                  </Popover>
                </FlexItem>
              )}
            </Flex>
            <div style={{ marginTop: '16px' }}>
              {isEdit ? (
                <div
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d2d2d2',
                    borderRadius: '3px',
                    backgroundColor: '#f5f5f5',
                    fontFamily: 'var(--pf-v6-global--FontFamily--text)',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    color: '#6a6e73',
                    minHeight: '36px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {formData.name}
                </div>
              ) : (
                <TextInput
                  isRequired
                  type="text"
                  id="provider-name"
                  value={formData.name}
                  onChange={(_event, value) => handleInputChange('name', value)}
                  placeholder=""
                  validated={nameError ? 'error' : 'default'}
                />
              )}
            </div>
            {!isEdit && nameError && (
              <HelperText>
                <HelperTextItem variant="error" icon={<ExclamationCircleIcon />}>
                  {nameError}
                </HelperTextItem>
              </HelperText>
            )}
            {isEdit && (
              <HelperText>
                <HelperTextItem variant="indeterminate">
                  You can't change the provider name after it's created
                </HelperTextItem>
              </HelperText>
            )}
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
              </FormGroup>

              <FormGroup label="Issuer URL" fieldId="issuer-url">
                <TextInput
                  type="url"
                  id="issuer-url"
                  value={formData.issuerUrl}
                  onChange={(_event, value) => handleInputChange('issuerUrl', value)}
                  placeholder=""
                />
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

          <Divider style={{ margin: '32px 0 16px 0' }} />

          {/* User Identity & Authorization */}
          <Title headingLevel="h3" size="lg" style={{ marginBottom: '8px', fontWeight: '500' }}>
            User identity & authorization
          </Title>

          {/* Scopes Section */}
          <ScopeInput
            scopes={formData.scopes}
            onScopesChange={(scopes) => handleInputChange('scopes', scopes)}
            isRequired={true}
            hasError={scopesError && hasInteractedWithScopes}
          />

          {/* Username Claim */}
          <FormGroup fieldId="username-claim" validated={usernameClaimError ? 'error' : 'default'}>
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
              <FlexItem>
                <label htmlFor="username-claim" style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                  Username claim
                </label>
              </FlexItem>
              <FlexItem>
                <Popover
                  triggerAction="hover"
                  headerContent="Username Claim"
                  bodyContent={
                    <div>
                      <p><strong>Purpose:</strong> The claim field that contains the username.</p>
                      <p><strong>Format:</strong> Use dot notation to access nested fields (e.g., 'custom_claims.user_id').</p>
                      <p><strong>Requirements:</strong> Each segment must start with a letter or underscore and contain only letters, numbers, or underscores.</p>
                    </div>
                  }
                  position="right"
                >
                  <Button
                    variant="plain"
                    size="sm"
                    icon={<InfoAltIcon style={{ color: '#6a6e73' }} />}
                    aria-label="Username claim help"
                  />
                </Popover>
              </FlexItem>
            </Flex>
            <TextInput
              type="text"
              id="username-claim"
              value={formData.usernameClaim}
              onChange={(_event, value) => handleInputChange('usernameClaim', value)}
              placeholder="e.g. preferred_username"
              validated={usernameClaimError ? 'error' : 'default'}
            />
            {usernameClaimError && (
              <HelperText>
                <HelperTextItem variant="error" icon={<ExclamationCircleIcon />}>
                  {usernameClaimError}
                </HelperTextItem>
              </HelperText>
            )}
          </FormGroup>

          {/* Role Claim */}
          <FormGroup fieldId="role-claim" validated={roleClaimError ? 'error' : 'default'}>
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
              <FlexItem>
                <label htmlFor="role-claim" style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                  Role claim
                </label>
              </FlexItem>
              <FlexItem>
                <Popover
                  triggerAction="hover"
                  headerContent="Role Claim"
                  bodyContent={
                    <div>
                      <p><strong>Purpose:</strong> The claim field that contains user roles or group memberships for authorization.</p>
                      <p><strong>Configuration:</strong> Refer to your provider's documentation for the correct claim name.</p>
                      <p><strong>Common examples:</strong> groups, roles, authorities</p>
                    </div>
                  }
                  position="right"
                >
                  <Button
                    variant="plain"
                    size="sm"
                    icon={<InfoAltIcon style={{ color: '#6a6e73' }} />}
                    aria-label="Role claim help"
                  />
                </Popover>
              </FlexItem>
            </Flex>
            <TextInput
              type="text"
              id="role-claim"
              value={formData.roleClaim}
              onChange={(_event, value) => handleInputChange('roleClaim', value)}
              placeholder="e.g., groups, roles, authorities"
              validated={roleClaimError ? 'error' : 'default'}
            />
            {roleClaimError && (
              <HelperText>
                <HelperTextItem variant="error" icon={<ExclamationCircleIcon />}>
                  {roleClaimError}
                </HelperTextItem>
              </HelperText>
            )}
          </FormGroup>

          <Divider style={{ margin: '24px 0' }} />

          {/* Organization Assignment */}
          <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px', fontWeight: '500' }}>
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
              </FormGroup>

              <FormGroup label="Organization name prefix" fieldId="org-name-prefix">
                <TextInput
                  type="text"
                  id="org-name-prefix"
                  value={formData.organizationNamePrefix}
                  onChange={(_event, value) => handleInputChange('organizationNamePrefix', value)}
                  placeholder=""
                />
              </FormGroup>

              <FormGroup label="Organization name suffix" fieldId="org-name-suffix">
                <TextInput
                  type="text"
                  id="org-name-suffix"
                  value={formData.organizationNameSuffix}
                  onChange={(_event, value) => handleInputChange('organizationNameSuffix', value)}
                  placeholder=""
                />
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
              </FormGroup>

              <FormGroup label="Organization name suffix" fieldId="org-name-suffix-peruser">
                <TextInput
                  type="text"
                  id="org-name-suffix-peruser"
                  value={formData.organizationNameSuffix}
                  onChange={(_event, value) => handleInputChange('organizationNameSuffix', value)}
                  placeholder=""
                />
              </FormGroup>
            </>
          )}


          {/* Actions */}
          <ActionGroup style={{ marginTop: '32px' }}>
            <Button variant="primary" onClick={handleSave} isDisabled={!isFormValid()}>
              Save
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
        variant={ModalVariant.large}
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        position="top"
      >
        <ModalHeader title="Test connection results" />
        <ModalBody tabIndex={0}>
          <Stack hasGutter>
            <StackItem>
              {testConnectionStatus === 'success' ? (
                <>
                  <Alert variant="success" isInline title="Connection test successful" />
                  <p style={{ marginTop: '1rem', color: '#6a6e73', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    Great! We successfully connected to your provider. Here's what we found:
                  </p>
                </>
              ) : testConnectionStatus === 'partial' ? (
                <>
                  <Alert variant="warning" isInline title="Connection partially successful" />
                  <p style={{ marginTop: '1rem', color: '#6a6e73', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    We found some issues with your configuration. Here's what needs your attention:
                  </p>
                </>
              ) : (
                <>
                  <Alert variant="danger" isInline title="Connection failed" />
                  <p style={{ marginTop: '1rem', color: '#6a6e73', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    We couldn't connect to your provider. Check the details below and verify your settings:
                  </p>
                </>
              )}
            </StackItem>

            <StackItem>
              <Table variant="compact">
                <Thead>
                  <Tr>
                    <Th>Field</Th>
                    <Th width={30}>Value</Th>
                    <Th width={10}>Status</Th>
                    <Th width={40}>Details</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {testResults.map((result, index) => (
                    <Tr key={index}>
                      <Td>{result.field}</Td>
                      <Td style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.5', wordBreak: 'break-all' }}>
                        {result.value}
                      </Td>
                      <Td>
                        {result.status === 'success' ? (
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '4px' }} />
                        ) : (
                          <ExclamationTriangleIcon style={{ color: '#C9190B', marginRight: '4px' }} />
                        )}
                      </Td>
                      <Td style={{ fontSize: '0.875rem', color: '#6a6e73', lineHeight: '1.5' }}>
                        {result.details}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsTestModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Leave Confirmation Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={isLeaveModalOpen}
        onClose={cancelLeave}
        position="top"
      >
        <ModalHeader title="Unsaved changes" />
        <ModalBody>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#151515' }}>
            Your changes haven't been saved yet. To keep your work, save before leaving.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="danger" onClick={confirmLeave}>
            Leave without saving
          </Button>
          <Button variant="link" onClick={cancelLeave}>
            Stay on page
          </Button>
        </ModalFooter>
      </Modal>
    </Stack>
  );
};

export default ProviderFormPage;