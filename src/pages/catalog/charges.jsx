import { Box, Menu, Modal, Paper } from "@mantine/core";
import { DataGrid } from "@mui/x-data-grid";
import { Divider, message } from "antd";
import { useState } from "react";
import { PageHeader, SearchInput } from "../../components/shared";
import { deleteCharge, getAllCharges } from "../../helpers/api";
import EditChargeForm from "./components/edit-charge";
import NewChargeForm from "./components/new-charge";
import { useQuery } from 'react-query'
import smalltalk from 'smalltalk';
import { cedisLocale } from "../../helpers/utilities";


const columns = ( onOpen, onDelete ) => [

    {
        field: 'id',
        headerName: 'SN',
        sortable: true,
        width: 90,
        renderCell: ( params ) => params.api.getRowIndexRelativeToVisibleRows( params.row.id ) + 1
    },
    {
        field: 'title',
        headerName: 'Title',
        sortable: true,
        width: 300,
    },
    {
        field: 'amount',
        headerName: 'Amount',
        sortable: true,
        width: 150,
        valueFormatter: ( { value } ) => cedisLocale.format( value )
    },
    {
        field: 'description',
        headerName: 'Description',
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


const ChargesPage = ( props ) => {

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
    const { data: charges = [], isFetching, refetch: fetchCharges } = useQuery( {
        queryFn: () => getAllCharges(),
        queryKey: [ 'charges' ],
        onSuccess: data => setFilteredData( data )
    } );

    const handleOpen = ( id ) => { setMode( { edit: true, id } ) }

    const handleDelete = ( id ) => {

        smalltalk.confirm(
            "Delete Charge", "This action cannot be undone. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteCharge( id ).then(
                ( res ) => {
                    if ( res.status === 204 ) {
                        message.success( "charge deleted successfully" )
                        fetchCharges()
                    }
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
                        <NewChargeForm
                            onClose={ () => setMode( { edit: false, id: null } ) }
                            onSuccess={ fetchCharges }
                        />
                    </Paper> :
                    mode.edit ?
                        <Paper>
                            <EditChargeForm
                                canEdit={ true } //use permission here
                                id={ mode.id }
                                onUpdate={ fetchCharges }
                                onClose={ () => setMode( { edit: false, id: null } ) }

                            />
                        </Paper> :
                        <>
                            <PageHeader
                                title="Charges"
                                description="view, edit and add charges"
                                metaData={ `${ filteredData.length }` || '...' }
                            />
                            {/* buttons */ }
                            <div className="d-flex justify-content-between">
                                <div className="buttons has-addons">
                                    <button className="button bokx-btn btn-prim"
                                        onClick={ () => setMode( { new: true } ) }>
                                        <span className="bi bi-plus-circle me-2"></span>
                                        Add
                                        <span className="d-none d-md-inline ms-1">
                                            Charge
                                        </span>
                                    </button>
                                    {/* <button className="button bokx-btn">
                                        <span className="bi bi-arrow-up-right-square me-2"></span>
                                        <span className="d-none d-md-inline">
                                            Export
                                        </span>
                                    </button> */}
                                </div>
                                {/* <div className="d-flex d-none d-md-inline "> */ }
                                <SearchInput
                                    autoFocus
                                    placeholder="search by title or amount"
                                    onChange={ value =>
                                        setFilteredData(
                                            charges.filter( ch =>
                                                ch.title.toLowerCase().includes( value.toLowerCase() ) ||
                                                ch.amount.toString().toLowerCase().includes( value.toLowerCase() )
                                            ) )
                                    }
                                />
                                {/* </div> */ }
                            </div>
                            {/* buttons end */ }
                            {/* <Divider className="my-2" /> */ }
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

export { ChargesPage };