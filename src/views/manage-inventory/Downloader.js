// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

const DownloaderComponent = () => {
  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  // Function to handle download
  const handleDownload = () => {
    // Construct the file URL
    const fileUrl = `/downloads/Zipped/project.zip`;
    
    // Create a temporary anchor element
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = 'project.zip'; // Specify the file name
    anchor.click();

    // Clean up
    URL.revokeObjectURL(anchor.href);
  };

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>Download Component</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          Click below to download the file.
        </Typography>
        <Button size='small' variant='contained' onClick={handleDownload}>
          Download File
        </Button>
        <TrophyImg alt='trophy' src='/images/misc/trophy.png' />
      </CardContent>
    </Card>
  )
}

export default DownloaderComponent;
