/** @format */

import React, {   useState, useEffect } from 'react'
import * as yup from 'yup'
import axios from '../../api/axios'
import ModalForm from '../../composants/controls/modal/ModalForm'
import Controls from '../../composants/controls/Controls'
import TextInput from '../../composants/controls/TextInput'
import { makeStyles } from '@material-ui/core'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Notification } from '../../composants/controls/toast/MyToast'
import Constantes from '../../api/Constantes'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: 'right',
  },
}))

function ProfilsForm(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })
  const [initialValue, setInitialValue] = useState({})
  const schema = yup.object().shape({
    libelle: yup.string().required('Champs obligatoire'),
    //description: yup.string().required('Champs obligatoire'),
    about: yup.string().required('Champs obligatoire'),
  })


console.log(initialValue)
  
  const {
    register,
    handleSubmit,
    unregister, 
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
     defaultValue: {id:0, libelle:'', about: '44'}
  })
 
  // fonction à exécuter si le formulaire est OK
  const onSubmit = (values) => {
    console.log(values)
    return  props.initial_.id == 0 ?
   createProfilFunc(values) : editProfilFunc(values) 
  
  }

  const editProfilFunc = (values) => {
    axios
    .post('Profils.php?type=U', values)
    .then((response) => {
   
      if (response.data.reponse == 'success') {
        try {
          setNotify({
            type: response.data.reponse,
            message: response.data.message,
          })
          if (typeSubmit.type == 1) {
            props.handleClose()
          }
          setOpenNotif(true)
          ////////////
          // setLoader(true)

          fetch(Constantes.URL + '/Profils.php?type=R')
            .then((response) => response.json())
            .then((data) => props.setListProfils(data.infos))
            unregister(['id', 'libelle', 'about'])
          // setLoader(false)
          /////////////
        } catch (e) {
          setNotify({
            type: response.data.reponse,
            message: response.data.message,
          })
          setOpenNotif(true)
        }
      } else {
        setNotify({
          type: 'error',
          message: ' response.data.message',
        })
        setOpenNotif(true)
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }


  const createProfilFunc = (values) => {
    axios
    .post('Profils.php?type=C', values)
    .then((response) => {
   
      if (response.data.reponse == 'success') {
        try {
          setNotify({
            type: response.data.reponse,
            message: response.data.message,
          })
          if (typeSubmit.type == 1) {
            props.handleClose()
          }
          setOpenNotif(true)
          ////////////
          // setLoader(true)

          fetch(Constantes.URL + '/Profils.php?type=R')
            .then((response) => response.json())
            .then((data) => props.setListProfils(data.infos))
          // setLoader(false)
          /////////////
        } catch (e) {
          setNotify({
            type: response.data.reponse,
            message: response.data.message,
          })
          setOpenNotif(true)
        }
      } else {
        setNotify({
          type: 'error',
          message: ' response.data.message',
        })
        setOpenNotif(true)
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const classes = useStyles()
  
useEffect(()=>{
  fetch(Constantes.URL + `/Profils.php?type=R&id=${props.initial_.id}`)
    .then((response) => response.json())
    .then((data) => {
      
      setInitialValue(data.infos) 
      reset({id:initialValue.id, libelle: initialValue.profil_libelle, description: initialValue.profil_description})
      setValue("id",initialValue.id)
      setValue("libelle", initialValue.profil_libelle)
      setValue( "about", initialValue.profil_description)
    })
}, [props.initial_.id])
  
  return (
    <>
      <ModalForm
        title={props.title || 'Nouveau profil'}
        handleClose={props.handleClose}
        open={props.open}>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}>
          <input
            id='id'
            {...register('id')}
            type='hidden'
            value={props.initial_.id || ''}
          />

          <Controls.TextInput
            variant='outlined'
            margin='normal'
            fullWidth
            id='libelle'
            label='Libelle profil'
            {...register('libelle')}
            autoFocus
            type='text'
            helperText={errors.libelle?.message}
            error={errors.libelle && true}
              defaultValue={initialValue.profil_libelle || ''}
           //  defaultValue='abcd'
             //defaultValue={props.initial_.libelle || ''}
           
         
          />
         <Controls.TextInput
          variant='outlined'
          margin='normal'
          fullWidth='true'
          id='about'
          label='description'
          {...register('about')}
          error={errors.about && true}
          helperText={errors.about?.message}
          
         // defaultValue={props.initial_.description || '' }
        //  defaultValue="ok"
           defaultValue={initialValue.profil_description || '' }
        />
        {/*
          <input
            id='description'
            {...register('description')}
            type='text'
            value={props.initial_.description || ''}
          />*/}
          <div className={classes.buton}>
            <Controls.ButtonLabel
              color='primary'
              onClick={() =>
                setTypeSubmit({ type: 1,  })
              }>
              Valider
            </Controls.ButtonLabel>
            {props.initial_.type == 1 && (
              <Controls.ButtonLabel
                color='secondary'
                onClick={() => setTypeSubmit({ type: 2,  })}>
                Appliquer
              </Controls.ButtonLabel>
            )}
          </div>
        </form>
      </ModalForm>
      <Notification
        type={notify.type}
        message={notify.message}
        open={openNotif}
        setOpen={setOpenNotif}
      />
    </>
  )
}

export default ProfilsForm
