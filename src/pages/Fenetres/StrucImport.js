/** @format */
import React, { useEffect, useState } from "react";
import PageHeader from "../../composants/PageHeader";
import TableauBasic from "../../composants/tableaux/TableauBasic";
import { Paper, Grid } from "@material-ui/core";
import Controls from "../../composants/controls/Controls";
import Constantes from "../../api/Constantes";
import BarreButtons from "../../composants/BarreButtons";
import Buttons from "../../composants/controls/Buttons";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import StrucImportForm from "./StrucImportForm";
import CreateIcon from "@material-ui/icons/Create";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import IconButton from "@material-ui/core/IconButton";
import ModalOuiNon from "../../composants/controls/modal/ModalOuiNon";
import axios from "../../api/axios";
import { Notification } from "../../composants/controls/toast/MyToast";
import CryptFunc from "../../functions/CryptFunc";
import GroupBy from "../../functions/GroupBy";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

function StrucImport(props) {
  // Lignes du tableau

  const [listStrucImport, setListStrucImport] = useState([]);
  const [loader, setLoader] = useState(false);
  const [openStrucImport, setOpenStrucImport] = useState(false);

  // valeurs initiales
  const [openNotif, setOpenNotif] = useState(false);

  const [opens_, setOpens_] = React.useState(false); // statut du modal suppression
  const [idProf, setidProf] = React.useState(""); // idprofil à editer ou supprimer?
  const [init, setInit] = useState({
    id: 0,
    code: "",
    description: "",
    pos_taxe: 0,
    pos_benef: 0,
    pos_ref_benef: 0,
    pos_montant: 0,
    pos_num: 0,
    pos_num_bon: 0,
    pos_motif: 0,
    pos_echeance: 0,
    pos_budget: 0,
    pos_date: 0,
    pos_marche: 0,
    pos_retenue: 0,
  });

  const [notify, setNotify] = useState({
    type: "",
    message: "",
  });

  const handleCloseModal_ = () => {
    setOpens_(false);
  };

  //Supression du Structure
  const StopCnx = (id) => {
    axios({
      url: `/Strucimport.php?type=D&id=${id}`,
    })
      .then((response) => {
        if (response.data.reponse == "success") {
          setNotify({
            type: response.data.reponse,
            message: response.data.message,
          });
          setOpenNotif(true);
          //////////////////
          setLoader(true);

          fetch(Constantes.URL + "StrucImport.php?type=R")
            .then((response) => response.json())
            .then((data) => setListStrucImport(data.infos));
          setLoader(false);
          ///////////////////
        } else {
          setNotify({
            type: "error",
            message: response.data.message,
          });
          setOpenNotif(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setOpens_(false);
  };

  // Modal Supression de la structure
  const FuncSuppr = (id) => {
    setOpens_(true);
    setidProf(id);
  };

  // Entetes du tableau
  const enteteCol = [
    {
      field: "id",
      hide: true,
      editable: false,
      headerName: "id",
      width: 20,
      columnResizeIcon: true,
    },
    {
      field: "code",
      hide: false,
      editable: false,
      headerName: "Code Structure",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "description",
      hide: false,
      editable: false,
      headerName: "Description",
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: "pos_taxe",
      hide: false,
      editable: false,
      headerName: "Taxe",
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: "pos_benef",
      hide: false,
      editable: false,
      headerName: "Bénéficiaire",
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: "pos_ref_benef",
      hide: false,
      editable: false,
      headerName: "Référence Bénéf",
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: "pos_montant",
      hide: false,
      editable: false,
      headerName: "Montant",
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: "pos_num",
      hide: false,
      editable: false,
      headerName: "N° Engagement",
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: "pos_num_bon",
      hide: false,
      editable: false,
      headerName: "N° bon commande",
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: "pos_motif",
      hide: false,
      editable: false,
      headerName: "Motif",
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: "pos_echeance",
      hide: false,
      editable: false,
      headerName: "Echéance",
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: "pos_budget",
      hide: false,
      editable: false,
      headerName: "Budget",
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: "pos_date",
      hide: false,
      editable: false,
      headerName: "Date",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "pos_marche",
      hide: false,
      editable: false,
      headerName: "Marche",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "pos_retenue",
      hide: false,
      editable: false,
      headerName: "Retenue",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "Actions",
      width: 125,
      align: "center",
      renderCell: (e) => (
        <>
          <IconButton
            aria-label="update"
            size="small"
            onClick={() => {
              DroitsUser.droits_modifier == 1
                ? handleClickOpenStrucImport(
                    e.row.id,
                    e.row.code,
                    e.row.description,
                    e.row.pos_taxe,
                    e.row.pos_benef,
                    e.row.pos_ref_benef,
                    e.row.pos_montant,
                    e.row.pos_num,
                    e.row.pos_num_bon,
                    e.row.pos_motif,
                    e.row.pos_echeance,
                    e.row.pos_budget,
                    e.row.pos_date,
                    e.row.pos_marche,
                    e.row.pos_retenue
                  )
                : noRightFunc();
            }}
          >
            <CreateIcon
              fontSize="inherit"
              color="default"
              className="CreateIcon"
            />
          </IconButton>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => {
              DroitsUser.droits_supprimer == 1
                ? FuncSuppr(e.row.id)
                : noRightFunc();
            }}
          >
            <DeleteSweepIcon
              color="default"
              fontSize="inherit"
              className="DeleteSweepIcon"
            />
          </IconButton>
        </>
      ),
    },
  ];

  // recuperation des Structures

  useEffect(() => {
    setLoader(true);
    fetch(Constantes.URL + "/Strucimport.php?type=R")
      .then((response) => response.json())
      .then((data) => {
        setListStrucImport(data.infos);
      });
    setLoader(false);
  }, []);

  //Ouverture modal Structure
  const handleClickOpenStrucImport = (
    id = 0,
    code = "",
    description = "",
    pos_taxe = 0,
    pos_benef = 0,
    pos_ref_benef = 0,
    pos_montant = 0,
    pos_num = 0,
    pos_num_bon = 0,
    pos_motif = 0,
    pos_echeance = 0,
    pos_budget = 0,
    pos_date = 0,
    pos_marche = 0,
    pos_retenue = 0
  ) => {
    setInit({
      id: id,
      code: code,
      description: description,
      pos_taxe: pos_taxe,
      pos_benef: pos_benef,
      pos_ref_benef: pos_ref_benef,
      pos_montant: pos_montant,
      pos_num: pos_num,
      pos_num_bon: pos_num_bon,
      pos_motif: pos_motif,
      pos_echeance: pos_echeance,
      pos_budget: pos_budget,
      pos_date: pos_date,
      pos_marche: pos_marche,
      pos_retenue: pos_retenue,
    });

    setOpenStrucImport(true);
  };
  const handleCloseStrucImport = () => {
    setOpenStrucImport(false);
  };

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem("_Drt"), 0);
  const leMenu = GroupBy(MachaineDeCrypte);
  const DroitsUser = leMenu.group["interfaces"][0];

  // fonction pas assez de droits
  const noRightFunc = () => {
    setNotify({
      type: "error",
      message: "Droits insuffisants",
    });

    setOpenNotif(true);
  };

  const classes = useStyles();

  //console.log(DroitsUser)

  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />

      <BarreButtons
        buttons={
          <>
            <Buttons
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                DroitsUser.droits_creer == 1
                  ? handleClickOpenStrucImport()
                  : noRightFunc();
              }}
              className={classes.button}
              startIcon={<AddIcon />}
            >
              Créer
            </Buttons>
          </>
        }
      />
      {loader ? (
        <Paper elevation={0} className="paperLoad">
          <Controls.SpinnerBase />
        </Paper>
      ) : (
        <Grid container>
          <Grid item xs={12}>
            {/**  */}
            <TableauBasic
              disableSelectionOnClick={true}
              col={enteteCol}
              donnees={listStrucImport}
              onRowClick={(e) => {}}
              pagination
            />
          </Grid>{" "}
          <StrucImportForm
            setListStrucImport={setListStrucImport}
            initial_={init}
            handleClose={handleCloseStrucImport}
            open={openStrucImport}
            titreModal={
              init.id == ""
                ? "Nouvelle Structure"
                : "Modifier Structure: " + init.code
            }
            infoCookie={props.infoCookie}
          />
        </Grid>
      )}
      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre={"Supprimer ?"}
        message={"Voulez vous Supprimer cette structure ?"}
        non="Annuler"
        oui="Oui"
        deconnect={() => StopCnx(idProf)}
      />
      <Notification
        type={notify.type}
        message={notify.message}
        open={openNotif}
        setOpen={setOpenNotif}
      />
    </>
  );
}

export default StrucImport;
