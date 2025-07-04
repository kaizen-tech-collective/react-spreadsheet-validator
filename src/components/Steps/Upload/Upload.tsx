import * as React from 'react';
import XLSX from 'xlsx-ugnis';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { useRsi } from '../../../hooks/useRsi';
import { DropZone } from '../../DropZone';

import ExampleTable from './ExampleTable';

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
  const [isLoading, setIsLoading] = React.useState(false);

  // const styles = useStyleConfig("UploadStep") as (typeof themeOverrides)["components"]["UploadStep"]["baseStyle"]

  const { translations, fields } = useRsi();

  const handleOnContinue = React.useCallback(
    async (data: XLSX.WorkBook, file: File) => {
      setIsLoading(true);
      await onContinue(data, file);
      setIsLoading(false);
    },
    [onContinue],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
            {translations.uploadStep.title}
          </Typography>
          <Typography variant="h6">{translations.uploadStep.manifestTitle}</Typography>
          <Typography color="textSecondary" sx={{ mb: '32px' }}>
            {translations.uploadStep.manifestDescription}
          </Typography>
          <Box sx={{ mb: '32px', position: 'relative', height: '105px' }}>
            <ExampleTable fields={fields} />
            <FadingOverlay />
          </Box>
          <DropZone onContinue={handleOnContinue} isLoading={isLoading} />
        </>
      )}
    </Box>
  );
};

export default Upload;
