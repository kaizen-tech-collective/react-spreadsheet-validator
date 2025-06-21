import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { GridRowSelectionModel } from '@mui/x-data-grid';

// import { SubmitDataAlert } from "../../components/Alerts/SubmitDataAlert"
import { useRsi } from '../../hooks/useRsi';
import type { Data, Meta } from '../../types';

import { addErrorsAndRunHooks } from '../dataMutations';
import { Table, RowData } from '../Table';
import { generateColumns } from '../ValidationStepColumns';

type Props<T extends string> = {
  initialData: Data<T>[];
  file: File;
};

export const ValidationStep = <T extends string>({ initialData, file }: Props<T>) => {
  const { translations, fields, onClose, onSubmit, rowHook, tableHook, allowInvalidSubmit } = useRsi<T>();
  // const styles = useStyleConfig(
  //     "ValidationStep",
  // ) as (typeof themeOverrides)["components"]["ValidationStep"]["baseStyle"]

  const [data, setData] = React.useState<(Data<T> & Meta)[]>(
    React.useMemo(() => addErrorsAndRunHooks<T>(initialData, fields, rowHook, tableHook), []),
  );
  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set<number>([]),
  });
  const [filterByErrors, setFilterByErrors] = React.useState(false);
  const [showSubmitAlert, setShowSubmitAlert] = React.useState(false);

  const updateData = React.useCallback(
    (rows: typeof data) => {
      setData(addErrorsAndRunHooks<T>(rows, fields, rowHook, tableHook));
    },
    [setData, rowHook, tableHook, fields],
  );

  const deleteSelectedRows = () => {
    if (selectedRows.ids.size > 0) {
      const newData = data.filter(row => !selectedRows.ids.has(row.__index));
      updateData(newData);

      setSelectedRows({
        type: 'include',
        ids: new Set<number>(),
      });
    }
  };

  const updateRow = React.useCallback(
    (rows: RowData[], changedIndexes?: number[]) => {
      const changes = changedIndexes?.reduce(
        (acc, i) => {
          const realIndex = data.findIndex(value => value.__index === rows[i].__index);
          acc[realIndex] = rows[i];
          return acc;
        },
        {} as Record<number, RowData>,
      );

      const newData = Object.assign([], data, changes);
      updateData(newData);
    },
    [data, updateData],
  );

  const columns = React.useMemo(() => {
    return generateColumns(fields);
  }, [fields]);

  const tableData = React.useMemo(() => {
    if (filterByErrors) {
      return data.filter(value => {
        if (value?.__errors) {
          return Object.values(value.__errors)?.filter(err => {
            return err.level === 'error';
          }).length;
        }
        return false;
      });
    }
    return data;
  }, [data, filterByErrors]);

  const rowKeyGetter = React.useCallback((row: Data<T> & Meta) => {
    return row.__index;
  }, []);

  const submitData = async () => {
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
    setShowSubmitAlert(false);
    onClose();
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
    if (!invalidData) {
      submitData();
    } else {
      setShowSubmitAlert(true);
    }
  };

  return (
    <>
      {/*<SubmitDataAlert isOpen={showSubmitAlert} onClose={() => setShowSubmitAlert(false)} onConfirm={submitData} />*/}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="2rem" flexWrap="wrap" gap="8px">
        <Typography variant={'h4'}>{translations.validationStep.title}</Typography>
        <Box display="flex" gap="16px" alignItems="center" flexWrap="wrap">
          <Button onClick={deleteSelectedRows} size={'small'} variant={'outlined'}>
            {translations.validationStep.discardButtonTitle}
          </Button>
          <Switch
            sx={{ display: 'flex', alignItems: 'center' }}
            checked={filterByErrors}
            onChange={() => {
              return setFilterByErrors(!filterByErrors);
            }}
          />
          <FormLabel component="legend">{translations.validationStep.filterSwitchTitle}</FormLabel>
        </Box>
      </Box>
      <Box style={{ height: '50vh', display: 'flex', flexDirection: 'column' }}>
        <Table
          rows={tableData}
          columns={columns}
          selectedRows={selectedRows}
          setSelectedRow={setSelectedRows}
          onRowsChange={updateRow}
          components={{
            noRowsFallback: (
              <Box display="flex" justifyContent="center" gridColumn="1/-1" mt="32px">
                {filterByErrors
                  ? translations.validationStep.noRowsMessageWhenFiltered
                  : translations.validationStep.noRowsMessage}
              </Box>
            ),
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 2,
        }}
      >
        <Button variant={'contained'} onClick={onContinue} style={{ width: 300 }}>
          {translations.validationStep.nextButtonTitle}
        </Button>
      </Box>
    </>
  );
};
