import React, { useState, Fragment } from 'react';
import {
  Alert,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  ClipboardCopyButton,
  ExpandableSection,
  ExpandableSectionToggle,
  Stack,
  StackItem,
} from '@patternfly/react-core';

interface LoginCommandDisplayProps {
  loginCommand: string;
  shortLoginCommand: string;
  expandedContent: string;
}

const LoginCommandDisplay: React.FC<LoginCommandDisplayProps> = ({
  loginCommand,
  shortLoginCommand,
  expandedContent,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleId = 'login-command-toggle';

  const clipboardCopyFunc = (event: React.MouseEvent, text: string) => {
    navigator.clipboard.writeText(text.toString());
  };

  const onClick = (event: React.MouseEvent, text: string) => {
    clipboardCopyFunc(event, text);
    setCopied(true);
  };

  const onToggle = (isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  return (
    <Stack hasGutter>
      <StackItem>
        <Alert
          variant="success"
          title="Login successful!"
          isInline
        />
      </StackItem>

      <StackItem>
        <p>
          Copy and run this command in your terminal to authenticate with Flight Control:
        </p>
      </StackItem>

      <StackItem>
        <CodeBlock
          actions={
            <Fragment>
              <CodeBlockAction>
                <ClipboardCopyButton
                  id="login-copy-button"
                  textId="login-command-code"
                  aria-label="Copy to clipboard"
                  onClick={(e) => onClick(e, loginCommand)}
                  exitDelay={copied ? 1500 : 600}
                  maxWidth="110px"
                  variant="plain"
                  onTooltipHidden={() => setCopied(false)}
                >
                  {copied ? 'Successfully copied to clipboard!' : 'Copy to clipboard'}
                </ClipboardCopyButton>
              </CodeBlockAction>
            </Fragment>
          }
        >
          <CodeBlockCode id="login-command-code">
            {shortLoginCommand}
            <ExpandableSection
              isExpanded={isExpanded}
              isDetached
              contentId="login-command-expand"
              toggleId={toggleId}
            >
              {expandedContent}
            </ExpandableSection>
          </CodeBlockCode>
          <ExpandableSectionToggle
            isExpanded={isExpanded}
            onToggle={onToggle}
            contentId="login-command-expand"
            direction="up"
            toggleId={toggleId}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </ExpandableSectionToggle>
        </CodeBlock>
      </StackItem>

      <StackItem>
        <Alert
          variant="info"
          title="Next steps"
          isInline
        >
          After running this command, you'll be authenticated and can use the Flight Control CLI
          to manage your edge devices from your terminal.
        </Alert>
      </StackItem>
    </Stack>
  );
};

export default LoginCommandDisplay;

