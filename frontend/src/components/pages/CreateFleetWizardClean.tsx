import React, { useState, useRef } from 'react';
import {
  Wizard,
  WizardStep,
  Form,
  FormGroup,
  TextInput,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Button,
  Label,
  LabelGroup,
  InputGroup,
  InputGroupItem,
  Alert,
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  CodeBlock,
  CodeBlockCode,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Checkbox,
  Split,
  SplitItem,
  Stack,
  StackItem,
  NumberInput,
  ExpandableSection,
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Popover,
  FormGroupLabelHelp,
  MultipleFileUpload,
  MultipleFileUploadMain,
  MultipleFileUploadStatus,
  MultipleFileUploadStatusItem,
  DropEvent,
  FileUpload,
  FileUploadHelperText,
  Radio,
  TextArea
} from '@patternfly/react-core';
import {
  PlusIcon,
  TimesIcon,
  MinusCircleIcon,
  OutlinedQuestionCircleIcon,
  UploadIcon,
  TimesCircleIcon,
  EditAltIcon,
  CheckIcon,
  AngleDownIcon,
  AngleRightIcon,
  PenToSquareIcon
} from '@patternfly/react-icons';
import { ViewType, NavigationItemId, NavigationParams } from '../../types/app';
import { FleetFormData } from '../../types/fleet';
import { useDesignControls } from '../../hooks/useDesignControls';

interface CreateFleetWizardCleanProps {
  onNavigate?: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
}

