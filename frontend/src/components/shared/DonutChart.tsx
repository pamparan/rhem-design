import { Flex, FlexItem, Stack, StackItem, Popover, Button } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import * as React from 'react';

import './DonutChart.css';

export type DonutChartData = {
  label: string;
  value: number;
  color: string;
};

const Legend = ({ data, total }: { data: DonutChartData[]; total: number }) => {
  // Split data into rows of 2 items each
  const rows: DonutChartData[][] = [];
  for (let i = 0; i < data.length; i += 2) {
    rows.push(data.slice(i, i + 2));
  }

  return (
    <Stack hasGutter>
      {rows.map((row, rowIndex) => (
        <StackItem key={rowIndex}>
          <Flex columnGap={{ default: 'columnGapLg' }}>
            {row.map((datum) => {
              const percentage = total > 0 ? Math.round((datum.value / total) * 100) : 0;
              return (
                <FlexItem key={datum.label}>
                  <LegendItem color={datum.color}>
                    <span style={{ color: datum.color, fontWeight: '500' }}>
                      {percentage}%
                    </span>{' '}
                    <span>{datum.label}</span>
                  </LegendItem>
                </FlexItem>
              );
            })}
          </Flex>
        </StackItem>
      ))}
    </Stack>
  );
};

const LegendItem = ({ children, color }: { children: React.ReactNode; color: string }) => {
  return (
    <Flex
      flexWrap={{ default: 'nowrap' }}
      alignItems={{ default: 'alignItemsCenter' }}
      columnGap={{ default: 'columnGapXs' }}
    >
      <FlexItem>
        <div
          style={{
            backgroundColor: color,
            height: '8px',
            width: '8px',
          }}
        />
      </FlexItem>
      <FlexItem style={{ fontSize: '12px' }}>{children}</FlexItem>
    </Flex>
  );
};

const DonutChart = ({
  data,
  title,
  titlePopoverContent
}: {
  data: DonutChartData[];
  title: string;
  titlePopoverContent?: string;
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const isEmpty = total === 0;

  // Calculate angles for each segment
  const segments = React.useMemo(() => {
    if (isEmpty) {
      return [{ color: '#d2d2d2', startAngle: 0, endAngle: 360, value: 100, label: 'No data' }];
    }

    let currentAngle = 0;
    return data.map((item) => {
      const angle = (item.value / total) * 360;
      const segment = {
        color: item.color,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        value: item.value,
        label: item.label
      };
      currentAngle += angle;
      return segment;
    });
  }, [data, total, isEmpty]);

  // Create SVG path for donut segment
  const createPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 80 + outerRadius * Math.cos(startAngleRad);
    const y1 = 80 + outerRadius * Math.sin(startAngleRad);
    const x2 = 80 + outerRadius * Math.cos(endAngleRad);
    const y2 = 80 + outerRadius * Math.sin(endAngleRad);

    const x3 = 80 + innerRadius * Math.cos(endAngleRad);
    const y3 = 80 + innerRadius * Math.sin(endAngleRad);
    const x4 = 80 + innerRadius * Math.cos(startAngleRad);
    const y4 = 80 + innerRadius * Math.sin(startAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", x1, y1,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 1, x2, y2,
      "L", x3, y3,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 0, x4, y4,
      "Z"
    ].join(" ");
  };

  return (
    <Flex
      justifyContent={{ default: 'justifyContentCenter' }}
      direction={{ default: 'column' }}
      alignItems={{ default: 'alignItemsCenter' }}
    >
      <FlexItem className="fctl-charts__donut">
        <div style={{ height: '160px', width: '160px', position: 'relative' }}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={createPath(segment.startAngle, segment.endAngle, 75, 40)}
                fill={segment.color}
                stroke="#fff"
                strokeWidth="1"
              />
            ))}
          </svg>

          {/* Custom title overlay with popover */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            width: '100px'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#6a6e73',
              lineHeight: '1.2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              flexWrap: 'wrap'
            }}>
              <span>{title}</span>
              {titlePopoverContent && (
                <Popover
                  aria-label={`${title} information`}
                  bodyContent={titlePopoverContent}
                >
                  <Button
                    variant="plain"
                    style={{
                      padding: 0,
                      minWidth: 'auto',
                      height: 'auto',
                      pointerEvents: 'auto'
                    }}
                    aria-label={`More information about ${title}`}
                  >
                    <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                  </Button>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </FlexItem>
      <FlexItem style={{ marginTop: '16px' }}>
        {!isEmpty && <Legend data={data} total={total} />}
      </FlexItem>
    </Flex>
  );
};

export default DonutChart;

