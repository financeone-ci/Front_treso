/** @format */

import React from "react";
import { Grid } from "@material-ui/core";
import PageHeader from "../../composants/PageHeader";
import ListeSousMenu from "../../composants/controls/ListeSousMenu";
import GroupBy from "../../functions/GroupBy";
import CryptFunc from "../../functions/CryptFunc";
import { v4 as uuidv4 } from "uuid";

function Parametrage(props) {
  var MachaineDeCrypte = CryptFunc(localStorage.getItem("_Drt"), 0);
  const leMenu = GroupBy(MachaineDeCrypte);

  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />

      <Grid container spacing={3}>
        {GroupBy(MachaineDeCrypte) &&
          props.menu.map((a) => (
            <Grid item xs={12} md={6} lg={6} key={uuidv4()}>
              {<ListeSousMenu volet={a} adminGeneral={leMenu.group[a]} />}
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default React.memo(Parametrage);
