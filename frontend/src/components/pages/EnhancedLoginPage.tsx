import React, { useState } from 'react';
import {
  Page,
  PageSection,
  Title,
  Button,
  Card,
  CardBody,
  Stack,
  StackItem,
  Bullseye,
  Flex,
  FlexItem,
  Divider,
  Alert,
} from '@patternfly/react-core';
import {
  GoogleIcon,
  GithubIcon,
  ExternalLinkAltIcon,
  UserIcon,
  ArrowLeftIcon,
} from '@patternfly/react-icons';
import { ViewType, NavigationItemId, NavigationParams } from '../../types/app';

interface EnhancedLoginPageProps {
  onNavigate: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
  onBack?: () => void;
}

interface AuthProvider {
  id: string;
  displayName: string;
  enabled: boolean;
  type: 'internal' | 'google' | 'github' | 'oidc' | 'saml';
  icon?: React.ReactNode;
  description?: string;
}

const EnhancedLoginPage: React.FC<EnhancedLoginPageProps> = ({ onNavigate, onBack }) => {
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sample authentication providers (in real app, this would come from API)
  const authProviders: AuthProvider[] = [
    {
      id: 'internal',
      displayName: 'Internal Account',
      enabled: true,
      type: 'internal',
      icon: <UserIcon />,
      description: 'Use your Flight Control account'
    },
    {
      id: 'google',
      displayName: 'Google Workspace',
      enabled: true,
      type: 'google',
      icon: <GoogleIcon />,
      description: 'Sign in with your Google account'
    },
    {
      id: 'github',
      displayName: 'GitHub Enterprise',
      enabled: true,
      type: 'github',
      icon: <GithubIcon />,
      description: 'Sign in with your GitHub account'
    },
    {
      id: 'okta',
      displayName: 'Customer-B Okta',
      enabled: false, // Disabled provider won't show
      type: 'oidc',
      icon: <ExternalLinkAltIcon />,
      description: 'Sign in with Okta'
    },
  ];

  const enabledProviders = authProviders.filter(provider => provider.enabled);

  const handleProviderLogin = async (providerId: string) => {
    setIsLoggingIn(providerId);
    setLoginError(null);

    try {
      // Simulate authentication flow
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (providerId === 'internal') {
        // For internal auth, navigate to the existing login form
        onNavigate('login');
      } else {
        // For external providers, simulate OAuth redirect
        console.log(`Initiating ${providerId} OAuth flow...`);

        // Simulate successful authentication
        // In real implementation, this would redirect to provider's OAuth endpoint
        // and handle the callback

        // For demo purposes, simulate success and navigate back to main app
        onNavigate('main', 'overview');
      }
    } catch (error) {
      setLoginError(`Failed to authenticate with ${providerId}. Please try again.`);
    } finally {
      setIsLoggingIn(null);
    }
  };

  const getProviderButtonColor = (type: string) => {
    switch (type) {
      case 'google':
        return '#4285f4';
      case 'github':
        return '#333';
      case 'internal':
        return '#0066cc';
      default:
        return '#6a6e73';
    }
  };

  return (
    <Page>
      <PageSection>
        <Bullseye>
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <Card>
              <CardBody style={{ padding: '40px' }}>
                <Stack hasGutter>
                  {/* Back Button */}
                  {onBack && (
                    <StackItem>
                      <Button
                        variant="plain"
                        onClick={onBack}
                        style={{ padding: '8px', marginBottom: '16px' }}
                      >
                        <ArrowLeftIcon style={{ marginRight: '8px' }} />
                        Back to Application
                      </Button>
                    </StackItem>
                  )}

                  {/* Header */}
                  <StackItem>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                      {/* Flight Control Logo */}
                      <div style={{ marginBottom: '16px' }}>
                        <svg
                          width="180"
                          height="24"
                          viewBox="0 0 1016.11 164.44"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ margin: '0 auto' }}
                        >
                          <defs>
                            <style>
                              {`.cls-1 { fill: #1ba8ff; }`}
                            </style>
                          </defs>
                          <g id="svg1">
                            <g>
                              <g>
                                <path className="cls-1" d="M208.53,119.52V23.34h63.27v8.8h-53.51v87.39h-9.76ZM217.24,78.71v-8.79h48.77v8.79h-48.77Z"/>
                                <path className="cls-1" d="M285.78,119.52V17.57h9.36v101.96h-9.36Z"/>
                                <path className="cls-1" d="M321.76,31.45c-1.93,0-3.56-.69-4.88-2.06-1.32-1.37-1.98-3.02-1.98-4.95s.66-3.55,1.98-4.88c1.31-1.33,2.94-1.99,4.88-1.99s3.56.64,4.88,1.92c1.32,1.28,1.98,2.89,1.98,4.81s-.64,3.71-1.91,5.08c-1.27,1.38-2.92,2.06-4.94,2.06ZM317.02,119.52V47.38h9.36v72.14h-9.36Z"/>
                                <path className="cls-1" d="M376.07,116.78c-6.59,0-12.52-1.49-17.79-4.47-5.27-2.98-9.42-7.12-12.46-12.43-3.03-5.32-4.55-11.41-4.55-18.28s1.52-12.94,4.55-18.21,7.18-9.37,12.46-12.3c5.27-2.93,11.2-4.39,17.79-4.39,6.15,0,11.68,1.33,16.61,3.98,4.92,2.66,8.83,6.6,11.73,11.82,2.9,5.22,4.35,11.59,4.35,19.1s-1.45,13.88-4.35,19.1c-2.9,5.22-6.81,9.2-11.73,11.95-4.92,2.75-10.46,4.12-16.61,4.12ZM377.78,146.87c-6.33,0-12.39-.96-18.19-2.89-5.8-1.92-10.5-4.67-14.11-8.24l4.74-7.42c3.25,3.03,7.27,5.43,12.06,7.22,4.79,1.79,9.86,2.68,15.23,2.68,8.79,0,15.24-2.13,19.38-6.39,4.13-4.26,6.2-10.88,6.2-19.85v-18l1.32-12.37-.93-12.37v-21.85h8.97v63.35c0,12.46-2.92,21.59-8.76,27.41-5.84,5.82-14.48,8.73-25.9,8.73ZM376.99,108.12c5.1,0,9.62-1.12,13.58-3.37,3.95-2.24,7.07-5.36,9.36-9.34,2.28-3.99,3.43-8.59,3.43-13.81s-1.14-9.8-3.43-13.74c-2.29-3.94-5.4-7.03-9.36-9.27s-8.48-3.37-13.58-3.37-9.51,1.12-13.51,3.37c-4,2.25-7.12,5.34-9.36,9.27-2.24,3.94-3.36,8.52-3.36,13.74s1.12,9.82,3.36,13.81c2.24,3.99,5.36,7.1,9.36,9.34,4,2.25,8.5,3.37,13.51,3.37Z"/>
                                <path className="cls-1" d="M434.33,119.52V17.57h9.36v49.6l-1.84-3.71c2.19-5.22,5.71-9.32,10.54-12.3,4.83-2.98,10.59-4.46,17.27-4.46,5.62,0,10.57,1.12,14.83,3.36,4.26,2.25,7.6,5.66,10.02,10.24,2.41,4.58,3.63,10.35,3.63,17.31v41.91h-9.36v-40.95c0-7.6-1.82-13.35-5.47-17.25-3.64-3.89-8.76-5.84-15.36-5.84-4.92,0-9.2,1.03-12.85,3.09-3.65,2.06-6.46,5.04-8.44,8.93-1.98,3.89-2.97,8.59-2.97,14.08v37.92h-9.36Z"/>
                                <path className="cls-1" d="M508.41,55.49v-8.11h42.84v8.11h-42.84ZM541.1,120.21c-6.5,0-11.51-1.83-15.02-5.5-3.52-3.66-5.27-8.84-5.27-15.52V31.45h9.36v67.19c0,4.22,1.03,7.47,3.1,9.76,2.06,2.29,5.03,3.43,8.9,3.43,4.13,0,7.56-1.24,10.28-3.71l3.29,7c-1.84,1.74-4.07,3.02-6.65,3.85-2.6.82-5.25,1.24-7.98,1.24Z"/>
                                <path className="cls-1" d="M616.59,120.68c-7.03,0-13.51-1.21-19.44-3.64-5.93-2.43-11.07-5.86-15.42-10.31-4.35-4.44-7.75-9.64-10.21-15.6-2.46-5.95-3.69-12.5-3.69-19.65s1.23-13.7,3.69-19.65c2.46-5.95,5.89-11.15,10.28-15.6,4.39-4.44,9.56-7.88,15.49-10.31,5.93-2.42,12.41-3.64,19.45-3.64s13.68,1.26,19.7,3.78c6.02,2.52,11.14,6.25,15.36,11.2l-8.57,8.66c-3.52-3.85-7.47-6.71-11.87-8.59s-9.09-2.82-14.1-2.82-9.99.92-14.43,2.75c-4.44,1.83-8.29,4.4-11.53,7.7-3.25,3.3-5.78,7.22-7.58,11.75-1.8,4.53-2.7,9.46-2.7,14.77s.9,10.23,2.7,14.77c1.8,4.53,4.33,8.45,7.58,11.74,3.25,3.3,7.09,5.87,11.53,7.7,4.44,1.83,9.25,2.75,14.43,2.75s9.71-.94,14.1-2.82c4.39-1.88,8.35-4.79,11.87-8.73l8.57,8.66c-4.22,4.95-9.34,8.7-15.36,11.27-6.02,2.56-12.63,3.85-19.84,3.85Z"/>
                                <path className="cls-1" d="M690.27,120.41c-6.94,0-13.16-1.6-18.65-4.81-5.49-3.21-9.82-7.62-12.98-13.26-3.16-5.63-4.74-12.02-4.74-19.17s1.58-13.63,4.74-19.17c3.16-5.54,7.47-9.91,12.92-13.12,5.45-3.21,11.69-4.81,18.72-4.81s13.16,1.58,18.65,4.74c5.49,3.16,9.8,7.53,12.92,13.12,3.12,5.59,4.68,12,4.68,19.24s-1.56,13.65-4.68,19.24c-3.12,5.59-7.43,9.99-12.92,13.19-5.49,3.21-11.71,4.81-18.65,4.81ZM690.27,108.86c4.48,0,8.5-1.05,12.06-3.16,3.56-2.11,6.35-5.1,8.37-9,2.02-3.89,3.03-8.4,3.03-13.53s-1.01-9.73-3.03-13.54c-2.02-3.8-4.81-6.75-8.37-8.86-3.56-2.11-7.58-3.16-12.06-3.16s-8.48,1.05-11.99,3.16c-3.52,2.11-6.33,5.06-8.44,8.86-2.11,3.8-3.16,8.31-3.16,13.54s1.05,9.64,3.16,13.53c2.11,3.9,4.92,6.9,8.44,9,3.51,2.11,7.51,3.16,11.99,3.16Z"/>
                                <path className="cls-1" d="M739.84,119.58V46.76h12.12v19.65l-1.97-5.22c2.28-4.76,5.8-8.47,10.54-11.13,4.74-2.65,10.28-3.98,16.61-3.98,5.71,0,10.74,1.15,15.09,3.43,4.35,2.29,7.76,5.77,10.22,10.44,2.46,4.67,3.69,10.58,3.69,17.72v41.91h-12.65v-40.4c0-7.05-1.65-12.37-4.94-15.94-3.3-3.57-7.93-5.36-13.91-5.36-4.48,0-8.39.92-11.73,2.75-3.34,1.83-5.91,4.53-7.71,8.1-1.8,3.57-2.7,8.02-2.7,13.33v37.51h-12.65Z"/>
                                <path className="cls-1" d="M815.36,57.61v-10.86h44.55v10.86h-44.55ZM849.37,120.41c-7.03,0-12.48-1.97-16.35-5.91-3.86-3.94-5.8-9.57-5.8-16.9V30.82h12.65v66.23c0,3.94.95,6.96,2.84,9.07,1.89,2.11,4.59,3.16,8.1,3.16,3.96,0,7.25-1.14,9.89-3.43l3.95,9.48c-1.93,1.74-4.24,3.02-6.92,3.85s-5.47,1.24-8.37,1.24Z"/>
                                <path className="cls-1" d="M875.73,119.58V46.76h12.12v19.78l-1.18-4.95c1.93-5.03,5.18-8.89,9.75-11.54,4.57-2.65,10.2-3.98,16.87-3.98v12.78c-.52-.09-1.03-.14-1.52-.14h-1.38c-6.77,0-12.12,2.11-16.08,6.32-3.96,4.22-5.93,10.31-5.93,18.28v36.28h-12.65Z"/>
                                <path className="cls-1" d="M953.89,120.41c-6.94,0-13.16-1.6-18.65-4.81-5.49-3.21-9.82-7.62-12.98-13.26-3.16-5.63-4.74-12.02-4.74-19.17s1.58-13.63,4.74-19.17c3.16-5.54,7.47-9.91,12.92-13.12,5.45-3.21,11.69-4.81,18.72-4.81s13.16,1.58,18.65,4.74c5.49,3.16,9.8,7.53,12.92,13.12,3.12,5.59,4.68,12,4.68,19.24s-1.56,13.65-4.68,19.24c-3.12,5.59-7.43,9.99-12.92,13.19-5.49,3.21-11.71,4.81-18.65,4.81ZM953.89,108.86c4.48,0,8.5-1.05,12.06-3.16,3.56-2.11,6.35-5.1,8.37-9,2.02-3.89,3.03-8.4,3.03-13.53s-1.01-9.73-3.03-13.54c-2.02-3.8-4.81-6.75-8.37-8.86-3.56-2.11-7.58-3.16-12.06-3.16s-8.48,1.05-11.99,3.16c-3.52,2.11-6.33,5.06-8.44,8.86-2.11,3.8-3.16,8.31-3.16,13.54s1.05,9.64,3.16,13.53c2.11,3.9,4.92,6.9,8.44,9,3.51,2.11,7.51,3.16,11.99,3.16Z"/>
                                <path className="cls-1" d="M1003.45,119.58V17.63h12.65v101.96h-12.65Z"/>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <Title headingLevel="h1" size="xl">
                        Sign in to Flight Control
                      </Title>
                      <p style={{ color: '#6a6e73', marginTop: '8px' }}>
                        Choose your authentication method to continue
                      </p>
                    </div>
                  </StackItem>

                  {/* Error Alert */}
                  {loginError && (
                    <StackItem>
                      <Alert variant="danger" isInline title="Authentication failed">
                        {loginError}
                      </Alert>
                    </StackItem>
                  )}

                  {/* Provider Buttons */}
                  <StackItem>
                    <Stack hasGutter>
                      {enabledProviders.map((provider, index) => (
                        <StackItem key={provider.id}>
                          <Button
                            variant="secondary"
                            size="lg"
                            isBlock
                            onClick={() => handleProviderLogin(provider.id)}
                            isLoading={isLoggingIn === provider.id}
                            isDisabled={!!isLoggingIn}
                            style={{
                              height: '60px',
                              borderColor: getProviderButtonColor(provider.type),
                              '--pf-v6-c-button--m-secondary--Color': getProviderButtonColor(provider.type),
                            } as React.CSSProperties}
                          >
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <FlexItem style={{ color: getProviderButtonColor(provider.type) }}>
                                {provider.icon}
                              </FlexItem>
                              <FlexItem>
                                <div style={{ textAlign: 'left' }}>
                                  <div style={{ fontWeight: '600', fontSize: '16px' }}>
                                    {isLoggingIn === provider.id ? 'Signing in...' : `Continue with ${provider.displayName}`}
                                  </div>
                                  <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '2px' }}>
                                    {provider.description}
                                  </div>
                                </div>
                              </FlexItem>
                            </Flex>
                          </Button>
                          {index < enabledProviders.length - 1 && (
                            <div style={{ margin: '12px 0' }}>
                              <Divider />
                            </div>
                          )}
                        </StackItem>
                      ))}
                    </Stack>
                  </StackItem>

                  {/* Footer */}
                  <StackItem style={{ marginTop: '24px' }}>
                    <div style={{ textAlign: 'center', fontSize: '14px', color: '#6a6e73' }}>
                      <p>
                        Having trouble signing in?{' '}
                        <Button variant="link" style={{ padding: 0, fontSize: '14px' }}>
                          Contact your administrator
                        </Button>
                      </p>
                    </div>
                  </StackItem>
                </Stack>
              </CardBody>
            </Card>
          </div>
        </Bullseye>
      </PageSection>
    </Page>
  );
};

export default EnhancedLoginPage;