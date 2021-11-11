import React, { useState } from 'react';
import { DropzoneDialog } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';

export default function MyDragAndDrop(props) {
  const [state, setState] = useState({
    open: false,
    files: [],
  });
  /*
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      files: [],
    };
  }*/

  const handleClose = () => {
    setState({
      open: false,
    });
  };

  const handleSave = (files) => {
    //Saving files to state for further use and closing Modal.
    setState({
      files: files,
      open: false,
    });
    console.log(files);
    let added = files.map((fic) => fic.name);
    /*let added = {};
    for (const [key, value] of Object.entries(files)) {
      added = { ...added, value };
      console.log(`${key}: ${value}`);
    }*/
    let mesFichiers = {};
    try {
      mesFichiers = { ...localStorage.getItem('img'), ...added };
    } catch (error) {
      mesFichiers = added;
    }

    localStorage.setItem('img', JSON.stringify(mesFichiers));
    // files.map((fic) => localStorage.setItem(fic.name, fic.name));
  };

  const handleOpen = () => {
    setState({
      open: true,
    });
  };

  return (
    <div>
      <Button onClick={handleOpen.bind(this)}>Ajouter une Image</Button>
      <DropzoneDialog
        open={state.open}
        onSave={handleSave.bind(this)}
        acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
        showPreviews={true}
        maxFileSize={5000000}
        onClose={handleClose.bind(this)}
      />
    </div>
  );
}
