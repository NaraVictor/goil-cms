import { Box, Menu, Modal, Paper } from "@mantine/core";
import { DataGrid } from "@mui/x-data-grid";
import { Divider, message } from "antd";
import { useState } from "react";
import { PageHeader, SearchInput } from "../../components/shared";
import NewCustomerForm from "./components/new-customer";
import EditCustomerForm from "./components/edit-customer";
import { deleteCustomer, getAllCustomers } from "../../helpers/api";
import { useQuery } from "react-query";
import smalltalk from 'smalltalk';


const columns = ( onOpen, onDelete ) => [

    {
        field: 'id',
        headerName: 'SN',
        sortable: true,
        width: 90,
        renderCell: ( params ) => params.api.getRowIndexRelativeToVisibleRows( params.row.id ) + 1
    },
    {
        field: 'customer_name',
        headerName: 'Name',
        sortable: true,
        width: 280,
    },
    {
        field: 'contact',
        headerName: 'Contact',
        sortable: true,
        width: 150,
    },
    {
        field: 'gender',
        headerName: 'Gender',
        sortable: true,
        width: 100,
    },
    {
        field: 'total_spent',
        headerName: 'Total Spent',
        sortable: true,
        width: 150,
    },
    {
        field: 'location',
        headerName: 'Location',
        sortable: true,
        // width: 180,
        flex: 1,
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
                                {/* Actions */ }
                            </button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                color="blue"
                                onClick={ () => onOpen( row.id ) }
                                icon={ <span className="bi bi-arrow-up-right-square" /> }>
                                Open
                            </Menu.Item>
                            <Menu.Item
                                // className="text-danger"
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


const CustomersPage = ( props ) => {
    const [ filteredData, setFilteredData ] = useState( [] );
    const [ mode, setMode ] = useState( {
        new: false,
        edit: false,
        id: null
    } )
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null
    } )


    // queries
    const { data: customers = [], isFetching, refetch: fetchCustomers } = useQuery( {
        queryFn: () => getAllCustomers(),
        queryKey: [ 'customers' ],
        onSuccess: ( data ) => setFilteredData( data )
    } );


    const handleOpen = ( id ) => { setMode( { edit: true, id } ) }
    const handleDelete = ( id ) => {

        smalltalk.confirm(
            "Delete Customer", "This action cannot be undone. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteCustomer( id ).then( ( res ) => {
                console.log( 'delete response: ', res );
                message.success( 'Customer deleted successfully' )
                fetchCustomers()
            }
            )
        } ).catch( ex => {
            return false;
        } );

    }


    return (
        <section className="mt-4 pb-4">
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
            >
                { modal.content }
            </Modal>

            {
                mode.new ?
                    <Paper>
                        <NewCustomerForm
                            onClose={ () => setMode( { new: false } ) }
                            onSuccess={ fetchCustomers }
                        />
                    </Paper> :
                    mode.edit ?
                        <Paper>
                            <EditCustomerForm
                                canEdit={ true } //use permission here
                                id={ mode.id }
                                onUpdate={ fetchCustomers }
                                onClose={ () => setMode( { edit: false, id: null } ) }
                            />
                        </Paper> :
                        <>
                            <PageHeader
                                title="Customers"
                                description="view, edit and add customers"
                                metaData={ `${ filteredData.length }` || '...' }
                            />
                            <div>
                                <div className="d-flex justify-content-between">
                                    {/* buttons */ }
                                    <div className="buttons has-addons">
                                        <button className="button bokx-btn btn-prim"
                                            onClick={ () => setMode( { new: true } ) }>
                                            <span className="bi bi-plus-circle me-2"></span>
                                            Add
                                            <span className="ms-1 d-none d-md-inline">
                                                Customer
                                            </span>
                                        </button>
                                        {/* <button className="button bokx-btn d-none d-md-inline">
                                            <span className="bi bi-download me-2"></span>
                                            <span className="d-none d-md-inline">
                                                Import
                                            </span>
                                        </button> */}
                                        {/* <button className="button bokx-btn d-none d-md-inline">
                                            <span className="me-2 bi bi-arrow-up-right-square"></span>
                                            <span className="d-none d-md-inline">
                                                Export
                                            </span>
                                        </button> */}
                                    </div>
                                    {/* buttons end */ }
                                    {/* <div className=""> */ }
                                    <SearchInput
                                        autoFocus
                                        onChange={ value =>
                                            setFilteredData(
                                                customers.filter( fd =>
                                                    fd.customer_name.toLowerCase().includes( value.toLowerCase() ) ||
                                                    fd.gender.toLowerCase().includes( value.toLowerCase() ) ||
                                                    fd.contact.toLowerCase().includes( value.toLowerCase() )
                                                ) )
                                        }
                                        placeholder="search by name, gender" />
                                    {/* </div> */ }
                                </div>
                            </div>
                            {/* <Divider /> */ }
                            <Paper>
                                <Box sx={ { height: 500, width: '100%' } }>
                                    <DataGrid
                                        rows={ filteredData }
                                        columns={ columns( handleOpen, handleDelete ) }
                                        loading={ isFetching }
                                    />
                                </Box>
                            </Paper>
                        </>
            }
        </section>
    );
}

export { CustomersPage };