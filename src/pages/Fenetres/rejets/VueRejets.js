/** @format */

import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../composants/PageHeader";
import TableData from "../../../composants/tableaux/TableData";
import { Paper, Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import Controls from "../../../composants/controls/Controls";
import BarreButtons from "../../../composants/BarreButtons";
import Buttons from "../../../composants/controls/Buttons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CreateIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import ModalOuiNon from "../../../composants/controls/modal/ModalOuiNon";
import axios from "../../../api/axios";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import AddIcon from "@material-ui/icons/Add";
import { Notification } from "../../../composants/controls/toast/MyToast";
import CryptFunc from "../../../functions/CryptFunc";
import GroupBy from "../../../functions/GroupBy";
import ReadCookie from "../../../functions/ReadCookie";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Formik, Form, Field, useField, ErrorMessage } from "formik";
import * as yup from "yup";
import SearchIcon from "@material-ui/icons/Search";
// Style
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));
const schema = yup.object().shape({
  debut: yup.date("Date invalide").max(yup.ref("fin"), "Période invalide"),
  fin: yup
    .date("Date invalide")
    .min(yup.ref("debut"), "Période invalide")
    .max(new Date(), "Période invalide"),
});

function VueImport(props) {
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem("_Drt"), 0);
  const leMenu = GroupBy(MachaineDeCrypte);
  const DroitsUser = leMenu.group["Intégrations"][2];
  // droits insuffisants
  const noRightFunc = () => {
    setNotify({
      type: "error",
      message: "Droits insuffisants",
    });
    setOpenNotif(true);
  };
  ///// formattage de la date
  let today = new Date();
  let today2 = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }
  today = `${yyyy}-${mm}-${dd}`;
  today2 = `${yyyy}-${mm}-${dd - 1}`;

  const [initial, setInitial] = useState({ debut: today, fin: today });
  // Stats
  const [notify, setNotify] = useState({
    type: "",
    message: "",
  });
  const [openNotif, setOpenNotif] = useState(false);
  const [openOuiNon, setOpenOuiNon] = useState(false); // statut du modal suppression
  const [idSuppr, setIdSuppr] = useState([]); // id  à editer ou supprimer ?
  // const [idSuppr, setIdSuppr] = useState('') // id  à editer ou supprimer ?

  // Variables
  const [Api, setApi] = useState("rejets/ReadRejets.php");
  const Query = ["listeRejets"];
  const cookieInfo = ReadCookie();

  const handleCloseModalOuiNon = () => {
    setOpenOuiNon(false);
  };

  // Modal Supression
  const FuncSuppr = (id) => {
    setOpenOuiNon(true);
    setIdSuppr(id);
  };

  // Mise à jour de la liste des retraits après mutation
  const queryClient = useQueryClient();

  // suppression d'une  devise
  const periodUpd = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };

    response = await axios.post(
      `rejets/ReadRejets.php?debut=${values.debut}&fin=${values.fin}`,
      { values },
      { headers }
    );
    setApi(`rejets/ReadRejets.php?debut=${values.debut}&fin=${values.fin}`);
    // console.log(response);
    /* handleCloseModalOuiNon();
     */

    return response.data;
  };

  // suppression d'une devise
  const periodUpdater = useMutation(periodUpd, {
    onSuccess: async (data) => {
      setIdSuppr([]);
      queryClient.setQueryData(["listeRejets"], data);
      setNotify({
        type: data.reponse,
        message: "Affichage de " + data.infos.length + " résultat(s)",
      });
      setOpenNotif(true);
    },
    onError: (error) => {
      console.error(error);
      props.setNotify({
        message: "Service indisponible",
        type: "error",
      });
      props.setOpenNotif(true);
    },
  });

  // console.log(periodUpdater.isLoading);

  // suppression d'une  devise
  const supprDevise = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };

    response = await axios.post(
      `rejets/DeleteRejets.php?id=${values}`,
      { values },
      { headers }
    );
    handleCloseModalOuiNon();
    return response.data;
  };

  // suppression d'une devise
  const supDevise = useMutation(supprDevise, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("listeRejets");
      setNotify({
        type: data.reponse,
        message: data.message,
      });
      setOpenNotif(true);
    },
    onError: (error) => {
      console.error(error);
      props.setNotify({
        message: "Service indisponible",
        type: "error",
      });
      props.setOpenNotif(true);
    },
  });

  // Entetes du tableau
  const tableHeader = [
    {
      field: "id",
      hide: true,
      editable: false,
      headerName: "id",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "IDIMPORT",
      hide: true,
      editable: false,
      headerName: "idimport",
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "MOTIF_REJET",
      hide: false,
      editable: false,
      headerName: "Motif rejet",
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "TAXE",
      hide: false,
      editable: false,
      headerName: "Taxe",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "NUM_ENGAGEMENT",
      hide: false,
      editable: false,
      headerName: "N° Engagement",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "REF_BENEFICIAIRE",
      hide: false,
      editable: false,
      headerName: "Réf. Bénéficiaire",
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: "BENEFICIAIRE",
      hide: false,
      editable: false,
      headerName: "Bénéficiaire",
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: "MONTANT",
      hide: false,
      editable: false,
      headerName: "Montant",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "NUM_BON",
      hide: false,
      editable: false,
      headerName: "N° Bon commande",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "MOTIF",
      hide: false,
      editable: false,
      headerName: "Motif engagement",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "DATE_ECHEANCE",
      hide: false,
      editable: false,
      headerName: "Date échéance",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "CODE_BUDGET",
      hide: false,
      editable: false,
      headerName: "Code Budgetaire",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "DATE_ENGAGEMENT",
      hide: false,
      editable: false,
      headerName: "Date engagement",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "REF_MARCHE",
      hide: false,
      editable: false,
      headerName: "Réf. Marche",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "RETENUE",
      hide: false,
      editable: false,
      headerName: "retenue",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "DATE_REJET",
      hide: false,
      editable: false,
      headerName: "Date rejet",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "DATE_IMPORTATION",
      hide: false,
      editable: false,
      headerName: "Date importation",
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
  ];

  // Classe de style
  const classes = new useStyles();
  useEffect(() => {}, [initial]);

  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />
      <BarreButtons
        buttons={
          <Grid container>
            <Grid item xs={3}>
              <Buttons
                variant="contained"
                color="primary"
                size="small"
                disabled={idSuppr.length == 0}
                onClick={(e) => {
                  DroitsUser.droits_supprimer == 1
                    ? FuncSuppr(idSuppr)
                    : noRightFunc();
                }}
                className={classes.button}
                startIcon={<DeleteSweepIcon />}
              >
                Supprimer {idSuppr.length}
              </Buttons>
            </Grid>
            <Grid item xs={9} style={{ textAlign: "right" }}>
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
                  });

                  periodUpdater.mutate(values, {
                    onSuccess: (e) => {},
                    onError: (e) => {
                      console.log(e);
                    },
                  });
                }}
              >
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
                      margin="normal"
                      id="debut"
                      type="date"
                      helperText={errors.debut}
                      error={errors.debut && true}
                      size="small"
                      name="debut"
                    />
                    <Controls.TextInput
                      margin="normal"
                      id="fin"
                      type="date"
                      helperText={errors.fin}
                      error={errors.fin && true}
                      name="fin"
                      style={{ marginLeft: "5px" }}
                    />
                    <Buttons
                      style={{ marginTop: "16px" }}
                      variant="contained"
                      color="default"
                      size="large"
                      className={classes.button}
                      startIcon={<SearchIcon fontSize="large" />}
                    ></Buttons>
                  </Form>
                )}
              </Formik>
            </Grid>
          </Grid>
        }
      />
      <Grid container>
        <Grid item xs={12}>
          {periodUpdater.isLoading ? (
            <Paper elevation={0} className="paperLoad">
              <Controls.SpinnerBase />
            </Paper>
          ) : (
            <TableData
              columns={tableHeader}
              useQuery={Query}
              api={Api}
              Authorization={ReadCookie()}
              checkboxSelection
              onSelectionModelChange={(e) => setIdSuppr(e)}
            />
          )}
        </Grid>
      </Grid>

      <ModalOuiNon
        open={openOuiNon}
        onClose={handleCloseModalOuiNon}
        titre="Supprimer?"
        message={"Voulez vous Supprimer ?"}
        non="Annuler"
        oui="Oui"
        deconnect={() => supDevise.mutate(idSuppr)}
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

export default VueImport;
