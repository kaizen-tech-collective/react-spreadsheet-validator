import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Result } from '../src/types';

import { ReactSpreadsheetImport } from './ReactSpreadsheetImport';

const fields = [
  {
    label: 'Name',
    key: 'name',
    alternateMatches: ['first name', 'first'],
    fieldType: {
      type: 'input',
    },
    example: 'Stephanie',
    validations: [
      {
        rule: 'required',
        errorMessage: 'Name is required',
      },
    ],
  },
  {
    label: 'Surname',
    key: 'surname',
    alternateMatches: ['second name', 'last name', 'last'],
    fieldType: {
      type: 'input',
    },
    example: 'McDonald',
    validations: [
      {
        rule: 'unique',
        errorMessage: 'Last name must be unique',
        level: 'info',
      },
    ],
    description: 'Family / Last name',
  },
  {
    label: 'Age',
    key: 'age',
    alternateMatches: ['years'],
    fieldType: {
      type: 'input',
    },
    example: '23',
    validations: [
      {
        rule: 'regex',
        value: '^\\d+$',
        errorMessage: 'Age must be a number',
        level: 'warning',
      },
    ],
  },
  {
    label: 'Team',
    key: 'team',
    alternateMatches: ['department'],
    fieldType: {
      type: 'select',
      options: [
        { label: 'Team One', value: 'one' },
        { label: 'Team Two', value: 'two' },
      ],
    },
    example: 'Team one',
    validations: [
      {
        rule: 'required',
        errorMessage: 'Team is required',
      },
    ],
  },
  {
    label: 'Is manager',
    key: 'is_manager',
    alternateMatches: ['manages'],
    fieldType: {
      type: 'checkbox',
      booleanMatches: {},
    },
    example: 'true',
  },
] as const;

export const App = () => {
  const [data, setData] = React.useState<Result<any> | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <>
      <Box display="flex" gap="1" alignItems="center">
        <Button
          variant="contained"
          onClick={() => {
            return setOpen(true);
          }}
        >
          Open Flow
        </Button>
      </Box>
      <ReactSpreadsheetImport
        fields={fields}
        isOpen={open}
        onClose={() => {
          return setOpen(false);
        }}
        onSubmit={data => {
          setData(data);
        }}
      />
      {!!data && (
        <Box pt={4} display="flex" gap="8px" flexDirection="column">
          <b>Returned data (showing first 100 rows):</b>
          <Box
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              fontSize: '16px',
              background: '#4A5568',
              color: 'white',
              p: '32',
            }}
          >
            <pre>
              {JSON.stringify(
                {
                  validData: data.validData.slice(0, 100),
                  invalidData: data.invalidData.slice(0, 100),
                  all: data.all.slice(0, 100),
                },
                undefined,
                4,
              )}
            </pre>
          </Box>
        </Box>
      )}
    </>
  );
};

export default App;
