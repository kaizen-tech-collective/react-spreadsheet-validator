import { Box, Grid } from '@mui/material';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useRsi } from '../../hooks/useRsi';
import XLSX from 'xlsx-ugnis';
import Typography from '@mui/material/Typography';
import { inspect } from 'util';
import { ExampleTable } from '../ExampleTable';
import { DropZone } from '../DropZone';

type UploadProps = {
  onContinue: (data: XLSX.WorkBook, file: File) => Promise<void>;
};

export const FadingOverlay = () => (
  <Box
    sx={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '40px',
      pointerEvents: 'none',
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), white)',
    }}
  />
);

const Upload = ({ onContinue }: UploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  // const styles = useStyleConfig("UploadStep") as (typeof themeOverrides)["components"]["UploadStep"]["baseStyle"]
  const { translations, fields } = useRsi();
  const handleOnContinue = useCallback(
    async (data: XLSX.WorkBook, file: File) => {
      setIsLoading(true);
      await onContinue(data, file);
      setIsLoading(false);
    },
    [onContinue],
  );
  return (
    <>
      <Typography variant={'h4'} gutterBottom>
        {translations.uploadStep.title}
      </Typography>
      <Typography variant={'h5'}>{translations.uploadStep.manifestTitle}</Typography>
      <Typography gutterBottom variant={'body1'}>
        {translations.uploadStep.manifestDescription}
      </Typography>
      <Box sx={{ mb: '0.1rem', position: 'relative', height: '72px' }}>
        <ExampleTable fields={fields} />
        <FadingOverlay />
      </Box>
      <DropZone onContinue={handleOnContinue} isLoading={isLoading} />
    </>
  );
};

export default Upload;
