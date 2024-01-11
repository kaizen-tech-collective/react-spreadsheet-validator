import { Box } from '@mui/material';
import * as React from 'react';
type FadingWrapperProps = {
  gridColumn: string
  gridRow: string
}

export const FadingWrapper = ({ gridColumn, gridRow }: FadingWrapperProps) => (
  <>
    <Box sx={{
        gridColumn:{gridColumn},
        gridRow:{gridRow},
        borderRadius:"1.2rem",
        border:"1px solid",
        // borderColor:"border",
        pointerEvents:"none" , 
    }}
    />
    <Box sx={{
        gridColumn:{gridColumn},
        gridRow:{gridRow},
        pointerEvents:"none",
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), white)',
    }}
      
    />
  </>
)
