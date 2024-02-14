import { Box, Paper } from '@mantine/core';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { useQuery } from 'react-query';
import { getLogs } from '../../../helpers/api'
import { getUser } from '../../../helpers/auth';


const columns = [
    {
        field: 'outlet',
        headerName: 'Outlet',
        sortable: true,
        width: 150,
        valueGetter: ( { row } ) => row.outlet.outlet_name
    },
    {
        field: 'user',
        headerName: 'User',
        sortable: true,
        width: 200,
        valueGetter: ( { row } ) => `${ row.user.staff.first_name } ${ row.user.staff.last_name }`
    },
    {
        field: 'createdAt',
        headerName: 'Date - Time',
        sortable: true,
        width: 300,
        renderCell: ( { value } ) => `${ new Date( value ).toDateString() } - ${ new Date( value ).toLocaleTimeString() }`,
    },
    {
        field: 'description',
        headerName: 'Description',
        sortable: true,
        flex: 1,
    },
    {
        field: 'department',
        headerName: 'Department',
        sortable: true,
        width: 150,
    },

];



export default function AllLogsComponent () {
    const user = getUser()

    const { data: logs = [], isFetching, refetch } = useQuery( {
        queryFn: () => getLogs( user.id, user.shop_id ),
        queryKey: [ 'shop logs' ],
    } );

    return (
        <div>
            {/* <div className="buttons has-addons mb-2">
                <button className='button bokx-btn'>
                    <span className="bi bi-download me-2"></span>
                    Export</button>
                <button className='button bokx-btn'>
                    <span className="bi bi-printer me-2"></span>
                    Print</button>
            </div> */}
            <Paper>
                <Box sx={ { height: 400, width: '100%' } }>
                    <DataGrid
                        rows={ logs }
                        columns={ columns }
                        showCellVerticalBorder
                        showColumnVerticalBorder
                        pagination
                        loading={ isFetching }
                    />
                </Box>
            </Paper>

        </div>
    )
}
