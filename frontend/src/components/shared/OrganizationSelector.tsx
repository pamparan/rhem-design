import React, { useState } from 'react';
import { Button } from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons';
import OrganizationSelectionModal from './OrganizationSelectionModal';

interface Organization {
  id: string;
  name: string;
}

interface OrganizationSelectorProps {
  className?: string;
  style?: React.CSSProperties;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  className,
  style,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample organizations data
  const organizations: Organization[] = [
    { id: '1', name: 'Alpha Corp' },
    { id: '2', name: 'Bravo Industries' },
    { id: '3', name: 'Charlie Services' },
  ];

  // State for selected organization - defaults to Charlie Services as shown in the image
  const [selectedOrgId, setSelectedOrgId] = useState('3');
  const selectedOrganization = organizations.find(org => org.id === selectedOrgId) || organizations[0];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectOrganization = (orgId: string) => {
    setSelectedOrgId(orgId);
  };

  return (
    <>
      <Button
        variant="tertiary"
        onClick={handleOpenModal}
        className={className}
        style={{
          border: '2px solid #0066cc',
          borderRadius: '24px',
          padding: '8px 20px',
          color: '#0066cc',
          backgroundColor: 'white',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '180px',
          justifyContent: 'space-between',
          ...style
        }}
      >
        <span>{selectedOrganization.name}</span>
        <CaretDownIcon style={{ fontSize: '12px' }} />
      </Button>

      <OrganizationSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        organizations={organizations}
        selectedOrgId={selectedOrgId}
        onSelectOrganization={handleSelectOrganization}
      />
    </>
  );
};

export default OrganizationSelector;