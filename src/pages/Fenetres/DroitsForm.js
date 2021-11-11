/** @format */

import React, { useState, useEffect } from 'react'
import ModalForm from '../../composants/controls/modal/ModalForm'
import TableauSimple from '../../composants/tableaux/TableauSimple'
import { makeStyles } from '@material-ui/core'
import { Notification } from '../../composants/controls/toast/MyToast'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: 'right',
  },
}))

function DroitsForm(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)

const fonctionOK =()=>{
  setNotify({
    type: 'success',
    message: 'OK',
  })
  setOpenNotif(true)
}
  // Colonne du tableau
  const columns = [
    { id: 'e_smenu_libelle', label: 'Droits', minWidth: 170, align: 'left' },
    {
      id: 'droits_lecture',
      label: 'Lecture',
      minWidth: 100,
      align: 'center',
      format: (value) => value,
    },
    {
      id: 'droits_creer',
      label: 'Création',
      minWidth: 100,
      align: 'center',
      format: (value) => value,
    },
    {
      id: 'droits_modifier',
      label: 'Modification',
      minWidth: 100,
      align: 'center',
      format: (value) => value,
    },
    {
      id: 'droits_supprimer',
      label: 'Suppression',
      minWidth: 100,
      align: 'center',
      format: (value) => value,
    },
  ]

  const classes = useStyles()
  return (
    <>
      <ModalForm
        title={props.titre}
        handleClose={props.handleClose}
        open={props.open}>
        <TableauSimple fonctionOK={fonctionOK} columns={columns} rows={props.listDroits} AfficheDroits={props.AfficheDroits} />
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
export default DroitsForm
