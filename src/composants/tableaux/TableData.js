/** @format */

import React, { useState } from 'react'
// import { DataGrid } from '@material-ui/data-grid'
import { frFR, XGrid } from '@material-ui/x-grid'
import { createMuiTheme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import { useQuery } from 'react-query'
import axios from '../../api/axios'
import { Paper } from '@material-ui/core'
import Controls from '../../composants/controls/Controls'

function TableData(props) {
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
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    // onSuccess: (data) => {
    //   setDataTable(data.data.infos)
    // },
  })

  // console.log(VueData.data.data.infos)
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
                rows={VueData.data.data.infos}
                columns={tableColumns}
                density='compact'
                rowHeight={30}
                pagination={true}
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
