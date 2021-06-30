import React from 'react';
import Webcam from 'react-webcam';
import { Button } from '../buttons/buttons';

const WebcamCapture = ({ handleBack, handleNext, collectionID }) => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const recapture = () => {
    setImgSrc(null);
  };

  const processNextStage = () => {
    setImgSrc(null);
    handleNext({
      imgSrc,
    });
  };

  const buttonStyle = {
    backgroundColor: '#BAA06A',
    borderRadius: 24.5,
    color: '#0B1A23',
    margin: '5px'
  }

  const retakeButton = {
    backgroundColor: '#555862',
    borderRadius: 24.5,
    color: '#FFFFFF',
    margin: '5px'
  }

  const capturePhoto = () => {
    return (
      <div >
        {!imgSrc && (
          <>
            <div style={{ maxWidth: '300px', margin: 'auto' }} >
              <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" style={{ marginTop: '10px', width: '100%' }} />
            </div>
            <div style={{ textAlign: 'center', fontSize: 'xx-large' }}>
              <i className="fa fa-camera" aria-hidden="true" onClick={capture}></i>
            </div>
          </>
        )}
        {imgSrc && (
          <>
            <img src={imgSrc} />
            <div className="row" style={{ margin: '10px 20px' }}>
              <Button className="next-button" style={buttonStyle} onClick={handleBack}>
                Back
              </Button>
              <Button className="next-button" style={retakeButton} onClick={recapture}>
                Retake
              </Button>
              <Button className="next-button" style={buttonStyle} onClick={processNextStage}>
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  return capturePhoto();
};

export default WebcamCapture;
