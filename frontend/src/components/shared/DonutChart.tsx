import { ChartDonut } from '@patternfly/react-charts/victory';
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

  const chartData = isEmpty
    ? [{ x: 'No data', y: 100 }]
    : data.map((d) => ({ x: d.label, y: d.value }));

  const colorScale = isEmpty ? ['#d2d2d2'] : data.map((d) => d.color);

  return (
    <Flex
      justifyContent={{ default: 'justifyContentCenter' }}
      direction={{ default: 'column' }}
      alignItems={{ default: 'alignItemsCenter' }}
    >     
      <FlexItem className="fctl-charts__donut">
        <div style={{ height: '160px', width: '160px', position: 'relative' }}>
          <ChartDonut
            ariaDesc={title}
            ariaTitle={title}
            constrainToVisibleArea
            colorScale={colorScale}
            data={chartData}
            height={160}
            width={160}
            labels={() => ''}
            padding={0}
            innerRadius={65}
            title=""
            subTitle=""
          />
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

