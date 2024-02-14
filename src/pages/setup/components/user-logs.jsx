import { Box, Paper } from '@mantine/core';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { getLogs } from '../../../helpers/api';
import { useQuery } from 'react-query';



const columns = [
    {
        field: 'outlet',
        headerName: 'Outlet',
        sortable: true,
        width: 200,
        valueGetter: ( { row } ) => row.outlet.outlet_name
    },
    {
        field: 'createdAt',
        headerName: 'Date - Time',
        sortable: true,
        width: 300,
        valueGetter: ( { row } ) => `${ new Date( row.createdAt ).toDateString() } - ${ new Date( row.createdAt ).toLocaleTimeString() }`,
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



export default function UserLogsComponent ( { id } ) {

    const { data: logs = [], isFetching } = useQuery( {
        queryFn: () => getLogs( id ),
        queryKey: [ 'user-logs', id ],
    } );


    return (
        <div>
            {/* <div className="buttons has-addons mb-2">
                <button className='button bokx-btn'>
                    <span className="bi bi-download me-2"></span>
                    Export
                </button>
                <button className='button bokx-btn'>
                    <span className="bi bi-printer me-2"></span>
                    Print
                </button>
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
