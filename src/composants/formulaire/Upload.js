/** @format */

import React from 'react'
import { DropzoneArea } from 'material-ui-dropzone'

function Upload(props) {
  return (
    <DropzoneArea
      onChange={props.handleChange}
      acceptedFiles={props.acceptedFiles}
      {...props}
    />
  )
}

export default Upload
