/** @format */
import React, { useEffect, useState } from 'react'
import PageHeader from '../../composants/PageHeader'
import TableauBasic from '../../composants/tableaux/TableauBasic'
import { Paper, Grid } from '@material-ui/core'
import Controls from '../../composants/controls/Controls'
import Constantes from '../../api/Constantes'
import BarreButtons from '../../composants/BarreButtons'
import Buttons from '../../composants/controls/Buttons'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import axios from '../../api/axios'
import { Notification } from '../../composants/controls/toast/MyToast'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import SearchIcon from '@material-ui/icons/Search'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
import CryptFunc from '../../functions/CryptFunc'
import GroupBy from '../../functions/GroupBy'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

function Rejets(props) {
  // fonction de formatage date
  let today = new Date()
  let today2 = new Date()
  let dd = today.getDate()

  let mm = today.getMonth() + 1

  const yyyy = today.getFullYear()
  if (dd < 10) {
    dd = `0${dd}`
  }

  if (mm < 10) {
    mm = `0${mm}`
  }
  today = `${yyyy}-${mm}-${dd}`
  today2 = `${yyyy}-${mm}-${dd - 1}`

  // valeurs initiales
  const [listRejets, setListRejets] = useState([])
  const [listId, setListId] = useState([])
  const [initial, setInitial] = useState({ debut: today, fin: today })
  const [loader, setLoader] = useState(false)
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  // valeurs initiales
  const [openNotif, setOpenNotif] = useState(false)
  const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
  const [idRejet, setIdRejet] = useState()

  const handleCloseModal_ = () => {
    setOpens_(false)
  }

  // Suppression des rejets
  const SupRejets = () => {
    axios({
      url: `/fichier/rejets.php?type=D&id=${listId}`,
    })
      .then((response) => {
        if (response.data.reponse == 'success') {
          setListId("")
          setNotify({
            type: response.data.reponse,
            message: response.data.message,
          })
          setOpenNotif(true)
          //////////////////
          setLoader(true)
          fetch(
            Constantes.URL +
              '/fichier/rejets.php?type=R&debut=' +
              initial.debut +
              '&fin=' +
              initial.fin,
          )
            .then((response) => response.json())
            .then((data) => {
              setListRejets(data.infos)
            })
          setLoader(false)
          ///////////////////
        } else {
          setNotify({
            type: 'error',
            message: response.data.message,
          })
          setOpenNotif(true)
        }
      })
      .catch((error) => {
        console.log(error)
      })
    setOpens_(false)
  }

  // Chargé la liste des rejets
  const LoadRejet = (values) => {
    // Mise à jour des states des dates
    axios({
      url: `/fichier/rejets.php?type=R&debut=${values.debut}&fin=${values.fin}`,
    })
      .then((response) => {
        // setLoader(true)
        if (response.data.reponse == 'success') {
          setListRejets(response.data.infos)
          setInitial({ debut: values.debut, fin: values.fin })
          // setLoader(false)
        } else {
          setNotify({
            type: 'error',
            message: response.data.message,
          })
          setOpenNotif(true)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Entetes du tableau
  const enteteCol = [
    {
      field: 'id',
      hide: true,
      editable: false,
      headerName: 'id',
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: 'IDIMPORT',
      hide: true,
      editable: false,
      headerName: 'idimport',
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'MOTIF_REJET',
      hide: false,
      editable: false,
      headerName: 'Motif rejet',
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'TAXE',
      hide: false,
      editable: false,
      headerName: 'Taxe',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'NUM_ENGAGEMENT',
      hide: false,
      editable: false,
      headerName: 'N° Engagement',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'REF_BENEFICIAIRE',
      hide: false,
      editable: false,
      headerName: 'Réf. Bénéficiaire',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'BENEFICIAIRE',
      hide: false,
      editable: false,
      headerName: 'Bénéficiaire',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'MONTANT',
      hide: false,
      editable: false,
      headerName: 'Montant',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'NUM_BON',
      hide: false,
      editable: false,
      headerName: 'N° Bon commande',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'MOTIF',
      hide: false,
      editable: false,
      headerName: 'Motif engagement',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'DATE_ECHEANCE',
      hide: false,
      editable: false,
      headerName: 'Date échéance',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'CODE_BUDGET',
      hide: false,
      editable: false,
      headerName: 'Code Budgetaire',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'DATE_ENGAGEMENT',
      hide: false,
      editable: false,
      headerName: 'Date engagement',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'REF_MARCHE',
      hide: false,
      editable: false,
      headerName: 'Réf. Marche',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'RETENUE',
      hide: false,
      editable: false,
      headerName: 'retenue',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'DATE_REJET',
      hide: false,
      editable: false,
      headerName: 'Date rejet',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'DATE_IMPORTATION',
      hide: false,
      editable: false,
      headerName: 'Date importation',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
  ]

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Intégrations'][2]

  // fonction pas assez de droits
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })
    setOpenNotif(true)
  }

  const schema = yup.object().shape({
    debut: yup.date('Date invalide').max(yup.ref('fin'), 'Période invalide'),
    fin: yup
      .date('Date invalide')
      .min(yup.ref('debut'), 'Période invalide')
      .max(new Date(), 'Période invalide'),
  })

  useEffect(() => {
    setLoader(true)
    fetch(
      Constantes.URL +
        '/fichier/rejets.php?type=R&debut=' +
        initial.debut +
        '&fin=' +
        initial.fin,
    )
      .then((response) => response.json())
      .then((data) => {
        setListRejets(data.infos)
      })
    setLoader(false)
  }, [])

  const classes = useStyles()

  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />
      <BarreButtons
        buttons={
          <div style={{ textAlign: 'right' }}>
            
             
                <Buttons
                  variant='contained'
                  color='secondary'
                  disabled = {listId.length == 0 }
                  size='small'
                  onClick={() => {
                    DroitsUser.droits_supprimer == 1
                      ? setOpens_(true)
                      : noRightFunc()
                  }}
                  className={classes.button}
                  startIcon={<DeleteIcon />}>
                  Supprimer
                </Buttons>

                <Buttons
                  variant='contained'
                  color='secondary'
                  size='small'
                  onClick={() => {
                    DroitsUser.droits_supprimer == 1
                      ? setOpens_(true)
                      : noRightFunc()
                  }}
                  className={classes.button}
                  startIcon={<DeleteIcon />}>
                  Purger
                </Buttons>
             
          
            <Formik
              noValidate
              initialValues={{
                debut: initial.debut,
                fin: initial.fin,
              }}
              validationSchema={schema}
              onSubmit={(values, onSubmitProps) => {
                setInitial({
                  debut: values.debut,
                  fin: values.fin,
                })
                LoadRejet(values)
              }}>
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <Form>
                  <Controls.TextInput
                    margin='normal'
                    id='debut'
                    type='date'
                    helperText={errors.debut}
                    error={errors.debut && true}
                    size='small'
                    name='debut'
                  />
                  <Controls.TextInput
                    margin='normal'
                    id='fin'
                    type='date'
                    helperText={errors.fin}
                    error={errors.fin && true}
                    name='fin'
                    style={{ marginLeft: '5px' }}
                  />
                  <Buttons
                    style={{ marginTop: '16px' }}
                    variant='contained'
                    color='default'
                    size='large'
                    className={classes.button}
                    startIcon={<SearchIcon fontSize='large' />}></Buttons>
                </Form>
              )}
            </Formik>
          </div>
        }
      />

      {loader ? (
        <Paper elevation={0} className='paperLoad'>
          <Controls.SpinnerBase />
        </Paper>
      ) : (
        <Grid container>
          <Grid item xs={12}>
            {/**  */}
            <TableauBasic
              disableSelectionOnClick={true}
              col={enteteCol}
              donnees={listRejets}
              onSelectionModelChange={(e) => {
                setListId(e)
              }}
              checkboxSelection={true}
              pagination
              pageSize={50}
            />
          </Grid>{' '}
        </Grid>
      )}
      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre='Supprimer?'
        message={'Voulez vous supprimer ce(s) rejet(s) ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => SupRejets()}
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

export default Rejets
