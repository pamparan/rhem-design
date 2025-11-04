import React, { useState } from 'react';
import {
  Title,
  Button,
  Card,
  CardBody,
  Stack,
  StackItem,
  Avatar,
  Label,
  Badge,
  TextInput,
  InputGroup,
  InputGroupText,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import {
  SearchIcon,
  PlusIcon,
  EllipsisVIcon
} from '@patternfly/react-icons';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
  lastLogin: string;
  avatar?: string;
}

const MembersSettings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const members: Member[] = [
    {
      id: '1',
      name: 'Diana Mary',
      email: 'diana.mary@flightcontrol.com',
      role: 'Administrator',
      status: 'Active',
      lastLogin: '2 hours ago',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150'
    },
    {
      id: '2',
      name: 'Alex Jackson',
      email: 'alex.jackson@flightcontrol.com',
      role: 'Fleet Manager',
      status: 'Active',
      lastLogin: '1 day ago'
    },
    {
      id: '3',
      name: 'Sarah Chen',
      email: 'sarah.chen@flightcontrol.com',
      role: 'Operator',
      status: 'Active',
      lastLogin: '3 days ago'
    },
    {
      id: '4',
      name: 'Mike Torres',
      email: 'mike.torres@flightcontrol.com',
      role: 'Operator',
      status: 'Pending',
      lastLogin: 'Never'
    }
  ];

  const getStatusBadge = (status: Member['status']) => {
    const statusConfig = {
      Active: { color: 'green', text: 'Active' },
      Pending: { color: 'orange', text: 'Pending' },
      Inactive: { color: 'grey', text: 'Inactive' }
    };

    const config = statusConfig[status];
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      'Administrator': 'purple',
      'Fleet Manager': 'blue',
      'Operator': 'cyan'
    };

    return <Badge color={roleColors[role] || 'grey'}>{role}</Badge>;
  };

  return (
    <Stack hasGutter>
      <StackItem>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Title headingLevel="h2" size="xl">
                Members
              </Title>
            </ToolbarItem>
            <ToolbarItem variant="separator" />
            <ToolbarItem>
              <Button variant="primary" icon={<PlusIcon />}>
                Invite member
              </Button>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <p style={{ marginTop: '8px', color: '#6a6e73' }}>
          Manage team members and their access permissions.
        </p>
      </StackItem>

      {/* Search and filters */}
      <StackItem>
        <Card>
          <CardBody>
            <InputGroup>
              <InputGroupText>
                <SearchIcon />
              </InputGroupText>
              <TextInput
                placeholder="Search members..."
                value={searchTerm}
                onChange={(_event, value) => setSearchTerm(value)}
              />
            </InputGroup>
          </CardBody>
        </Card>
      </StackItem>

      {/* Members table */}
      <StackItem>
        <Card>
          <CardBody>
            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th>Member</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Last Login</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {members.map((member) => (
                  <Tr key={member.id}>
                    <Td>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                        <FlexItem>
                          <Avatar
                            src={member.avatar}
                            alt={member.name}
                            size="md"
                          />
                        </FlexItem>
                        <FlexItem>
                          <div>
                            <strong>{member.name}</strong>
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '14px' }}>
                            {member.email}
                          </div>
                        </FlexItem>
                      </Flex>
                    </Td>
                    <Td>{getRoleBadge(member.role)}</Td>
                    <Td>{getStatusBadge(member.status)}</Td>
                    <Td>{member.lastLogin}</Td>
                    <Td>
                      <Button variant="plain" icon={<EllipsisVIcon />} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </StackItem>

      {/* Member stats */}
      <StackItem>
        <Card>
          <CardBody>
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h3" size="lg">
                  Member Statistics
                </Title>
              </StackItem>
              <StackItem>
                <Grid hasGutter>
                  <GridItem span={3}>
                    <Card>
                      <CardBody style={{ textAlign: 'center' }}>
                        <Title headingLevel="h2" size="2xl" style={{ color: '#059669' }}>
                          {members.filter(m => m.status === 'Active').length}
                        </Title>
                        <Label>Active Members</Label>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={3}>
                    <Card>
                      <CardBody style={{ textAlign: 'center' }}>
                        <Title headingLevel="h2" size="2xl" style={{ color: '#dc2626' }}>
                          {members.filter(m => m.status === 'Pending').length}
                        </Title>
                        <Label>Pending Invitations</Label>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={3}>
                    <Card>
                      <CardBody style={{ textAlign: 'center' }}>
                        <Title headingLevel="h2" size="2xl" style={{ color: '#2563eb' }}>
                          {members.filter(m => m.role === 'Administrator').length}
                        </Title>
                        <Label>Administrators</Label>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={3}>
                    <Card>
                      <CardBody style={{ textAlign: 'center' }}>
                        <Title headingLevel="h2" size="2xl" style={{ color: '#7c3aed' }}>
                          {members.filter(m => m.role === 'Fleet Manager').length}
                        </Title>
                        <Label>Fleet Managers</Label>
                      </CardBody>
                    </Card>
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

export default MembersSettings;