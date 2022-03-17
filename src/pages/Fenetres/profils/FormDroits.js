/** @format */

import React, { useState } from 'react'
import axios from '../../../api/axios'
import ModalForm from '../../../composants/controls/modal/ModalForm'
import ReadCookie from '../../../functions/ReadCookie'
import { makeStyles } from '@material-ui/core'
import { Grid } from '@material-ui/core'
import SpinnerForm from '../../../composants/controls/spinner/SpinnerForm'
import {
  useMutation,
} from 'react-query'
import ListWithCheck from '../../../composants/formGroup/ListWithCheck'
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: 'right',
  },
}))

function FormProfil(props) {
  // Stats

  const [typeSubmit, setTypeSubmit] = useState(1)

  // Variables
  // lire les infos du cookie
  const cookieInfo = ReadCookie()

  

  
  const classes = useStyles()
  return (
    <>
      <ModalForm
        title={props.titreModal}
        handleClose={props.handleClose}
        open={props.openModal}>
    
       
            
            
              <Grid container spacing={2}>
               
                <Grid item xs={12} sm={12} lg={12}>
                  Modifier les droits du profil <b> {props.initialModal.titre}</b>
                </Grid>
              </Grid>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} lg={12}>
                {
               //   console.log(props.initialModal)
                  
                  props.initialModal.droits &&
                  props.initialModal.droits.map((ligne)=>(
                    <div key={uuidv4()}>
                       
                      <ListWithCheck 
                      label={ligne.e_smenu_libelle}
                      api="profils-droits/UpdateDroits.php?id=" 
                     // setNotify={props.setNotify}
                     // setOpenNotif={props.setOpenNotif}
                      queryClient='listeProfils'
                      elements={
                        [
                          {
                            id:  ligne.droits_id,
                            value: ligne.droits_creer,
                            champ: "droits_creer",
                            title: "Création",
                          },
                          {
                            id:  ligne.droits_id,
                            value: ligne.droits_lecture,
                            champ: "droits_lecture",
                            title: "Lecture",
                          },
                          {
                            id:  ligne.droits_id,
                            value: ligne.droits_modifier,
                            champ: "droits_modifier",
                            title: "Modifier",
                          },
                          {
                            id:  ligne.droits_id,
                            value: ligne.droits_supprimer,
                            champ: "droits_supprimer",
                            title: "Supprimer",
                          },
                        
                      ]} />
                  
                  </div>
                  ) )
                  
                }
                  
                  
                  </Grid>
                
              </Grid>

             
           
         
      </ModalForm>
    </>
  )
}

export default FormProfil
