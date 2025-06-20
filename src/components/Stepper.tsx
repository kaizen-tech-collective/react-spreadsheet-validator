import * as React from 'react';
import { toast } from 'react-toastify';
import XLSX from 'xlsx-ugnis';

// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
// import Typography from '@mui/material/Typography';

import { useRsi } from '../hooks/useRsi';
import { StepState, StepType } from '../types';

import { MatchColumnsStep } from './Steps/MatchColumns';
import { SelectHeaderStep } from './Steps/SelectHeader';
import Upload from './Steps/Upload';
import { ValidationStep } from './Steps/Validation';

const steps = ['Upload file', 'Select header row', 'Match columns', 'Validate data'];

export const exceedsMaxRecords = (workSheet: XLSX.WorkSheet, maxRecords: number) => {
  const [top, bottom] =
    workSheet['!ref']?.split(':').map(position => {
      return parseInt(position.replace(/\D/g, ''), 10);
    }) || [];
  return bottom - top > maxRecords;
};

export const mapWorkbook = (workbook: XLSX.WorkBook, sheetName?: string) => {
  const worksheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    blankrows: false,
    raw: false,
  });
  return data as string[][];
};

const HorizontalStepper = () => {
  const { initialStepState } = useRsi();
  const [state, setState] = React.useState<StepState>(initialStepState || { type: StepType.upload });
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const { maxRecords, translations } = useRsi();

  const errorToast = React.useCallback(
    (description: string) => {
      toast(`${translations.alerts.toast.error}: ${description}`, {
        type: 'error',
        position: 'bottom-left',
        closeOnClick: true,
      });
    },
    [toast, translations],
  );

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>({});

  const setNextStep = () => {
    setCompleted({ ...completed, [activeStep]: true });
    setActiveStep(activeStep + 1);
  };

  const stepsContent = [
    <Upload
      key={1}
      onContinue={async (workbook, file) => {
        setUploadedFile(file);
        const isSingleSheet = workbook.SheetNames.length === 1;
        if (isSingleSheet) {
          if (maxRecords && exceedsMaxRecords(workbook.Sheets[workbook.SheetNames[0]], maxRecords)) {
            errorToast(translations.uploadStep.maxRecordsExceeded(maxRecords.toString()));
            return;
          }
          try {
            const mappedWorkbook = mapWorkbook(workbook);
            setState({
              type: StepType.selectHeader,
              data: mappedWorkbook,
            });
            setNextStep();
          } catch (e) {
            errorToast((e as Error).message);
          }
        }
      }}
    />,
    <SelectHeaderStep
      key={2}
      //@ts-ignore
      data={state.data}
      onContinue={async (headerValues, data) => {
        try {
          setState({
            type: StepType.matchColumns,
            data,
            headerValues,
          });
          setNextStep();
        } catch (e) {
          errorToast((e as Error).message);
        }
      }}
    />,
    <MatchColumnsStep
      key={3}
      data={state.type !== 'upload' ? state.data : []}
      headerValues={state.type === 'matchColumns' ? state.headerValues : []}
      onContinue={async (values, rawData, columns) => {
        try {
          setState({
            type: StepType.validateData,
            data: values,
          });
          setNextStep();
        } catch (e) {
          errorToast((e as Error).message);
        }
      }}
    />,
    //@ts-ignore
    <ValidationStep key={4} initialData={state.data} file={uploadedFile!} />,
  ];

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const handleNext = () => {
    setCompleted({ ...completed, [activeStep]: true });
    const newActiveStep = isLastStep()
      ? // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        steps.findIndex((step, i) => !(i in completed))
      : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleFinish = () => {
    alert('Finish');
  };

  return (
    <>
      <DialogTitle>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" disableRipple={true} style={{ cursor: 'default' }}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent>{stepsContent[activeStep]}</DialogContent>
    </>
  );
};

export default HorizontalStepper;
