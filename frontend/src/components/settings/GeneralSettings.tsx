import React, { useState } from 'react';
import {
  Title,
  Card,
  CardBody,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Button,
  ActionGroup,
  Divider,
  Stack,
  StackItem,
  Label,
  Grid,
  GridItem
} from '@patternfly/react-core';

const GeneralSettings: React.FC = () => {
  const [organizationName, setOrganizationName] = useState('Flight Control Systems');
  const [description, setDescription] = useState('Enterprise edge device management and fleet orchestration platform');

  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size="xl">
          General Settings
        </Title>
        <p style={{ marginTop: '8px', color: '#6a6e73' }}>
          Manage your organization's basic information and branding.
        </p>
      </StackItem>

      {/* Organization Profile */}
      <StackItem>
        <Card>
          <CardBody>
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h3" size="lg">
                  Organization Profile
                </Title>
              </StackItem>


              <StackItem>
                <Form>
                  <FormGroup
                    label="Organization Name"
                    isRequired
                    fieldId="org-name"
                  >
                    <TextInput
                      isRequired
                      type="text"
                      id="org-name"
                      value={organizationName}
                      onChange={(_event, value) => setOrganizationName(value)}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Description"
                    fieldId="org-description"
                  >
                    <TextArea
                      id="org-description"
                      value={description}
                      onChange={(_event, value) => setDescription(value)}
                      rows={3}
                    />
                  </FormGroup>

                  <ActionGroup>
                    <Button variant="primary">Save changes</Button>
                    <Button variant="secondary">Cancel</Button>
                  </ActionGroup>
                </Form>
              </StackItem>
            </Stack>
          </CardBody>
        </Card>
      </StackItem>

      {/* System Information */}
      <StackItem>
        <Card>
          <CardBody>
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h3" size="lg">
                  System Information
                </Title>
              </StackItem>

              <StackItem>
                <Grid hasGutter>
                  <GridItem span={6}>
                    <Label>Version</Label>
                    <div>Flight Control v2.4.1</div>
                  </GridItem>
                  <GridItem span={6}>
                    <Label>License</Label>
                    <div>Enterprise License</div>
                  </GridItem>
                  <GridItem span={6}>
                    <Label>Last Updated</Label>
                    <div>October 30, 2024</div>
                  </GridItem>
                  <GridItem span={6}>
                    <Label>Support Status</Label>
                    <div>Active Support</div>
                  </GridItem>
                </Grid>
              </StackItem>
            </Stack>
          </CardBody>
        </Card>
      </StackItem>
    </Stack>
  );
};

export default GeneralSettings;