/** @format */

import React, { useState } from 'react'
import { frFR, XGrid } from '@material-ui/x-grid'
import { createMuiTheme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'

const defaultTheme = createMuiTheme()
const useStyles = makeStyles(
  (theme) => ({
    root: {
      padding: theme.spacing(0.5, 0.5, 0),
      justifyContent: 'space-between',
      display: 'flex',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    },
    textField: {
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
      margin: theme.spacing(1, 0.5, 1.5),
      '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(0.5),
      },
      '& .MuiInput-underline:before': {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
  }),
  { defaultTheme },
)

function TableauBasic(props) {
  const [dates, setDates] = useState(props.dates || '')
  // Entete et lignes du tableau
  const datax = {
    columns: props.col,
    rows: props.donnees,
  }
  // style={{ height: 550, width: '100%', cursor: 'pointer' }}
  return (
    <div style={{ height: 550, width: '100%', cursor: 'pointer' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <XGrid
            density='compact'
            {...datax}
            localeText={frFR.props.MuiDataGrid.localeText}
            rowHeight={40}
            onRowClick={props.onRowClick}
            checkboxSelection={false}
            {...props}
          />
        </div>
      </div>
    </div>
  )
}
export default React.memo(TableauBasic)
