import { useRef } from 'react';
import * as React from 'react';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Webcam from "react-webcam";
import LensIcon from '@mui/icons-material/Lens';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

const videoConstraints = {
    //width: '100px',
    //height: window.innerHeight,
    facingMode: "environment"
  };

export default function MyCamera(props) {
    const [photos, setPhotos] = React.useState([])
    const [cameraReady, setCameraReady] = React.useState(false)

    const webcamRef = useRef(null);

    const onCapturePhoto = React.useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPhotos(photos => [...photos, imageSrc]);
    }, [webcamRef]);

    const onUserMedia = (e) => {
      setCameraReady(true)
    };

    const onCancel = () => {
        props.onFinish([])
    }

    const onFinish = () => {
        props.onFinish(photos)
    }

  const photosPreview = photos.map( (photo, index) => {
    const k = "preview_image" + index;
    return <img key={k} src={photo} style={{width:'60px'}}/>
  });

  return (
  <>
    <div style={{ zIndex:'999', backgroundColor: 'white', width: window.innerWidth, height: window.innerHeight, position:'absolute', top:'0', 'left':0 }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        width={window.innerWidth}
        //height={window.innerHeight}
        screenshotFormat="image/webp"
        videoConstraints={videoConstraints}
        screenshotQuality={1}
        onUserMedia={onUserMedia}
      />
      { 
        (!cameraReady) &&
          <div>Loading camera...</div>
      }
      {
        (cameraReady) &&
        <>
        <div style={{position:'absolute', height:'4em', top:'0px', left:'0px', width:'100%', backgroundColor:'rgba(40, 40, 40, 0.8)'}}>
          <IconButton color="primary" onClick={onCancel} style={{position:'absolute', top:'10px', left:'10px'}} size="large">
              <CloseIcon fontSize="inherit" />
          </IconButton>
          <IconButton color="primary" onClick={onFinish} style={{position:'absolute', top:'10px', right:'10px'}} size="large">
              <DoneIcon fontSize="inherit" />
          </IconButton>
        </div>
        <div style={{position:'absolute', bottom:'10px', width:'100%'}}>
          <Fab color="primary" aria-label="add" onClick={onCapturePhoto} size="large">
            <LensIcon />
          </Fab>
        </div>
        {photosPreview}
        </>
      }
    </div>
  </>
  );
}