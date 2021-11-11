import React, {useState} from 'react'
import Constantes from '../api/Constantes'
import jwt from 'jsonwebtoken'


 // controle de la validité du jeton
        try {
            var b = document.cookie.match('(^|;)\\s*_Jst\\s*=\\s*([^;]+)')
        } catch (error) {
           var b = [1,2,3,4]  
        }

const INITIAL_STATE = {
   // cookie: b[2]
    cookie: "5"
}

function InfoCookieReducer(state = INITIAL_STATE, action){
    
 
       
       
    return state
}

export default InfoCookieReducer