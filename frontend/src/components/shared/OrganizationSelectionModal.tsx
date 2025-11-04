import React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { CheckIcon, TimesIcon } from '@patternfly/react-icons';

interface Organization {
  id: string;
  name: string;
}

interface OrganizationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizations: Organization[];
  selectedOrgId: string;
  onSelectOrganization: (orgId: string) => void;
}

const OrganizationSelectionModal: React.FC<OrganizationSelectionModalProps> = ({
  isOpen,
  onClose,
  organizations,
  selectedOrgId,
  onSelectOrganization,
}) => {
  const [tempSelectedOrgId, setTempSelectedOrgId] = React.useState(selectedOrgId);

  React.useEffect(() => {
    setTempSelectedOrgId(selectedOrgId);
  }, [selectedOrgId]);

  const handleContinue = () => {
    onSelectOrganization(tempSelectedOrgId);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedOrgId(selectedOrgId); // Reset to original selection
    onClose();
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={handleCancel}
      aria-labelledby="organization-selection-modal-title"
      hasNoBodyWrapper
      showClose={false}
      style={{ borderRadius: '16px' }}
    >
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '24px' }}>
          <FlexItem>
            <TextContent>
              <Text component="h1" style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                Select Organization
              </Text>
            </TextContent>
          </FlexItem>
          <FlexItem>
            <Button
              variant="plain"
              onClick={handleCancel}
              style={{ padding: '8px' }}
            >
              <TimesIcon style={{ fontSize: '20px', color: '#6a6e73' }} />
            </Button>
          </FlexItem>
        </Flex>

        {/* Description */}
        <TextContent style={{ marginBottom: '32px' }}>
          <Text style={{ color: '#6a6e73', fontSize: '16px' }}>
            Please select an organization to continue. This will refresh the application.
          </Text>
        </TextContent>

        {/* Organization Label */}
        <TextContent style={{ marginBottom: '16px' }}>
          <Text component="h2" style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
            Organization
          </Text>
        </TextContent>

        {/* Organization List */}
        <div style={{ marginBottom: '32px' }}>
          {organizations.map((org) => (
            <Card
              key={org.id}
              isClickable
              isSelected={tempSelectedOrgId === org.id}
              onClick={() => setTempSelectedOrgId(org.id)}
              style={{
                marginBottom: '8px',
                border: tempSelectedOrgId === org.id ? '2px solid #0066cc' : '1px solid #d2d2d2',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
            >
              <CardBody style={{ padding: '16px' }}>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <Text style={{
                      fontSize: '16px',
                      fontWeight: tempSelectedOrgId === org.id ? '600' : '400',
                      color: tempSelectedOrgId === org.id ? '#0066cc' : '#151515'
                    }}>
                      {org.name}
                    </Text>
                  </FlexItem>
                  {tempSelectedOrgId === org.id && (
                    <FlexItem>
                      <CheckIcon style={{ fontSize: '20px', color: '#0066cc' }} />
                    </FlexItem>
                  )}
                </Flex>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <Flex>
          <FlexItem style={{ marginRight: '16px' }}>
            <Button
              variant="primary"
              onClick={handleContinue}
              style={{
                backgroundColor: '#0066cc',
                borderRadius: '24px',
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Continue
            </Button>
          </FlexItem>
          <FlexItem>
            <Button
              variant="link"
              onClick={handleCancel}
              style={{
                color: '#0066cc',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Cancel
            </Button>
          </FlexItem>
        </Flex>
      </div>
    </Modal>
  );
};

export default OrganizationSelectionModal;