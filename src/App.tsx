import * as React from 'react';
import { ReactSpreadsheetImport } from './ReactSpreadsheetImport';
import { useState } from 'react';
import Button from '@mui/material/Button';

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
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          return setOpen(true);
        }}
      >
        Open Flow
      </Button>
      <ReactSpreadsheetImport
        isOpen={open}
        onClose={() => {
          return setOpen(false);
        }}
        fields={fields}
        onSubmit={(
          data,
          // file
        ) => {
          return console.log(data);
        }}
      />
    </>
  );
};

export default App;