const CreateFleetWizardClean: React.FC<CreateFleetWizardCleanProps> = ({ onNavigate }) => {
  const { getSetting } = useDesignControls();
  const [formData, setFormData] = useState<FleetFormData>({
    // Step 1: General Info
    fleetName: '',
    fleetLabels: [],
    deviceSelector: [],

    // Step 2: Device Template
    systemImage: '',
    hostConfigurations: [],
    applicationWorkloads: [],
    systemdServices: [],

    // Step 3: Updates
    useBasicConfigurations: true,
    rolloutPolicies: {
      enabled: false,
      batchSequencing: false,
      updateTimeout: 60,
      batches: [],
    },
    disruptionBudget: {
      enabled: false,
      groupByLabelKey: '',
      minAvailable: 5,
      maxUnavailable: 0
    },
    updatePolicies: {
      enabled: false,
      useDifferentSchedules: false,
      useDeviceTimezoneDownloading: true,
      useDeviceTimezoneInstalling: false,
      downloadingSchedule: {
        startTime: '1:30pm',
        endTime: '4:30pm',
        frequency: 'daily',
        timezone: '(GMT+01:00) Central European Time - Copenhagen',
      },
      installingSchedule: {
        startTime: '1:30pm',
        endTime: '4:30pm',
        frequency: 'weekly',
        timezone: '(GMT+01:00) Central European Time - Copenhagen',
        daysOfWeek: ['Mon']
      }
    }
  });

  // Error state management
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);

  // UI state
  const [newLabel, setNewLabel] = useState({ key: '', value: '' });
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [newDeviceLabel, setNewDeviceLabel] = useState({ key: '', value: '' });
  const [showDeviceLabelInput, setShowDeviceLabelInput] = useState(false);


  // Host configurations management
  interface HostConfiguration {
    id: number;
    name: string;
    description: string;
    expanded: boolean;
    sourceName: string;
    sourceType: string;
    repository: string;
    branchTagCommit: string;
    path: string;
    // Inline configuration fields
    inlineFiles: {
      id: number;
      name: string;
      filePath: string;
      content: string;
      contentIsBase64: boolean;
      permissions: string;
      user: string;
      group: string;
      expanded: boolean;
    }[];
  }
  const [hostConfigurations, setHostConfigurations] = useState<HostConfiguration[]>([]);
  const [nextConfigId, setNextConfigId] = useState(1);

  // Volume management interface
  interface Volume {
    id: number;
    name: string;
    volumeType: string;
    imageReference: string;
    pullPolicy: string;
    mountPath: string;
    expanded?: boolean;
  }

  // Applications management
  interface Application {
    id: number;
    name: string;
    expanded: boolean;
    applicationName: string;
    applicationType: string;
    // Single container application fields
    applicationImage: string;
    ports: string[];
    newHostPort: string;
    newContainerPort: string;
    cpuValue: string;
    memoryValue: string;
    volumes: Volume[];
    // Compose application fields
    filePath: string;
    contentIsBase64: boolean;
    // Quadlet application fields
    sourceType: string;
    ociArtifactUrl: string;
    environmentVariables: { key: string; value: string }[];
    fileDefinitions: { name: string; filePath: string; content: string; filename?: string; expanded?: boolean }[];
  }
  const [applications, setApplications] = useState<Application[]>([]);
  const [nextApplicationId, setNextApplicationId] = useState(1);
  const [nextVolumeId, setNextVolumeId] = useState(1);

  // Host configuration dropdown states - each config has its own dropdown states
  const [configDropdowns, setConfigDropdowns] = useState<Record<number, Record<string, boolean>>>({});

  // Application dropdown states - each application has its own dropdown states
  const [applicationDropdowns, setApplicationDropdowns] = useState<Record<number, Record<string, boolean>>>({});

  // File upload states
  interface UploadedFile {
    name: string;
    size: number;
    type: string;
    file: File;
  }
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  // Multiple file upload component states - per application
  interface UploadedApplicationFile {
    file: File;
    name: string;
    size: number;
    uploadProgress?: number;
    uploadStatus?: 'queued' | 'uploading' | 'success' | 'error';
  }
  const [applicationFiles, setApplicationFiles] = useState<Record<number, UploadedApplicationFile[]>>({});

  // File definition title editing state
  const [editingFileDefTitle, setEditingFileDefTitle] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState<string>('');

  // Batch management state
  const [nextBatchId, setNextBatchId] = useState(1);
  const [newBatchLabel, setNewBatchLabel] = useState({ key: '', value: '' });
  const [showBatchLabelInput, setShowBatchLabelInput] = useState<Record<number, boolean>>({});

  // Disruption budget label state
  const [newDisruptionLabel, setNewDisruptionLabel] = useState('');

  const updateFormData = (updates: Partial<FleetFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear related errors when data changes
    if (updates.fleetName !== undefined) {
      clearError('fleetName');
    }
    if (updates.systemImage !== undefined) {
      clearError('systemImage');
    }
  };

  // Validation functions
  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const setError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const validateFleetName = (name: string): string | null => {
    if (!name.trim()) {
      return 'Fleet name is required';
    }
    if (name.length < 3) {
      return 'Fleet name must be at least 3 characters long';
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
      return 'Fleet name can only contain letters, numbers, hyphens, and underscores';
    }
    return null;
  };

  const validateSystemImage = (image: string): string | null => {
    if (image.trim() && image.length > 0) {
      // Basic container image format validation
      if (!/^[a-zA-Z0-9._\-\/]+:[a-zA-Z0-9._\-]+$/.test(image) &&
          !image.startsWith('https://')) {
        return 'System image must be a valid container image (e.g., "quay.io/image:tag") or OSTree URL';
      }
    }
    return null;
  };

  const validateApplicationImage = (image: string): string | null => {
    if (!image.trim()) {
      return 'Application image is required';
    }
    if (!/^[a-zA-Z0-9._\-\/]+:[a-zA-Z0-9._\-]+$/.test(image)) {
      return 'Invalid image format. Use: registry/repository:tag';
    }
    return null;
  };

  const validatePort = (port: string): string | null => {
    if (!port.trim()) {
      return 'Port mapping is required';
    }
    if (!/^\d+:\d+$/.test(port)) {
      return 'Port must be in format "hostPort:containerPort" (e.g., "8080:80")';
    }
    const [hostPort, containerPort] = port.split(':').map(Number);
    if (hostPort < 1 || hostPort > 65535 || containerPort < 1 || containerPort > 65535) {
      return 'Port numbers must be between 1 and 65535';
    }
    return null;
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) {
      // Validate General Info step
      const nameError = validateFleetName(formData.fleetName);
      if (nameError) {
        newErrors.fleetName = nameError;
        isValid = false;
      }
    } else if (currentStep === 2) {
      // Validate Device Template step
      const imageError = validateSystemImage(formData.systemImage);
      if (imageError) {
        newErrors.systemImage = imageError;
        isValid = false;
      }

      // Validate applications
      applications.forEach((app, index) => {
        // Application type is required
        if (!app.applicationType || app.applicationType === 'Select') {
          newErrors[`app_${app.id}_applicationType`] = 'Application type is required';
          isValid = false;
        }

        if (app.applicationType === 'Single container application') {
          const appImageError = validateApplicationImage(app.applicationImage);
          if (appImageError) {
            newErrors[`app_${app.id}_image`] = appImageError;
            isValid = false;
          }

          // Validate ports
          app.ports.forEach((port, portIndex) => {
            const portError = validatePort(port);
            if (portError) {
              newErrors[`app_${app.id}_port_${portIndex}`] = portError;
              isValid = false;
            }
          });
        }

        if (app.applicationType === 'Compose Application' && !app.filePath.trim()) {
          newErrors[`app_${app.id}_filePath`] = 'File path is required for compose applications';
          isValid = false;
        }

        if (app.applicationType === 'Quadlets application') {
          if (app.sourceType === 'OCI Reference' && !app.ociArtifactUrl.trim()) {
            newErrors[`app_${app.id}_ociUrl`] = 'OCI Reference URL is required';
            isValid = false;
          }
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleClose = () => {
    if (onNavigate) {
      onNavigate('main', 'fleets');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError('');

      // Validate all steps before submission
      const isStep1Valid = validateCurrentStep();
      setCurrentStep(2);
      const isStep2Valid = validateCurrentStep();
      setCurrentStep(3);
      const isStep3Valid = validateCurrentStep();

      if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
        setCurrentStep(1); // Go back to first step with errors
        throw new Error('Please fix validation errors before submitting');
      }

      // Simulate API call with potential for failure
      console.log('Creating fleet with data:', formData);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate potential API errors (for demonstration)
      if (Math.random() < 0.1) { // 10% chance of random failure for testing
        throw new Error('Failed to create fleet: Server temporarily unavailable');
      }

      if (formData.fleetName.toLowerCase() === 'test-error') {
        throw new Error('Fleet name "test-error" already exists. Please choose a different name.');
      }

      // Success - navigate back to fleets page
      if (onNavigate) {
        onNavigate('main', 'fleets');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while creating the fleet';
      setSubmitError(errorMessage);
      console.error('Fleet creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Label management
  const addLabel = () => {
    if (newLabel.key && newLabel.value) {
      updateFormData({
        fleetLabels: [...formData.fleetLabels, newLabel]
      });
      setNewLabel({ key: '', value: '' });
      setShowLabelInput(false);
    }
  };

  const removeLabel = (index: number) => {
    const updatedLabels = formData.fleetLabels.filter((_, i) => i !== index);
    updateFormData({ fleetLabels: updatedLabels });
  };

  const addDeviceLabel = () => {
    if (newDeviceLabel.key && newDeviceLabel.value) {
      updateFormData({
        deviceSelector: [...formData.deviceSelector, newDeviceLabel]
      });
      setNewDeviceLabel({ key: '', value: '' });
      setShowDeviceLabelInput(false);
    }
  };

  const removeDeviceLabel = (index: number) => {
    const updatedLabels = formData.deviceSelector.filter((_, i) => i !== index);
    updateFormData({ deviceSelector: updatedLabels });
  };

  // Host configuration management functions
  const addHostConfiguration = () => {
    const configName = `Configuration${nextConfigId}`;
    const newConfig = {
      id: nextConfigId,
      name: configName,
      description: '',
      expanded: true,  // Default to open when added
      sourceName: '',
      sourceType: 'git repo',
      repository: '',
      branchTagCommit: 'main',
      path: '',
      inlineFiles: []
    };
    setHostConfigurations([...hostConfigurations, newConfig]);
    setNextConfigId(nextConfigId + 1);
  };

  const removeHostConfiguration = (configId: number) => {
    setHostConfigurations(hostConfigurations.filter(config => config.id !== configId));
    // Clean up dropdown states for removed config
    const newDropdowns = { ...configDropdowns };
    delete newDropdowns[configId];
    setConfigDropdowns(newDropdowns);
  };

  const toggleConfigurationExpanded = (configId: number) => {
    setHostConfigurations(hostConfigurations.map(config =>
      config.id === configId ? { ...config, expanded: !config.expanded } : config
    ));
  };

  const updateConfigurationField = (configId: number, field: string, value: string) => {
    setHostConfigurations(hostConfigurations.map(config =>
      config.id === configId ? { ...config, [field]: value } : config
    ));
  };

  const toggleConfigDropdown = (configId: number, dropdownType: string, isOpen: boolean) => {
    setConfigDropdowns(prev => ({
      ...prev,
      [configId]: {
        ...prev[configId],
        [dropdownType]: isOpen
      }
    }));
  };

  const getDropdownState = (configId: number, dropdownType: string) => {
    return configDropdowns[configId]?.[dropdownType] || false;
  };

  // Inline file management functions for host configurations
  const addInlineFile = (configId: number) => {
    const config = hostConfigurations.find(c => c.id === configId);
    const fileNumber = config ? config.inlineFiles.length + 1 : 1;

    const newFile = {
      id: Date.now(),
      name: `File${fileNumber}`,
      filePath: '',
      content: '',
      contentIsBase64: false,
      permissions: '(0644) Read, write, execute',
      user: '',
      group: '',
      expanded: true
    };

    setHostConfigurations(hostConfigurations.map(config =>
      config.id === configId
        ? { ...config, inlineFiles: [...config.inlineFiles, newFile] }
        : config
    ));
  };

  const removeInlineFile = (configId: number, fileId: number) => {
    setHostConfigurations(hostConfigurations.map(config =>
      config.id === configId
        ? { ...config, inlineFiles: config.inlineFiles.filter(file => file.id !== fileId) }
        : config
    ));
  };

  const updateInlineFile = (configId: number, fileId: number, field: string, value: any) => {
    setHostConfigurations(hostConfigurations.map(config =>
      config.id === configId
        ? {
            ...config,
            inlineFiles: config.inlineFiles.map(file =>
              file.id === fileId ? { ...file, [field]: value } : file
            )
          }
        : config
    ));
  };

  // Application management functions
  const addApplication = () => {
    const applicationName = `Application${nextApplicationId}`;
    const newApplication = {
      id: nextApplicationId,
      name: applicationName,
      expanded: true,  // Default to open when added
      applicationName: '',
      applicationType: 'Select',
      // Single container application fields
      applicationImage: '',
      ports: [],
      newHostPort: '',
      newContainerPort: '',
      cpuValue: '',
      memoryValue: '',
      volumes: [],
      // Compose application fields
      filePath: '',
      contentIsBase64: false,
      // Quadlet application fields
      sourceType: 'Select',
      ociArtifactUrl: '',
      environmentVariables: [],
      fileDefinitions: []
    };
    setApplications([...applications, newApplication]);
    setNextApplicationId(nextApplicationId + 1);
  };

  const removeApplication = (applicationId: number) => {
    setApplications(applications.filter(app => app.id !== applicationId));
    // Clean up dropdown states for removed application
    const newDropdowns = { ...applicationDropdowns };
    delete newDropdowns[applicationId];
    setApplicationDropdowns(newDropdowns);
  };

  const toggleApplicationExpanded = (applicationId: number) => {
    setApplications(applications.map(app =>
      app.id === applicationId ? { ...app, expanded: !app.expanded } : app
    ));
  };

  const updateApplicationField = (applicationId: number, field: string, value: any) => {
    setApplications(applications.map(app =>
      app.id === applicationId ? { ...app, [field]: value } : app
    ));
  };

  const toggleApplicationDropdown = (applicationId: number, dropdownType: string, isOpen: boolean) => {
    setApplicationDropdowns(prev => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        [dropdownType]: isOpen
      }
    }));
  };

  const getApplicationDropdownState = (applicationId: number, dropdownType: string) => {
    return applicationDropdowns[applicationId]?.[dropdownType] || false;
  };

  // Port management for specific applications
  const addApplicationPort = (applicationId: number, hostPort?: string, containerPort?: string) => {
    setApplications(prevApplications => {
      const application = prevApplications.find(app => app.id === applicationId);
      if (!application) return prevApplications;

      // Use provided values or get from application state
      const host = hostPort || application.newHostPort;
      const container = containerPort || application.newContainerPort;

      if (!host.trim() || !container.trim()) {
        setError(`app_${applicationId}_newPort`, 'Both host and container ports are required');
        return prevApplications;
      }

      const port = `${host.trim()}:${container.trim()}`;
      const portError = validatePort(port);
      if (portError) {
        setError(`app_${applicationId}_newPort`, portError);
        return prevApplications;
      }

      // Create new applications array with updated ports
      const updatedApplications = prevApplications.map(app =>
        app.id === applicationId
          ? {
              ...app,
              ports: [...app.ports, port],
              newHostPort: '',
              newContainerPort: ''
            }
          : app
      );

      // Clear error after successful addition
      clearError(`app_${applicationId}_newPort`);
      return updatedApplications;
    });

    return true;
  };

  const removeApplicationPort = (applicationId: number, portToRemove: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      const newPorts = application.ports.filter(port => port !== portToRemove);
      updateApplicationField(applicationId, 'ports', newPorts);
    }
  };

  // Volume management functions
  const addApplicationVolume = (applicationId: number) => {
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      const newVolume: Volume = {
        id: nextVolumeId,
        name: `Volume${nextVolumeId}`,
        volumeType: 'Select',
        imageReference: '',
        pullPolicy: 'Select',
        mountPath: '',
        expanded: true
      };
      const newVolumes = [...application.volumes, newVolume];
      updateApplicationField(applicationId, 'volumes', newVolumes);
      setNextVolumeId(nextVolumeId + 1);
    }
  };

  const removeApplicationVolume = (applicationId: number, volumeId: number) => {
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      const newVolumes = application.volumes.filter(volume => volume.id !== volumeId);
      updateApplicationField(applicationId, 'volumes', newVolumes);
    }
  };

  const updateApplicationVolume = (applicationId: number, volumeId: number, field: string, value: string | boolean) => {
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      const newVolumes = application.volumes.map(volume =>
        volume.id === volumeId ? { ...volume, [field]: value } : volume
      );
      updateApplicationField(applicationId, 'volumes', newVolumes);
    }
  };

  const toggleVolumeExpansion = (applicationId: number, volumeId: number) => {
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      const newVolumes = application.volumes.map(volume =>
        volume.id === volumeId ? { ...volume, expanded: !volume.expanded } : volume
      );
      updateApplicationField(applicationId, 'volumes', newVolumes);
    }
  };

  const formatLabelDisplay = (label: { key: string; value: string }) => {
    return `${label.key}=${label.value}`;
  };

  // Batch management functions
  const addBatch = () => {
    const newBatch = {
      id: nextBatchId,
      labels: [],
      subsetType: 'percentage' as const,
      subsetValue: 20,
      successThreshold: 80
    };
    updateFormData({
      rolloutPolicies: {
        ...formData.rolloutPolicies,
        batches: [...formData.rolloutPolicies.batches, newBatch]
      }
    });
    setNextBatchId(nextBatchId + 1);
  };

  const removeBatch = (batchId: number) => {
    updateFormData({
      rolloutPolicies: {
        ...formData.rolloutPolicies,
        batches: formData.rolloutPolicies.batches.filter(batch => batch.id !== batchId)
      }
    });
  };

  const updateBatch = (batchId: number, updates: Partial<typeof formData.rolloutPolicies.batches[0]>) => {
    updateFormData({
      rolloutPolicies: {
        ...formData.rolloutPolicies,
        batches: formData.rolloutPolicies.batches.map(batch =>
          batch.id === batchId ? { ...batch, ...updates } : batch
        )
      }
    });
  };

  const addBatchLabel = (batchId: number) => {
    const batch = formData.rolloutPolicies.batches.find(b => b.id === batchId);
    if (batch && newBatchLabel.key && newBatchLabel.value) {
      updateBatch(batchId, {
        labels: [...batch.labels, newBatchLabel]
      });
      setNewBatchLabel({ key: '', value: '' });
      setShowBatchLabelInput(prev => ({ ...prev, [batchId]: false }));
    }
  };

  const removeBatchLabel = (batchId: number, labelIndex: number) => {
    const batch = formData.rolloutPolicies.batches.find(b => b.id === batchId);
    if (batch) {
      updateBatch(batchId, {
        labels: batch.labels.filter((_, index) => index !== labelIndex)
      });
    }
  };

  // Auto-fill functionality for design controls
  const autoFillFormData = () => {
    const sampleData: FleetFormData = {
      // Step 1: General Info
      fleetName: 'retail-fleet-west-coast',
      fleetLabels: [
        { key: 'region', value: 'west-coast' },
        { key: 'environment', value: 'production' },
        { key: 'type', value: 'retail' }
      ],
      deviceSelector: [
        { key: 'location', value: 'store-*' },
        { key: 'hardware', value: 'edge-device' }
      ],

      // Step 2: Device Template
      systemImage: 'quay.io/redhat/rhde:9.4',
      hostConfigurations: [],
      applicationWorkloads: [],
      systemdServices: [],

      // Step 3: Updates
      useBasicConfigurations: false,
      rolloutPolicies: {
        enabled: true,
        batchSequencing: true,
        updateTimeout: 120,
        batches: [
          {
            id: 1,
            labels: [{ key: 'priority', value: 'high' }],
            subsetType: 'percentage',
            subsetValue: 25,
            successThreshold: 90
          },
          {
            id: 2,
            labels: [{ key: 'priority', value: 'medium' }],
            subsetType: 'percentage',
            subsetValue: 50,
            successThreshold: 85
          }
        ],
      },
      disruptionBudget: {
        enabled: true,
        groupByLabelKey: 'location',
        minAvailable: 10,
        maxUnavailable: 5
      },
      updatePolicies: {
        enabled: true,
        useDifferentSchedules: true,
        useDeviceTimezoneDownloading: false,
        useDeviceTimezoneInstalling: true,
        downloadingSchedule: {
          startTime: '2:00am',
          endTime: '4:00am',
          frequency: 'daily',
          timezone: '(GMT+00:00) Coordinated Universal Time',
        },
        installingSchedule: {
          startTime: '6:00pm',
          endTime: '8:00pm',
          frequency: 'weekly',
          timezone: '(GMT-05:00) Eastern Standard Time',
          daysOfWeek: ['Sat', 'Sun']
        }
      }
    };

    setFormData(sampleData);
    setNextBatchId(3); // Set next batch ID after sample batches

    // Add sample applications
    const sampleApps = [
      {
        id: nextApplicationId,
        applicationType: 'Single container application' as const,
        applicationName: 'nginx-web-server',
        applicationImage: 'docker.io/nginx:1.21',
        ports: ['8080:80', '8443:443'],
        newHostPort: '',
        newContainerPort: '',
        cpuValue: '500m',
        memoryValue: '512Mi',
        environmentVariables: [
          { key: 'ENV', value: 'production', completed: true },
          { key: 'SERVER_NAME', value: 'nginx-web', completed: true }
        ],
        fileDefinitions: [],
        volumes: [
          {
            id: 1,
            name: 'nginx-config',
            volumeType: 'Mount Volume',
            imageReference: '',
            pullPolicy: 'Select',
            mountPath: '/etc/nginx/conf.d',
            expanded: true
          },
          {
            id: 2,
            name: 'web-content',
            volumeType: 'Image Mount Volume',
            imageReference: 'quay.io/nginx/content:v1.0',
            pullPolicy: 'Always',
            mountPath: '/usr/share/nginx/html',
            expanded: true
          }
        ],
        expanded: true  // Set expanded state so accordion can be opened
      },
      {
        id: nextApplicationId + 1,
        applicationType: 'Quadlets application' as const,
        applicationName: 'monitoring-agent',
        sourceType: 'OCI Reference',
        ociArtifactUrl: 'quay.io/monitoring/agent:latest',
        newHostPort: '',
        newContainerPort: '',
        cpuValue: '',
        memoryValue: '',
        environmentVariables: [
          { key: 'LOG_LEVEL', value: 'info', completed: true },
          { key: 'METRICS_PORT', value: '9090', completed: true }
        ],
        fileDefinitions: [],
        volumes: [],
        expanded: true  // Set expanded state so accordion can be opened
      }
    ];

    setApplications(sampleApps);
    setNextApplicationId(nextApplicationId + 2);
    setNextVolumeId(3); // Set next volume ID after sample volumes
  };

  // Auto-fill form data when component mounts if setting is enabled
  React.useEffect(() => {
    if (getSetting('fillFleetForm')) {
      autoFillFormData();
    }
  }, [getSetting]);

  // Listen for clear form event from design controls
  React.useEffect(() => {
    const handleClearForm = () => {
      // Reset to initial state
      setFormData({
        fleetName: '',
        fleetLabels: [],
        deviceSelector: [],
        systemImage: '',
        hostConfigurations: [],
        applicationWorkloads: [],
        systemdServices: [],
        useBasicConfigurations: true,
        rolloutPolicies: {
          enabled: false,
          batchSequencing: false,
          updateTimeout: 60,
          batches: [],
        },
        disruptionBudget: {
          enabled: false,
          groupByLabelKey: '',
          minAvailable: 5,
          maxUnavailable: 0
        },
        updatePolicies: {
          enabled: false,
          useDifferentSchedules: false,
          useDeviceTimezoneDownloading: true,
          useDeviceTimezoneInstalling: false,
          downloadingSchedule: {
            startTime: '1:30pm',
            endTime: '4:30pm',
            frequency: 'daily',
            timezone: '(GMT+01:00) Central European Time - Copenhagen',
          },
          installingSchedule: {
            startTime: '1:30pm',
            endTime: '4:30pm',
            frequency: 'weekly',
            timezone: '(GMT+01:00) Central European Time - Copenhagen',
            daysOfWeek: ['Mon']
          }
        }
      });

      // Reset other state
      setApplications([]);
      setNextApplicationId(1);
      setNextVolumeId(1);
      setNextBatchId(1);
      setCurrentStep(1);
      setErrors({});
      setSubmitError('');
    };

    window.addEventListener('clear-fleet-form', handleClearForm);
    return () => window.removeEventListener('clear-fleet-form', handleClearForm);
  }, []);

  // File path validation for Quadlet inline files
  const validateFilePath = (filePath: string) => {
    if (!filePath.trim()) return { isValid: true, message: '', variant: 'default' as const };

    const lowercasePath = filePath.toLowerCase();

    // Error validation - forbidden/unsupported extensions
    const forbiddenExtensions = ['.build', '.kube', '.artifact'];
    const hasForbiddenExtension = forbiddenExtensions.some(ext => lowercasePath.includes(ext));

    if (hasForbiddenExtension) {
      return {
        isValid: false,
        message: 'Files with .build, .kube, or .artifact extensions are not supported and will be rejected',
        variant: 'error' as const
      };
    }

    // Supported Quadlet extensions (primary recommendations)
    const quadletExtensions = ['.container', '.volume', '.pod', '.image', '.network'];
    const configExtensions = ['.yaml', '.yml', '.json', '.toml'];
    const systemdExtensions = ['.service', '.timer', '.socket'];

    const hasQuadletExtension = quadletExtensions.some(ext => lowercasePath.endsWith(ext));
    const hasConfigExtension = configExtensions.some(ext => lowercasePath.endsWith(ext));
    const hasSystemdExtension = systemdExtensions.some(ext => lowercasePath.endsWith(ext));

    // Skip showing success messages for recommended extensions
    if (hasQuadletExtension || hasConfigExtension || hasSystemdExtension) {
      return {
        isValid: true,
        message: '',
        variant: 'default' as const
      };
    }

    // Warning for experimental or non-standard extensions
    return {
      isValid: true,
      message: 'Unknown extension. Consider using recommended types: .container, .volume, .pod, .image, .network',
      variant: 'warning' as const
    };
  };

  // File upload handlers
  const handleFileUpload = (files: File[]) => {
    const newFiles = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeUploadedFile = (fileIndex: number) => {
    setUploadedFiles(uploadedFiles.filter((_, index) => index !== fileIndex));
  };

  // Multiple file upload handlers for inline applications
  const handleMultipleFilesDrop = (applicationId: number, droppedFiles: File[]) => {
    const newFiles: UploadedApplicationFile[] = droppedFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      uploadStatus: 'queued' as const,
      uploadProgress: 0
    }));

    setApplicationFiles(prev => ({
      ...prev,
      [applicationId]: [...(prev[applicationId] || []), ...newFiles]
    }));

    // Automatically start upload process
    setTimeout(() => {
      handleFilesUpload(applicationId);
    }, 100);
  };

  const handleFileRemove = (applicationId: number, fileName: string) => {
    setApplicationFiles(prev => ({
      ...prev,
      [applicationId]: prev[applicationId]?.filter(file => file.name !== fileName) || []
    }));
  };

  const handleFilesUpload = (applicationId: number) => {
    const files = applicationFiles[applicationId] || [];
    // Simulate upload progress for demonstration
    files.forEach((file, index) => {
      setApplicationFiles(prev => ({
        ...prev,
        [applicationId]: prev[applicationId]?.map(f =>
          f.name === file.name ? { ...f, uploadStatus: 'uploading' as const, uploadProgress: 0 } : f
        ) || []
      }));

      // Simulate upload progress with confirmation text
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        setApplicationFiles(prev => ({
          ...prev,
          [applicationId]: prev[applicationId]?.map(f =>
            f.name === file.name ? {
              ...f,
              uploadProgress: Math.min(progress, 100),
              uploadStatus: progress >= 100 ? 'success' as const : 'uploading' as const
            } : f
          ) || []
        }));

        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 300);
    });
  };

  return (
    <>
      <Wizard
        title="Create fleet"
        onClose={handleClose}
        onSave={handleSubmit}
        onStepChange={(step) => {
          const stepNumber = typeof step === 'object' ? step.index : step;
          if (stepNumber && stepNumber > currentStep) {
            // Validate current step before allowing navigation forward
            if (validateCurrentStep()) {
              setCurrentStep(stepNumber);
            }
          } else {
            setCurrentStep(stepNumber || 1);
          }
        }}
        isInProgress={isSubmitting}
      >
      {/* Step 1: General info */}
      <WizardStep
        name="General info"
        id="general-info"
      >
        <Form>
          <FormGroup
            label="Fleet name"
            fieldId="fleet-name"
            isRequired
          >
            <TextInput
              type="text"
              id="fleet-name"
              name="fleet-name"
              value={formData.fleetName}
              onChange={(_event, value) => updateFormData({ fleetName: value })}
              onBlur={() => {
                const error = validateFleetName(formData.fleetName);
                if (error) {
                  setError('fleetName', error);
                }
              }}
              placeholder="e.g., retail-stores-west"
              validated={errors.fleetName ? 'error' : 'default'}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant={errors.fleetName ? 'error' : 'default'}>
                  {errors.fleetName || 'Choose a descriptive name for your fleet. Use letters, numbers, hyphens, and underscores only.'}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          <FormGroup
            label="Fleet labels"
            fieldId="fleet-labels"
          >
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              {formData.fleetLabels.length > 0 && (
                <>
                  {formData.fleetLabels.map((label, index) => (
                    <Label
                      key={index}
                      onClose={() => removeLabel(index)}
                      closeBtnAriaLabel={`Remove ${formatLabelDisplay(label)}`}
                    >
                      {formatLabelDisplay(label)}
                    </Label>
                  ))}
                </>
              )}

              {showLabelInput ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TextInput
                    placeholder="key"
                    value={newLabel.key}
                    onChange={(_event, value) => setNewLabel(prev => ({ ...prev, key: value }))}
                    style={{ maxWidth: '120px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#151515' }}>=</span>
                  <TextInput
                    placeholder="value"
                    value={newLabel.value}
                    onChange={(_event, value) => setNewLabel(prev => ({ ...prev, value: value }))}
                    style={{ maxWidth: '120px' }}
                  />
                  <Button
                    variant="primary"
                    onClick={addLabel}
                    isDisabled={!newLabel.key || !newLabel.value}
                  >
                    Add
                  </Button>
                  <Button
                    variant="plain"
                    onClick={() => {
                      setNewLabel({ key: '', value: '' });
                      setShowLabelInput(false);
                    }}
                    style={{ padding: '4px' }}
                  >
                    <TimesIcon />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="link"
                  isInline
                  onClick={() => setShowLabelInput(true)}
                  icon={<PlusIcon />}
                  style={{ padding: 0 }}
                >
                  Add label
                </Button>
              )}
            </div>
            <FormHelperText style={{ marginTop: '0.25rem' }}>
              <HelperText>
                <HelperTextItem>
                  Add labels to organize and categorize this fleet.
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          <FormGroup
            label="Device selector"
            fieldId="device-selector"
          >
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              {formData.deviceSelector.length > 0 && (
                <>
                  {formData.deviceSelector.map((label, index) => (
                    <Label
                      key={index}
                      onClose={() => removeDeviceLabel(index)}
                      closeBtnAriaLabel={`Remove ${formatLabelDisplay(label)}`}
                    >
                      {formatLabelDisplay(label)}
                    </Label>
                  ))}
                </>
              )}

              {showDeviceLabelInput ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TextInput
                    placeholder="key"
                    value={newDeviceLabel.key}
                    onChange={(_event, value) => setNewDeviceLabel(prev => ({ ...prev, key: value }))}
                    style={{ maxWidth: '120px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#151515' }}>=</span>
                  <TextInput
                    placeholder="value"
                    value={newDeviceLabel.value}
                    onChange={(_event, value) => setNewDeviceLabel(prev => ({ ...prev, value: value }))}
                    style={{ maxWidth: '120px' }}
                  />
                  <Button
                    variant="primary"
                    onClick={addDeviceLabel}
                    isDisabled={!newDeviceLabel.key || !newDeviceLabel.value}
                  >
                    Add
                  </Button>
                  <Button
                    variant="plain"
                    onClick={() => {
                      setNewDeviceLabel({ key: '', value: '' });
                      setShowDeviceLabelInput(false);
                    }}
                    style={{ padding: '4px' }}
                  >
                    <TimesIcon />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="link"
                  isInline
                  onClick={() => setShowDeviceLabelInput(true)}
                  icon={<PlusIcon />}
                  style={{ padding: 0 }}
                >
                  Add label
                </Button>
              )}
            </div>
            <FormHelperText style={{ marginTop: '0.25rem' }}>
              <HelperText>
                <HelperTextItem>
                  Add labels to select which devices will be included in this fleet.
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        </Form>
      </WizardStep>

      {/* Step 2: Device template */}
      <WizardStep
        name="Device template"
        id="device-template"
      >
        <Form>
          {/* Using template variables - Expandable Alert */}
          <Alert
            variant="info"
            title="Using template variables"
            isInline
            isExpandable
            style={{ marginBottom: '1.5rem' }}
          >
            <p style={{ marginBottom: '1rem', marginTop: 0 }}>
              Add a variable by using {'{{ device.metadata.labels[key] }}'} or {'{{ device.metadata.name }}'} and it will be applied based on each device's details.
            </p>
            <p style={{ marginBottom: '1rem', marginTop: 0 }}>
              For example, you could set the following value to apply different files in a Git configuration:
            </p>
            <CodeBlock>
              <CodeBlockCode>/device-configs/factory-floor/floor-{'{{ device.metadata.labels[factory-floor] }}'}</CodeBlockCode>
            </CodeBlock>
          </Alert>

          {/* System image */}
          <FormGroup
            label="System image"
            labelHelp={
              <Popover
                triggerAction="hover"
                headerContent="System image"
                bodyContent={
                <div>
                  <p><strong>System Image Types:</strong></p>
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li><strong>OCI Container Image</strong> - <code>quay.io/redhat/rhde:9.3</code></li>
                    <li><strong>OSTree Reference</strong> - <code>https://ostree.fedoraproject.org/iot?ref=fedora/stable/x86_64/iot</code></li>
                  </ul>
                  <p><strong>💡 Tip:</strong> Leave empty to manage applications only without updating the OS.</p>
                </div>
              }
                hasClose={false}
              >
                <FormGroupLabelHelp aria-label="More info for system image field" />
              </Popover>
            }
            fieldId="system-image"
          >
            <TextInput
              type="text"
              id="system-image"
              value={formData.systemImage}
              onChange={(_event, value) => updateFormData({ systemImage: value })}
              onBlur={() => {
                const error = validateSystemImage(formData.systemImage);
                if (error) {
                  setError('systemImage', error);
                }
              }}
              placeholder="quay.io/redhat/rhde:9.3"
              validated={errors.systemImage ? 'error' : 'default'}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant={errors.systemImage ? 'error' : 'default'}>
                  {errors.systemImage ||
                    'Must either be an OCI image ref (e.g. "quay.io/redhat/rhde:9.3") or ostree ref (e.g. "https://ostree.fedoraproject.org/iot?ref=fedora/stable/x86_64/iot"). Keep this empty if you don\'t want to manage your OS from the fleet.'
                  }
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          {/* Host configurations (files) */}
          <FormGroup
            label="Host configurations (files)"
            labelHelp={
              <Popover
                triggerAction="hover"
                headerContent="Host configurations"
                bodyContent="Define configuration files that will be deployed directly to the host operating system on your devices. These can include system settings, certificates, scripts, or any files needed at the OS level (not inside containers)."
                hasClose={false}
              >
                <FormGroupLabelHelp aria-label="More info for host configurations field" />
              </Popover>
            }
            fieldId="host-configurations"
          >
            <Stack hasGutter>
              {hostConfigurations.map((config) => (
                <StackItem key={config.id}>
                  <div style={{
                    border: '1px solid #d2d2d2',
                    borderRadius: '4px',
                    padding: '12px 16px',
                    position: 'relative'
                  }}>
                    <Button
                      variant="plain"
                      onClick={() => removeHostConfiguration(config.id)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px',
                        color: '#0066cc',
                        zIndex: 1
                      }}
                      aria-label="Remove configuration"
                    >
                      <MinusCircleIcon title="Remove configuration" />
                    </Button>
                    <ExpandableSection
                      toggleText={`${config.sourceName || config.name}${config.description ? ` - ${config.description}` : ''}`}
                      isExpanded={config.expanded}
                      onToggle={() => toggleConfigurationExpanded(config.id)}
                      style={{ margin: 0 }}
                    >
                      {config.expanded && (
                        <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                          <Stack hasGutter>
                            {/* Source name */}
                            <StackItem>
                              <FormGroup
                                label="Source name"
                                labelHelp={
                                  <Popover
                                    triggerAction="hover"
                                    headerContent="Source name"
                                    bodyContent="Give this configuration a descriptive name to help you identify it later. For example: 'nginx-config', 'security-settings', or 'monitoring-tools'."
                                    hasClose={false}
                                  >
                                    <FormGroupLabelHelp aria-label="More info for source name field" />
                                  </Popover>
                                }
                                fieldId={`source-name-${config.id}`}
                              >
                                <TextInput
                                  type="text"
                                  id={`source-name-${config.id}`}
                                  value={config.sourceName}
                                  onChange={(_event, value) => updateConfigurationField(config.id, 'sourceName', value)}
                                  placeholder="e.g., system-config"
                                />
                              </FormGroup>
                            </StackItem>

                            {/* Source type */}
                            <StackItem>
                              <FormGroup
                                label="Source type"
                                labelHelp={
                                  <Popover
                                    triggerAction="hover"
                                    headerContent="Source type"
                                    bodyContent="Choose how to provide your configuration files: 'Git repo' to pull files from a Git repository, or 'Inline configurations' to define files directly in this interface."
                                    hasClose={false}
                                  >
                                    <FormGroupLabelHelp aria-label="More info for source type field" />
                                  </Popover>
                                }
                                fieldId={`source-type-${config.id}`}
                              >
                                <Select
                                    id={`source-type-${config.id}`}
                                    isOpen={getDropdownState(config.id, 'sourceType')}
                                    selected={config.sourceType}
                                    onSelect={(_event, selection) => {
                                      updateConfigurationField(config.id, 'sourceType', selection as string);
                                      // Auto-add a file when switching to inline
                                      if (selection === 'inline' && config.inlineFiles.length === 0) {
                                        addInlineFile(config.id);
                                      }
                                      toggleConfigDropdown(config.id, 'sourceType', false);
                                    }}
                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                      <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => toggleConfigDropdown(config.id, 'sourceType', !getDropdownState(config.id, 'sourceType'))}
                                        isExpanded={getDropdownState(config.id, 'sourceType')}
                                        style={{ width: '100%' }}
                                      >
                                        {config.sourceType === 'inline' ? 'Inline configurations' : config.sourceType}
                                      </MenuToggle>
                                    )}
                                  >
                                    <SelectList>
                                      <SelectOption value="git repo">git repo</SelectOption>
                                      <SelectOption value="inline">Inline configurations</SelectOption>
                                    </SelectList>
                                  </Select>
                              </FormGroup>
                            </StackItem>

                            {/* Git repo fields */}
                            {config.sourceType === 'git repo' && (
                              <>
                            {/* Repository */}
                            <StackItem>
                              <FormGroup
                                label="Repository"
                                labelHelp={
                                  <Popover
                                    triggerAction="hover"
                                    headerContent="Repository"
                                    bodyContent="Select which Git repository contains your configuration files. This should be a repository that's already connected to your system and contains the files you want to deploy."
                                    hasClose={false}
                                  >
                                    <FormGroupLabelHelp aria-label="More info for repository field" />
                                  </Popover>
                                }
                                fieldId={`repository-${config.id}`}
                              >
                                <Select
                                    id={`repository-${config.id}`}
                                    isOpen={getDropdownState(config.id, 'repository')}
                                    selected={config.repository}
                                    onSelect={(_event, selection) => {
                                      updateConfigurationField(config.id, 'repository', selection as string);
                                      toggleConfigDropdown(config.id, 'repository', false);
                                    }}
                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                      <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => toggleConfigDropdown(config.id, 'repository', !getDropdownState(config.id, 'repository'))}
                                        isExpanded={getDropdownState(config.id, 'repository')}
                                        style={{ width: '100%' }}
                                      >
                                        {config.repository}
                                      </MenuToggle>
                                    )}
                                  >
                                    <SelectList>
                                      <SelectOption value="model-repo">model-repo</SelectOption>
                                      <SelectOption value="config-repo">config-repo</SelectOption>
                                      <SelectOption value="main-repo">main-repo</SelectOption>
                                    </SelectList>
                                  </Select>
                              </FormGroup>
                            </StackItem>

                            {/* Branch/tag/commit */}
                            <StackItem>
                              <FormGroup
                                label="Branch/tag/commit"
                                labelHelp={
                                  <Popover
                                    triggerAction="hover"
                                    headerContent="Branch/tag/commit"
                                    bodyContent="Choose which version of your repository to use. Use 'main' or 'stable' for the latest version, specific tags like 'v1.0.0' for releases, or commit hashes for exact versions."
                                    hasClose={false}
                                  >
                                    <FormGroupLabelHelp aria-label="More info for branch/tag/commit field" />
                                  </Popover>
                                }
                                fieldId={`branch-tag-commit-${config.id}`}
                                style={{ marginBottom: '0.5rem', gap: '8px' }}
                              >
                                <div style={{ marginTop: '8px' }}>
                                  <Select
                                    id={`branch-tag-commit-${config.id}`}
                                    isOpen={getDropdownState(config.id, 'branchTagCommit')}
                                    selected={config.branchTagCommit}
                                    onSelect={(_event, selection) => {
                                      updateConfigurationField(config.id, 'branchTagCommit', selection as string);
                                      toggleConfigDropdown(config.id, 'branchTagCommit', false);
                                    }}
                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                      <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => toggleConfigDropdown(config.id, 'branchTagCommit', !getDropdownState(config.id, 'branchTagCommit'))}
                                        isExpanded={getDropdownState(config.id, 'branchTagCommit')}
                                        style={{ width: '100%' }}
                                      >
                                        {config.branchTagCommit}
                                      </MenuToggle>
                                    )}
                                  >
                                    <SelectList>
                                      <SelectOption value="main">main</SelectOption>
                                      <SelectOption value="develop">develop</SelectOption>
                                      <SelectOption value="stable">stable</SelectOption>
                                      <SelectOption value="v1.0.0">v1.0.0</SelectOption>
                                    </SelectList>
                                  </Select>
                                </div>
                              </FormGroup>
                            </StackItem>

                            {/* Path */}
                            <StackItem>
                              <FormGroup
                                label="Path"
                                labelHelp={
                                  <Popover
                                    triggerAction="hover"
                                    headerContent="Path"
                                    bodyContent="Specify which folder or subfolder in the repository contains your configuration files. For example, '/config-files' or '/scripts'. Use '/' for the root directory."
                                    hasClose={false}
                                  >
                                    <FormGroupLabelHelp aria-label="More info for path field" />
                                  </Popover>
                                }
                                fieldId={`path-${config.id}`}
                                style={{ marginBottom: '0.5rem', gap: '8px' }}
                              >
                                <div style={{ marginTop: '8px' }}>
                                  <Select
                                  id={`path-${config.id}`}
                                  isOpen={getDropdownState(config.id, 'path')}
                                  selected={config.path}
                                  onSelect={(_event, selection) => {
                                    updateConfigurationField(config.id, 'path', selection as string);
                                    toggleConfigDropdown(config.id, 'path', false);
                                  }}
                                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                    <MenuToggle
                                      ref={toggleRef}
                                      onClick={() => toggleConfigDropdown(config.id, 'path', !getDropdownState(config.id, 'path'))}
                                      isExpanded={getDropdownState(config.id, 'path')}
                                      style={{ width: '100%' }}
                                    >
                                      {config.path || 'Select path'}
                                    </MenuToggle>
                                  )}
                                >
                                  <SelectList>
                                    <SelectOption value="/object-detection-model-vi">/object-detection-model-vi</SelectOption>
                                    <SelectOption value="/image-analysis-model">/image-analysis-model</SelectOption>
                                    <SelectOption value="/config-files">/config-files</SelectOption>
                                    <SelectOption value="/scripts">/scripts</SelectOption>
                                  </SelectList>
                                </Select>
                                </div>
                              </FormGroup>
                            </StackItem>
                              </>
                            )}

                            {/* Inline configuration fields */}
                            {config.sourceType === 'inline' && (
                              <>
                                {/* File sections */}
                                {config.inlineFiles.map((inlineFile) => (
                                  <StackItem key={inlineFile.id}>
                                    <div style={{
                                      border: '1px solid #d2d2d2',
                                      borderRadius: '4px',
                                      padding: '12px 16px',
                                      position: 'relative',
                                      marginBottom: '1rem'
                                    }}>
                                      <Button
                                        variant="plain"
                                        onClick={() => removeInlineFile(config.id, inlineFile.id)}
                                        style={{
                                          position: 'absolute',
                                          top: '12px',
                                          right: '12px',
                                          padding: '4px',
                                          color: '#0066cc',
                                          zIndex: 1
                                        }}
                                        aria-label="Remove file"
                                      >
                                        <MinusCircleIcon title="Remove file" />
                                      </Button>
                                      <ExpandableSection
                                        toggleText={inlineFile.name}
                                        isExpanded={inlineFile.expanded}
                                        onToggle={() => updateInlineFile(config.id, inlineFile.id, 'expanded', !inlineFile.expanded)}
                                        style={{ margin: 0 }}
                                      >
                                        {inlineFile.expanded && (
                                          <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                            <Stack hasGutter>
                                              {/* File path on device */}
                                              <StackItem>
                                                <FormGroup
                                                  label="File path on the device"
                                                  fieldId={`inline-file-path-${inlineFile.id}`}
                                                >
                                                  <TextInput
                                                    type="text"
                                                    id={`inline-file-path-${inlineFile.id}`}
                                                    value={inlineFile.filePath}
                                                    onChange={(_event, value) => updateInlineFile(config.id, inlineFile.id, 'filePath', value)}
                                                    placeholder="/etc/config/app-config.yaml"
                                                  />
                                                </FormGroup>
                                              </StackItem>

                                              {/* Content */}
                                              <StackItem>
                                                <FormGroup
                                                  label="Content"
                                                  fieldId={`inline-content-${inlineFile.id}`}
                                                >
                                                  <div style={{
                                                    border: '2px dashed #d2d2d2',
                                                    borderRadius: '8px',
                                                    padding: '2rem',
                                                    backgroundColor: '#fafafa',
                                                    minHeight: '120px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    color: '#151515'
                                                  }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                      <UploadIcon style={{ fontSize: '24px', color: '#151515' }} />
                                                      <div>
                                                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                                                          Drag and drop files here or upload
                                                        </div>
                                                        <div style={{ fontSize: '14px', color: '#6a6e73' }}>
                                                          Accepted file types: text files, JSON, YAML. Max file size: 1mb per file
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <Button variant="primary">
                                                      Upload
                                                    </Button>
                                                  </div>
                                                </FormGroup>
                                              </StackItem>

                                              {/* Content is base64 */}
                                              <StackItem>
                                                <Checkbox
                                                  label="Content is base64"
                                                  isChecked={inlineFile.contentIsBase64}
                                                  onChange={(_event, checked) => updateInlineFile(config.id, inlineFile.id, 'contentIsBase64', checked)}
                                                  id={`inline-base64-${inlineFile.id}`}
                                                />
                                              </StackItem>

                                              {/* Permissions */}
                                              <StackItem>
                                                <FormGroup
                                                  label="Permissions"
                                                  fieldId={`inline-permissions-${inlineFile.id}`}
                                                >
                                                  <Select
                                                    id={`inline-permissions-${inlineFile.id}`}
                                                    isOpen={getDropdownState(config.id, `permissions-${inlineFile.id}`)}
                                                    selected={inlineFile.permissions}
                                                    onSelect={(_event, selection) => {
                                                      updateInlineFile(config.id, inlineFile.id, 'permissions', selection as string);
                                                      toggleConfigDropdown(config.id, `permissions-${inlineFile.id}`, false);
                                                    }}
                                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                                      <MenuToggle
                                                        ref={toggleRef}
                                                        onClick={() => toggleConfigDropdown(config.id, `permissions-${inlineFile.id}`, !getDropdownState(config.id, `permissions-${inlineFile.id}`))}
                                                        isExpanded={getDropdownState(config.id, `permissions-${inlineFile.id}`)}
                                                        style={{ width: '100%' }}
                                                      >
                                                        {inlineFile.permissions}
                                                      </MenuToggle>
                                                    )}
                                                  >
                                                    <SelectList>
                                                      <SelectOption value="(0644) Read, write, execute">(0644) Read, write, execute</SelectOption>
                                                      <SelectOption value="(0755) Read, write, execute for owner, read/execute for others">(0755) Read, write, execute for owner, read/execute for others</SelectOption>
                                                      <SelectOption value="(0666) Read, write for all">(0666) Read, write for all</SelectOption>
                                                    </SelectList>
                                                  </Select>
                                                </FormGroup>
                                              </StackItem>

                                              {/* User */}
                                              <StackItem>
                                                <FormGroup
                                                  label="User"
                                                  fieldId={`inline-user-${inlineFile.id}`}
                                                >
                                                  <TextInput
                                                    type="text"
                                                    id={`inline-user-${inlineFile.id}`}
                                                    value={inlineFile.user}
                                                    onChange={(_event, value) => updateInlineFile(config.id, inlineFile.id, 'user', value)}
                                                    placeholder="root"
                                                  />
                                                </FormGroup>
                                              </StackItem>

                                              {/* Group */}
                                              <StackItem>
                                                <FormGroup
                                                  label="Group"
                                                  fieldId={`inline-group-${inlineFile.id}`}
                                                >
                                                  <TextInput
                                                    type="text"
                                                    id={`inline-group-${inlineFile.id}`}
                                                    value={inlineFile.group}
                                                    onChange={(_event, value) => updateInlineFile(config.id, inlineFile.id, 'group', value)}
                                                    placeholder="root"
                                                  />
                                                </FormGroup>
                                              </StackItem>
                                            </Stack>
                                          </div>
                                        )}
                                      </ExpandableSection>
                                    </div>
                                  </StackItem>
                                ))}

                                {/* Add file button */}
                                <StackItem>
                                  <Button
                                    variant="link"
                                    onClick={() => addInlineFile(config.id)}
                                    icon={<PlusIcon />}
                                    style={{ padding: '8px 0', color: '#0066cc' }}
                                  >
                                    Add file
                                  </Button>
                                </StackItem>
                              </>
                            )}
                          </Stack>
                        </div>
                      )}
                    </ExpandableSection>
                  </div>
                </StackItem>
              ))}

              <StackItem>
                <Button
                  variant="link"
                  onClick={addHostConfiguration}
                  icon={<PlusIcon />}
                  style={{ padding: '8px 0', color: '#0066cc' }}
                >
                  Add configuration
                </Button>
              </StackItem>
            </Stack>
          </FormGroup>

          {/* Application workloads */}
          <FormGroup
            label="Application workloads"
            labelHelp={
              <Popover
                triggerAction="hover"
                headerContent="Application workloads"
                bodyContent={
                <div>
                  <p><strong>Application Types:</strong></p>
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li><strong>Single container</strong> - Simple deployments with image specifications</li>
                    <li><strong>Compose applications</strong> - Custom file-based workloads</li>
                    <li><strong>Quadlet applications</strong> - Advanced systemd integration</li>
                  </ul>
                  <p><strong>Configuration Options:</strong></p>
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li>Resource limits (CPU, memory)</li>
                    <li>Port mappings</li>
                    <li>Volume mounts</li>
                    <li>Environment configurations</li>
                  </ul>
                </div>
              }
                hasClose={false}
              >
                <FormGroupLabelHelp aria-label="More info for application workloads field" />
              </Popover>
            }
            fieldId="application-workloads"
          >
            <p style={{ marginBottom: '1.5rem', color: '#6a6e73' }}>
              Configure containerized applications and services that will run on your fleet devices. You can deploy single containers, inline applications with custom files, or Quadlet applications for advanced container orchestration.
            </p>
            <Stack hasGutter>
              {applications.map((application) => (
                <StackItem key={application.id}>
                  <div style={{
                    border: '1px solid #d2d2d2',
                    borderRadius: '4px',
                    padding: '12px 16px',
                    position: 'relative'
                  }}>
                    <Button
                      variant="plain"
                      onClick={() => removeApplication(application.id)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px',
                        color: '#0066cc',
                        zIndex: 1
                      }}
                      aria-label="Remove application"
                    >
                      <MinusCircleIcon title="Remove application" />
                    </Button>
                    <ExpandableSection
                      toggleText={application.applicationName || `Application${application.id}`}
                      isExpanded={application.expanded}
                      onToggle={() => toggleApplicationExpanded(application.id)}
                      style={{ margin: 0 }}
                    >
                      <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                          {/* Application name */}
                          <FormGroup
                            label="Application name"
                            labelHelp={
                              <Popover
                                triggerAction="hover"
                                headerContent="Application name"
                                bodyContent="Provide a descriptive, unique name for your application workload. This name will be used to identify the application across your fleet and should reflect its purpose (e.g., 'web-server', 'data-collector', 'monitoring-agent'). Use lowercase letters, numbers, and hyphens for best compatibility."
                                hasClose={false}
                              >
                                <FormGroupLabelHelp aria-label="More info for application name field" />
                              </Popover>
                            }
                            fieldId={`app-name-${application.id}`}
                            style={{ marginBottom: '1.5rem' }}
                          >
                            <TextInput
                              type="text"
                              id={`app-name-${application.id}`}
                              value={application.applicationName}
                              onChange={(_event, value) => updateApplicationField(application.id, 'applicationName', value)}
                              placeholder="e.g., web-server"
                            />
                          </FormGroup>

                          {/* Application type */}
                          <FormGroup
                            label={
                              <span>
                                Application type
                                <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                              </span>
                            }
                            validated={errors[`app_${application.id}_applicationType`] ? 'error' : 'default'}
                            labelHelp={
                              <Popover
                                triggerAction="hover"
                                headerContent="Application type"
                                bodyContent={
                                <div>
                                  <p><strong>Deployment Methods:</strong></p>
                                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                    <li><strong>Single container application</strong> - Basic containerized services with image and resource specs</li>
                                    <li><strong>Compose application</strong> - Custom file-based deployments with direct file uploads</li>
                                    <li><strong>Quadlet application</strong> - Advanced systemd-managed containers with OCI references</li>
                                  </ul>
                                  <p><strong>⚠️ Important:</strong> This choice cannot be changed after creation.</p>
                                </div>
                              }
                                hasClose={false}
                              >
                                <FormGroupLabelHelp aria-label="More info for application type field" />
                              </Popover>
                            }
                            fieldId={`app-type-${application.id}`}
                            style={{ marginBottom: '1.5rem' }}
                          >
                            <Select
                            id={`app-type-${application.id}`}
                            isOpen={getApplicationDropdownState(application.id, 'applicationType')}
                            selected={application.applicationType}
                            onSelect={(_event, selection) => {
                              // Use functional state update for more reliable updates
                              setApplications(prevApplications =>
                                prevApplications.map(app =>
                                  app.id === application.id
                                    ? {
                                        ...app,
                                        applicationType: selection as string,
                                        sourceType: selection === 'Compose Application' ? 'OCI Reference' : app.sourceType
                                      }
                                    : app
                                )
                              );
                              toggleApplicationDropdown(application.id, 'applicationType', false);
                              clearError(`app_${application.id}_applicationType`);
                            }}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => toggleApplicationDropdown(application.id, 'applicationType', !getApplicationDropdownState(application.id, 'applicationType'))}
                                isExpanded={getApplicationDropdownState(application.id, 'applicationType')}
                                style={{ width: '100%' }}
                              >
                                {application.applicationType}
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              <SelectOption value="Select">Select</SelectOption>
                              <SelectOption value="Single container application">Single container application</SelectOption>
                              <SelectOption value="Quadlets application">Quadlets application</SelectOption>
                              <SelectOption value="Compose Application">Compose Application</SelectOption>
                            </SelectList>
                          </Select>
                          <FormHelperText>
                            <HelperText>
                              <HelperTextItem variant={errors[`app_${application.id}_applicationType`] ? 'error' : 'default'}>
                                {errors[`app_${application.id}_applicationType`] || 'This selection cannot be changed after initial creation as the configuration structure is fundamentally different for each application type.'}
                              </HelperTextItem>
                            </HelperText>
                          </FormHelperText>
                          </FormGroup>

                          {/* Application configuration fields - indented to show dependency on application type */}
                          <div style={{ marginLeft: '24px', borderLeft: '2px solid #f0f0f0', paddingLeft: '16px' }}>

                          {/* Conditional fields based on application type */}
                          {application.applicationType === 'Compose Application' && (
                            <>
                              {/* Definition Source */}
                              <FormGroup
                                label="Definition Source"
                                labelHelp={
                                  <Popover
                                    triggerAction="hover"
                                    headerContent="Definition Source"
                                    bodyContent={
                                    <div>
                                      <p><strong>Configuration Sources:</strong></p>
                                      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                        <li><strong>OCI Reference</strong> - Pull compose definitions from container registry (reusable, versioned)</li>
                                        <li><strong>Inline</strong> - Define compose files directly in this interface (custom, one-off)</li>
                                      </ul>
                                    </div>
                                  }
                                    hasClose={false}
                                  >
                                    <FormGroupLabelHelp aria-label="More info for definition source field" />
                                  </Popover>
                                }
                                fieldId={`definition-source-${application.id}`}
                                style={{ marginBottom: '1.5rem' }}
                              >
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                  <Radio
                                    isChecked={application.sourceType === 'OCI Reference'}
                                    name={`definition-source-${application.id}`}
                                    onChange={() => updateApplicationField(application.id, 'sourceType', 'OCI Reference')}
                                    label="OCI Reference"
                                    id={`oci-reference-${application.id}`}
                                  />
                                  <Radio
                                    isChecked={application.sourceType === 'Inline'}
                                    name={`definition-source-${application.id}`}
                                    onChange={() => {
                                      updateApplicationField(application.id, 'sourceType', 'Inline');
                                      // Add a default file definition if none exist
                                      if (application.fileDefinitions.length === 0) {
                                        updateApplicationField(application.id, 'fileDefinitions', [{ name: '', filePath: '', content: '', expanded: true }]);
                                      }
                                    }}
                                    label="Inline"
                                    id={`inline-${application.id}`}
                                  />
                                </div>
                              </FormGroup>

                              {/* OCI Reference Scenario */}
                              {application.sourceType === 'OCI Reference' && (
                                <div style={{ marginLeft: '24px', paddingLeft: '16px', borderLeft: '2px solid #f0f0f0' }}>
                                  {/* OCI Reference URL */}
                                  <FormGroup
                                    label="OCI Reference URL"
                                    labelHelp={
                                      <Popover
                                        triggerAction="hover"
                                        headerContent="OCI Reference URL"
                                        bodyContent="Specify the full URL to the OCI reference containing your compose application definition. Use the format 'oci://registry.example.com/path/to/reference:tag'. The reference should contain compose files and related configurations packaged as an OCI reference. Ensure your devices have access to the specified registry."
                                        hasClose={false}
                                      >
                                        <FormGroupLabelHelp aria-label="More info for OCI reference URL field" />
                                      </Popover>
                                    }
                                    fieldId={`oci-url-${application.id}`}
                                    style={{ marginBottom: '1.5rem' }}
                                  >
                                    <TextInput
                                      type="text"
                                      id={`oci-url-${application.id}`}
                                      value={application.ociArtifactUrl}
                                      onChange={(_event, value) => updateApplicationField(application.id, 'ociArtifactUrl', value)}
                                      placeholder="oci://registry.example.com/my-quadlet:latest"
                                    />
                                    <FormHelperText>
                                      <HelperText>
                                        <HelperTextItem>
                                          Provide a valid OCI reference URL (e.g., "oci://registry.example.com/my-quadlet:latest")
                                        </HelperTextItem>
                                      </HelperText>
                                    </FormHelperText>
                                  </FormGroup>

                                  {/* Environment Variables */}
                                  <FormGroup
                                    label="Environment Variables"
                                    labelHelp={
                                      <Popover
                                        triggerAction="hover"
                                        headerContent="Environment Variables"
                                        bodyContent="Define key-value pairs that will be available as environment variables inside your compose application containers. Use this to configure application behavior, API keys (use secrets for sensitive data), database URLs, feature flags, and other runtime configuration. Environment variables are essential for making applications configurable across different deployment environments."
                                        hasClose={false}
                                      >
                                        <FormGroupLabelHelp aria-label="More info for environment variables field" />
                                      </Popover>
                                    }
                                    fieldId={`env-vars-${application.id}`}
                                    style={{ marginBottom: '1.5rem' }}
                                  >
                                    <Stack hasGutter>
                                      {/* Display existing environment variables as labels */}
                                      {application.environmentVariables.filter(env => env.completed).length > 0 && (
                                        <StackItem>
                                          <LabelGroup>
                                            {application.environmentVariables
                                              .filter(env => env.completed)
                                              .map((envVar, index) => (
                                                <Label
                                                  key={index}
                                                  onClose={() => {
                                                    const newEnvVars = application.environmentVariables.filter(env =>
                                                      !(env.key === envVar.key && env.value === envVar.value)
                                                    );
                                                    updateApplicationField(application.id, 'environmentVariables', newEnvVars);
                                                  }}
                                                  closeBtnAriaLabel={`Remove ${envVar.key}=${envVar.value}`}
                                                >
                                                  {envVar.key}={envVar.value}
                                                </Label>
                                              ))}
                                          </LabelGroup>
                                        </StackItem>
                                      )}

                                      {/* Show input row only for incomplete variables (new ones being added) */}
                                      {application.environmentVariables
                                        .filter(env => !env.completed)
                                        .map((envVar, index) => {
                                          const actualIndex = application.environmentVariables.findIndex(env =>
                                            env === envVar
                                          );

                                          const handleAddVariable = () => {
                                            if (envVar.key.trim() && envVar.value.trim()) {
                                              const newEnvVars = [...application.environmentVariables];
                                              newEnvVars[actualIndex] = {
                                                ...newEnvVars[actualIndex],
                                                key: envVar.key.trim(),
                                                value: envVar.value.trim(),
                                                completed: true
                                              };
                                              updateApplicationField(application.id, 'environmentVariables', newEnvVars);
                                            }
                                          };

                                          const handleKeyPress = (event: React.KeyboardEvent) => {
                                            if (event.key === 'Enter') {
                                              handleAddVariable();
                                            }
                                          };

                                          return (
                                            <StackItem key={`input-${actualIndex}`}>
                                              <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                maxWidth: '600px'
                                              }}>
                                                <TextInput
                                                  placeholder="key"
                                                  value={envVar.key || ''}
                                                  onChange={(_event, value) => {
                                                    const newEnvVars = [...application.environmentVariables];
                                                    newEnvVars[actualIndex] = { ...newEnvVars[actualIndex], key: value };
                                                    updateApplicationField(application.id, 'environmentVariables', newEnvVars);
                                                  }}
                                                  onKeyDown={handleKeyPress}
                                                  style={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #D2D2D2',
                                                    minWidth: '120px',
                                                    flex: '1'
                                                  }}
                                                />
                                                <span style={{
                                                  color: '#151515',
                                                  fontWeight: '400',
                                                  fontSize: '14px'
                                                }}>
                                                  =
                                                </span>
                                                <TextInput
                                                  placeholder="value"
                                                  value={envVar.value || ''}
                                                  onChange={(_event, value) => {
                                                    const newEnvVars = [...application.environmentVariables];
                                                    newEnvVars[actualIndex] = { ...newEnvVars[actualIndex], value: value };
                                                    updateApplicationField(application.id, 'environmentVariables', newEnvVars);
                                                  }}
                                                  onKeyDown={handleKeyPress}
                                                  style={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #D2D2D2',
                                                    minWidth: '120px',
                                                    flex: '1'
                                                  }}
                                                />
                                                <Button
                                                  variant="primary"
                                                  onClick={handleAddVariable}
                                                  isDisabled={!envVar.key?.trim() || !envVar.value?.trim()}
                                                  style={{
                                                    borderRadius: '20px',
                                                    backgroundColor: (envVar.key?.trim() && envVar.value?.trim()) ? '#0066CC' : '#A3A3A3',
                                                    border: 'none',
                                                    padding: '6px 16px',
                                                    fontSize: '14px',
                                                    fontWeight: '400'
                                                  }}
                                                >
                                                  Add
                                                </Button>
                                                <Button
                                                  variant="plain"
                                                  onClick={() => {
                                                    const newEnvVars = application.environmentVariables.filter((_, i) => i !== actualIndex);
                                                    updateApplicationField(application.id, 'environmentVariables', newEnvVars);
                                                  }}
                                                  style={{
                                                    minWidth: 'auto',
                                                    padding: '4px',
                                                    fontSize: '18px',
                                                    color: '#6A6E73',
                                                    background: 'transparent',
                                                    border: 'none'
                                                  }}
                                                >
                                                  ×
                                                </Button>
                                              </div>
                                            </StackItem>
                                          );
                                        })}

                                      {/* Add Environment Variables button */}
                                      <StackItem>
                                        <Button
                                          variant="link"
                                          onClick={() => {
                                            // Add an empty environment variable to trigger input mode
                                            const newEnvVars = [...application.environmentVariables, { key: '', value: '', completed: false }];
                                            updateApplicationField(application.id, 'environmentVariables', newEnvVars);
                                          }}
                                          icon={<PlusIcon />}
                                          style={{ padding: 0 }}
                                        >
                                          Add environment variable
                                        </Button>
                                      </StackItem>
                                    </Stack>
                                  </FormGroup>
                                </div>
                              )}

                              {/* Inline Scenario */}
                              {application.sourceType === 'Inline' && (
                                <div style={{ marginLeft: '24px', paddingLeft: '16px', borderLeft: '2px solid #f0f0f0' }}>
                                  {/* File Definitions */}
                                  <FormGroup
                                    label="File Definitions"
                                    labelHelp={
                                      <Popover
                                        triggerAction="hover"
                                        headerContent="File Definitions"
                                        bodyContent="Create compose files and related configurations directly in this interface. Define your docker-compose.yml files, environment files, or supporting configuration files. Multiple files can be defined to create complex compose applications with multiple services."
                                        hasClose={false}
                                      >
                                        <FormGroupLabelHelp aria-label="More info for file definitions field" />
                                      </Popover>
                                    }
                                    fieldId={`file-definitions-${application.id}`}
                                    style={{ marginBottom: '1.5rem' }}
                                  >
                                    <Stack hasGutter>
                                      {application.fileDefinitions.map((fileDef, index) => {
                                        const fileDefKey = `file-def-${application.id}-${index}`;
                                        const isExpanded = fileDef.expanded !== false; // Default to expanded

                                        return (
                                          <StackItem key={index}>
                                            <div style={{ position: 'relative' }}>
                                              <Button
                                                variant="plain"
                                                onClick={() => {
                                                  const newFileDefs = application.fileDefinitions.filter((_, i) => i !== index);
                                                  updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                }}
                                                aria-label="Remove file definition"
                                                style={{
                                                  position: 'absolute',
                                                  top: '22px',
                                                  right: '12px',
                                                  transform: 'translateY(-50%)',
                                                  padding: '4px',
                                                  color: '#0066cc',
                                                  zIndex: 2
                                                }}
                                              >
                                                <MinusCircleIcon title="Remove file definition" />
                                              </Button>
                                              <div
                                                style={{
                                                  border: '1px solid #D2D2D2',
                                                  borderRadius: '8px',
                                                  marginBottom: '1rem'
                                                }}
                                              >
                                                {/* Custom header with inline edit functionality */}
                                                <div
                                                  style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '12px 16px',
                                                    cursor: 'pointer'
                                                  }}
                                                  onClick={(e) => {
                                                    // Only toggle if we're not clicking on edit elements
                                                    if (!(e.target as HTMLElement).closest('.edit-controls')) {
                                                      const newFileDefs = [...application.fileDefinitions];
                                                      newFileDefs[index] = { ...newFileDefs[index], expanded: !isExpanded };
                                                      updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                    }
                                                  }}
                                                >
                                                  {/* Expand/Collapse icon */}
                                                  <Button
                                                    variant="plain"
                                                    style={{
                                                      marginRight: '8px',
                                                      padding: '2px',
                                                      minWidth: 'auto',
                                                      color: '#0066cc'
                                                    }}
                                                  >
                                                    {isExpanded ?
                                                      <AngleDownIcon style={{ fontSize: '14px' }} /> :
                                                      <AngleRightIcon style={{ fontSize: '14px' }} />
                                                    }
                                                  </Button>

                                                  {/* Title */}
                                                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, paddingRight: '48px' }}>
                                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                                      {fileDef.name || (fileDef.filePath ? fileDef.filePath.split('/').pop() : `Compose File ${index + 1}`)}
                                                    </span>
                                                  </div>
                                                </div>
                                                {isExpanded && (
                                                  <div style={{
                                                    padding: '1rem',
                                                    backgroundColor: '#FAFAFA'
                                                  }}>
                                                    <Stack hasGutter>
                                                      <StackItem>
                                                        <FormGroup
                                                          label="File name"
                                                          labelHelp={
                                                            <Popover
                                                              triggerAction="hover"
                                                              headerContent="File name Guidelines"
                                                              bodyContent={
                                                                <div>
                                                                  <p><strong>Common Compose Files:</strong></p>
                                                                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                                                    <li><code>docker-compose.yml</code> - Main compose file</li>
                                                                    <li><code>docker-compose.override.yml</code> - Override configurations</li>
                                                                    <li><code>.env</code> - Environment variables file</li>
                                                                    <li><code>config.yml</code> - Application configuration</li>
                                                                  </ul>
                                                                  <p><strong>Also Supported:</strong></p>
                                                                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                                                    <li><code>.yaml, .json, .conf</code> - Config files</li>
                                                                    <li><code>.sh</code> - Shell scripts</li>
                                                                  </ul>
                                                                </div>
                                                              }
                                                              hasClose={false}
                                                            >
                                                              <FormGroupLabelHelp aria-label="File name guidelines" />
                                                            </Popover>
                                                          }
                                                          fieldId={`file-path-${application.id}-${index}`}
                                                        >
                                                          <Split hasGutter>
                                                            <SplitItem isFilled>
                                                              <TextInput
                                                                type="text"
                                                                id={`file-path-${application.id}-${index}`}
                                                                value={fileDef.filePath || ''}
                                                                onChange={(_event, value) => {
                                                                  const newFileDefs = [...application.fileDefinitions];
                                                                  newFileDefs[index] = { ...newFileDefs[index], filePath: value };
                                                                  updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                                }}
                                                                placeholder="docker-compose.yml"
                                                                aria-label="File name"
                                                                autoComplete="off"
                                                              />
                                                            </SplitItem>
                                                          </Split>

                                                          {/* Base helper text always shown */}
                                                          <FormHelperText>
                                                            <HelperText>
                                                              <HelperTextItem>
                                                                Common files: <strong>docker-compose.yml</strong>, <strong>.env</strong>, <strong>config.yml</strong>
                                                              </HelperTextItem>
                                                            </HelperText>
                                                          </FormHelperText>
                                                        </FormGroup>
                                                      </StackItem>
                                                      <StackItem>
                                                        <FormGroup
                                                          label="Content"
                                                          fieldId={`file-content-${application.id}-${index}`}
                                                        >
                                                          <FileUpload
                                                            id={`file-content-${application.id}-${index}`}
                                                            type="text"
                                                            value={fileDef.content}
                                                            filename={fileDef.filename || ''}
                                                            filenamePlaceholder="Drag and drop a file or upload one"
                                                            onFileInputChange={(_, file: File) => {
                                                              const newFileDefs = [...application.fileDefinitions];
                                                              newFileDefs[index] = { ...newFileDefs[index], filename: file.name };
                                                              updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                            }}
                                                            onDataChange={(_, value: string) => {
                                                              const newFileDefs = [...application.fileDefinitions];
                                                              newFileDefs[index] = { ...newFileDefs[index], content: value };
                                                              updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                            }}
                                                            onTextChange={(_, value: string) => {
                                                              const newFileDefs = [...application.fileDefinitions];
                                                              newFileDefs[index] = { ...newFileDefs[index], content: value };
                                                              updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                            }}
                                                            onClearClick={() => {
                                                              const newFileDefs = [...application.fileDefinitions];
                                                              newFileDefs[index] = { ...newFileDefs[index], filename: '', content: '' };
                                                              updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                            }}
                                                            allowEditingUploadedText={true}
                                                            browseButtonText="Upload"
                                                          >
                                                            <FileUploadHelperText>
                                                              <HelperText>
                                                                <HelperTextItem>
                                                                  Upload a file or paste content. Supported files: docker-compose.yml, .env, config files
                                                                </HelperTextItem>
                                                              </HelperText>
                                                            </FileUploadHelperText>
                                                          </FileUpload>
                                                        </FormGroup>
                                                      </StackItem>
                                                    </Stack>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </StackItem>
                                        );
                                      })}
                                      <StackItem>
                                        <Button
                                          variant="link"
                                          onClick={() => {
                                            const newFileDefs = [...application.fileDefinitions, { name: '', filePath: '', content: '', expanded: true }];
                                            updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                          }}
                                          icon={<PlusIcon />}
                                          style={{ padding: 0 }}
                                        >
                                          Add file definition
                                        </Button>
                                      </StackItem>
                                    </Stack>
                                  </FormGroup>
                                </div>
                              )}
                            </>
                          )}

                          {application.applicationType === 'Single container application' && (
                            <>
                              {/* Image */}
                              <FormGroup
                                label="Image"
                                labelHelp={
                                  <Popover
                                    triggerAction="hover"
                                    headerContent="Application image"
                                    bodyContent="Specify the container image reference for your application in the format 'registry/repository:tag'. Examples: 'nginx:latest', 'quay.io/nginx/nginx:1.21', 'docker.io/library/redis:alpine'. The image must be accessible from your devices and compatible with their architecture (x86_64, arm64, etc.)."
                                    hasClose={false}
                                  >
                                    <FormGroupLabelHelp aria-label="More info for image field" />
                                  </Popover>
                                }
                                fieldId={`app-image-${application.id}`}
                                style={{ marginBottom: '1.5rem' }}
                              >
                                <TextInput
                                  type="text"
                                  id={`app-image-${application.id}`}
                                  value={application.applicationImage}
                                  onChange={(_event, value) => {
                                    updateApplicationField(application.id, 'applicationImage', value);
                                    clearError(`app_${application.id}_image`);
                                  }}
                                  onBlur={() => {
                                    const error = validateApplicationImage(application.applicationImage);
                                    if (error) {
                                      setError(`app_${application.id}_image`, error);
                                    }
                                  }}
                                  placeholder="quay.io/nginx/nginx:latest"
                                  validated={errors[`app_${application.id}_image`] ? 'error' : 'default'}
                                />
                                <FormHelperText>
                                  <HelperText>
                                    <HelperTextItem variant={errors[`app_${application.id}_image`] ? 'error' : 'default'}>
                                      {errors[`app_${application.id}_image`] || 'Provide a valid image reference'}
                                    </HelperTextItem>
                                  </HelperText>
                                </FormHelperText>
                              </FormGroup>

                              {/* Ports */}
                              <FormGroup
                                label="Ports"
                                labelHelp={
                                  <Popover
                                    triggerAction="hover"
                                    headerContent="Port mappings"
                                    bodyContent="Map ports from the device host to your container application. Provide host port and container port separately. Multiple port mappings can be added. Consider port availability on target devices and potential conflicts with other applications."
                                    hasClose={false}
                                  >
                                    <FormGroupLabelHelp aria-label="More info for ports field" />
                                  </Popover>
                                }
                                fieldId={`ports-${application.id}`}
                                style={{ marginBottom: '1.5rem' }}
                              >
                                <FormHelperText>
                                  <HelperText>
                                    <HelperTextItem variant={errors[`app_${application.id}_newPort`] ? 'error' : 'default'}>
                                      {errors[`app_${application.id}_newPort`] || 'Provide a valid port mapping in the format "hostPort:containerPort" (e.g., "8080:80").'}
                                    </HelperTextItem>
                                  </HelperText>
                                </FormHelperText>

                                <Split hasGutter style={{ alignItems: 'center' }}>
                                  <SplitItem>
                                    <TextInput
                                      id={`host-port-input-${application.id}`}
                                      placeholder="Host Port"
                                      value={application.newHostPort}
                                      validated={errors[`app_${application.id}_newPort`] ? 'error' : 'default'}
                                      style={{ width: '180px' }}
                                      onKeyPress={(event) => {
                                        if (event.key === 'Enter') {
                                          addApplicationPort(application.id);
                                        }
                                      }}
                                      onChange={(_event, value) => {
                                        updateApplicationField(application.id, 'newHostPort', value);
                                        clearError(`app_${application.id}_newPort`);
                                      }}
                                    />
                                  </SplitItem>
                                  <SplitItem style={{
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#6a6e73',
                                    padding: '0 8px'
                                  }}>
                                    :
                                  </SplitItem>
                                  <SplitItem>
                                    <TextInput
                                      id={`container-port-input-${application.id}`}
                                      placeholder="Container port"
                                      value={application.newContainerPort}
                                      validated={errors[`app_${application.id}_newPort`] ? 'error' : 'default'}
                                      style={{ width: '180px' }}
                                      onKeyPress={(event) => {
                                        if (event.key === 'Enter') {
                                          addApplicationPort(application.id);
                                        }
                                      }}
                                      onChange={(_event, value) => {
                                        updateApplicationField(application.id, 'newContainerPort', value);
                                        clearError(`app_${application.id}_newPort`);
                                      }}
                                    />
                                  </SplitItem>
                                  <SplitItem>
                                    <Button
                                      variant="control"
                                      onClick={() => addApplicationPort(application.id)}
                                    >
                                      →
                                    </Button>
                                  </SplitItem>
                                </Split>

                                {application.ports.length > 0 && (
                                  <div style={{
                                    marginTop: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    flexWrap: 'wrap'
                                  }}>
                                    <span style={{
                                      fontSize: '14px',
                                      color: '#6a6e73',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      Added ports:
                                    </span>
                                    {application.ports.map((port, index) => (
                                      <Label
                                        key={index}
                                        onClose={() => removeApplicationPort(application.id, port)}
                                        closeBtnAriaLabel={`Remove ${port}`}
                                      >
                                        {port}
                                      </Label>
                                    ))}
                                  </div>
                                )}
                              </FormGroup>

                          {/* Resources */}
                          <FormGroup
                            label="Resources"
                            labelHelp={
                              <Popover
                                triggerAction="hover"
                                headerContent="Resources"
                                bodyContent={
                                <div>
                                  <p><strong>CPU Formats:</strong></p>
                                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                    <li><strong>Fractional:</strong> <code>0.5</code>, <code>500m</code> (half core)</li>
                                    <li><strong>Whole numbers:</strong> <code>1</code>, <code>2</code> (full cores)</li>
                                  </ul>
                                  <p><strong>Memory Formats:</strong></p>
                                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                    <li><code>512Mi</code>, <code>1Gi</code>, <code>2048k</code></li>
                                  </ul>
                                  <p><strong>⚡ Tip:</strong> Leave empty for no limits, but consider device constraints.</p>
                                </div>
                              }
                                hasClose={false}
                              >
                                <FormGroupLabelHelp aria-label="More info for resources field" />
                              </Popover>
                            }
                            fieldId={`resources-${application.id}`}
                            style={{ marginBottom: '1.5rem' }}
                          >
                            <FormHelperText>
                              <HelperText>
                                <HelperTextItem>
                                  You may leave one or both fields empty.
                                </HelperTextItem>
                              </HelperText>
                            </FormHelperText>

                            <Split hasGutter>
                              <SplitItem>
                                <FormGroup
                                  label="CPU"
                                  labelHelp={
                                    <Popover
                                      triggerAction="hover"
                                      headerContent="CPU"
                                      bodyContent="Set the maximum CPU usage for your container. Use fractional values ('0.5' or '500m' for half a CPU core) or whole numbers ('1', '2' for full cores). The 'm' suffix represents millicores (1000m = 1 CPU core). Consider your device's total CPU capacity when setting limits."
                                      hasClose={false}
                                    >
                                      <FormGroupLabelHelp aria-label="More info for CPU field" />
                                    </Popover>
                                  }
                                  fieldId={`cpu-${application.id}`}
                                >
                                  <TextInput
                                    id={`cpu-${application.id}`}
                                    value={application.cpuValue}
                                    onChange={(_event, value) => updateApplicationField(application.id, 'cpuValue', value)}
                                    placeholder="500m"
                                  />
                                  <FormHelperText>
                                    <HelperText>
                                      <HelperTextItem>
                                        Provide a valid CPU value (e.g., "500m" or "2").
                                      </HelperTextItem>
                                    </HelperText>
                                  </FormHelperText>
                                </FormGroup>
                              </SplitItem>
                              <SplitItem>
                                <FormGroup
                                  label="Memory"
                                  labelHelp={
                                    <Popover
                                      triggerAction="hover"
                                      headerContent="Memory"
                                      bodyContent="Set the maximum memory usage for your container using standard units: 'Ki' (kibibytes), 'Mi' (mebibytes), 'Gi' (gibibytes). Examples: '512Mi' (512 MB), '1Gi' (1 GB), '2048k' (2 MB). Ensure the limit fits within your device's available memory and accounts for other applications and system processes."
                                      hasClose={false}
                                    >
                                      <FormGroupLabelHelp aria-label="More info for memory field" />
                                    </Popover>
                                  }
                                  fieldId={`memory-${application.id}`}
                                >
                                  <TextInput
                                    id={`memory-${application.id}`}
                                    value={application.memoryValue}
                                    onChange={(_event, value) => updateApplicationField(application.id, 'memoryValue', value)}
                                    placeholder="512Mi"
                                  />
                                  <FormHelperText>
                                    <HelperText>
                                      <HelperTextItem>
                                        Provide a valid memory value (e.g., "512Mi", "2g", "1024k").
                                      </HelperTextItem>
                                    </HelperText>
                                  </FormHelperText>
                                </FormGroup>
                              </SplitItem>
                            </Split>
                          </FormGroup>

                          {/* Volumes - Hidden for Quadlets application */}
                          {application.applicationType !== 'Quadlets application' && (
                            <FormGroup
                              label="Volumes"
                              labelHelp={
                                <Popover
                                  triggerAction="hover"
                                  headerContent="Volumes"
                                  bodyContent={
                                  <div>
                                    <p><strong>Volume Types:</strong></p>
                                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                      <li><strong>Mount Volume</strong> - Mount existing device directories into the container</li>
                                      <li><strong>Image Mount Volume</strong> - Mount data from container images</li>
                                    </ul>
                                    <p><strong>💾 Benefits:</strong> Persistent storage that survives container restarts and updates.</p>
                                  </div>
                                }
                                  hasClose={false}
                                >
                                  <FormGroupLabelHelp aria-label="More info for volumes field" />
                                </Popover>
                              }
                              fieldId={`volumes-${application.id}`}
                              style={{ marginBottom: '1.5rem' }}
                            >
                            <Stack hasGutter>
                              {/* Existing volumes */}
                              {application.volumes.map((volume) => (
                                <StackItem key={volume.id}>
                                  <div style={{
                                    border: '1px solid #d2d2d2',
                                    borderRadius: '4px',
                                    position: 'relative'
                                  }}>
                                    {/* Volume Header */}
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      padding: '12px 16px',
                                      borderBottom: volume.expanded ? '1px solid #e8e8e8' : 'none',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => toggleVolumeExpansion(application.id, volume.id)}>
                                      <Button
                                        variant="plain"
                                        style={{
                                          padding: '4px',
                                          marginRight: '8px',
                                          transform: volume.expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                          transition: 'transform 0.2s ease'
                                        }}
                                        aria-label={volume.expanded ? "Collapse volume" : "Expand volume"}
                                      >
                                        <AngleRightIcon />
                                      </Button>

                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                          fontWeight: 600,
                                          fontSize: '14px',
                                          marginBottom: volume.expanded ? 0 : '2px'
                                        }}>
                                          {volume.name || 'Unnamed Volume'}
                                        </div>
                                        {!volume.expanded && (
                                          <div style={{
                                            fontSize: '12px',
                                            color: '#6a6e73',
                                            display: 'flex',
                                            gap: '8px',
                                            flexWrap: 'wrap'
                                          }}>
                                            <span>{volume.volumeType !== 'Select' ? volume.volumeType : 'No type selected'}</span>
                                            {volume.mountPath && <span>→ {volume.mountPath}</span>}
                                            {volume.volumeType === 'Image Mount Volume' && volume.imageReference && (
                                              <span>({volume.imageReference})</span>
                                            )}
                                          </div>
                                        )}
                                      </div>

                                      <Button
                                        variant="plain"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeApplicationVolume(application.id, volume.id);
                                        }}
                                        style={{
                                          padding: '4px',
                                          color: '#0066cc',
                                          marginLeft: '8px'
                                        }}
                                        aria-label="Remove volume"
                                      >
                                        <MinusCircleIcon title="Remove volume" />
                                      </Button>
                                    </div>

                                    {/* Volume Details (only when expanded) */}
                                    {volume.expanded && (
                                      <div style={{ padding: '16px' }}>
                                        <Stack hasGutter>
                                          {/* Volume Name */}
                                          <StackItem>
                                            <FormGroup
                                              label="Name"
                                              fieldId={`volume-name-${volume.id}`}
                                            >
                                              <TextInput
                                                type="text"
                                                id={`volume-name-${volume.id}`}
                                                value={volume.name}
                                                onChange={(_event, value) => updateApplicationVolume(application.id, volume.id, 'name', value)}
                                                placeholder="e.g., data-volume"
                                              />
                                            </FormGroup>
                                          </StackItem>

                                          {/* Volume Type Selection */}
                                          <StackItem>
                                            <FormGroup
                                              label="Volume type"
                                              fieldId={`volume-type-${volume.id}`}
                                            >
                                              <Select
                                                id={`volume-type-${volume.id}`}
                                                isOpen={getApplicationDropdownState(volume.id, 'volumeType')}
                                                selected={volume.volumeType}
                                                onSelect={(_event, selection) => {
                                                  updateApplicationVolume(application.id, volume.id, 'volumeType', selection as string);
                                                  toggleApplicationDropdown(volume.id, 'volumeType', false);
                                                }}
                                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                                  <MenuToggle
                                                    ref={toggleRef}
                                                    onClick={() => toggleApplicationDropdown(volume.id, 'volumeType', !getApplicationDropdownState(volume.id, 'volumeType'))}
                                                    isExpanded={getApplicationDropdownState(volume.id, 'volumeType')}
                                                    style={{ width: '100%' }}
                                                  >
                                                    {volume.volumeType}
                                                  </MenuToggle>
                                                )}
                                              >
                                                <SelectList>
                                                  <SelectOption value="Select">Select</SelectOption>
                                                  <SelectOption value="Mount Volume">Mount Volume</SelectOption>
                                                  <SelectOption value="Image Mount Volume">Image Mount Volume</SelectOption>
                                                </SelectList>
                                              </Select>
                                            </FormGroup>
                                          </StackItem>

                                          {/* Conditional fields based on volume type */}
                                          {volume.volumeType === 'Image Mount Volume' && (
                                            <StackItem>
                                              <FormGroup
                                                label="Image reference"
                                                fieldId={`volume-image-ref-${volume.id}`}
                                              >
                                                <TextInput
                                                  type="text"
                                                  id={`volume-image-ref-${volume.id}`}
                                                  value={volume.imageReference}
                                                  onChange={(_event, value) => updateApplicationVolume(application.id, volume.id, 'imageReference', value)}
                                                  placeholder="quay.io/myself/myimage"
                                                />
                                              </FormGroup>
                                            </StackItem>
                                          )}

                                          {volume.volumeType === 'Image Mount Volume' && (
                                            <StackItem>
                                              <FormGroup
                                                label="Pull policy"
                                                fieldId={`volume-pull-policy-${volume.id}`}
                                              >
                                                <Select
                                                  id={`volume-pull-policy-${volume.id}`}
                                                  isOpen={getApplicationDropdownState(volume.id, 'pullPolicy')}
                                                  selected={volume.pullPolicy}
                                                  onSelect={(_event, selection) => {
                                                    updateApplicationVolume(application.id, volume.id, 'pullPolicy', selection as string);
                                                    toggleApplicationDropdown(volume.id, 'pullPolicy', false);
                                                  }}
                                                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                                    <MenuToggle
                                                      ref={toggleRef}
                                                      onClick={() => toggleApplicationDropdown(volume.id, 'pullPolicy', !getApplicationDropdownState(volume.id, 'pullPolicy'))}
                                                      isExpanded={getApplicationDropdownState(volume.id, 'pullPolicy')}
                                                      style={{ width: '100%' }}
                                                    >
                                                      {volume.pullPolicy}
                                                    </MenuToggle>
                                                  )}
                                                >
                                                  <SelectList>
                                                    <SelectOption value="Select">Select</SelectOption>
                                                    <SelectOption value="Always">Always</SelectOption>
                                                    <SelectOption value="If not present">If not present</SelectOption>
                                                    <SelectOption value="Never">Never</SelectOption>
                                                  </SelectList>
                                                </Select>
                                              </FormGroup>
                                            </StackItem>
                                          )}

                                          {/* Mount path - shown for both volume types */}
                                          {(volume.volumeType === 'Mount Volume' || volume.volumeType === 'Image Mount Volume') && (
                                            <StackItem>
                                              <FormGroup
                                                label="Mount path"
                                                fieldId={`volume-mount-path-${volume.id}`}
                                              >
                                                <TextInput
                                                  type="text"
                                                  id={`volume-mount-path-${volume.id}`}
                                                  value={volume.mountPath}
                                                  onChange={(_event, value) => updateApplicationVolume(application.id, volume.id, 'mountPath', value)}
                                                  placeholder="/path/to/somewhere"
                                                />
                                              </FormGroup>
                                            </StackItem>
                                          )}
                                        </Stack>
                                      </div>
                                    )}
                                  </div>
                                </StackItem>
                              ))}

                              {/* Add Volume button */}
                              <StackItem>
                                <Button
                                  variant="link"
                                  onClick={() => addApplicationVolume(application.id)}
                                  icon={<PlusIcon />}
                                  style={{ padding: '8px 0', color: '#0066cc' }}
                                >
                                  Add volume
                                </Button>
                              </StackItem>
                            </Stack>
                          </FormGroup>
                          )}


                            </>
                          )}

                          {application.applicationType === 'Quadlets application' && (
                            <>
                              {/* Definition Source */}
                              <FormGroup
                                label="Definition Source"
                                labelHelp={
                                  <Popover
                                    triggerAction="hover"
                                    headerContent="Definition Source"
                                    bodyContent={
                                    <div>
                                      <p><strong>Configuration Sources:</strong></p>
                                      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                        <li><strong>OCI Reference</strong> - Pull definitions from container registry (reusable, versioned)</li>
                                        <li><strong>Inline</strong> - Define Quadlet files directly in this interface (custom, one-off)</li>
                                      </ul>
                                    </div>
                                  }
                                    hasClose={false}
                                  >
                                    <FormGroupLabelHelp aria-label="More info for definition source field" />
                                  </Popover>
                                }
                                fieldId={`definition-source-${application.id}`}
                                style={{ marginBottom: '1.5rem' }}
                              >
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                  <Radio
                                    isChecked={application.sourceType === 'OCI Reference'}
                                    name={`definition-source-${application.id}`}
                                    onChange={() => updateApplicationField(application.id, 'sourceType', 'OCI Reference')}
                                    label="OCI Reference"
                                    id={`oci-reference-${application.id}`}
                                  />
                                  <Radio
                                    isChecked={application.sourceType === 'Inline'}
                                    name={`definition-source-${application.id}`}
                                    onChange={() => {
                                      updateApplicationField(application.id, 'sourceType', 'Inline');
                                      // Add a default file definition if none exist
                                      if (application.fileDefinitions.length === 0) {
                                        updateApplicationField(application.id, 'fileDefinitions', [{ name: '', filePath: '', content: '', expanded: true }]);
                                      }
                                    }}
                                    label="Inline"
                                    id={`inline-${application.id}`}
                                  />
                                </div>
                              </FormGroup>

                              {/* OCI Reference Scenario */}
                              {application.sourceType === 'OCI Reference' && (
                                <div style={{ marginLeft: '24px', paddingLeft: '16px', borderLeft: '2px solid #f0f0f0' }}>
                                  {/* OCI Reference URL */}
                                  <FormGroup
                                    label="OCI Reference URL"
                                    labelHelp={
                                      <Popover
                                        triggerAction="hover"
                                        headerContent="OCI Reference URL"
                                        bodyContent="Specify the full URL to the OCI reference containing your Quadlet application definition. Use the format 'oci://registry.example.com/path/to/reference:tag'. The reference should contain Quadlet files (.container, .volume, .pod, etc.) packaged as an OCI reference. Ensure your devices have access to the specified registry."
                                        hasClose={false}
                                      >
                                        <FormGroupLabelHelp aria-label="More info for OCI reference URL field" />
                                      </Popover>
                                    }
                                    fieldId={`oci-url-${application.id}`}
                                    style={{ marginBottom: '1.5rem' }}
                                  >
                                    <TextInput
                                      type="text"
                                      id={`oci-url-${application.id}`}
                                      value={application.ociArtifactUrl}
                                      onChange={(_event, value) => updateApplicationField(application.id, 'ociArtifactUrl', value)}
                                      placeholder="oci://registry.example.com/my-quadlet:latest"
                                    />
                                    <FormHelperText>
                                      <HelperText>
                                        <HelperTextItem>
                                          Provide a valid OCI reference URL (e.g., "oci://registry.example.com/my-quadlet:latest")
                                        </HelperTextItem>
                                      </HelperText>
                                    </FormHelperText>
                                  </FormGroup>

                                  {/* Environment Variables */}
                                  <FormGroup
                                    label="Environment Variables"
                                    labelHelp={
                                      <Popover
                                        triggerAction="hover"
                                        headerContent="Environment Variables"
                                        bodyContent="Define key-value pairs that will be available as environment variables inside your Quadlet application containers. Use this to configure application behavior, API keys (use secrets for sensitive data), database URLs, feature flags, and other runtime configuration. Environment variables are essential for making applications configurable across different deployment environments."
                                        hasClose={false}
                                      >
                                        <FormGroupLabelHelp aria-label="More info for environment variables field" />
                                      </Popover>
                                    }
                                    fieldId={`env-vars-${application.id}`}
                                    style={{ marginBottom: '1.5rem' }}
                                  >
                                    <Stack hasGutter>
                                      {/* Display existing environment variables as labels */}
                                      {application.environmentVariables.filter(env => env.completed).length > 0 && (
                                        <StackItem>
                                          <LabelGroup>
                                            {application.environmentVariables
                                              .filter(env => env.completed)
                                              .map((envVar, index) => (
                                                <Label
                                                  key={index}
                                                  onClose={() => {
                                                    const newEnvVars = application.environmentVariables.filter(env =>
                                                      !(env.key === envVar.key && env.value === envVar.value)
                                                    );
                                                    updateApplicationField(application.id, 'environmentVariables', newEnvVars);
                                                  }}
                                                  closeBtnAriaLabel={`Remove ${envVar.key}=${envVar.value}`}
                                                >
                                                  {envVar.key}={envVar.value}
                                                </Label>
                                              ))}
                                          </LabelGroup>
                                        </StackItem>
                                      )}

                                      {/* Show input row only for incomplete variables (new ones being added) */}
                                      {application.environmentVariables
                                        .filter(env => !env.completed)
                                        .map((envVar, index) => {
                                          const actualIndex = application.environmentVariables.findIndex(env =>
                                            env === envVar
                                          );

                                          const handleAddVariable = () => {
                                            if (envVar.key.trim() && envVar.value.trim()) {
                                              const newEnvVars = [...application.environmentVariables];
                                              newEnvVars[actualIndex] = {
                                                ...newEnvVars[actualIndex],
                                                key: envVar.key.trim(),
                                                value: envVar.value.trim(),
                                                completed: true
                                              };
                                              updateApplicationField(application.id, 'environmentVariables', newEnvVars);
                                            }
                                          };

                                          const handleKeyPress = (event: React.KeyboardEvent) => {
                                            if (event.key === 'Enter') {
                                              handleAddVariable();
                                            }
                                          };

                                          return (
                                            <StackItem key={`input-${actualIndex}`}>
                                              <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                maxWidth: '600px'
                                              }}>
                                                <TextInput
                                                  placeholder="key"
                                                  value={envVar.key || ''}
                                                  onChange={(_event, value) => {
                                                    const newEnvVars = [...application.environmentVariables];
                                                    newEnvVars[actualIndex] = { ...newEnvVars[actualIndex], key: value };
                                                    updateApplicationField(application.id, 'environmentVariables', newEnvVars);
                                                  }}
                                                  onKeyDown={handleKeyPress}
                                                  style={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #D2D2D2',
                                                    minWidth: '120px',
                                                    flex: '1'
                                                  }}
                                                />
                                                <span style={{
                                                  color: '#151515',
                                                  fontWeight: '400',
                                                  fontSize: '14px'
                                                }}>
                                                  =
                                                </span>
                                                <TextInput
                                                  placeholder="value"
                                                  value={envVar.value || ''}
                                                  onChange={(_event, value) => {
                                                    const newEnvVars = [...application.environmentVariables];
                                                    newEnvVars[actualIndex] = { ...newEnvVars[actualIndex], value: value };
                                                    updateApplicationField(application.id, 'environmentVariables', newEnvVars);
                                                  }}
                                                  onKeyDown={handleKeyPress}
                                                  style={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #D2D2D2',
                                                    minWidth: '120px',
                                                    flex: '1'
                                                  }}
                                                />
                                                <Button
                                                  variant="primary"
                                                  onClick={handleAddVariable}
                                                  isDisabled={!envVar.key?.trim() || !envVar.value?.trim()}
                                                  style={{
                                                    borderRadius: '20px',
                                                    backgroundColor: (envVar.key?.trim() && envVar.value?.trim()) ? '#0066CC' : '#A3A3A3',
                                                    border: 'none',
                                                    padding: '6px 16px',
                                                    fontSize: '14px',
                                                    fontWeight: '400'
                                                  }}
                                                >
                                                  Add
                                                </Button>
                                                <Button
                                                  variant="plain"
                                                  onClick={() => {
                                                    const newEnvVars = application.environmentVariables.filter((_, i) => i !== actualIndex);
                                                    updateApplicationField(application.id, 'environmentVariables', newEnvVars);
                                                  }}
                                                  style={{
                                                    minWidth: 'auto',
                                                    padding: '4px',
                                                    fontSize: '18px',
                                                    color: '#6A6E73',
                                                    background: 'transparent',
                                                    border: 'none'
                                                  }}
                                                >
                                                  ×
                                                </Button>
                                              </div>
                                            </StackItem>
                                          );
                                        })}

                                      {/* Add Environment Variables button */}
                                      <StackItem>
                                        <Button
                                          variant="link"
                                          onClick={() => {
                                            // Add an empty environment variable to trigger input mode
                                            const newEnvVars = [...application.environmentVariables, { key: '', value: '', completed: false }];
                                            updateApplicationField(application.id, 'environmentVariables', newEnvVars);
                                          }}
                                          icon={<PlusIcon />}
                                          style={{ padding: 0 }}
                                        >
                                          Add environment variable
                                        </Button>
                                      </StackItem>
                                    </Stack>
                                  </FormGroup>
                                </div>
                              )}

                              {/* Inline Scenario */}
                              {application.sourceType === 'Inline' && (
                                <div style={{ marginLeft: '24px', paddingLeft: '16px', borderLeft: '2px solid #f0f0f0' }}>
                                  {/* File Definitions */}
                                  <FormGroup
                                    label="File Definitions"
                                    labelHelp={
                                      <Popover
                                        triggerAction="hover"
                                        headerContent="File Definitions"
                                        bodyContent="Create Quadlet definition files directly in this interface. Each file should contain valid Quadlet configuration (.container, .volume, .pod, .image, .network files) or supporting configuration files (.yaml, .json, .service files). Use recommended Quadlet extensions for proper systemd integration and validation. Multiple files can be defined to create complex application deployments."
                                        hasClose={false}
                                      >
                                        <FormGroupLabelHelp aria-label="More info for file definitions field" />
                                      </Popover>
                                    }
                                    fieldId={`file-definitions-${application.id}`}
                                    style={{ marginBottom: '1.5rem' }}
                                  >
                                    <Stack hasGutter>
                                      {application.fileDefinitions.map((fileDef, index) => {
                                        const fileDefKey = `file-def-${application.id}-${index}`;
                                        const isExpanded = fileDef.expanded !== false; // Default to expanded

                                        return (
                                          <StackItem key={index}>
                                            <div style={{ position: 'relative' }}>
                                              <Button
                                                variant="plain"
                                                onClick={() => {
                                                  const newFileDefs = application.fileDefinitions.filter((_, i) => i !== index);
                                                  updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                }}
                                                aria-label="Remove file definition"
                                                style={{
                                                  position: 'absolute',
                                                  top: '22px',
                                                  right: '12px',
                                                  transform: 'translateY(-50%)',
                                                  padding: '4px',
                                                  color: '#0066cc',
                                                  zIndex: 2
                                                }}
                                              >
                                                <MinusCircleIcon title="Remove file definition" />
                                              </Button>
                                              <div
                                                style={{
                                                  border: '1px solid #D2D2D2',
                                                  borderRadius: '8px',
                                                  marginBottom: '1rem'
                                                }}
                                              >
                                                {/* Custom header with inline edit functionality */}
                                                <div
                                                  style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '12px 16px',
                                                    cursor: 'pointer'
                                                  }}
                                                  onClick={(e) => {
                                                    // Only toggle if we're not clicking on edit elements
                                                    if (!(e.target as HTMLElement).closest('.edit-controls')) {
                                                      const newFileDefs = [...application.fileDefinitions];
                                                      newFileDefs[index] = { ...newFileDefs[index], expanded: !isExpanded };
                                                      updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                    }
                                                  }}
                                                >
                                                  {/* Expand/Collapse icon */}
                                                  <Button
                                                    variant="plain"
                                                    style={{
                                                      marginRight: '8px',
                                                      padding: '2px',
                                                      minWidth: 'auto',
                                                      color: '#0066cc'
                                                    }}
                                                  >
                                                    {isExpanded ?
                                                      <AngleDownIcon style={{ fontSize: '14px' }} /> :
                                                      <AngleRightIcon style={{ fontSize: '14px' }} />
                                                    }
                                                  </Button>

                                                  {/* Title - editable or display mode */}
                                                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, paddingRight: '48px' }}>
                                                    {editingFileDefTitle === `${application.id}-${index}` ? (
                                                      <div className="edit-controls" style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        flex: 1,
                                                        minWidth: 0,
                                                        maxWidth: 'calc(100% - 40px)'
                                                      }}>
                                                        <TextInput
                                                          type="text"
                                                          value={editingTitleValue}
                                                          onChange={(_event, value) => setEditingTitleValue(value)}
                                                          placeholder="Optional: Give this file a descriptive name"
                                                          onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                              const newFileDefs = [...application.fileDefinitions];
                                                              newFileDefs[index] = { ...newFileDefs[index], name: editingTitleValue.trim() };
                                                              updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                              setEditingFileDefTitle(null);
                                                              setEditingTitleValue('');
                                                            } else if (e.key === 'Escape') {
                                                              setEditingFileDefTitle(null);
                                                              setEditingTitleValue('');
                                                            }
                                                          }}
                                                          onBlur={() => {
                                                            // Auto-submit on blur: save if there's content, cancel if empty
                                                            if (editingTitleValue.trim()) {
                                                              const newFileDefs = [...application.fileDefinitions];
                                                              newFileDefs[index] = { ...newFileDefs[index], name: editingTitleValue.trim() };
                                                              updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                            }
                                                            setEditingFileDefTitle(null);
                                                            setEditingTitleValue('');
                                                          }}
                                                          style={{
                                                            flex: 1,
                                                            minWidth: '200px',
                                                            marginRight: '8px'
                                                          }}
                                                          autoFocus
                                                        />
                                                        <Button
                                                          variant="plain"
                                                          onClick={() => {
                                                            const newFileDefs = [...application.fileDefinitions];
                                                            newFileDefs[index] = { ...newFileDefs[index], name: editingTitleValue.trim() };
                                                            updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                            setEditingFileDefTitle(null);
                                                            setEditingTitleValue('');
                                                          }}
                                                          style={{
                                                            padding: '6px',
                                                            minWidth: '32px',
                                                            flexShrink: 0
                                                          }}
                                                        >
                                                          <CheckIcon style={{ fontSize: '14px', color: '#0066cc' }} />
                                                        </Button>
                                                      </div>
                                                    ) : (
                                                      <>
                                                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                                          {fileDef.name || (fileDef.filePath ? fileDef.filePath.split('/').pop() : `File Definition ${index + 1}`)}
                                                        </span>
                                                      </>
                                                    )}
                                                  </div>
                                                </div>
                                                {isExpanded && (
                                                  <div style={{
                                                    padding: '1rem',
                                                    backgroundColor: '#FAFAFA'
                                                  }}>
                                                    <Stack hasGutter>
                                                      <StackItem>
                                                        <FormGroup
                                                          label="File name"
                                                          labelHelp={
                                                            <Popover
                                                              triggerAction="hover"
                                                              headerContent="File name Guidelines"
                                                              bodyContent={
                                                                <div>
                                                                  <p><strong>Recommended Quadlet Types:</strong></p>
                                                                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                                                    <li><code>.container</code> - Container definitions</li>
                                                                    <li><code>.volume</code> - Volume definitions</li>
                                                                    <li><code>.pod</code> - Pod definitions</li>
                                                                    <li><code>.image</code> - Image definitions</li>
                                                                    <li><code>.network</code> - Network definitions</li>
                                                                  </ul>
                                                                  <p><strong>Also Supported:</strong></p>
                                                                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                                                    <li><code>.service, .timer, .socket</code> - SystemD units</li>
                                                                    <li><code>.yaml, .yml, .json, .toml</code> - Config files</li>
                                                                  </ul>
                                                                  <p><strong>⚠️ Unsupported:</strong> <code>.build</code>, <code>.kube</code>, <code>.artifact</code> files</p>
                                                                </div>
                                                              }
                                                              hasClose={false}
                                                            >
                                                              <FormGroupLabelHelp aria-label="File name guidelines" />
                                                            </Popover>
                                                          }
                                                          fieldId={`file-path-${application.id}-${index}`}
                                                        >
                                                          <Split hasGutter>
                                                            <SplitItem isFilled>
                                                              <TextInput
                                                                type="text"
                                                                id={`file-path-${application.id}-${index}`}
                                                                value={fileDef.filePath || ''}
                                                                onChange={(_event, value) => {
                                                                  const newFileDefs = [...application.fileDefinitions];
                                                                  newFileDefs[index] = { ...newFileDefs[index], filePath: value };
                                                                  updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                                }}
                                                                onFocus={(event) => {
                                                                  // Debug: log to check if focus is working
                                                                  console.log('Input focused, value:', event.target.value);
                                                                }}
                                                                placeholder="/etc/containers/systemd/webapp.container"
                                                                aria-label="File name"
                                                                autoComplete="off"
                                                                validated={(() => {
                                                                  const validation = validateFilePath(fileDef.filePath);
                                                                  return validation.variant === 'error' ? 'error' :
                                                                         validation.variant === 'warning' ? 'warning' :
                                                                         validation.variant === 'success' ? 'success' : 'default';
                                                                })()}
                                                              />
                                                            </SplitItem>
                                                          </Split>

                                                          {/* Base helper text always shown */}
                                                          <FormHelperText>
                                                            <HelperText>
                                                              <HelperTextItem>
                                                                Supported extensions: <strong>.container</strong>, <strong>.volume</strong>, <strong>.pod</strong>, <strong>.image</strong>, <strong>.network</strong>
                                                              </HelperTextItem>
                                                            </HelperText>
                                                          </FormHelperText>

                                                          {/* Validation feedback */}
                                                          {(() => {
                                                            const validation = validateFilePath(fileDef.filePath);
                                                            if (validation.message) {
                                                              return (
                                                                <FormHelperText>
                                                                  <HelperText>
                                                                    <HelperTextItem
                                                                      variant={validation.variant === 'error' ? 'error' :
                                                                              validation.variant === 'warning' ? 'warning' :
                                                                              validation.variant === 'success' ? 'success' : 'default'}
                                                                    >
                                                                      {validation.message}
                                                                    </HelperTextItem>
                                                                  </HelperText>
                                                                </FormHelperText>
                                                              );
                                                            }
                                                            return null;
                                                          })()}
                                                        </FormGroup>
                                                      </StackItem>
                                                      <StackItem>
                                                        <FormGroup
                                                          label="Content"
                                                          fieldId={`file-content-${application.id}-${index}`}
                                                        >
                                                          <FileUpload
                                                            id={`file-content-${application.id}-${index}`}
                                                            type="text"
                                                            value={fileDef.content}
                                                            filename={fileDef.filename || ''}
                                                            filenamePlaceholder="Drag and drop a file or upload one"
                                                            onFileInputChange={(_, file: File) => {
                                                              const newFileDefs = [...application.fileDefinitions];
                                                              newFileDefs[index] = { ...newFileDefs[index], filename: file.name };
                                                              updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                            }}
                                                            onDataChange={(_, value: string) => {
                                                              const newFileDefs = [...application.fileDefinitions];
                                                              newFileDefs[index] = { ...newFileDefs[index], content: value };
                                                              updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                            }}
                                                            onTextChange={(_, value: string) => {
                                                              const newFileDefs = [...application.fileDefinitions];
                                                              newFileDefs[index] = { ...newFileDefs[index], content: value };
                                                              updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                            }}
                                                            onClearClick={() => {
                                                              const newFileDefs = [...application.fileDefinitions];
                                                              newFileDefs[index] = { ...newFileDefs[index], filename: '', content: '' };
                                                              updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                                            }}
                                                            allowEditingUploadedText={true}
                                                            browseButtonText="Upload"
                                                          >
                                                            <FileUploadHelperText>
                                                              <HelperText>
                                                                <HelperTextItem>
                                                                  Upload a file or paste content. Supported extensions: .container, .volume, .pod, .image, .network
                                                                </HelperTextItem>
                                                              </HelperText>
                                                            </FileUploadHelperText>
                                                          </FileUpload>
                                                        </FormGroup>
                                                      </StackItem>
                                                    </Stack>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </StackItem>
                                        );
                                      })}
                                      <StackItem>
                                        <Button
                                          variant="link"
                                          onClick={() => {
                                            const newFileDefs = [...application.fileDefinitions, { name: '', filePath: '', content: '', expanded: true }];
                                            updateApplicationField(application.id, 'fileDefinitions', newFileDefs);
                                          }}
                                          icon={<PlusIcon />}
                                          style={{ padding: 0 }}
                                        >
                                          Add file definition
                                        </Button>
                                      </StackItem>
                                    </Stack>
                                  </FormGroup>
                                </div>
                              )}
                            </>
                          )}
                          </div>
                        </div>
                    </ExpandableSection>
                  </div>
                </StackItem>
              ))}

              <StackItem>
                <Button
                  variant="link"
                  onClick={addApplication}
                  icon={<PlusIcon />}
                  style={{ padding: '8px 0', color: '#0066cc' }}
                >
                  Add application
                </Button>
              </StackItem>
            </Stack>
          </FormGroup>
        </Form>
      </WizardStep>

      {/* Step 3: Updates */}
      <WizardStep
        name="Updates"
        id="updates"
      >
        <Form>
          <FormGroup
            fieldId="config-type"
          >
            <Checkbox
              label="Use basic configurations"
              isChecked={formData.useBasicConfigurations}
              onChange={(_event, checked) => updateFormData({ useBasicConfigurations: checked })}
              id="use-basic-config"
              description="Basic configurations use default settings with immediate rollout and no scheduling restrictions. Uncheck for advanced configuration options."
            />
          </FormGroup>

          {formData.useBasicConfigurations && (
            <Alert
              variant="info"
              title="Default update policy"
              isInline
              style={{ marginTop: '1rem' }}
            >
              All the devices that are part of this fleet will receive updates as soon as they are available.
            </Alert>
          )}

          {!formData.useBasicConfigurations && (
            <Stack hasGutter>
              {/* Advanced configurations header */}
              <StackItem>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#151515', marginTop: '1rem' }}>
                  Advanced configurations
                </div>
              </StackItem>

              {/* Set rollout policies */}
              <StackItem>
                <div style={{
                  border: '1px solid #D2D2D2',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#FAFAFA'
                }}>
                  <FormGroup fieldId="rollout-policies">
                    <Checkbox
                      label="Set rollout policies"
                      isChecked={formData.rolloutPolicies.enabled}
                      onChange={(_event, checked) => {
                        updateFormData({
                          rolloutPolicies: { ...formData.rolloutPolicies, enabled: checked }
                        });
                        if (checked && formData.rolloutPolicies.batches.length === 0) {
                          addBatch(); // Add first batch automatically
                        }
                      }}
                      id="set-rollout-policies"
                    />
                  </FormGroup>

                  {formData.rolloutPolicies.enabled && (
                    <div style={{ marginTop: '16px', marginLeft: '24px', borderLeft: '2px solid #E7F1FA', paddingLeft: '16px' }}>
                      {/* Batch sequencing info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px',
                        backgroundColor: '#E7F1FA',
                        borderRadius: '8px',
                        marginBottom: '16px'
                      }}>
                        <OutlinedQuestionCircleIcon style={{ fontSize: '16px', color: '#0066CC' }} />
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '14px', color: '#151515' }}>Batch sequencing</div>
                          <div style={{ fontSize: '14px', color: '#6A6E73', marginTop: '4px' }}>
                            Batches will be applied from first to last.
                          </div>
                          <div style={{ fontSize: '14px', color: '#6A6E73' }}>
                            Devices that are not part of any batch will be updated last.
                          </div>
                        </div>
                      </div>

                      {/* Update timeout */}
                      <FormGroup label="Update timeout" fieldId="update-timeout" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', color: '#151515' }}>Timeout devices that fail to update after</span>
                          <NumberInput
                            value={formData.rolloutPolicies.updateTimeout}
                            min={1}
                            max={1440}
                            onMinus={() => updateFormData({
                              rolloutPolicies: {
                                ...formData.rolloutPolicies,
                                updateTimeout: Math.max(1, formData.rolloutPolicies.updateTimeout - 1)
                              }
                            })}
                            onPlus={() => updateFormData({
                              rolloutPolicies: {
                                ...formData.rolloutPolicies,
                                updateTimeout: Math.min(1440, formData.rolloutPolicies.updateTimeout + 1)
                              }
                            })}
                            inputName="update-timeout"
                            inputAriaLabel="Update timeout in minutes"
                            style={{ width: '80px' }}
                          />
                          <span style={{ fontSize: '14px', color: '#151515' }}>minutes.</span>
                        </div>
                      </FormGroup>

                      {/* Batches */}
                      {formData.rolloutPolicies.batches.map((batch, batchIndex) => (
                        <div key={batch.id} style={{
                          border: '1px solid #D2D2D2',
                          borderRadius: '8px',
                          padding: '16px',
                          marginBottom: '16px',
                          backgroundColor: 'white'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ fontSize: '16px', fontWeight: '500', color: '#151515' }}>
                              Batch {batchIndex + 1}
                            </span>
                            <Button
                              variant="plain"
                              onClick={() => removeBatch(batch.id)}
                              style={{ padding: '4px', color: '#C9190B' }}
                            >
                              <TimesCircleIcon />
                            </Button>
                          </div>

                          {/* Select devices using labels */}
                          <FormGroup label="Select devices using labels" fieldId={`batch-labels-${batch.id}`} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                              {batch.labels.map((label, labelIndex) => (
                                <Label
                                  key={labelIndex}
                                  onClose={() => removeBatchLabel(batch.id, labelIndex)}
                                  closeBtnAriaLabel={`Remove ${formatLabelDisplay(label)}`}
                                >
                                  {formatLabelDisplay(label)}
                                </Label>
                              ))}

                              {showBatchLabelInput[batch.id] ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <TextInput
                                    placeholder="key"
                                    value={newBatchLabel.key}
                                    onChange={(_event, value) => setNewBatchLabel(prev => ({ ...prev, key: value }))}
                                    style={{ maxWidth: '120px' }}
                                  />
                                  <span>=</span>
                                  <TextInput
                                    placeholder="value"
                                    value={newBatchLabel.value}
                                    onChange={(_event, value) => setNewBatchLabel(prev => ({ ...prev, value: value }))}
                                    style={{ maxWidth: '120px' }}
                                  />
                                  <Button
                                    variant="primary"
                                    onClick={() => addBatchLabel(batch.id)}
                                    isDisabled={!newBatchLabel.key || !newBatchLabel.value}
                                  >
                                    Add
                                  </Button>
                                  <Button
                                    variant="plain"
                                    onClick={() => {
                                      setNewBatchLabel({ key: '', value: '' });
                                      setShowBatchLabelInput(prev => ({ ...prev, [batch.id]: false }));
                                    }}
                                  >
                                    <TimesIcon />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="link"
                                  isInline
                                  onClick={() => setShowBatchLabelInput(prev => ({ ...prev, [batch.id]: true }))}
                                  icon={<PlusIcon />}
                                  style={{ padding: 0, color: '#0066CC' }}
                                >
                                  Add label
                                </Button>
                              )}
                            </div>
                          </FormGroup>

                          {/* Select a subset using */}
                          <FormGroup label="Select a subset using" fieldId={`batch-subset-${batch.id}`} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Select
                                id={`subset-type-${batch.id}`}
                                isOpen={getApplicationDropdownState(batch.id, 'subsetType')}
                                selected={batch.subsetType === 'percentage' ? 'Percentage' : 'Count'}
                                onSelect={(_event, selection) => {
                                  updateBatch(batch.id, {
                                    subsetType: selection === 'Percentage' ? 'percentage' : 'count'
                                  });
                                  toggleApplicationDropdown(batch.id, 'subsetType', false);
                                }}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => toggleApplicationDropdown(batch.id, 'subsetType', !getApplicationDropdownState(batch.id, 'subsetType'))}
                                    isExpanded={getApplicationDropdownState(batch.id, 'subsetType')}
                                    style={{ width: '120px' }}
                                  >
                                    {batch.subsetType === 'percentage' ? 'Percentage' : 'Count'}
                                  </MenuToggle>
                                )}
                              >
                                <SelectList>
                                  <SelectOption value="Percentage">Percentage</SelectOption>
                                  <SelectOption value="Count">Count</SelectOption>
                                </SelectList>
                              </Select>

                              <NumberInput
                                value={batch.subsetValue}
                                min={1}
                                max={batch.subsetType === 'percentage' ? 100 : 1000}
                                onMinus={() => updateBatch(batch.id, {
                                  subsetValue: Math.max(1, batch.subsetValue - 1)
                                })}
                                onPlus={() => updateBatch(batch.id, {
                                  subsetValue: Math.min(
                                    batch.subsetType === 'percentage' ? 100 : 1000,
                                    batch.subsetValue + 1
                                  )
                                })}
                                inputAriaLabel="Subset value"
                                style={{ width: '80px' }}
                              />

                              {batch.subsetType === 'percentage' && (
                                <span style={{ fontSize: '14px', color: '#151515' }}>%</span>
                              )}
                            </div>
                          </FormGroup>

                          {/* Success threshold */}
                          <FormGroup label="Success threshold" fieldId={`batch-threshold-${batch.id}`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '14px', color: '#151515' }}>If</span>
                              <NumberInput
                                value={batch.successThreshold}
                                min={1}
                                max={100}
                                onMinus={() => updateBatch(batch.id, {
                                  successThreshold: Math.max(1, batch.successThreshold - 1)
                                })}
                                onPlus={() => updateBatch(batch.id, {
                                  successThreshold: Math.min(100, batch.successThreshold + 1)
                                })}
                                inputAriaLabel="Success threshold percentage"
                                style={{ width: '80px' }}
                              />
                              <span style={{ fontSize: '14px', color: '#151515' }}>
                                % of the batch devices pass the success criteria, move to next batch or the rest of fleet's devices.
                              </span>
                            </div>
                          </FormGroup>
                        </div>
                      ))}

                      {/* Add batch button */}
                      <Button
                        variant="link"
                        onClick={addBatch}
                        icon={<PlusIcon />}
                        style={{ padding: 0, color: '#0066CC' }}
                      >
                        Add batch
                      </Button>
                    </div>
                  )}
                </div>
              </StackItem>

              {/* Set disruption budget */}
              <StackItem>
                <div style={{
                  border: '1px solid #D2D2D2',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#FAFAFA'
                }}>
                  <FormGroup fieldId="disruption-budget">
                    <Checkbox
                      label="Set disruption budget"
                      isChecked={formData.disruptionBudget.enabled}
                      onChange={(_event, checked) => updateFormData({
                        disruptionBudget: { ...formData.disruptionBudget, enabled: checked }
                      })}
                      id="set-disruption-budget"
                    />
                  </FormGroup>

                  {formData.disruptionBudget.enabled && (
                    <div style={{ marginTop: '16px', marginLeft: '24px', borderLeft: '2px solid #E7F1FA', paddingLeft: '16px' }}>
                      {/* Group devices by label's key */}
                      <FormGroup label="Group devices by label's key" fieldId="disruption-label-key" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <TextInput
                            value={formData.disruptionBudget.groupByLabelKey}
                            onChange={(_event, value) => updateFormData({
                              disruptionBudget: { ...formData.disruptionBudget, groupByLabelKey: value }
                            })}
                            placeholder="label-key"
                            style={{ maxWidth: '200px' }}
                          />
                          <Button
                            variant="link"
                            isInline
                            icon={<PlusIcon />}
                            style={{ padding: 0, color: '#0066CC' }}
                          >
                            Add label key
                          </Button>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6A6E73', marginTop: '4px' }}>
                          Use only the 'key' part of the label to group all values.
                        </div>
                        <div style={{ fontSize: '12px', color: '#6A6E73' }}>
                          Leaving this empty will apply the disruption budget to all fleet's devices.
                        </div>
                      </FormGroup>

                      {/* Min/Max available devices */}
                      <div style={{ display: 'flex', gap: '24px' }}>
                        <FormGroup label="Minimum number of available devices" fieldId="min-available">
                          <NumberInput
                            value={formData.disruptionBudget.minAvailable}
                            min={0}
                            max={1000}
                            onMinus={() => updateFormData({
                              disruptionBudget: {
                                ...formData.disruptionBudget,
                                minAvailable: Math.max(0, formData.disruptionBudget.minAvailable - 1)
                              }
                            })}
                            onPlus={() => updateFormData({
                              disruptionBudget: {
                                ...formData.disruptionBudget,
                                minAvailable: Math.min(1000, formData.disruptionBudget.minAvailable + 1)
                              }
                            })}
                            inputAriaLabel="Minimum available devices"
                            style={{ width: '80px' }}
                          />
                        </FormGroup>

                        <FormGroup label="Maximum number of unavailable devices" fieldId="max-unavailable">
                          <NumberInput
                            value={formData.disruptionBudget.maxUnavailable}
                            min={0}
                            max={1000}
                            onMinus={() => updateFormData({
                              disruptionBudget: {
                                ...formData.disruptionBudget,
                                maxUnavailable: Math.max(0, formData.disruptionBudget.maxUnavailable - 1)
                              }
                            })}
                            onPlus={() => updateFormData({
                              disruptionBudget: {
                                ...formData.disruptionBudget,
                                maxUnavailable: Math.min(1000, formData.disruptionBudget.maxUnavailable + 1)
                              }
                            })}
                            inputAriaLabel="Maximum unavailable devices"
                            style={{ width: '80px' }}
                          />
                        </FormGroup>
                      </div>
                    </div>
                  )}
                </div>
              </StackItem>

              {/* Set update policies */}
              <StackItem>
                <div style={{
                  border: '1px solid #D2D2D2',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#FAFAFA'
                }}>
                  <FormGroup fieldId="update-policies">
                    <Checkbox
                      label="Set update policies"
                      isChecked={formData.updatePolicies.enabled}
                      onChange={(_event, checked) => updateFormData({
                        updatePolicies: { ...formData.updatePolicies, enabled: checked }
                      })}
                      id="set-update-policies"
                    />
                  </FormGroup>

                  {formData.updatePolicies.enabled && (
                    <div style={{ marginTop: '16px', marginLeft: '24px', borderLeft: '2px solid #E7F1FA', paddingLeft: '16px' }}>
                      {/* Use different update schedules checkbox */}
                      <FormGroup fieldId="different-schedules" style={{ marginBottom: '16px' }}>
                        <Checkbox
                          label="Use different update schedules for downloading and installing updates"
                          isChecked={formData.updatePolicies.useDifferentSchedules}
                          onChange={(_event, checked) => updateFormData({
                            updatePolicies: { ...formData.updatePolicies, useDifferentSchedules: checked }
                          })}
                          id="use-different-schedules"
                        />
                      </FormGroup>

                      {/* Downloading schedule */}
                      <FormGroup label="Downloading schedule" fieldId="downloading-schedule" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <TextInput
                            value={formData.updatePolicies.downloadingSchedule.startTime}
                            onChange={(_event, value) => updateFormData({
                              updatePolicies: {
                                ...formData.updatePolicies,
                                downloadingSchedule: {
                                  ...formData.updatePolicies.downloadingSchedule,
                                  startTime: value
                                }
                              }
                            })}
                            placeholder="1:30pm"
                            style={{ width: '100px' }}
                          />
                          <span>-</span>
                          <TextInput
                            value={formData.updatePolicies.downloadingSchedule.endTime}
                            onChange={(_event, value) => updateFormData({
                              updatePolicies: {
                                ...formData.updatePolicies,
                                downloadingSchedule: {
                                  ...formData.updatePolicies.downloadingSchedule,
                                  endTime: value
                                }
                              }
                            })}
                            placeholder="4:30pm"
                            style={{ width: '100px' }}
                          />

                          <div style={{ marginLeft: '16px' }}>
                            <Radio
                              isChecked={formData.updatePolicies.downloadingSchedule.frequency === 'daily'}
                              name="downloading-frequency"
                              onChange={() => updateFormData({
                                updatePolicies: {
                                  ...formData.updatePolicies,
                                  downloadingSchedule: {
                                    ...formData.updatePolicies.downloadingSchedule,
                                    frequency: 'daily'
                                  }
                                }
                              })}
                              label="Daily"
                              id="downloading-daily"
                            />
                          </div>
                          <div>
                            <Radio
                              isChecked={formData.updatePolicies.downloadingSchedule.frequency === 'weekly'}
                              name="downloading-frequency"
                              onChange={() => updateFormData({
                                updatePolicies: {
                                  ...formData.updatePolicies,
                                  downloadingSchedule: {
                                    ...formData.updatePolicies.downloadingSchedule,
                                    frequency: 'weekly'
                                  }
                                }
                              })}
                              label="Weekly"
                              id="downloading-weekly"
                            />
                          </div>
                        </div>

                        <Checkbox
                          label="Use device's local timezone"
                          isChecked={formData.updatePolicies.useDeviceTimezoneDownloading}
                          onChange={(_event, checked) => updateFormData({
                            updatePolicies: { ...formData.updatePolicies, useDeviceTimezoneDownloading: checked }
                          })}
                          id="use-device-timezone-downloading"
                        />
                      </FormGroup>

                      {/* Installing schedule */}
                      <FormGroup label="Installing schedule" fieldId="installing-schedule" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <TextInput
                            value={formData.updatePolicies.installingSchedule.startTime}
                            onChange={(_event, value) => updateFormData({
                              updatePolicies: {
                                ...formData.updatePolicies,
                                installingSchedule: {
                                  ...formData.updatePolicies.installingSchedule,
                                  startTime: value
                                }
                              }
                            })}
                            placeholder="1:30pm"
                            style={{ width: '100px' }}
                          />
                          <span>-</span>
                          <TextInput
                            value={formData.updatePolicies.installingSchedule.endTime}
                            onChange={(_event, value) => updateFormData({
                              updatePolicies: {
                                ...formData.updatePolicies,
                                installingSchedule: {
                                  ...formData.updatePolicies.installingSchedule,
                                  endTime: value
                                }
                              }
                            })}
                            placeholder="4:30pm"
                            style={{ width: '100px' }}
                          />

                          <div style={{ marginLeft: '16px' }}>
                            <Radio
                              isChecked={formData.updatePolicies.installingSchedule.frequency === 'daily'}
                              name="installing-frequency"
                              onChange={() => updateFormData({
                                updatePolicies: {
                                  ...formData.updatePolicies,
                                  installingSchedule: {
                                    ...formData.updatePolicies.installingSchedule,
                                    frequency: 'daily'
                                  }
                                }
                              })}
                              label="Daily"
                              id="installing-daily"
                            />
                          </div>
                          <div>
                            <Radio
                              isChecked={formData.updatePolicies.installingSchedule.frequency === 'weekly'}
                              name="installing-frequency"
                              onChange={() => updateFormData({
                                updatePolicies: {
                                  ...formData.updatePolicies,
                                  installingSchedule: {
                                    ...formData.updatePolicies.installingSchedule,
                                    frequency: 'weekly'
                                  }
                                }
                              })}
                              label="Weekly"
                              id="installing-weekly"
                            />
                          </div>
                        </div>

                        {/* Day of week checkboxes for weekly */}
                        {formData.updatePolicies.installingSchedule.frequency === 'weekly' && (
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                              <Checkbox
                                key={day}
                                label={day}
                                isChecked={formData.updatePolicies.installingSchedule.daysOfWeek?.includes(day) || false}
                                onChange={(_event, checked) => {
                                  const currentDays = formData.updatePolicies.installingSchedule.daysOfWeek || [];
                                  const newDays = checked
                                    ? [...currentDays, day]
                                    : currentDays.filter(d => d !== day);
                                  updateFormData({
                                    updatePolicies: {
                                      ...formData.updatePolicies,
                                      installingSchedule: {
                                        ...formData.updatePolicies.installingSchedule,
                                        daysOfWeek: newDays
                                      }
                                    }
                                  });
                                }}
                                id={`installing-${day}`}
                              />
                            ))}
                          </div>
                        )}

                        <Checkbox
                          label="Use device's local timezone"
                          isChecked={formData.updatePolicies.useDeviceTimezoneInstalling}
                          onChange={(_event, checked) => updateFormData({
                            updatePolicies: { ...formData.updatePolicies, useDeviceTimezoneInstalling: checked }
                          })}
                          id="use-device-timezone-installing"
                        />

                        {!formData.updatePolicies.useDeviceTimezoneInstalling && (
                          <Select
                            id="timezone-select"
                            isOpen={getApplicationDropdownState(0, 'timezone')}
                            selected={formData.updatePolicies.installingSchedule.timezone}
                            onSelect={(_event, selection) => {
                              updateFormData({
                                updatePolicies: {
                                  ...formData.updatePolicies,
                                  installingSchedule: {
                                    ...formData.updatePolicies.installingSchedule,
                                    timezone: selection as string
                                  }
                                }
                              });
                              toggleApplicationDropdown(0, 'timezone', false);
                            }}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => toggleApplicationDropdown(0, 'timezone', !getApplicationDropdownState(0, 'timezone'))}
                                isExpanded={getApplicationDropdownState(0, 'timezone')}
                                style={{ width: '300px', marginTop: '8px' }}
                              >
                                {formData.updatePolicies.installingSchedule.timezone}
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              <SelectOption value="(GMT+01:00) Central European Time - Copenhagen">(GMT+01:00) Central European Time - Copenhagen</SelectOption>
                              <SelectOption value="(GMT+00:00) Coordinated Universal Time">(GMT+00:00) Coordinated Universal Time</SelectOption>
                              <SelectOption value="(GMT-05:00) Eastern Standard Time">(GMT-05:00) Eastern Standard Time</SelectOption>
                              <SelectOption value="(GMT-08:00) Pacific Standard Time">(GMT-08:00) Pacific Standard Time</SelectOption>
                            </SelectList>
                          </Select>
                        )}
                      </FormGroup>
                    </div>
                  )}
                </div>
              </StackItem>
            </Stack>
          )}
        </Form>
      </WizardStep>

      {/* Step 4: Review and Create */}
      <WizardStep
        name="Review and Create"
        id="review"
        footer={{ nextButtonText: isSubmitting ? 'Creating fleet...' : 'Create fleet' }}
      >
        <Stack hasGutter>
          {/* Submit Error Alert */}
          {submitError && (
            <StackItem>
              <Alert
                variant="danger"
                title="Failed to create fleet"
                isInline
                actionClose={
                  <Button
                    variant="plain"
                    onClick={() => setSubmitError('')}
                    aria-label="Close error alert"
                  >
                    <TimesIcon />
                  </Button>
                }
              >
                {submitError}
              </Alert>
            </StackItem>
          )}
          <StackItem>
            <Card>
              <CardTitle>General Information</CardTitle>
              <CardBody>
                <DescriptionList isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Fleet name</DescriptionListTerm>
                    <DescriptionListDescription>
                      <strong>{formData.fleetName || 'Not specified'}</strong>
                    </DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Fleet labels</DescriptionListTerm>
                    <DescriptionListDescription>
                      {formData.fleetLabels && formData.fleetLabels.length > 0 ? (
                        <LabelGroup>
                          {formData.fleetLabels.map((label, index) => (
                            <Label key={index}>{formatLabelDisplay(label)}</Label>
                          ))}
                        </LabelGroup>
                      ) : (
                        <span style={{ color: '#6a6e73', fontStyle: 'italic' }}>None specified</span>
                      )}
                    </DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Device selector</DescriptionListTerm>
                    <DescriptionListDescription>
                      {formData.deviceSelector && formData.deviceSelector.length > 0 ? (
                        <LabelGroup>
                          {formData.deviceSelector.map((label, index) => (
                            <Label key={index}>{formatLabelDisplay(label)}</Label>
                          ))}
                        </LabelGroup>
                      ) : (
                        <span style={{ color: '#6a6e73', fontStyle: 'italic' }}>None specified</span>
                      )}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
            </Card>
          </StackItem>

          <StackItem>
            <Card>
              <CardTitle>Device Template</CardTitle>
              <CardBody>
                <DescriptionList isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>System image</DescriptionListTerm>
                    <DescriptionListDescription>
                      <CodeBlock>
                        <CodeBlockCode>{formData.systemImage || 'Not specified'}</CodeBlockCode>
                      </CodeBlock>
                    </DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Host configurations</DescriptionListTerm>
                    <DescriptionListDescription>
                      {formData.hostConfigurations.length > 0 ?
                        `${formData.hostConfigurations.length} configuration(s)` :
                        'None configured'
                      }
                    </DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Application workloads</DescriptionListTerm>
                    <DescriptionListDescription>
                      {formData.applicationWorkloads.length > 0 ?
                        `${formData.applicationWorkloads.length} application(s)` :
                        'None configured'
                      }
                    </DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>SystemD services</DescriptionListTerm>
                    <DescriptionListDescription>
                      {formData.systemdServices.length > 0 ? (
                        <LabelGroup>
                          {formData.systemdServices.map((service, index) => (
                            <Label key={index} variant="outline">{service}</Label>
                          ))}
                        </LabelGroup>
                      ) : (
                        'None configured'
                      )}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
            </Card>
          </StackItem>

          <StackItem>
            <Card>
              <CardTitle>Update Configuration</CardTitle>
              <CardBody>
                <DescriptionList isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Configuration type</DescriptionListTerm>
                    <DescriptionListDescription>
                      {formData.useBasicConfigurations ? 'Basic configurations' : 'Advanced configurations'}
                    </DescriptionListDescription>
                  </DescriptionListGroup>

                  {!formData.useBasicConfigurations && (
                    <DescriptionListGroup>
                      <DescriptionListTerm>Update timeout</DescriptionListTerm>
                      <DescriptionListDescription>
                        {formData.rolloutPolicies.updateTimeout} minutes
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  )}
                </DescriptionList>
              </CardBody>
            </Card>
          </StackItem>

          <StackItem>
            <Alert
              variant="info"
              title="Ready to create fleet"
            >
              Review the configuration above and click "Create fleet" to proceed. This will create a new fleet with the specified settings and begin managing the selected devices.
            </Alert>
          </StackItem>
        </Stack>
      </WizardStep>
    </Wizard>

    {/* File Upload Modal */}
    <Modal
      variant={ModalVariant.large}
      isOpen={isFileUploadModalOpen}
      onClose={() => setIsFileUploadModalOpen(false)}
      hasNoBodyWrapper
      width="40%"
    >
      <ModalHeader title="Upload File" />
      <ModalBody>
        <div style={{ padding: '16px', minHeight: '300px', maxHeight: '70vh', overflowY: 'auto' }}>
        {/* Error Alert */}
        {uploadError && (
          <Alert
            variant="danger"
            title="Upload Error"
            isInline
            style={{ marginBottom: '20px' }}
            actionClose={
              <Button
                variant="plain"
                onClick={() => setUploadError('')}
                aria-label="Close error alert"
              >
                <TimesIcon />
              </Button>
            }
          >
            {uploadError}
          </Alert>
        )}

        {/* Modal description */}
        <div style={{
          fontSize: '14px',
          color: '#6a6e73',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          Upload Excel files to import port configurations. The uploaded files will be processed and applied to your container application settings.
        </div>

        {/* PatternFly 6 Multiple File Upload */}
        <MultipleFileUpload
          onFileDrop={(event: DropEvent, droppedFiles: File[]) => {
            handleFileUpload(droppedFiles);
          }}
          onFileInputChange={(event, file) => {
            if (file) {
              handleFileUpload([file]);
            }
          }}
          dropzoneProps={{
            accept: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              'application/vnd.ms-excel': ['.xls']
            }
          }}
          isHorizontal={false}
        >
          <MultipleFileUploadMain
            titleIcon={<UploadIcon />}
            titleText="Drag and drop files here"
            titleTextSeparator="or"
            infoText="Accepted file types: Excel (.xlsx, .xls)"
          />
          {uploadedFiles.length > 0 && (
            <MultipleFileUploadStatus
              statusToggleText={`${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''} uploaded`}
              statusToggleIcon="success"
              aria-label="Current uploads"
            >
              {uploadedFiles.map((file, index) => (
                <MultipleFileUploadStatusItem
                  key={index}
                  file={file.file}
                  onClearClick={() => removeUploadedFile(index)}
                  progressValue={100}
                  progressVariant="success"
                />
              ))}
            </MultipleFileUploadStatus>
          )}
        </MultipleFileUpload>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          key="upload"
          variant="primary"
          onClick={async () => {
            if (uploadedFiles.length > 0) {
              setIsUploading(true);
              setUploadError('');

              try {
                // Simulate upload process
                console.log('Processing uploaded files:', uploadedFiles);

                // Validate file types
                const invalidFiles = uploadedFiles.filter(file => !file.type.includes('sheet') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls'));
                if (invalidFiles.length > 0) {
                  throw new Error(`Invalid file types detected: ${invalidFiles.map(f => f.name).join(', ')}. Only Excel files are allowed.`);
                }

                // Simulate processing time
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Success - close modal and reset state
                setUploadedFiles([]);
                setIsFileUploadModalOpen(false);
                console.log('Files uploaded successfully!');

              } catch (error) {
                setUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
              } finally {
                setIsUploading(false);
              }
            }
          }}
          isDisabled={uploadedFiles.length === 0 || isUploading}
          isLoading={isUploading}
        >
          {isUploading ? 'Uploading...' : uploadedFiles.length > 0 ? `Upload ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''}` : 'Upload Files'}
        </Button>
        <Button
          key="clear"
          variant="secondary"
          onClick={() => {
            setUploadedFiles([]);
            setUploadError('');
          }}
          isDisabled={uploadedFiles.length === 0 || isUploading}
        >
          Clear All
        </Button>
        <Button
          key="cancel"
          variant="link"
          onClick={() => {
            if (!isUploading) {
              setIsFileUploadModalOpen(false);
              setUploadError('');
            }
          }}
          isDisabled={isUploading}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
    </>
  );
};


export default CreateFleetWizardClean;