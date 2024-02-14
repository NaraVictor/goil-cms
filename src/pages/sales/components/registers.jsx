import { Box, Menu, Modal, Paper } from '@mantine/core';
import { DataGrid } from '@mui/x-data-grid';
import { message } from 'antd';
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { deleteRegister, getAllRegisters } from '../../../helpers/api';
import EditRegisterForm from './edit-register'
import smalltalk from 'smalltalk';


const columns = ( onEdit, onDelete ) => [

    {
        field: 'register_name',
        headerName: 'Register Name',
        sortable: true,
        flex: 1,

    },
    {
        field: 'outlet',
        headerName: 'Outlet',
        sortable: true,
        flex: 1,
        renderCell: ( { row } ) => row.outlet.outlet_name
    },
    // {
    //     field: 'creator',
    //     headerName: 'Creator',
    //     sortable: true,
    //     flex: 1
    // },
    {
        field: 'sequences',
        headerName: 'Sequences #',
        sortable: true,
        flex: 1,
        renderCell: ( { row } ) => row.sequences.length
    },
    {
        // headerName: 'Actions',
        width: 50,
        renderCell: ( { row } ) => {
            return (
                <div className="d-flex">
                    <Menu>
                        <Menu.Target>
                            <button className="button is-small is-ghost px-2">
                                <span className="bi bi-list me-2"></span>
                            </button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                onClick={ () => onEdit( row.id ) }
                                icon={ <span className="bi bi-pencil" /> }>
                                Edit
                            </Menu.Item>
                            <Menu.Item
                                // className='text-danger'
                                color="red"
                                onClick={ () => onDelete( row.id ) }
                                icon={ <span className="bi bi-trash" /> }>
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                </div>
            )
        }
    }
];



export default function Registers () {
    const [ registers, setRegisters ] = useState( [] )
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null
    } )

    // queries
    const { isFetching, refetch } = useQuery( {
        queryFn: () => getAllRegisters(),
        queryKey: [ 'registers' ],
        onSuccess: data => setRegisters( data )
    } );


    // handlers
    const handleEdit = ( id ) => {
        setModal( {
            title: 'Edit Register',
            isOpen: true,
            content: <EditRegisterForm id={ id } canEdit={ true } onUpdate={ refetch } />
        } )
    }
    const handleDelete = ( id ) =>
        smalltalk.confirm(
            "Delete Register", "This action cannot be undone. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteRegister( id ).then( () => {
                message.success( 'Register deleted successfully' )
                refetch()
            }
            )
        } ).catch( ex => {
            return false;
        } );


    return (
        <div>
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
            >
                { modal.content }
            </Modal>
            <h6>Shop Registers</h6>
            <p>These are all the shop registers across all outlets/branches</p>
            <Paper>
                <Box sx={ { height: 400, width: '100%' } }>
                    <DataGrid
                        columns={ columns( handleEdit, handleDelete ) }
                        rows={ registers }
                        loading={ isFetching }
                    />
                </Box>
            </Paper>

        </div>
    )
}
