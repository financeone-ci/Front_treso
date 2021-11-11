import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import PageHeader from '../../composants/PageHeader'
import GroupBy from '../../functions/GroupBy';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';
import List from '@material-ui/core/List';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: '50px'
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export default function TestAdministration(props) {
  const classes = useStyles();
  const leMenu = GroupBy(JSON.parse(localStorage.getItem('droit')))

  return (
      <>
       <PageHeader icone={props.icone} titrePage={props.titre} />
    <div className={classes.root}>
    <Grid container spacing={3}>
        {GroupBy(JSON.parse(localStorage.getItem('droit'))) &&
          props.menu.map((a) => (
            <>
            <Grid item xs={12} md={6} lg={6} className="bloc-sous-menu">

            <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src="https://cdn.pixabay.com/photo/2016/01/22/21/10/dollar-1156662_960_720.png" />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h5" style={{textDecoration: 'underline'}} >
                {a}
                </Typography>
                <List dense>
                
               {
                   leMenu.group[a].length > 0 && (
                    leMenu.group[a].map((item)=>
                    <ListItem button>
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary={item.e_smenu_libelle} />
      </ListItem>
                    ) 
                   )
               }

                </List>
              </Grid>
              <Grid item>
                <Typography variant="body2" style={{ cursor: 'pointer', fontStyle: 'italic' }}>
                  plus d'infos
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">{props.icone}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper></Grid>
            
              {/*<Grid item xs={12} md={6} lg={6}>
                  
                {
                  <ListeSousMenu
                    volet={a}
                    adminGeneral={leMenu.group[a] || []}
                  />
                }
              </Grid>*/}
            </>
          ))}
      </Grid>
    </div>
    </>
  );
}
