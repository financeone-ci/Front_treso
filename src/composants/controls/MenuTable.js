/** @format */

import React from 'react'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'

export default function MenuTable(props) {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton
        aria-label='more'
        aria-controls='long-menu'
        aria-haspopup='true'
        onClick={handleClick}>
        {props.icone}
      </IconButton>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {props.children}
        {/* {props.items.map((item) => (
          <MenuItem onClick={handleClose}>{item}</MenuItem>
        ))} */}
      </Menu>
    </div>
  )
}
