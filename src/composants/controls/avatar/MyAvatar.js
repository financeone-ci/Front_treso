/** @format */

import React from 'react'

function MyAvatar(props) {
  return <span className={props.css + ' avatar'} title={props.title} >{props.lettre}</span>
}

export default MyAvatar
