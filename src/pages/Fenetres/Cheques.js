/** @format **/

import React, { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import PageHeader from '../../composants/PageHeader'
import TableauBasic from '../../composants/tableaux/TableauBasic'
import { Paper, Grid } from '@material-ui/core'
import Controls from '../../composants/controls/Controls'
import Constantes from '../../api/Constantes'
import BarreButtons from '../../composants/BarreButtons'
import Buttons from '../../composants/controls/Buttons'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
import { Notification } from '../../composants/controls/toast/MyToast'
import CryptFunc from '../../functions/CryptFunc'
import GroupBy from '../../functions/GroupBy'
import axios from '../../api/axios'
import { jsPDF } from 'jspdf'
import pdfobject from 'pdfobject'
import PdfViewer from './PdfViewer'
import { NumberToLetter } from 'convertir-nombre-lettre'
import jwt from 'jsonwebtoken'
import { useCookies } from 'react-cookie'
import DecoupeMontant from '../../functions/DecoupeMontant'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

function Cheques(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [ouvrePdf, setOuvrePdf] = useState(false)
  const [visiblePdf, setVisiblePdf] = useState({ display: 'none' }) // Afficher/ Masquer le PDF
  const [opens_, setOpens_] = useState(false) // statut du modal suppression
  const [listId, setListId] = useState([]) // liste des chèques non imrpimés
  const [paie, setPaie] = useState([]) // compte sélectionnée
  const [position, setPosition] = useState([])
  const [idPdf, setIdPdf] = useState('')
  const [cookies, setCookie] = useCookies(['_Jst'])
  // Permet l'actualisation
  const queryClient = useQueryClient()
  // Fermeture de modal
  const handleCloseModal_ = () => {
    setOpens_(false)
  }

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Paiements'][0]
  // fonction pas assez de droits
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })
    setOpenNotif(true)
  }

  // Chargement des comptes avec le nombre de chèques à imprimer
  const fetchComptes = async () => {
    const response = await fetch(`${Constantes.URL}/nbrChqCpte.php`)
    return response.json()
  }
  const ListeCompte = useQuery(['ListeCompte'], fetchComptes)

  // Chargement de la liste des paiements à imprimer à la sélection du compte
  const Loadpaiements = async (cpte) => {
    // Chargement des paiements
    let responsePaie = await axios(
      `${Constantes.URL}/ChqAimprimer.php?cpte=${cpte}`,
    )
    setPaie(responsePaie.data.infos)
    // Chargement des positions
    let responsePosition = await axios(
      `${Constantes.URL}/mesuresCheque.php?cpte=${cpte}`,
    )
    setPosition(responsePosition.data.infos)
  }

  // Chargement de la liste des chèques sélectionnées
  const listCheques = []
  ListeCompte.status == 'success' &&
    paie.map((item) => {
      listId.includes(item.id) && listCheques.push(item)
    })
