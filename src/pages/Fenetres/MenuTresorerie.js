/** @format */

import React from "react";
import { Grid } from "@material-ui/core";
import PageHeader from "../../composants/PageHeader";
import ListeSousMenu from "../../composants/controls/ListeSousMenu";
import GroupBy from "../../functions/GroupBy";
import Profils from "./Profils";
import { Switch, Route } from "react-router-dom";
import CryptFunc from "../../functions/CryptFunc";
import { v4 as uuidv4 } from "uuid";

function MenuTresorerie(props) {
  var MachaineDeCrypte = CryptFunc(localStorage.getItem("_Drt"), 0);
  const leMenu = GroupBy(MachaineDeCrypte);
  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />

      <Grid container spacing={3}>
        {GroupBy(MachaineDeCrypte) &&
          props.menu.map((a) => (
            <Grid item xs={12} md={6} lg={6} key={uuidv4()}>
              {<ListeSousMenu volet={a} adminGeneral={leMenu.group[a] || []} />}
            </Grid>
          ))}
      </Grid>
    </>
  );
  /*
 return(
   <></>
 ) */
}

export default React.memo(MenuTresorerie);
