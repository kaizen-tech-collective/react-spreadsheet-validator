import { useCallback, useMemo, useState } from 'react';
import { useRsi } from '../../hooks/useRsi';
import { Table } from '../Table';
// import { SubmitDataAlert } from "../../components/Alerts/SubmitDataAlert"
import type { Data, Meta } from '../../types';
import type { RowsChangeData } from 'react-data-grid';
import * as React from 'react';
import { addErrorsAndRunHooks } from '../dataMutations';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, FormLabel, Switch } from '@mui/material';
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

  const [data, setData] = useState<(Data<T> & Meta)[]>(
    useMemo(() => addErrorsAndRunHooks<T>(initialData, fields, rowHook, tableHook), []),
  );
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number | string>>(new Set());
  const [filterByErrors, setFilterByErrors] = useState(false);
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);

  const updateData = useCallback(
    (rows: typeof data) => {
      setData(addErrorsAndRunHooks<T>(rows, fields, rowHook, tableHook));
    },
    [setData, rowHook, tableHook, fields],
  );

  const deleteSelectedRows = () => {
    if (selectedRows.size) {
      const newData = data.filter(value => !selectedRows.has(value.__index));
      updateData(newData);
      setSelectedRows(new Set());
    }
  };

  const updateRow = useCallback(
    (rows: typeof data, changedData?: RowsChangeData<(typeof data)[number]>) => {
      const changes = changedData?.indexes.reduce(
        (acc, index) => {
          // when data is filtered val !== actual index in data
          const realIndex = data.findIndex(value => value.__index === rows[index].__index);
          acc[realIndex] = rows[index];
          return acc;
        },
        {} as Record<number, (typeof data)[number]>,
      );
      const newData = Object.assign([], data, changes);
      updateData(newData);
    },
    [data, updateData],
  );

  const columns = useMemo(() => generateColumns(fields), [fields]);

  const tableData = useMemo(() => {
    if (filterByErrors) {
      return data.filter(value => {
        if (value?.__errors) {
          return Object.values(value.__errors)?.filter(err => err.level === 'error').length;
        }
        return false;
      });
    }
    return data;
  }, [data, filterByErrors]);

  const rowKeyGetter = useCallback((row: Data<T> & Meta) => row.__index, []);

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
        return !!Object.values(value.__errors)?.filter(err => err.level === 'error').length;
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
            onChange={() => setFilterByErrors(!filterByErrors)}
          />
          <FormLabel component="legend">{translations.validationStep.filterSwitchTitle}</FormLabel>
        </Box>
      </Box>
      <Box sx={{ h: 0, flexGrow: 1 }}>
        {/* <Table
          rowKeyGetter={rowKeyGetter}
          rows={tableData}
          onRowsChange={updateRow}
          columns={columns}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          components={{
            noRowsFallback: (
              <Box display="flex" justifyContent="center" gridColumn="1/-1" mt="32px">
                {filterByErrors
                  ? translations.validationStep.noRowsMessageWhenFiltered
                  : translations.validationStep.noRowsMessage}
              </Box>
            ),
          }}
        /> */}
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
