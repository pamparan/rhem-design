/**
 * A filter search input that mimics the behaviour of the filter by fleets and labels.
 *
 * How it works:
 * 1. User clicks in the search box and starts typing "my-search"
 * 2. Dropdown opens automatically and shows "Searching..." spinner
 * 3. After user stops typing for 300ms (debounced), shows matching results:
 *    - "Labels" group heading
 *    - A list of two results, one with the search text "my-search" and one with the search text "my-search-1"
 * 4. User clicks on one of the results, and it gets added as a chip
 * 5. User can remove individual filters by clicking X on each chip
 * 6. User can clear all filters with the "Clear all filters" button
 *
 * Layout: [🔍] [Search input...] [Label chips...] [Clear all filters]
 */

import React, { useState, useRef } from "react";
import {
  Button,
  Icon,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectGroup,
  SelectList,
  SelectOption,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Label,
  LabelGroup,
  Flex,
  FlexItem,
  Spinner,
} from "@patternfly/react-core";
import { TimesIcon, SearchIcon } from "@patternfly/react-icons";

interface LabelFleetFilterProps {
  selectedFilters: string[];
  onAddFilter: (filter: string) => void;
  onRemoveFilter: (filter: string) => void;
  onClearAll: () => void;
}

const LabelFleetFilter: React.FC<LabelFleetFilterProps> = ({
  selectedFilters,
  onAddFilter,
  onRemoveFilter,
  onClearAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const textInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleToggleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      textInputRef?.current?.focus();
    }
  };

  const handleTextChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setSearchText(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If user is typing something, show loading and open dropdown
    if (value.trim()) {
      setIsOpen(true);
      setIsSearching(true);

      searchTimeoutRef.current = setTimeout(() => {
        setIsSearching(false);
      }, 300);
    } else {
      setIsSearching(false);
      setIsOpen(false);
    }
  };

  const handleClearText = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchText("");
    setIsSearching(false);
    setIsOpen(false);
    textInputRef?.current?.focus();
  };

  // When user clicks on a filter option to add it
  const handleSelectFilter = (
    _event: React.MouseEvent | undefined,
    value: string | number | undefined
  ) => {
    if (value && typeof value === "string") {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      onAddFilter(value);
      setSearchText("");
      setIsSearching(false);
      setIsOpen(false);
    }
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      onClick={handleToggleClick}
      isExpanded={isOpen}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={searchText}
          onChange={handleTextChange}
          id="filter-search-input"
          autoComplete="off"
          innerRef={textInputRef}
          placeholder="Filter by labels and fleets"
        />
        {searchText && (
          <TextInputGroupUtilities>
            <Button
              variant="plain"
              onClick={handleClearText}
              aria-label="Clear search text"
            >
              <TimesIcon />
            </Button>
          </TextInputGroupUtilities>
        )}
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Flex
      gap={{ default: "gapSm" }}
      alignItems={{ default: "alignItemsFlexStart" }}
    >
      <FlexItem alignSelf={{ default: "alignSelfCenter" }}>
        <Icon size="md">
          <SearchIcon />
        </Icon>
      </FlexItem>
      <FlexItem>
        <Select
          id="filter-select"
          isOpen={isOpen}
          onSelect={handleSelectFilter}
          onOpenChange={(isOpen) => setIsOpen(isOpen)}
          toggle={toggle}
        >
          {/* Show loading or results */}
          {searchText && (
            <>
              {isSearching ? (
                <div style={{ padding: "1rem" }}>
                  <Spinner size="md" />
                  Searching...
                </div>
              ) : (
                <SelectGroup label="Labels">
                  <SelectList>
                    <SelectOption
                      value={searchText}
                      hasCheckbox
                      isSelected={false}
                    >
                      {searchText}
                    </SelectOption>
                    <SelectOption
                      value={`${searchText}-1`}
                      hasCheckbox
                      isSelected={false}
                    >
                      {`${searchText}-1`}
                    </SelectOption>
                  </SelectList>
                </SelectGroup>
              )}
            </>
          )}
        </Select>
      </FlexItem>
      {selectedFilters.length > 0 && (
        <>
          <FlexItem>
            <LabelGroup
              categoryName="Labels"
              isClosable
              onClick={onClearAll}
              numLabels={10}
            >
              {selectedFilters.map((filter) => (
                <Label
                  key={filter}
                  color="blue"
                  onClose={(_event) => onRemoveFilter(filter)}
                  isCompact
                >
                  {filter}
                </Label>
              ))}
            </LabelGroup>
          </FlexItem>
          <FlexItem>
            <Button variant="link" onClick={onClearAll}>
              Clear all filters
            </Button>
          </FlexItem>
        </>
      )}
    </Flex>
  );
};

export default LabelFleetFilter;
