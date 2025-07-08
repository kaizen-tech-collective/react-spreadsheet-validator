import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

import { DataGrid, GridRowModel, GridRowSelectionModel } from '@mui/x-data-grid';

import { useRsi } from '../../../hooks/useRsi';
import { CloseReason, Data, Meta } from '../../../types';

import { addErrorsAndRunHooks } from '../../dataMutations';
import generateValidationStepColumns, { validationStepColumnStyling } from '../../ValidationStepColumns';

import ValidationToolbar, { ValidationFilterOptions } from './Toolbar';

type Props<T extends string> = {
  initialData: Data<T>[];
  file: File;
};

const ValidationStep = <T extends string>({ initialData, file }: Props<T>) => {
  const { fields, onClose, onSubmit, rowHook, rtl, tableHook, translations } = useRsi<T>();

  const [data, setData] = React.useState<(Data<T> & Meta)[]>(
    React.useMemo(() => {
      return addErrorsAndRunHooks<T>(initialData, fields, rowHook, tableHook);
    }, []),
  );
  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set<number>([]),
  });

  const [activeFilter, setActiveFilter] = React.useState<ValidationFilterOptions>('all');

  const handleProcessRowUpdate = React.useCallback(
    (newRow: GridRowModel) => {
      const rowIndex = data.findIndex(row => {
        return row.__index === newRow.__index;
      });

      if (rowIndex === -1) {
        return newRow;
      }

      const updateData = [...data];
      updateData[rowIndex] = { ...data[rowIndex], ...newRow };

      const validated = addErrorsAndRunHooks<T>(updateData, fields, rowHook, tableHook);
      setData(validated);

      return validated[rowIndex] ?? newRow;
    },
    [data, fields, rowHook, tableHook],
  );

  const columns = React.useMemo(() => {
    return generateValidationStepColumns(fields);
  }, [fields]);

  const rows = React.useMemo(() => {
    if (activeFilter === 'errors') {
      return data.filter(value => {
        if (value?.__errors) {
          return (
            Object.values(value.__errors)?.filter(error => {
              return error.level === 'error';
            }).length > 0
          );
        }
        return false;
      });
    } else if (activeFilter === 'warnings') {
      return data.filter(value => {
        if (value?.__errors) {
          const hasWarnings =
            Object.values(value.__errors)?.filter(error => {
              return error.level === 'warning';
            }).length > 0;
          const hasErrors =
            Object.values(value.__errors)?.filter(error => {
              return error.level === 'error';
            }).length > 0;
          // Show warnings but exclude rows that also have errors
          return hasWarnings && !hasErrors;
        }
        return false;
      });
    }
    return data;
  }, [data, activeFilter]);

  const { errorRowCount, warningRowCount } = React.useMemo(() => {
    let errors = 0;
    let warnings = 0;

    data.forEach(row => {
      if (row?.__errors) {
        const hasErrors = Object.values(row.__errors).some(error => {
          return error.level === 'error';
        });
        const hasWarnings = Object.values(row.__errors).some(error => {
          return error.level === 'warning';
        });

        if (hasErrors) {
          errors++;
        } else if (hasWarnings) {
          warnings++;
        }
      }
    });

    return { errorRowCount: errors, warningRowCount: warnings };
  }, [data]);

  const onDelete = () => {
    if (selectedRows.ids.size > 0) {
      const newData = data.filter(row => {
        return !selectedRows.ids.has(row.__index);
      });

      setData(newData);

      setSelectedRows({
        type: 'include',
        ids: new Set<number>(),
      });
    }
  };

  const onContinue = () => {
    const invalidData = data.find(value => {
      if (value?.__errors) {
        return !!Object.values(value.__errors)?.filter(err => {
          return err.level === 'error';
        }).length;
      }
      return false;
    });

    // TODO: Replace this with a pretty dialog
    let submit = true;
    if (invalidData) {
      submit = confirm(
        'There are still some rows that contain errors. Rows with errors will be ignored when submitting.',
      );
    }

    if (submit) {
      const calculatedData = data.reduce(
        (acc, value) => {
          const { __index, __errors, ...values } = value;
          if (__errors) {
            for (const key in __errors) {
              if (__errors[key].level === 'error') {
                acc.invalidData.push(values as unknown as Data<T>);
                return acc;
              }
            }
          }
          acc.validData.push(values as unknown as Data<T>);
          return acc;
        },
        { validData: [] as Data<T>[], invalidData: [] as Data<T>[], all: data },
      );
      onSubmit(calculatedData, file);
      onClose(CloseReason.submit);
    }
  };

  const handleFilterChange = (filter: ValidationFilterOptions) => {
    setActiveFilter(filter);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: '32px' }}>
        <Typography variant="h5">{translations.validationStep.title}</Typography>
        <Box display="flex" gap="16px" alignItems="center">
          {selectedRows.ids.size ? (
            <Button onClick={onDelete} size="small" variant="outlined">
              Delete {selectedRows.ids.size} Selected {selectedRows.ids.size === 1 ? 'Row' : 'Rows'}
            </Button>
          ) : null}
        </Box>
      </Box>
      {/*
          TODO:
          - Abstract to a component
          - Enable 'single click editing: https://mui.com/x/react-data-grid/recipes-editing/#single-click-editing
        */}
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={row => {
          return row.__index;
        }}
        checkboxSelection
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={setSelectedRows}
        disableRowSelectionOnClick
        disableColumnSorting
        disableColumnFilter
        disableColumnMenu
        processRowUpdate={handleProcessRowUpdate}
        hideFooter
        slots={{
          toolbar: () => {
            return (
              <ValidationToolbar
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                totalRows={data.length}
                errorRows={errorRowCount}
                warningRows={warningRowCount}
              />
            );
          },
        }}
        showToolbar
        sx={{
          ...validationStepColumnStyling,
          direction: rtl ? 'rtl' : 'ltr',
        }}
      />
      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 2,
        }}
      >
        <Button
          variant="contained"
          style={{ width: 300 }}
          onClick={() => {
            return onContinue();
          }}
        >
          {translations.validationStep.nextButtonTitle}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default ValidationStep;
