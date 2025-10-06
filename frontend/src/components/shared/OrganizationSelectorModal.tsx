import React, { useState } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  List,
  ListItem,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons';

interface OrganizationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrganizationSelect: (orgId: string) => void;
  currentOrganization?: string;
}

const mockOrganizations = [
  { id: 'alpha', name: 'Alpha Corp' },
  { id: 'bravo', name: 'Bravo Industries' },
  { id: 'charlie', name: 'Charlie Services' },
];

const OrganizationSelectorModal: React.FC<OrganizationSelectorModalProps> = ({
  isOpen,
  onClose,
  onOrganizationSelect,
  currentOrganization = 'charlie'
}) => {
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (selectedOrg) {
      setIsLoading(true);

      // Simulate application refresh/reload
      await new Promise(resolve => setTimeout(resolve, 1500));

      onOrganizationSelect(selectedOrg);
      onClose();

      // Simulate page refresh by briefly hiding and showing content
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const handleCancel = () => {
    setSelectedOrg(null); // Reset selection
    onClose();
  };

  const handleOrgSelect = (orgId: string) => {
    setSelectedOrg(orgId);
  };

  // Add global style to darken sidenav when modal is open
  React.useEffect(() => {
    if (isOpen) {
      const style = document.createElement('style');
      style.textContent = `
        .pf-c-page__sidebar,
        .pf-v5-c-page__sidebar,
        [class*="sidebar"],
        [class*="nav-sidebar"] {
          filter: brightness(0.2) blur(12px) !important;
          transition: filter 0.3s ease !important;
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 99999,
            pointerEvents: 'none'
          }}
        />
      )}
      <Modal
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={handleCancel}
        appendTo={() => document.body}
        hasNoBodyWrapper={false}
        style={{
          zIndex: 100000
        }}
      >
      <ModalHeader title="Select Organization" />
      <ModalBody>
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            margin: 0,
            lineHeight: '1.5',
            fontSize: '14px',
            color: '#6A6E73',
            fontWeight: '400'
          }}>
            Please select an organization to continue. This will refresh the application.
          </p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#151515'
          }}>
            Organization
          </label>
          <div style={{
            border: '1px solid #C7C7C7',
            borderRadius: '4px',
            backgroundColor: 'white'
          }}>
            {mockOrganizations.map((org, index) => (
              <div
                key={org.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  minHeight: '48px',
                  cursor: 'pointer',
                  backgroundColor: selectedOrg === org.id ? '#E7F1FA' : 'white',
                  borderBottom: index < mockOrganizations.length - 1 ? '1px solid #C7C7C7' : 'none',
                  color: selectedOrg === org.id ? '#0066CC' : '#151515',
                  fontWeight: selectedOrg === org.id ? '600' : '400',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => handleOrgSelect(org.id)}
                onMouseEnter={(e) => {
                  if (selectedOrg !== org.id) {
                    e.currentTarget.style.backgroundColor = '#F5F5F5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedOrg !== org.id) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <span>{org.name}</span>
                <div style={{
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedOrg === org.id && (
                    <CheckIcon style={{
                      color: '#0066CC',
                      fontSize: '16px'
                    }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          key="continue"
          variant="primary"
          onClick={handleContinue}
          isDisabled={!selectedOrg || isLoading}
          style={{
            backgroundColor: (selectedOrg && !isLoading) ? '#0066CC' : '#C7C7C7',
            borderColor: (selectedOrg && !isLoading) ? '#0066CC' : '#C7C7C7',
            color: (selectedOrg && !isLoading) ? 'white' : '#6A6E73',
            cursor: (selectedOrg && !isLoading) ? 'pointer' : 'not-allowed'
          }}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" style={{ marginRight: '8px' }} />
              Refreshing application...
            </>
          ) : (
            'Continue'
          )}
        </Button>
        <Button
          key="cancel"
          variant="link"
          onClick={handleCancel}
          isDisabled={isLoading}
          style={{
            color: isLoading ? '#6A6E73' : '#0066CC',
            textDecoration: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
    </>
  );
};

export default OrganizationSelectorModal;