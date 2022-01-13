/** @format */

import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import Container from '@material-ui/core/Container'
import { BrowserRouter as Router } from 'react-router-dom'
import IconUser from '../composants/controls/IconUser'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsIcon from '@material-ui/icons/Notifications'
import MenuPrincipal from '../composants/MenuPrincipal'
import Constantes from '../api/Constantes'
import BarRecherche from '../composants/controls/BarRecherche'
import { useHistory } from 'react-router-dom'
import CryptFunc from '../functions/CryptFunc'
import jwt from 'jsonwebtoken'
import Chemins from '../composants/routes/Chemins'
import IdleFunc from '../functions/IdleFunc'
import ControlJeton from '../functions/ControlJeton'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#ffffff',
    '& .MuiContainer-maxWidthLg': {
      maxWidth: '100%',
    },
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: -25,
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}))

export default function Accueil() {
  // ControlJeton()
  const [open, setOpen] = React.useState(true)
  const [infoCookie, setInfoCookie] = React.useState(true)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }
  const classes = useStyles()

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  // Controle du cookie
  var history = useHistory()

  useEffect(() => {
    //Checks if location.pathname is not "/".
    const idInt = setInterval(() => {
      var b = document.cookie.match('(^|;)\\s*_Jst\\s*=\\s*([^;]+)')
      if (b) {
        // controle de la validité du jeton
        try {
          //var JetonDecrypt = CryptFunc(b[2], 0)
          var jeton = jwt.verify(b[2], Constantes.token)
          setInfoCookie(b[2])
        } catch (error) {
          //jeton invalide
          // console.log(error)
          history.push('/')
        }
      } else {
        // Impossible de trouver le cookie donc déconnexion
        history.push('/')
      }
    }, 1000)

    return () => {
      clearInterval(idInt)
    }
  }, [])

  return (
    <div className={classes.root}>
      <style></style>
      <CssBaseline />
      <AppBar
        position='absolute'
        className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden,
            )}>
            <MenuIcon />
          </IconButton>
          <Typography
            component='h1'
            variant='h6'
            color='inherit'
            align='left'
            noWrap
            className={classes.title}>
            Dashboard
          </Typography>
          <BarRecherche />
          <IconButton color='inherit'>
            <Badge badgeContent={4} color='secondary'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconUser />
        </Toolbar>
      </AppBar>
      <Router>
        <Drawer
          variant='permanent'
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}>
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />

          <List>
            <MenuPrincipal />
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth='lg' className={classes.container}>
            <Chemins infoCookie={infoCookie} />
            <IdleFunc />
          </Container>
        </main>
      </Router>
    </div>
  )
}
