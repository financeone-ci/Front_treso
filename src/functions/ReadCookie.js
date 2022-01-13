/** @format */

import React from 'react'

const ReadCookie = () => {
  var b = document.cookie.match('(^|;)\\s*_Jst\\s*=\\s*([^;]+)')
  if (b) {
    // controle de la validité du jeton

    return b[2]
  } else {
    // Impossible de trouver le cookie donc déconnexion
    return ''
  }
}
export default ReadCookie
