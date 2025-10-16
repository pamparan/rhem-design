/**
 * RHEM Design Controls
 *
 * A control panel for toggling various UI features during design reviews.
 * Press 'D' key to show/hide this panel.
 *
 * Features:
 * - Toggle Post-Restore Banner on/off
 * - More controls can be added as needed
 *
 * Settings are persisted in localStorage and accessible across all pages.
 */

import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  Title,
  Switch,
  Stack,
  StackItem,
  Button,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import { useDesignControls } from "../../hooks/useDesignControls";

interface DesignControlsProps {
  children: React.ReactNode;
}

// Component that wraps the application and provides a control panel for toggling various UI features during design reviews.
// Press 'd' key to show/hide this panel.
const DesignControls: React.FC<DesignControlsProps> = ({ children }) => {
  const { getSetting, setSetting, resetAll } = useDesignControls();
  // State: Is the design controls panel open?
  const [isExpanded, setIsExpanded] = useState(false);

  // Listen for 'd' key press to toggle the panel
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.key === "d" &&
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

  const panelContent = (
    <DrawerPanelContent isResizable defaultSize="400px" minSize="300px">
      <DrawerHead>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2" size="xl">
              RHEM Design Controls
            </Title>
          </StackItem>
          <StackItem>
            <p>Configure settings in the RHEM design application</p>
          </StackItem>
        </Stack>
        <DrawerActions>
          <DrawerCloseButton onClick={() => setIsExpanded(false)} />
        </DrawerActions>
      </DrawerHead>
      <DrawerContentBody>
        <Stack hasGutter>
          <StackItem>
            <HelperText>
              <HelperTextItem variant="indeterminate">
                Press 'd' to toggle this panel
              </HelperTextItem>
            </HelperText>
          </StackItem>

          <StackItem>
            <Title headingLevel="h3" size="md">
              Banners & Alerts
            </Title>
          </StackItem>

          <StackItem>
            <Switch
              id="post-restore-banner-switch"
              label="Post-Restore Banners"
              isChecked={getSetting("showPostRestoreBanner")}
              onChange={(_event, checked) =>
                setSetting("showPostRestoreBanner", checked)
              }
            />
            <HelperText>
              <HelperTextItem
                variant="indeterminate"
                style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}
              >
                Puts the system in the post-restore state, with devices both in
                Pending sync and Suspended states.
              </HelperTextItem>
            </HelperText>
          </StackItem>

          <StackItem>
            <Switch
              id="devices-pending-approval-switch"
              label="Devices Pending Approval"
              isChecked={getSetting("showDevicesPendingApproval")}
              onChange={(_event, checked) =>
                setSetting("showDevicesPendingApproval", checked)
              }
            />
            <HelperText>
              <HelperTextItem
                variant="indeterminate"
                style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}
              >
                Adds Devices pending approval to the system.
              </HelperTextItem>
            </HelperText>
          </StackItem>

          <StackItem>
            <Button variant="secondary" onClick={resetAll} isBlock>
              Reset All to Defaults
            </Button>
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

export default DesignControls;
