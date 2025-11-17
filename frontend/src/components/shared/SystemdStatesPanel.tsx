import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  Title,
  Card,
  CardBody,
  CardTitle,
  Label,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Divider,
  Content,
  Stack,
  StackItem,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';

interface SystemdStatesPanelProps {
  children: React.ReactNode;
}

// Component that wraps the application and provides a systemd states reference panel for developers.
// Press 's' key to show/hide this panel.
const SystemdStatesPanel: React.FC<SystemdStatesPanelProps> = ({ children }) => {
  // State: Is the systemd states panel open?
  const [isExpanded, setIsExpanded] = useState(false);

  // Listen for 's' key press to toggle the panel
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.key === "s" &&
        event.target instanceof HTMLElement &&
        event.target.tagName !== "INPUT" &&
        event.target.tagName !== "TEXTAREA"
      ) {
        setIsExpanded((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);
  // Helper function to get color for Enable states
  const getEnableStateColor = (state: string) => {
    switch (state) {
      case 'enabled':
      case 'enabled-runtime':
      case 'static':
      case 'alias':
      case 'linked':
      case 'linked-runtime':
      case 'indirect':
      case 'generated':
        return 'blue';
      case 'bad':
        return 'red';
      default:
        return 'grey';
    }
  };

  // Helper function to get color for Load states
  const getLoadStateColor = (state: string) => {
    switch (state) {
      case 'loaded':
      case 'merged':
      case 'stub':
        return 'blue';
      case 'error':
      case 'bad-setting':
        return 'red';
      default:
        return 'grey';
    }
  };

  // Helper function to get color for combined Active/Sub states
  const getActiveSubStateColor = (activeState: string, subState: string) => {
    // Red for clear errors only
    if (activeState === 'failed' || subState === 'failed' ||
        subState === 'stop-sigabrt' || subState === 'stop-sigkill' ||
        subState === 'stop-sigterm') {
      return 'red';
    }

    // Blue for active/running states
    if (activeState === 'active' && (subState === 'running' || subState === 'listening' ||
        subState === 'mounted' || subState === 'plugged' || subState === 'bound')) {
      return 'blue';
    }

    // Blue for other positive states
    if (activeState === 'active' || activeState === 'activating' ||
        activeState === 'reloading' || activeState === 'refreshing') {
      return 'blue';
    }

    // Everything else is grey (inactive, disabled, etc.)
    return 'grey';
  };

  const enableStates = [
    { state: 'alias', description: 'Unit file is an alias' },
    { state: 'bad', description: 'Unit file is bad' },
    { state: 'disabled', description: 'Unit is not enabled' },
    { state: 'enabled', description: 'Unit is enabled' },
    { state: 'enabled-runtime', description: 'Unit is enabled for runtime only' },
    { state: 'generated', description: 'Unit file was generated' },
    { state: 'indirect', description: 'Unit is enabled indirectly' },
    { state: 'linked', description: 'Unit file is linked' },
    { state: 'linked-runtime', description: 'Unit file is linked for runtime only' },
    { state: 'masked', description: 'Unit is masked' },
    { state: 'masked-runtime', description: 'Unit is masked for runtime only' },
    { state: 'static', description: 'Unit file is static' },
    { state: 'transient', description: 'Unit is transient' },
  ];

  const loadStates = [
    { state: 'stub', description: 'Unit file stub' },
    { state: 'loaded', description: 'Unit configuration loaded successfully' },
    { state: 'not-found', description: 'Unit file not found' },
    { state: 'bad-setting', description: 'Unit file has bad settings' },
    { state: 'error', description: 'Error loading unit file' },
    { state: 'merged', description: 'Unit file merged' },
    { state: 'masked', description: 'Unit file is masked' },
  ];

  const combinedStates = [
    { activeState: 'active', subState: 'running', description: 'Service is active and running' },
    { activeState: 'active', subState: 'exited', description: 'Service completed successfully' },
    { activeState: 'active', subState: 'listening', description: 'Socket is active and listening' },
    { activeState: 'active', subState: 'mounted', description: 'Mount is active and mounted' },
    { activeState: 'active', subState: 'plugged', description: 'Device is active and plugged' },
    { activeState: 'active', subState: 'bound', description: 'Service is active and bound' },
    { activeState: 'inactive', subState: 'dead', description: 'Service is stopped' },
    { activeState: 'inactive', subState: 'failed', description: 'Service failed to start' },
    { activeState: 'failed', subState: 'failed', description: 'Service has failed' },
    { activeState: 'activating', subState: 'start', description: 'Service is starting up' },
    { activeState: 'activating', subState: 'start-pre', description: 'Running pre-start commands' },
    { activeState: 'activating', subState: 'start-post', description: 'Running post-start commands' },
    { activeState: 'activating', subState: 'auto-restart', description: 'Service is auto-restarting' },
    { activeState: 'deactivating', subState: 'stop', description: 'Service is stopping' },
    { activeState: 'deactivating', subState: 'stop-pre', description: 'Running pre-stop commands' },
    { activeState: 'deactivating', subState: 'stop-post', description: 'Running post-stop commands' },
    { activeState: 'deactivating', subState: 'stop-sigterm', description: 'Stopping with SIGTERM' },
    { activeState: 'deactivating', subState: 'stop-sigkill', description: 'Force stopping with SIGKILL' },
    { activeState: 'deactivating', subState: 'stop-sigabrt', description: 'Stopped with SIGABRT (error)' },
    { activeState: 'reloading', subState: 'reload', description: 'Service is reloading configuration' },
    { activeState: 'maintenance', subState: 'maintenance', description: 'Service is in maintenance mode' },
  ];

  const renderStateSection = (title: string, states: Array<{state: string, description: string}>, getColor: (state: string) => string) => (
    <StackItem>
      <Card>
        <CardTitle>
          <Title headingLevel="h3" size="md">{title}</Title>
        </CardTitle>
        <CardBody>
          <Grid hasGutter>
            {states.map(({ state, description }) => (
              <GridItem span={12} key={state}>
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} className="pf-v6-u-mb-sm">
                  <FlexItem>
                    <Label
                      color={getColor(state) as any}
                      variant="outline"
                      className="pf-v6-u-font-family-monospace"
                    >
                      {state}
                    </Label>
                  </FlexItem>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <small className="pf-v6-u-color-200">
                      {description}
                    </small>
                  </FlexItem>
                </Flex>
              </GridItem>
            ))}
          </Grid>
        </CardBody>
      </Card>
    </StackItem>
  );

  const renderCombinedStateSection = (title: string, states: Array<{activeState: string, subState: string, description: string}>) => (
    <StackItem>
      <Card>
        <CardTitle>
          <Title headingLevel="h3" size="md">{title}</Title>
        </CardTitle>
        <CardBody>
          <Grid hasGutter>
            {states.map(({ activeState, subState, description }, index) => (
              <GridItem span={12} key={`${activeState}-${subState}-${index}`}>
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} className="pf-v6-u-mb-sm">
                  <FlexItem>
                    <Label
                      color={getActiveSubStateColor(activeState, subState) as any}
                      variant="outline"
                      className="pf-v6-u-font-family-monospace"
                    >
                      {`${activeState} (${subState})`}
                    </Label>
                  </FlexItem>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <small className="pf-v6-u-color-200">
                      {description}
                    </small>
                  </FlexItem>
                </Flex>
              </GridItem>
            ))}
          </Grid>
        </CardBody>
      </Card>
    </StackItem>
  );

  const panelContent = (
    <DrawerPanelContent isResizable defaultSize="500px" minSize="400px">
      <DrawerHead>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2" size="xl">
              Systemd States Reference
            </Title>
          </StackItem>
          <StackItem>
            <p>Complete reference for systemd unit states with proper PatternFly Label styling</p>
          </StackItem>
        </Stack>
        <DrawerActions>
          <DrawerCloseButton onClick={() => setIsExpanded(false)} />
        </DrawerActions>
      </DrawerHead>
      <DrawerContentBody style={{ maxHeight: '100vh', overflowY: 'auto', padding: '16px' }}>
        <Stack hasGutter>
          <StackItem>
            <HelperText>
              <HelperTextItem variant="indeterminate">
                Press 's' to toggle this panel
              </HelperTextItem>
            </HelperText>
          </StackItem>

          {renderStateSection('Enable States', enableStates, getEnableStateColor)}
          <Divider />
          {renderStateSection('Load States', loadStates, getLoadStateColor)}
          <Divider />
          {renderCombinedStateSection('Active/Sub States (Combined)', combinedStates)}

          <StackItem>
            <Card className="pf-v6-u-background-color-100">
              <CardTitle>
                <Title headingLevel="h3" size="md">Usage Example</Title>
              </CardTitle>
              <CardBody>
                <Content>
                  <pre className="pf-v6-u-font-family-monospace pf-v6-u-font-size-sm">
{`<Label
  color={getActiveSubStateColor(activeState, subState)}
  variant="outline"
>
  {activeState} ({subState})
</Label>`}
                  </pre>
                </Content>
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </DrawerContentBody>
    </DrawerPanelContent>
  );

  return (
    <Drawer isExpanded={isExpanded} position="right">
      <DrawerContent panelContent={panelContent}>
        <DrawerContentBody>{children}</DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SystemdStatesPanel;