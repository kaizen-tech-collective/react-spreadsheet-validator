import * as React from 'react';
import { toast } from 'react-toastify';
import XLSX from 'xlsx-ugnis';

import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel, { stepLabelClasses } from '@mui/material/StepLabel';
import { stepIconClasses } from '@mui/material/StepIcon';

import { useRsi } from '../hooks/useRsi';
import { StepState, StepType } from '../types';

import { MatchColumnsStep } from './Steps/MatchColumns';
import { SelectHeaderStep } from './Steps/SelectHeader';
import Upload from './Steps/Upload';
import ValidationStep from './Steps/Validation';

import { translations } from '../translationsRSIProps';

const steps = [
  translations.uploadStep.title,
  translations.selectHeaderStep.title,
  translations.matchColumnsStep.title,
  translations.validationStep.title,
];

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
      onContinue={async values => {
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

  // const totalSteps = () => {
  //   return steps.length;
  // };

  // const completedSteps = () => {
  //   return Object.keys(completed).length;
  // };

  // const isLastStep = () => {
  //   return activeStep === totalSteps() - 1;
  // };

  // const handleNext = () => {
  //   setCompleted({ ...completed, [activeStep]: true });
  //   const newActiveStep = isLastStep()
  //     ? // It's the last step, but not all steps have been completed,
  //       // find the first step that has been completed
  //       steps.findIndex((step, i) => !(i in completed))
  //     : activeStep + 1;
  //   setActiveStep(newActiveStep);
  // };

  // const handleFinish = () => {
  //   alert('Finish');
  // };

  return (
    <>
      <DialogTitle component="div" sx={{ py: '24px', px: '32px' }}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepLabel
                slotProps={{
                  label: {
                    sx: theme => {
                      return {
                        fontSize: '1rem',
                        lineHeight: '1.5',

                        [`&.${stepLabelClasses.active}, &.${stepLabelClasses.completed}`]: {
                          fontWeight: theme.typography.fontWeightBold,
                        },
                      };
                    },
                  },
                  stepIcon: {
                    sx: theme => {
                      const incompleteBgColor = theme.palette.grey[300];

                      return {
                        color: incompleteBgColor,
                        height: '32px',
                        width: '32px',

                        [`& .${stepIconClasses.text}`]: {
                          fill: theme.palette.common.white,
                        },

                        [`&.${stepIconClasses.active}`]: {
                          color: incompleteBgColor,
                          outlineColor: 'primary.main',
                          outlineWidth: '2px',
                          outlineStyle: 'solid',
                          borderRadius: '50%',

                          [`& .${stepIconClasses.text}`]: {
                            fill: theme.palette.text.primary,
                          },
                        },
                      };
                    },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent sx={{ p: 0, m: '32px' }}>{stepsContent[activeStep]}</DialogContent>
    </>
  );
};

export default HorizontalStepper;
