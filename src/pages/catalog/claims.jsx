import { Divider, Typography, Input, Drawer, message, } from "antd";
import { useState } from "react";
import { PageHeader, SaveButton, SearchInput } from "../../components/shared";
import NewClaimForm from "./components/new-claim";
import EditClaimForm from './components/edit-claim'
import smalltalk from 'smalltalk'
import { Box, Modal, Paper } from "@mantine/core";
import { deleteCampaign, getAllCampaigns, getAllProducts } from "../../helpers/api";
import { useQuery } from "react-query";
import { DataGrid } from "@mui/x-data-grid";

const ClaimsPage = ( props ) => {
    const [ filteredData, setFilteredData ] = useState( [] );
    const { Search } = Input;
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
    const { data: campaigns = [], isFetching, refetch: fetchCampaigns } = useQuery( {
        queryFn: () => getAllCampaigns(),
        queryKey: [ 'campaigns' ],
        onSuccess: ( data ) => setFilteredData( data || [] )
    } );


    // handlers
    const handleOpen = ( id ) => {
        setMode( { edit: true, id } )
    }

    const handleDelete = ( id ) => {
        smalltalk.confirm(
            "Delete Campaign", "This action cannot be undone. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            message.info( 'demo deleting...' )
            deleteCampaign( id ).then(
                () => {
                    message.success( "Campaign Deleted" )
                    fetchCampaigns();
                }
            )
        } ).catch( ex => {
            return false;
        } );
    }


    // columns
    const columns = ( onOpen, onDelete ) => [

        {
            field: 'id',
            headerName: 'ID',
            sortable: true,
            width: 100,
            renderCell: ( params ) => params.api.getRowIndexRelativeToVisibleRows( params.row.id ) + 1
        },
        {
            field: 'compaign_name',
            headerName: 'Campaign',
            sortable: true,
            width: 200,
            renderCell: ( { row } ) => 'campaign name'
        },
        {
            field: 'customer',
            headerName: 'Customer',
            sortable: true,
            width: 200,
            renderCell: ( { row } ) => 'date'
        },
        {
            field: 'points',
            headerName: 'Points',
            sortable: true,
            width: 100,
            renderCell: ( { row } ) => 'date'
        },
        {
            field: 'status',
            headerName: 'Status',
            sortable: true,
            width: 100,
            renderCell: ( { row } ) => 'remaining/total'
        },
        {
            field: 'handler',
            headerName: 'Handler',
            sortable: true,
            width: 200,
            renderCell: ( { row } ) => 'staff handling this claim'
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

    return (
        <section className="mt-4">
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
                        <NewClaimForm
                            onClose={ () => setMode( { new: false } ) }
                            onSuccess={ fetchCampaigns }
                        />
                    </Paper> :
                    mode.edit ?
                        <Paper>
                            <EditClaimForm
                                canEdit={ true } //use permission here
                                id={ mode.id }
                                onUpdate={ fetchCampaigns }
                                onClose={ () => setMode( { edit: false, id: null } ) }
                            />
                        </Paper>
                        :
                        <>
                            <PageHeader
                                title="Claims"
                                description="view, edit and process campaign/promotion claims."
                                metaData={ `${ filteredData.length }` }
                            />
                            {/* buttons */ }
                            <div className="d-flex justify-content-between">
                                <div className="buttons has-addons">
                                    <button className="button bokx-btn btn-prim" onClick={ () => setMode( { new: true } ) }>
                                        <span className="bi bi-plus-circle me-2"></span>
                                        Claim
                                    </button>
                                </div>
                                <SearchInput
                                    onChange={ value =>
                                        setFilteredData(
                                            campaigns?.filter( fd =>
                                                fd.campaign_name.toLowerCase().includes( value.toLowerCase() )
                                                // || fd.product_name.toLowerCase().includes( value.toLowerCase() )
                                            ) )
                                    }
                                    placeholder="search by name, category"
                                    autoFocus />
                            </div>
                            {/* <p>showing x records</p> */ }
                            <Paper>
                                <Box sx={ { height: 500, width: '100%' } }>
                                    <DataGrid
                                        rows={ filteredData }
                                        loading={ isFetching }
                                        columns={ columns( handleOpen, handleDelete ) }
                                    />
                                </Box>
                            </Paper>
                        </>
            }

        </section>
    );
}

export { ClaimsPage };