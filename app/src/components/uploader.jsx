import { useState, useRef } from 'react'
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputFileUpload from './input_file_upload.jsx'
import MyCamera from './camera.jsx'

function Uploader(props) {
  const [files, setFiles] = useState([]);
  const [subject, setSubject] = useState("math");
  const [showCamera, setShowCamera] = useState(false);

  const uploadedFiles = useRef([]);
  const uploadedFilesCount = useRef(0);


  const onCameraFinish = (photos) => {
    setFiles(photos)
    setShowCamera(false)
  }

  const onSubjectChange = e => {
    setSubject(e.target.value);
  };

  const onChange = e => {
    const files = e.target.files;
    uploadedFiles.current = {}
    uploadedFilesCount.current = files.length
    Array.from(files).map( (file) => {
      uploadedFiles.current[file.name] = ""
      getBase64(file);
    })
    return false;
  };

  const onLoad = (filename,fileString) => {
    // enable uploadBtn
    uploadedFiles.current[filename] = fileString
    if (uploadedFilesCount.current == Object.keys(uploadedFiles.current).length) {
      setFiles(Object.values(uploadedFiles.current))
    }

  };

  const getBase64 = async file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onLoad(file.name, reader.result);
    };
  };

  const onSubmit = e => {
    props.onSubmitted({
      "files":files,
      "subject": subject
    });
    // prevent default
    e.preventDefault();
    return false;
  };

  const onReset = e => {
    setFiles([]);
    // prevent default
    e.preventDefault();
    return false;
  }

  const filesListItems = Array.from(files).map( (_file, index) => {
    const k = "image" + index;
    return <img key={k} width="80px" src={_file}/>
  })
  return (
    <>
      <FormControl fullWidth sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-simple-select-label">Materia</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={subject}
          label="Materia"
          name="subject"
          onChange={onSubjectChange}
        >
          <MenuItem value="math">Matematica</MenuItem>
          <MenuItem value="italian">Italiano</MenuItem>
          <MenuItem value="inglese">Inglese</MenuItem>
          <MenuItem value="chimica">Chimica</MenuItem>
        </Select>
      </FormControl>
      {
      (files && files.length == 0) &&
      <>
      <InputFileUpload
        onChange={onChange}
      />
      <Button onClick={() => {setShowCamera(true)}}>Photo</Button>
      </>}
      {
      (showCamera) && 
      <MyCamera
        onFinish={onCameraFinish}
      />
      }
      {
        (files && files.length > 0) &&
        <>
          <div>{filesListItems}</div>
          <Button id="resetBtn" variant="outlined" onClick={onReset}>Annulla</Button>
          <Button id="uploadBtn" variant="outlined" onClick={onSubmit}>Analyze</Button>
        </>
      }

    </>
  )
}

export default Uploader