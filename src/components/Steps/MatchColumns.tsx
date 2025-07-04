import * as React from 'react';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

import { useRsi } from '../../hooks/useRsi';
import { Field, RawData } from '../../types';

import { ColumnGrid } from '../ColumnGrid';
import { findUnmatchedRequiredFields } from '../MatchColumns/findUnmatchedRequiredFields';
import { getMatchedColumns } from '../MatchColumns/getMatchedColumns';
import { normalizeTableData } from '../MatchColumns/normalizeTableData';
import { setColumn } from '../MatchColumns/setColumn';
import { setIgnoreColumn } from '../MatchColumns/setIgnoreColumn';
import { setSubColumn } from '../MatchColumns/setSubColumn';
import { TemplateColumn } from '../TemplateColumn';
import { UserTableColumn } from '../UserTableColumn';

export type MatchColumnsProps<T extends string> = {
  data: RawData[];
  headerValues: RawData;
  onContinue: (data: any[], rawData: RawData[], columns: Columns<T>) => void;
};

export enum ColumnType {
  empty,
  ignored,
  matched,
  matchedCheckbox,
  matchedSelect,
  matchedSelectOptions,
}

export type MatchedOptions<T> = {
  entry: string;
  value: T;
};

type EmptyColumn = { type: ColumnType.empty; index: number; header: string };
type IgnoredColumn = { type: ColumnType.ignored; index: number; header: string };
type MatchedColumn<T> = { type: ColumnType.matched; index: number; header: string; value: T };
type MatchedSwitchColumn<T> = { type: ColumnType.matchedCheckbox; index: number; header: string; value: T };
export type MatchedSelectColumn<T> = {
  type: ColumnType.matchedSelect;
  index: number;
  header: string;
  value: T;
  matchedOptions: Partial<MatchedOptions<T>>[];
};
export type MatchedSelectOptionsColumn<T> = {
  type: ColumnType.matchedSelectOptions;
  index: number;
  header: string;
  value: T;
  matchedOptions: MatchedOptions<T>[];
};

export type Column<T extends string> =
  | EmptyColumn
  | IgnoredColumn
  | MatchedColumn<T>
  | MatchedSwitchColumn<T>
  | MatchedSelectColumn<T>
  | MatchedSelectOptionsColumn<T>;

export type Columns<T extends string> = Column<T>[];

export const MatchColumnsStep = <T extends string>({ data, headerValues, onContinue }: MatchColumnsProps<T>) => {
  const dataExample = data.slice(0, 2);
  const {
    fields,
    // autoMapHeaders,
    // autoMapDistance,
    translations,
  } = useRsi<T>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [columns, setColumns] = React.useState<Columns<T>>(
    // Do not remove spread, it indexes empty array elements, otherwise map() skips over them
    ([...headerValues] as string[]).map((value, index) => {
      return { type: ColumnType.empty, index, header: value ?? '' };
    }),
  );
  React.useEffect(() => {
    const matchedColumns = getMatchedColumns(columns, fields, data, 1);
    setColumns(matchedColumns);
  }, []);

  // const [showUnmatchedFieldsAlert, setShowUnmatchedFieldsAlert] = React.useState(false);

  const onChange = React.useCallback(
    (value: T, columnIndex: number) => {
      const field = fields.find(field => field.key === value) as unknown as Field<T>;
      const existingFieldIndex = columns.findIndex(column => 'value' in column && column.value === field.key);
      setColumns(
        columns.map<Column<T>>((column, index) => {
          if (columnIndex === index) {
            return setColumn(column, field, data);
          } else if (index === existingFieldIndex) {
            toast(
              `${translations.matchColumnsStep.duplicateColumnWarningTitle}: ${translations.matchColumnsStep.duplicateColumnWarningDescription}`,
              {
                type: 'warning',
                position: 'bottom-left',
                closeOnClick: true,
              },
            );
            return setColumn(column);
          } else {
            return column;
          }
        }),
      );
    },
    [
      columns,
      data,
      fields,
      toast,
      translations.matchColumnsStep.duplicateColumnWarningDescription,
      translations.matchColumnsStep.duplicateColumnWarningTitle,
    ],
  );

  const onIgnore = React.useCallback(
    (columnIndex: number) => {
      setColumns(
        columns.map((column, index) => {
          return columnIndex === index ? setIgnoreColumn<T>(column) : column;
        }),
      );
    },
    [columns, setColumns],
  );

  const onRevertIgnore = React.useCallback(
    (columnIndex: number) => {
      setColumns(
        columns.map((column, index) => {
          return columnIndex === index ? setColumn(column) : column;
        }),
      );
    },
    [columns, setColumns],
  );

  const onSubChange = React.useCallback(
    (value: string, columnIndex: number, entry: string) => {
      setColumns(
        columns.map((column, index) => {
          return columnIndex === index && 'matchedOptions' in column ? setSubColumn(column, entry, value) : column;
        }),
      );
    },
    [columns, setColumns],
  );
  const unmatchedRequiredFields = React.useMemo(() => {
    return findUnmatchedRequiredFields(fields, columns);
  }, [fields, columns]);

  const handleContinue = React.useCallback(async () => {
    if (unmatchedRequiredFields.length > 0) {
      // setShowUnmatchedFieldsAlert(true);
      alert(translations.alerts.unmatchedRequiredFields.headerTitle);
    } else {
      setIsLoading(true);
      const normalizedData = normalizeTableData(columns, data, fields);
      onContinue(normalizedData, data, columns);
      setIsLoading(false);
    }
  }, [unmatchedRequiredFields.length, onContinue, columns, data, fields]);

  // const handleAlertOnContinue = React.useCallback(async () => {
  //   setShowUnmatchedFieldsAlert(false);
  //   setIsLoading(true);
  //   onContinue(normalizeTableData(columns, data, fields), data, columns);
  //   setIsLoading(false);
  // }, [onContinue, columns, data, fields]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* <UnmatchedFieldsAlert
        isOpen={showUnmatchedFieldsAlert}
        onClose={() => setShowUnmatchedFieldsAlert(false)}
        fields={unmatchedRequiredFields}
        onConfirm={handleAlertOnContinue}
      /> */}
      {isLoading ? (
        // TODO: Abstract this to a re-usable component between steps
        <Box
          sx={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}
        >
          <CircularProgress size="80px" />
          <Typography variant="h6" color="text.secondary">
            <strong>Processing...</strong>
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h5" sx={{ mb: '32px' }}>
            {translations.matchColumnsStep.title}
          </Typography>
          <ColumnGrid
            columns={columns}
            onContinue={handleContinue}
            isLoading={isLoading}
            userColumn={column => (
              <UserTableColumn
                column={column}
                onIgnore={onIgnore}
                onRevertIgnore={onRevertIgnore}
                entries={dataExample.map(row => {
                  return row[column.index];
                })}
              />
            )}
            templateColumn={column => {
              return <TemplateColumn column={column} onChange={onChange} onSubChange={onSubChange} />;
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
                return handleContinue();
              }}
            >
              {translations.matchColumnsStep.nextButtonTitle}
            </Button>
          </DialogActions>
        </>
      )}
    </Box>
  );
};
