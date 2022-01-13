/** @format */

import React, { useState } from 'react'
import { frFR, XGrid } from '@material-ui/x-grid'
import { createMuiTheme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import { useQuery } from 'react-query'
import axios from '../../api/axios'
import { Paper } from '@material-ui/core'
import Controls from '../../composants/controls/Controls'

// const defaultTheme = createMuiTheme()
// const useStyles = makeStyles(
//   (theme) => ({
//     root: {
//       padding: theme.spacing(0.5, 0.5, 0),
//       justifyContent: 'space-between',
//       display: 'flex',
//       alignItems: 'flex-start',
//       flexWrap: 'wrap',
//     },
//     textField: {
//       [theme.breakpoints.down('xs')]: {
//         width: '100%',
//       },
//       margin: theme.spacing(1, 0.5, 1.5),
//       '& .MuiSvgIcon-root': {
//         marginRight: theme.spacing(0.5),
//       },
//       '& .MuiInput-underline:before': {
//         borderBottom: `1px solid ${theme.palette.divider}`,
//       },
//     },
//   }),
//   { defaultTheme },
// )

function TableData(props) {
  const [dataTable, setDataTable] = useState([])
  const [tableColumns, setTableColumns] = useState(props.columns)
  // Chargement des données
  const fetchData = async () => {
    const headers = {
      Authorization: props.Authorization,
    }
    let response = await axios(props.api, {
      headers,
    })
    return response
  }

  const VueData = useQuery(props.useQuery, fetchData, {
    onSuccess: (data) => {
      setDataTable(data.data.infos)
    },
  })

  return (
    <>
      {VueData.isLoading ? (
        <Paper elevation={0} className='paperLoad'>
          <Controls.SpinnerBase />
        </Paper>
      ) : (
        <div style={{ height: 550, width: '100%', cursor: 'pointer' }}>
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
              <XGrid
                localeText={frFR.props.MuiDataGrid.localeText}
                density='compact'
                rows={dataTable}
                columns={tableColumns}
                rowHeight={40}
                pageSize={12}
                {...props}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TableData
