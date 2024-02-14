import { Box, Modal, Paper } from '@mantine/core';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react'



const columns = [
    {
        field: 'outlet',
        headerName: 'Outlet',
        sortable: true,
        width: 150
    },
    {
        field: 'customer',
        headerName: 'Customer',
        sortable: true,
        width: 150
    },
    {
        field: 'products',
        headerName: 'Products',
        sortable: true,
        flex: 1

    },
    {
        field: 'user',
        headerName: 'Parked By',
        sortable: true,
        width: 150

    },
    {
        field: 'park_time',
        headerName: 'Since',
        sortable: true,
        width: 150

    },
    {
        // headerName: 'Actions',
        // width: 50,
        flex: 1,
        renderCell: ( params ) => {
            return (
                <div className="d-flex">
                    <button className="bokx-btn">
                        <span className="bi bi-arrow-right me-2"></span>
                        Retrieve
                    </button>
                    <button className="button is-ghost text-danger">
                        <span className="bi bi-trash me-2"></span>
                        {/* Discard */ }
                    </button>
                </div>
            )
        }
    }
];


export default function ParkedSalesComponent () {

    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null
    } )



    return (
        <div>
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
            >
                { modal.content }
            </Modal>
            <div className='mt-3'>
                <p>Displaying 1 Parked Sale</p>
                <Paper>
                    <Box sx={ { height: 500, width: '100%' } }>
                        <DataGrid
                            // rows={ rows }
                            columns={ columns }
                        />
                    </Box>
                </Paper>
            </div>
        </div>
    )
}
