import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Import from the package as if it's a published dependency
import { ReactSpreadsheetImport } from '@kaizen-tech-collective/react-spreadsheet-validator';
import type { Result } from '@kaizen-tech-collective/react-spreadsheet-validator';

const fields = [
  {
    label: 'Student ID',
    key: 'studentId',
    alternateMatches: ['id', 'student id', 'student number'],
    fieldType: {
      type: 'input',
    },
    example: 'e6304505',
    validations: [
      {
        rule: 'required',
        errorMessage: 'First name is required',
        level: 'error',
      },
      {
        rule: 'unique',
        allowEmpty: false,
        errorMessage: 'Student ID must be unique',
        level: 'error',
      },
    ],
  },
  {
    label: 'First Name',
    key: 'firstName',
    alternateMatches: ['first name', 'first', 'name'],
    fieldType: {
      type: 'input',
    },
    example: 'Stephanie',
    validations: [
      {
        rule: 'required',
        errorMessage: 'First name is required',
        level: 'error',
      },
    ],
  },
  {
    label: 'Last Name',
    key: 'lastName',
    alternateMatches: ['second name', 'last name', 'last', 'surname'],
    fieldType: {
      type: 'input',
    },
    example: 'McDonald',
    validations: [
      {
        rule: 'required',
        errorMessage: 'Last name is required',
        level: 'error',
      },
    ],
  },
  {
    label: 'Grade',
    key: 'grade',
    alternateMatches: ['year', 'class', 'level'],
    fieldType: {
      type: 'select',
      options: [
        { label: '9th Grade', value: '9' },
        { label: '10th Grade', value: '10' },
        { label: '11th Grade', value: '11' },
        { label: '12th Grade', value: '12' },
      ],
    },
    example: '9th Grade',
    validations: [
      {
        rule: 'required',
        errorMessage: 'Grade is required',
        level: 'error',
      },
    ],
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
        onSubmit={(data: Result<any>) => {
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
