import { Modal } from "@mantine/core";
import { Divider, message, Tag, } from "antd";
import { useState } from "react";
import { PageHeader, SearchInput } from "../../components/shared";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from "@mui/material";
import NewStaffForm from "./components/new-staff";
import EditStaffForm from "./components/edit-staff";
import { useMutation, useQuery } from "react-query";
import { deleteStaff, getAllStaffs } from "../../helpers/api";
import _ from "lodash";
import smallTalk from 'smalltalk';

const columns = ( onEdit, onDelete ) => [
    {
        field: 'first_name',
        headerName: 'Staff Name',
        sortable: true,
        width: 250,
        renderCell: ( { row } ) => `${ row.first_name } ${ row.last_name }`
    },
    {
        field: 'gender',
        headerName: 'Gender',
        sortable: true,
        width: 150
    },
    {
        field: 'primary_contact',
        headerName: 'Contact',
        sortable: true,
        width: 150
    },
    {
        field: 'email',
        headerName: 'Email',
        sortable: true,
        width: 200
    },
    {
        field: 'job_title',
        headerName: 'Job Title',
        sortable: true,
        width: 150
    },
    {
        headerName: '',
        width: 100,
        renderCell: ( { row, value, hasFocus } ) => {
            return (
                <div className="d-flex">
                    <button
                        onClick={ () => onEdit( row.id ) }
                        className="button is-small is-ghost px-2">
                        <span className="bi bi-pencil me-1"></span>
                        Edit
                    </button>
                    <button
                        onClick={ () => onDelete( row.id ) }
                        className="button is-small text-danger is-ghost px-2">
                        <span className="bi bi-trash me-1"></span>
                        {/* Delete */ }
                    </button>
                </div>
            )
        }
    }
];



const StaffsSetupPage = ( props ) => {
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null, size: 'md'
    } )

    // queries
    const { data: staffs = [], isFetching, refetch } = useQuery( {
        queryFn: () => getAllStaffs(),
        queryKey: [ 'staffs' ],
    } );

    const { mutateAsync, isLoading } = useMutation( ( id ) => deleteStaff( id ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 204 ) {
                message.success( data.data.message );
                refetch();
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
            isOpen: true, title: 'Edit Staff',
            content: <EditStaffForm id={ id } onUpdate={ refetch } />
        } )
    }

    const handleDelete = ( id ) => {
        smallTalk.confirm(
            "Delete Staff", "This action is irreversible. Continue?",
            {
                buttons: {
                    ok: 'YES',
                    cancel: 'NO',
                },
            }
        ).then( () => {
            mutateAsync( id )
        } )
    }


    return (
        <section className="mt-4 pb-4">
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                size={ modal.size }
            >
                { modal.content }
            </Modal>
            <PageHeader
                title="Staffs"
                description="View and edit all staffs"
                metaData={ `${ staffs.length }` || '...' }
            />
            <div className="mb-3 d-flex justify-content-between">
                <button className="bokx-btn btn-prim me-3"
                    onClick={ () => setModal( {
                        isOpen: true,
                        title: 'New Staff',
                        content: <NewStaffForm onUpdate={ refetch } />
                    } ) }>
                    <span className="bi bi-plus-circle me-2"></span>
                    Add
                    <span className="d-none d-md-inline ms-1">
                        Staff
                    </span>
                </button>
                {/* <SearchInput placeholder="search staff by name, contact or email" /> */ }
            </div>
            {/* buttons end */ }
            {/* <Divider /> */ }

            {/* <div className="d-flex">
            </div>
            <Divider /> */}

            {/* <LinearProgress color="success" /> */ }
            <Paper>
                <Box sx={ { height: 400, width: '100%' } }>
                    <DataGrid
                        rows={ staffs }
                        loading={ isFetching }
                        columns={ columns( handleEdit, handleDelete ) }
                        pagination
                    />
                </Box>
            </Paper>


        </section>
    );
}

export { StaffsSetupPage };