import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx-ugnis';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useRsi } from '../hooks/useRsi';

type DropZoneProps = {
  onContinue: (data: XLSX.WorkBook, file: File) => void;
  isLoading: boolean;
};

export const readFileAsync = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
};

export const DropZone = ({ onContinue, isLoading }: DropZoneProps) => {
  const { translations, maxFileSize, dateFormat, parseRaw } = useRsi();
  // const styles = useStyleConfig("UploadStep") as (typeof themeOverrides)["components"]["UploadStep"]["baseStyle"]
  const [loading, setLoading] = React.useState(false);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    maxSize: maxFileSize,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    onDropRejected: fileRejections => {
      setLoading(false);
      fileRejections.forEach(fileRejection => {
        toast(
          `${fileRejection.file.name} ${translations.uploadStep.dropzone.errorToastDescription}: ${fileRejection.errors[0].message}`,
          {
            type: 'error',
            position: 'bottom-left',
            closeOnClick: true,
          },
        );
      });
    },
    onDropAccepted: async ([file]) => {
      setLoading(true);
      const arrayBuffer = await readFileAsync(file);
      const workbook = XLSX.read(arrayBuffer, {
        cellDates: true,
        dateNF: dateFormat,
        raw: parseRaw,
        dense: true,
      });
      setLoading(false);
      onContinue(workbook, file);
    },
  });

  const color = '#5d55fa';

  return (
    <Box
      {...getRootProps()}
      sx={{
        backgroundImage: `repeating-linear-gradient(0deg, blue, ${color} 10px, white 10px, white 20px, ${color} 20px), repeating-linear-gradient(90deg, ${color}, ${color} 10px, white 10px, white 20px, ${color} 20px), repeating-linear-gradient(180deg, ${color}, ${color} 10px, white 10px, white 20px, ${color} 20px), repeating-linear-gradient(270deg, ${color}, ${color} 10px, white 10px, white 20px, ${color} 20px)`,
        backgroundSize: '2px 100%, 100% 2px, 2px 100% , 100% 2px',
        backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
        backgroundRepeat: 'no-repeat',
        borderRadius: '4px',
        position: 'relative',
        height: '300px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <input {...getInputProps()} data-testid="rsi-dropzone" />
      {isDragActive ? (
        <Typography>{translations.uploadStep.dropzone.activeDropzoneTitle}</Typography>
      ) : loading || isLoading ? (
        <Typography>{translations.uploadStep.dropzone.loadingTitle}</Typography>
      ) : (
        <>
          <Typography>{translations.uploadStep.dropzone.title}</Typography>
          <Button variant={'contained'} onClick={open}>
            {translations.uploadStep.dropzone.buttonTitle}
          </Button>
        </>
      )}
    </Box>
  );
};
