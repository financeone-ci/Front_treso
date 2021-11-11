/** @format */

import React from 'react'
import Button from '@material-ui/core/Button'

export default function ButtonLabel(props) {
  return (
    <Button {...props} type={props.type || 'submit'}>
      {props.children}
    </Button>
  )
}
