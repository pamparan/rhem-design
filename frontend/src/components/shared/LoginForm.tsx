import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  TextInput,
  Button,
  Stack,
  StackItem,
} from '@patternfly/react-core';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <Card>
      <CardBody>
        <Stack hasGutter>
          <StackItem>
            <p>
              Enter your credentials to generate a CLI login command for Flight Control.
            </p>
          </StackItem>

          <StackItem>
            <Form>
              <FormGroup label="Username" isRequired fieldId="username">
                <TextInput
                  isRequired
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(_event, value) => setUsername(value)}
                  placeholder="Enter your username"
                />
              </FormGroup>

              <FormGroup label="Password" isRequired fieldId="password">
                <TextInput
                  isRequired
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(_event, value) => setPassword(value)}
                  placeholder="Enter your password"
                />
              </FormGroup>

              <FormGroup>
                <Button
                  variant="primary"
                  isBlock
                  isDisabled={!username || !password || isLoading}
                  isLoading={isLoading}
                  onClick={handleLogin}
                >
                  {isLoading ? 'Generating...' : 'Login'}
                </Button>
              </FormGroup>
            </Form>
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default LoginForm;

