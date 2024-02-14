// import { Modal } from "@mantine/core";
import { message, Tag, Modal } from "antd";
import { useState } from "react";
import { PageHeader, SearchInput } from "../../components/shared";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from "@mui/material";
import NewUserForm from "./components/new-user";
import AllLogsComponent from './components/all-logs'
import UserLogsComponent from './components/user-logs'
import EditUserForm from './components/edit-user'
import { useMutation, useQuery } from "react-query";
import { deleteUser, getAllUsers, putToggleUserStatus } from "../../helpers/api";
import _ from "lodash";
import { ROLES, getUser } from "../../helpers/auth";
import smalltalk from 'smalltalk'





const UsersSetupPage = ( props ) => {
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null, size: 'md'
    } )

    // queries
    const { data: users = [], isFetching, refetch } = useQuery( {
        queryFn: () => getAllUsers( getUser().shop_id ),
        queryKey: [ 'users' ],
    } );

    const { mutateAsync: toggleStatus, isLoading } = useMutation( ( id ) => putToggleUserStatus( id ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 200 ) {
                message.success( data.data.message );
                refetch()
                return;
            }

            throw data;
        },

        onError: ( error, variables, context ) => {
            const err = error.response.data.message;
            if ( _.isArray( err ) ) {
                err.map( err =>
                    message.error( err.message )
                );
            }
            else {
                message.error( err );
            }
        },
        retry: true
    } );


    // handlers
    const handleEdit = ( id ) => {
        setModal( {
            isOpen: true, title: 'Edit User',
            content: <EditUserForm id={ id } onUpdate={ refetch } />
        } )
    }

    const handleLogs = ( id ) => {
        setModal( {
            title: 'User Logs',
            isOpen: true,
            content: <UserLogsComponent id={ id } />,
            size: 'lg',
        } )
    }

    const handleToggleStatus = async ( id ) =>
        await toggleStatus( id )

    const handleDeleteUser = async ( id ) => {
        smalltalk.confirm(
            "Delete User", "This action cannot be undone. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteUser( id ).then(
                ( res ) => {
                    if ( res.status === 204 ) {
                        message.success( "user deleted!" )
                        refetch()
                        return
                    }

                    message.error( res.data.message )
                }
            )
        } ).catch( ex => {
            return false;
        } );
    }


    // table column
    const columns = ( onEdit, onLogs, onToggleStatus, onDelete ) => [
        // {
        //     field: 'avatar',
        //     headerName: 'Pic',
        //     width: 80,
        //     renderCell: ( { value } ) =>
        //         <img src={ value } height="50" width="50" style={ { borderRadius: "100%" } } />
        // },
        {
            field: 'staff',
            headerName: 'Staff',
            sortable: true,
            width: 200,
            renderCell: ( { row } ) => `${ row?.staff?.first_name } ${ row?.staff?.last_name }`
        },
        {
            field: 'email',
            headerName: 'Email',
            sortable: true,
            width: 250
        },
        {
            field: 'role',
            headerName: 'Role',
            sortable: true,
            width: 130,
            renderCell: ( { row } ) => `${ ROLES.find( rl => rl.value === row.role )?.label }`
        },
        {
            field: 'is_logged_on',
            headerName: 'Online',
            sortable: true,
            width: 80,
            renderCell: ( { value } ) =>
                value ?
                    <Tag color="success">YES</Tag> :
                    <Tag color="red">NO</Tag>
        },
        {
            field: 'is_suspended',
            headerName: 'Status',
            sortable: true,
            width: 100,
            renderCell: ( { value } ) =>
                value ?
                    <Tag color="red">Suspended</Tag> :
                    <Tag color="success">Active</Tag>
        },
        {
            headerName: 'Actions',
            width: 220,
            // flex: 1,
            renderCell: ( { row, value, hasFocus } ) => {
                return (
                    <div className="d-flex">
                        <button
                            onClick={ () => onToggleStatus( row.id ) }
                            className={ `button is-small is-ghost px-2 ${ isLoading && ' is-loading' }` }>
                            {
                                row.is_suspended ?
                                    <>
                                        <span className="bi bi-lock me-1"></span>
                                        Unlock
                                    </> :
                                    <>
                                        <span className="bi bi-lock me-1"></span>
                                        Lock
                                    </>
                            }
                        </button>
                        <button
                            onClick={ () => onLogs( row.id ) }
                            className="button is-small is-ghost px-2">
                            <span className="bi bi-file-binary me-1"></span>
                            Logs
                        </button>
                        <button
                            onClick={ () => onEdit( row.id ) }
                            className="button is-small is-ghost px-2">
                            <span className="bi bi-pencil me-1"></span>
                            Edit
                        </button>
                        <button
                            onClick={ () => onDelete( row.id ) }
                            className="button is-small is-ghost text-danger px-2 pe-3">
                            <span className="bi bi-trash me-1"></span>
                            {/* Delete */ }
                        </button>
                    </div>
                )
            }
        }
    ];


    return (
        <section className="mt-4 pb-4">
            {/* <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                size={ modal.size }
            >
                { modal.content }
            </Modal> */}
            <Modal
                onCancel={ () => setModal( { ...modal, isOpen: false } ) }
                open={ modal.isOpen }
                title={ modal.title }
                width={ modal.size }
                footer={ false }
            >
                { modal.content }
            </Modal>
            <PageHeader
                title="Users"
                description="View and edit all users with access to shop/outlets data, their roles, logs etc"
                metaData={ `${ users.length }` || '...' }
            />
            <div className="d-flex justify-content-between mb-3">
                <div className="buttons has-addons">
                    <button className="button bokx-btn btn-prim"
                        onClick={ () => setModal( {
                            isOpen: true,
                            title: 'New User',
                            content: <NewUserForm onUpdate={ refetch } />
                        } ) }>
                        <span className="bi bi-plus-circle me-2"></span>
                        Add
                        <span className="d-none d-md-inline ms-1">
                            User
                        </span>
                    </button>
                    <button className="button bokx-btn"
                        onClick={ () => setModal( {
                            isOpen: true,
                            title: 'Shop Logs',
                            content: <AllLogsComponent />,
                            size: 'lg'
                        } ) }
                    >
                        <span className="bi bi-file-binary me-2"></span>
                        <span className="d-none d-md-inline me-1">
                            Shop
                        </span>
                        Logs
                    </button>
                </div>
                {/* <SearchInput className="d-none d-md-inline" placeholder="search users by name, role or email" /> */ }
            </div>
            {/* buttons end */ }
            {/* <Divider /> */ }
            {/* 
            <div className="d-flex">
            </div>
            <Divider /> */}

            {/* <LinearProgress color="success" /> */ }
            <Paper>
                <Box sx={ { height: 400, width: '100%' } }>
                    <DataGrid
                        rows={ users }
                        loading={ isFetching }
                        columns={ columns( handleEdit, handleLogs, handleToggleStatus, handleDeleteUser ) }
                        pagination
                    />
                </Box>
            </Paper>


        </section>
    );
}

export { UsersSetupPage };