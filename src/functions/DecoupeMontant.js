import React from 'react';

const DecoupeMontant = (mot, longueur, reste = true ) => {
      
    let premierePartie = mot.substring(0, longueur)
   let  lastSpace = premierePartie.lastIndexOf(" ")
    premierePartie = mot.substring(0, lastSpace)
    let deuxiemePartie = ""
    if(reste === true)
   deuxiemePartie  = mot.substring(lastSpace + 1)
   else  deuxiemePartie  = mot.substring(lastSpace + 1, lastSpace +longueur)
    const montLettre = {un: premierePartie, deux: deuxiemePartie}
   return montLettre
  }

export default DecoupeMontant;