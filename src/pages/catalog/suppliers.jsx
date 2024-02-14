import { Box, Menu, Modal, Paper } from "@mantine/core";
import { DataGrid } from "@mui/x-data-grid";
import { Divider, Drawer, message } from "antd";
import { useState } from "react";
import { PageHeader, SaveButton, SearchInput } from "../../components/shared";
import NewSupplierForm from './components/new-supplier'
import EditSupplierForm from './components/edit-supplier'
import { useQuery } from "react-query";
import { deleteSupplier, getAllSuppliers } from "../../helpers/api";
import smalltalk from 'smalltalk';
import { getUser } from "../../helpers/auth";



const columns = ( onOpen, onDelete ) => [

    {
        field: 'id',
        headerName: 'SN',
        sortable: true,
        width: 90,
        renderCell: ( params ) => params.api.getRowIndexRelativeToVisibleRows( params.row.id ) + 1
    },
    {
        field: 'supplier_code',
        headerName: 'Code',
        sortable: true,
        width: 120,
    },
    {
        field: 'supplier_name',
        headerName: 'Name',
        sortable: true,
        width: 300,
    },
    {
        field: 'contact',
        headerName: 'Contact',
        sortable: true,
        width: 150,
    },
    {
        field: 'default_markup',
        headerName: 'Default Markup',
        sortable: true,
        width: 130,
    },
    {
        field: 'location',
        headerName: 'Location',
        sortable: true,
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



const SuppliersPage = ( props ) => {
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
    const { data: suppliers = [], isFetching, refetch: fetchSuppliers } = useQuery( {
        queryFn: () => getAllSuppliers( getUser().shop_id ),
        queryKey: [ 'suppliers' ],
        onSuccess: data => setFilteredData( data )
    } );


    // handlers
    const handleOpen = ( id ) => { setMode( { edit: true, id } ) }
    const handleDelete = ( id ) => {
        smalltalk.confirm(
            "Delete Supplier", "This action cannot be undone. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteSupplier( id ).then(
                () => {
                    message.success( "Supplier deleted successfully" )
                    fetchSuppliers()
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
                        <NewSupplierForm
                            onClose={ () => setMode( { new: false } ) }
                            onSuccess={ fetchSuppliers }
                        />
                    </Paper> :
                    mode.edit ?
                        <Paper>
                            <EditSupplierForm
                                canEdit={ true } //use permission here
                                id={ mode.id }
                                onUpdate={ fetchSuppliers }
                                onClose={ () => setMode( { edit: false, id: null } ) }
                            />
                        </Paper> :
                        <>
                            <PageHeader title="Suppliers"
                                description="view, edit and add suppliers"
                                metaData={ `${ filteredData.length }` || '...' }
                            />
                            {/* buttons */ }
                            <div className="mb-3 d-flex justify-content-between">
                                <div>
                                    <button className="bokx-btn btn-prim"
                                        onClick={ () => setMode( { new: true } ) }>
                                        <span className="me-2 bi bi-plus-circle d-none d-md-inline"></span>
                                        Add
                                        <span className="d-none d-md-inline ms-1">
                                            Supplier
                                        </span>
                                    </button>
                                    {/* <button className="bokx-btn ms-2">
                                        <span className="me-2 bi bi-arrow-up-right-square"></span>
                                        <span className="d-none d-md-inline">
                                            Export
                                        </span>
                                    </button> */}
                                </div>
                                {/* <div className="d-none d-md-inline"> */ }
                                <SearchInput
                                    autoFocus
                                    onChange={ value =>
                                        setFilteredData(
                                            suppliers.filter( fd =>
                                                fd.supplier_name.toLowerCase().includes( value.toLowerCase() ) ||
                                                fd.supplier_code.toLowerCase().includes( value.toLowerCase() ) ||
                                                fd.location.toLowerCase().includes( value.toLowerCase() ) ||
                                                fd.contact.toLowerCase().includes( value.toLowerCase() )
                                            ) )
                                    }
                                    placeholder="find supplier by name, code or contact" />
                                {/* </div> */ }
                            </div>
                            {/* buttons end */ }
                            {/* <Divider /> */ }
                            {/* table */ }
                            <Paper>
                                <Box sx={ { height: 500, width: '100%' } }>
                                    <DataGrid
                                        columns={ columns( handleOpen, handleDelete ) }
                                        rows={ filteredData }
                                        loading={ isFetching }
                                    />
                                </Box>
                            </Paper>
                        </>
            }
        </section>
    );
}

export { SuppliersPage };