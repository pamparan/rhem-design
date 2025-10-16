import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Label,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  SearchInput,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';
import {
  EllipsisVIcon
} from '@patternfly/react-icons';
import PostRestoreBanners from '../shared/PostRestoreBanners';
import { NavigationItemId, NavigationParams, ViewType } from '../../types/app';

// Mock repositories data for prototype
const mockRepositories = [
  { id: '1', name: 'basic-nginx-demo', type: 'Git repository', url: 'https://github.com/flightctl/flightctl-demos', syncStatus: 'Accessible', lastTransition: '17 hours ago' },
  { id: '2', name: 'HTTP-nginx-demo', type: 'HTTP service', url: 'https://nowhere.com/flightctl/flightctl-demos', syncStatus: 'No access', lastTransition: '17 hours ago' },
];

interface RepositoriesPageProps {
  onNavigate: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
}

const RepositoriesPage: React.FC<RepositoriesPageProps> = ({
  onNavigate,
}) => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <>
      {/* Header */}
      <PageSection >
        <Title headingLevel="h1" size="2xl">
          Repositories
        </Title>
      </PageSection>

      <PostRestoreBanners onNavigate={onNavigate} />

      {/* Main Content */}
      <PageSection>
        <Card>
          <CardBody>
            {/* Toolbar */}
            <Toolbar>
              <ToolbarContent>
                <ToolbarGroup>
                  <ToolbarItem>
                    <SearchInput
                      placeholder="Search"
                      value={searchValue}
                      onChange={(_event, value) => setSearchValue(value)}
                      onClear={() => setSearchValue('')}
                      style={{ width: '300px' }}
                    />
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup align={{ default: 'alignEnd' }}>
                  <ToolbarItem>
                    <Button variant="primary">Create a repository</Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button variant="secondary">Delete repositories</Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </ToolbarContent>
            </Toolbar>

            {/* Repositories Table */}
            <Table aria-label="Repositories list" variant="compact">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Type</Th>
                  <Th>URL</Th>
                  <Th>Sync status</Th>
                  <Th>Last transition</Th>
                  <Th width={10}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockRepositories.map((repo) => (
                  <Tr key={repo.id}>
                    <Td>
                      <Button variant="link" style={{ color: '#06c', padding: 0 }}>
                        {repo.name}
                      </Button>
                    </Td>
                    <Td>{repo.type}</Td>
                    <Td style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                      {repo.url}
                    </Td>
                    <Td>
                      {repo.syncStatus === 'Accessible' ? (
                        <Label color="green">● Accessible</Label>
                      ) : (
                        <Label color="red">● No access</Label>
                      )}
                    </Td>
                    <Td>{repo.lastTransition}</Td>
                    <Td>
                      <Button
                        variant="plain"
                        onClick={() => alert(`Repository options for ${repo.name}`)}
                      >
                        <EllipsisVIcon />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export default RepositoriesPage;