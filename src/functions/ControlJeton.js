/** @format */

import { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import Constantes from '../api/Constantes'

function ControlJeton(props) {
  var history = useHistory()
  var b = document.cookie.match('(^|;)\\s*_Jst\\s*=\\s*([^;]+)')
  const [donneesUser, setDonneesUser] = useState()

  useEffect(() => {
    //Checks if location.pathname is not "/".
    const idInt = setInterval(() => {
      // console.log(b[2])
      if (b) {
        // controle de la validité du jeton
        try {
          //var JetonDecrypt = CryptFunc(b[2], 0)
          setDonneesUser(jwt.verify(b[2], Constantes.token))
         
        } catch (error) {
          //jeton invalide
          console.log(error)
          history.push('/')
        }
      } else {
        // Impossible de trouver le cookie donc déconnexion
        history.push('/')
        console.log('jeton introuvable*')
      }
      //console.log(donneesUser)
    }, 1000)

    return () => {
      clearInterval(idInt)
    
    } 
   
  }, [])
 
  
}

export default ControlJeton




