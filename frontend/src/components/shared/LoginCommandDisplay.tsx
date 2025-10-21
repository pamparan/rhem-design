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

  const handleCopyClick = (_event: React.MouseEvent, text: string) => {
    navigator.clipboard.writeText(text.toString());
    setCopied(true);
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
                  id="copy-button"
                  textId="login-command-code"
                  aria-label="Copy to clipboard"
                  onClick={(e) => handleCopyClick(e, loginCommand)}
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
            {isExpanded ? loginCommand : shortLoginCommand}
            {!isExpanded && (
              <ExpandableSection
                isExpanded={isExpanded}
                isDetached
                contentId="code-expand"
                toggleId="toggle-id"
              >
                {expandedContent}
              </ExpandableSection>
            )}
          </CodeBlockCode>
          {!isExpanded && (
            <ExpandableSectionToggle
              isExpanded={isExpanded}
              onToggle={setIsExpanded}
              contentId="code-expand"
              direction="up"
              toggleId="toggle-id"
            >
              Show more
            </ExpandableSectionToggle>
          )}
          {isExpanded && (
            <ExpandableSectionToggle
              isExpanded={isExpanded}
              onToggle={setIsExpanded}
              contentId="code-expand"
              direction="down"
              toggleId="toggle-id"
            >
              Show less
            </ExpandableSectionToggle>
          )}
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

