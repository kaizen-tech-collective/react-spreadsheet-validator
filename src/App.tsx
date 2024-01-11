import * as React from 'react';
import { ReactSpreadsheetImport } from './ReactSpreadsheetImport';
import { useState } from 'react';
import Button from '@mui/material/Button';

const fields = [
  {
    // Visible in table header and when matching columns.
    label: 'Name',
    // This is the key used for this field when we call onSubmit.
    key: 'name',
    // Allows for better automatic column matching. Optional.
    alternateMatches: ['first name', 'first', 'firstname'],
    // Used when editing and validating information.
    fieldType: {
      // There are 3 types - "input" / "checkbox" / "select".
      type: 'input',
    },
    // Used in the first step to provide an example of what data is expected in this field. Optional.
    example: 'Stephanie',
    // Can have multiple validations that are visible in Validation Step table.
    validations: [
      {
        // Can be "required" / "unique" / "regex"
        rule: 'required',
        errorMessage: 'Name is required',
        // There can be "info" / "warning" / "error" levels. Optional. Default "error".
        level: 'error',
      },
    ],
  },
  {
    // Visible in table header and when matching columns.
    label: 'Surname',
    description: 'This is the surname',
    // This is the key used for this field when we call onSubmit.
    key: 'surname',
    // Allows for better automatic column matching. Optional.
    alternateMatches: ['last name', 'last'],
    // Used when editing and validating information.
    fieldType: {
      // There are 3 types - "input" / "checkbox" / "select".
      type: 'input',
    },
    // Used in the first step to provide an example of what data is expected in this field. Optional.
    example: 'McDonald',
    // Can have multiple validations that are visible in Validation Step table.
    validations: [
      {
        // Can be "required" / "unique" / "regex"
        rule: 'required',
        errorMessage: 'Surname is required',
        // There can be "info" / "warning" / "error" levels. Optional. Default "error".
        level: 'error',
      },
    ],
  },
  {
    // Visible in table header and when matching columns.
    label: 'Age',
    // This is the key used for this field when we call onSubmit.
    key: 'age',
    // Used when editing and validating information.
    fieldType: {
      // There are 3 types - "input" / "checkbox" / "select".
      type: 'input',
    },
    // Used in the first step to provide an example of what data is expected in this field. Optional.
    example: '23',
    // Can have multiple validations that are visible in Validation Step table.
    validations: [
      {
        // Can be "required" / "unique" / "regex"
        rule: 'required',
        errorMessage: 'Age is required',
        // There can be "info" / "warning" / "error" levels. Optional. Default "error".
        level: 'error',
      },
    ],
  },
] as const;

export const App = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button variant={'contained'} onClick={() => setOpen(true)}>Open Flow</Button>
      <ReactSpreadsheetImport
        isOpen={open}
        onClose={() => setOpen(false)}
        fields={fields}
        onSubmit={(data, file) => console.log(data)}
      />
    </>
  );
};

export default App;