/*
    const decoupeFunc = (mot, longueur ) => {
      
      let premierePartie = mot.substring(0, longueur)
     let  lastSpace = premierePartie.lastIndexOf(" ")
      premierePartie = mot.substring(0, lastSpace)
      let deuxiemePartie = mot.substring(lastSpace + 1)
      console.log(premierePartie)
      console.log(deuxiemePartie)
    }
    */

  // Fonction d'affichage du pdf
  function showPDF() {
    const doc = new jsPDF({
      orientation: 'landscape',
    })

    //////////////////////////////////////////////////////////////////////////
    //////////////// // Positionnement des informations du chèque
    //////////////////////////////////////////////////////////////////////////
    /* POLICES PAR DEFAUT
    Courier
    Courier-Bold
    Courier-BoldOblique
    Courier-Oblique
    Helvetica
    Helvetica-Bold
    Helvetica-BoldOblique
    Helvetica-Oblique
    Symbol
    Times-Roman
    Times-Bold
    Time-Italic
    Time-BoldItalic
   */
    listCheques.map((page, key) => {
      key > 0 && doc.addPage() // Saut de page (si nbr de pages > 0)
      doc.setFontSize(12)
      doc.setFont('Courier-Bold')

      doc.text(
        page.BENEFICIAIRE_PAIEMENT,
        position[0].X_DESTINATAIRE,
        position[0].Y_DESTINATAIRE,
        'left',
      )
      doc.text(
        "*"+page.MONTANT_PAIEMENT2+"*",
        position[0].X_MONTCHIFFRE,
        position[0].Y_MONTCHIFFRE,
        'left',
      )
      doc.text(
        page.MOTIF_PAIEMENT,
        position[0].X_MOTIF,
        position[0].Y_MOTIF,
        'left',
      )
      // doc.text(page.date_fr, position[0].X_DATE, position[0].Y_DATE, 'left')
      doc.text(page.date_impr, position[0].X_DATE, position[0].Y_DATE, 'left')
      ///// montants en lettres
    let montantLettres = DecoupeMontant( NumberToLetter(page.entier) + ' francs', position[0].LONG_BAR_CFR_LTR)
      doc.text(
       montantLettres.un,
        position[0].X_MONTLETTRE1,
        position[0].Y_MONTLETTRE1,
        'left',
      )
      
        doc.text(
         montantLettres.deux,
          position[0].X_MONTLETTRE2,
          position[0].Y_MONTLETTRE2,
          'left',
        )
      
      
      // ville
        doc.text(
        position[0].SIEGE_SOCIAL,
          position[0].X_VILLE,
          position[0].Y_VILLE,
          'left',
        )
     
        
////////////////////////COUPON

doc.text(
  page.BENEFICIAIRE_PAIEMENT,
  position[0].X_BENEF_COUP,
  position[0].Y_BENEF_COUP,
  'left',
)
doc.text(
  "*"+page.MONTANT_PAIEMENT2+"*",
  position[0].X_MONT_COUP,
  position[0].Y_MONT_COUP,
  'left',
)
doc.text(
  page.date_impr,
  position[0].X_DATE_COUP,
  position[0].Y_DATE_COUP,
  'left',
)
 


    })

    //////////////////////////////////////////////////////////////////////////
    //////////////// // Positionnement des informations du chèque
    //////////////////////////////////////////////////////////////////////////
    
    let login_user = ''

    //recuperation des infos depuis le cookie
    try {
      // Renvoi un objet contenant les informations du TOKEN
      var infos = cookies._Jst
      var decoded = jwt.verify(infos, Constantes.token)
      login_user = decoded.user_login
    } catch (e) {
      console.log(e)
    }

    // Optional - set properties on the document
    doc.setProperties({
      title: 'Impression chèques',
      subject: 'Impression automatique de chèques',
      author: login_user,
      keywords: 'chèque, édition, Tréso',
      creator: 'Tréso App',
    })
    // Affichage du document
    var result = doc.output('dataurlstring', { filename: 'Chèque.pdf' })

    pdfobject.embed(result, '#elemEmb', {
      width: '75rem',
      height: '35rem',
      id: 'embeded',
      fallbackLink: '<p>Affichage impossible</p>',
    })
    setVisiblePdf({ display: 'block' })
  }

  function hidePdf() {
    setVisiblePdf({ display: 'none' })
  }

  //   console.log(listCheques[0])
  const imprime = () => {
    if (DroitsUser.droits_creer == 1) {
      setOuvrePdf(true)
      showPDF()
    } else {
      noRightFunc()
    }
  }

  const retourList = () => {
    hidePdf()
    setListId([])
    setOuvrePdf(false)
  }

  // console.log(ouvrePdf)
  console.log(position[0])
  //console.log(listCheques)

  const classes = useStyles()

  // Entetes du tableau
  const enteteTableComppes = [
    {
      field: 'id',
      hide: false,
      editable: false,
      headerName: 'Code',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'LibCompte',
      hide: false,
      editable: false,
      headerName: 'Description',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'nombre',
      hide: false,
      editable: false,
      headerName: 'Nombre',
      width: 100,
      columnResizeIcon: true,
    },
  ]

  const enteteTablePaiements = [
    {
      field: 'id',
      hide: true,
      editable: false,
      headerName: 'ID',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'BENEFICIAIRE_PAIEMENT',
      hide: false,
      editable: false,
      headerName: 'Bénéficiaire',
      width: 300,
      columnResizeIcon: true,
    },
    {
      field: 'MONTANT_PAIEMENT',
      hide: false,
      editable: false,
      headerName: 'Montant',
      width: 150,
      columnResizeIcon: true,
      type: 'number',
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value).toLocaleString()
        return `${valueFormatted}`
      },
      valueParser: (value) => Number(value),
    },
    {
      field: 'MOTIF_PAIEMENT',
      hide: false,
      editable: false,
      headerName: 'Motif',
      width: 300,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_BUDGET_PAIE',
      hide: false,
      editable: false,
      headerName: 'Budget',
      width: 150,
      columnResizeIcon: true,
    },
  ]
  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />

      <BarreButtons
        buttons={
          <>
            <div style={{ textAlign: 'left' }}>
              {ouvrePdf ? (
                <Buttons
                  disabled={false}
                  variant='contained'
                  color='primary'
                  size='small'
                  onClick={() => {
                    retourList()
                  }}
                  className={classes.button}
                  startIcon={
                    <ArrowBackIcon
                      color='default'
                      fontSize='inherit'
                      className='CreateIcon'
                    />
                  }>
                  Retour
                </Buttons>
              ) : (
                <Buttons
                  disabled={listId.length === 0}
                  variant='contained'
                  color='primary'
                  size='small'
                  onClick={() => {
                    imprime()
                  }}
                  className={classes.button}
                  startIcon={
                    <AddIcon
                      color='default'
                      fontSize='inherit'
                      className='CreateIcon'
                    />
                  }>
                  Imprimer
                </Buttons>
              )}
            </div>
          </>
        }
      />

      {ListeCompte.status === 'loading' ? (
        <Paper elevation={0} className='paperLoad'>
          <Controls.SpinnerBase />
        </Paper>
      ) : (
        <>
          {ouvrePdf || (
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <TableauBasic
                  style={{ height: 550, width: '100%', cursor: 'pointer' }}
                  disableSelectionOnClick={true}
                  col={enteteTableComppes}
                  donnees={ListeCompte.data.infos}
                  onRowClick={(e) => {
                    Loadpaiements(e.row.id)
                  }}
                  pagination
                  autoHeight
                  disableColumnMenu
                  pageSize={50}
                />
              </Grid>
              <Grid item xs={8}>
                <TableauBasic
                  style={{ height: 550, width: '100%' }}
                  disableSelectionOnClick={true}
                  col={enteteTablePaiements}
                  donnees={paie}
                  onSelectionModelChange={(e) => {
                    setListId(e)
                  }}
                  checkboxSelection={true}
                  pagination
                  autoHeight
                  pageSize={50}
                />
              </Grid>
            </Grid>
          )}
          <div id='elemEmb' style={visiblePdf}></div>
        </>
      )}

      {/* <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre={'Confirmer impression !'}
        message={'Voulez vous imprimer ce(s) chèque(s) ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => ouvrePdfImprime()}
      /> */}
      <Notification
        type={notify.type}
        message={notify.message}
        open={openNotif}
        setOpen={setOpenNotif}
      />
    </>
  )
}

export default Cheques
