/**
 * useDesignControls Hook
 *
 * Centralized hook for managing RHEM design control settings.
 * Uses localStorage to persist settings across page reloads and all pages.
 *
 * Usage:
 * ```tsx
 * const { getSetting, setSetting } = useDesignControls();
 * const showBanner = getSetting('showPostRestoreBanner');
 * setSetting('showPostRestoreBanner', true);
 * ```
 */

import { useState, useEffect } from "react";

const STORAGE_KEY = "rhem-design-controls";
const SETTINGS_CHANGE_EVENT = "rhem-design-controls-change";

interface DesignControlsSettings {
  showPostRestoreBanner: boolean;
}

const DEFAULT_SETTINGS: DesignControlsSettings = {
  showPostRestoreBanner: false,
};

type SettingKey = keyof DesignControlsSettings;

// Helper to get current settings from localStorage
const loadSettings = (): DesignControlsSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error("Failed to load design controls from localStorage:", error);
  }
  return DEFAULT_SETTINGS;
};

export const useDesignControls = () => {
  // Load settings from localStorage on mount
  const [settings, setSettings] = useState<DesignControlsSettings>(loadSettings);

  // Listen for settings changes from other components
  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(loadSettings());
    };

    window.addEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChange);
    return () => {
      window.removeEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChange);
    };
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      // Notify other components about the change
      window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT));
    } catch (error) {
      console.error("Failed to save design controls to localStorage:", error);
    }
  }, [settings]);

  // Generic getter for any setting
  const getSetting = <K extends SettingKey>(
    key: K
  ): DesignControlsSettings[K] => {
    return settings[key];
  };

  // Generic setter for any setting
  const setSetting = <K extends SettingKey>(
    key: K,
    value: DesignControlsSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return {
    // Generic accessors
    getSetting,
    setSetting,

    // Get all settings
    settings,

    // Reset all settings to defaults
    resetAll: () => setSettings(DEFAULT_SETTINGS),
  };
};
