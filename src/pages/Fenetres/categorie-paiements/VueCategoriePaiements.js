/** @format */

import React, { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../../composants/PageHeader'
import TableData from '../../../composants/tableaux/TableData'
import { Paper, Grid, FormControlLabel, Checkbox } from '@material-ui/core'
import Controls from '../../../composants/controls/Controls'
import BarreButtons from '../../../composants/BarreButtons'
import Buttons from '../../../composants/controls/Buttons'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../../composants/controls/modal/ModalOuiNon'
import axios from '../../../api/axios'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import FormCategoriePaiements from './FormCategoriePaiements'
import AddIcon from '@material-ui/icons/Add'
import { Notification } from '../../../composants/controls/toast/MyToast'
import CryptFunc from '../../../functions/CryptFunc'
import GroupBy from '../../../functions/GroupBy'
import ReadCookie from '../../../functions/ReadCookie'
import { useMutation, useQuery, useQueryClient } from 'react-query'
// Style
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

function VueCategoriePaiementss(props) {
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Eléments paiements'][4]
  // droits insuffisants
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })
    setOpenNotif(true)
  }

  // Stats
  const [initialModal, setInitialModal] = useState({})
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [openModal, setOpenModal] = useState(false) // statut du modal suppression
  const [title, setTitle] = useState('')
  const [openOuiNon, setOpenOuiNon] = useState(false) // statut du modal suppression
  const [idSuppr, setIdSuppr] = useState('') // id  à editer ou supprimer ?

  // Variables
  const Api = 'categorie-paiements/ReadCategoriePaiements.php'
  const Query = ['listecategoriepaiements']
  const cookieInfo = ReadCookie()

  // Fermeture du modal
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  const handleCloseModalOuiNon = () => {
    setOpenOuiNon(false)
  }

  // ouverture du modal
  const handleOpenModal = (
    id = '',
    code = '',
    libelle = '',
  ) => {
    setInitialModal({
      id: id,
      code: code,
      libelle: libelle,
    })
    //Mise à jour du titre
    id === '' ? setTitle('Nouvelle Catégorie paiements ') : setTitle(`Modifier ${code}`)
    setOpenModal(true)
  }

  // Modal Supression
  const FuncSuppr = (id) => {
    setOpenOuiNon(true)
    setIdSuppr(id)
  }

  // suppression d'une  CategoriePaiements
  const supprCategoriePaiements = async (values) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }

    response = await axios.post(
      `categorie-paiements/DeleteCategoriePaiements.php?id=${values}`,
      { values },
      { headers },
    )
    handleCloseModalOuiNon()

    return response.data
  }

  // suppression d'une CategoriePaiements
  const supCategoriePaiements = useMutation(supprCategoriePaiements, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('listecategoriepaiements')
      console.log(data)
      setNotify({
        type: data.reponse,
        message: data.message,
      })
      setOpenNotif(true)
    },
    onError: (error) => {
      console.error(error)
      props.setNotify({
        message: 'Service indisponible',
        type: 'error',
      })
      props.setOpenNotif(true)
    },
  })

  // Mise à jour de la liste des retraits après mutation
  const queryClient = useQueryClient()

  // Entetes du tableau
  const tableHeader = [
    {
      field: 'id',
      hide: true,
      editable: false,
      headerName: 'id',
      width: 10,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_CATEGORIE_PAIEMENT',
      hide: false,
      editable: false,
      headerName: 'Code',
      width: 350,
      columnResizeIcon: true,
    },
    {
      field: 'LIB_CATEGORIE_PAIEMENT',
      hide: false,
      editable: false,
      headerName: 'Libellé',
      width: 550,
      columnResizeIcon: true,
    },
    
    {
      field: 'Actions',
      width: 125,
      align: 'center',
      renderCell: (e) => (
        <>
          <IconButton
            aria-label='update'
            size='small'
            onClick={() => {
              if (DroitsUser.droits_modifier == 1) {
                handleOpenModal(
                  e.row.id,
                  e.row.CODE_CATEGORIE_PAIEMENT,
                  e.row.LIB_CATEGORIE_PAIEMENT,
                  
                )
              }
            }}>
            <CreateIcon
              fontSize='inherit'
              color='default'
              className='CreateIcon'
            />
          </IconButton>
          <IconButton
            aria-label='delete'
            size='small'
            onClick={() => {
              DroitsUser.droits_supprimer == 1
                ? FuncSuppr(e.row.id)
                : noRightFunc()
            }}>
            <DeleteSweepIcon
              color='default'
              fontSize='inherit'
              className='DeleteSweepIcon'
            />
          </IconButton>
        </>
      ),
    },
  ]

  // Classe de style
  const classes = new useStyles()

  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />
      <BarreButtons
        buttons={
          <>
            <Buttons
              variant='contained'
              color='primary'
              size='small'
              onClick={() => {
                DroitsUser.droits_creer == 1 ? handleOpenModal() : noRightFunc()
              }}
              className={classes.button}
              startIcon={<AddIcon />}>
              Créer
            </Buttons>
          </>
        }
      />
      <Grid container>
        <Grid item xs={12}>
          <TableData
            columns={tableHeader}
            useQuery={Query}
            api={Api}
            Authorization={ReadCookie()}
          />
        </Grid>
      </Grid>
      <FormCategoriePaiements
        openModal={openModal}
        handleClose={handleCloseModal}
        initialModal={initialModal}
        titreModal={title}
        queryClient={queryClient}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
      />
      <ModalOuiNon
        open={openOuiNon}
        onClose={handleCloseModalOuiNon}
        titre='Supprimer?'
        message={'Voulez vous Supprimer cette catégorie ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => supCategoriePaiements.mutate(idSuppr)}
      />
      <Notification
        type={notify.type}
        message={notify.message}
        open={openNotif}
        setOpen={setOpenNotif}
      />
    </>
  )
}

export default VueCategoriePaiementss
