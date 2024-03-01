import { Divider, Typography, Input, Drawer, message, } from "antd";
import { useState } from "react";
import { PageHeader, SaveButton, SearchInput } from "../../components/shared";
import NewCampaignForm from "./components/new-campaign";
import EditCampaignForm from './components/edit-campaign'
import smalltalk from 'smalltalk'
import { Box, Menu, Modal, Paper } from "@mantine/core";
import { deleteCampaign, getAllCampaigns, getAllProducts } from "../../helpers/api";
import { useQuery } from "react-query";
import { DataGrid } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { demoCampaigns } from "../../data";

const CampaignPage = ( props ) => {
    const [ filteredData, setFilteredData ] = useState( demoCampaigns );
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
    // const { data: campaigns = [], isFetching, refetch: fetchCampaigns } = useQuery( {
    //     queryFn: () => getAllCampaigns(),
    //     queryKey: [ 'campaigns' ],
    //     onSuccess: ( data ) => setFilteredData( data || [] )
    // } );

    const campaigns = demoCampaigns


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
            headerName: 'SN',
            sortable: true,
            width: 70,
            renderCell: ( params ) => params.api.getRowIndexRelativeToVisibleRows( params.row.id ) + 1
        },
        {
            field: 'compaign_name',
            headerName: 'Name',
            sortable: true,
            width: 350,
            renderCell: ( { row } ) => row?.campaign_name
        },
        {
            field: 'start_date',
            headerName: 'Start Date',
            sortable: true,
            // width: 130,
            flex: 1,
            renderCell: ( { row } ) => row?.start_date
        },
        {
            field: 'end_date',
            headerName: 'End Date',
            sortable: true,
            // width: 100,
            flex: 1,
            renderCell: ( { row } ) => row?.end_date
        },
        // {
        //     field: 'slot',
        //     headerName: 'Slots',
        //     sortable: true,
        //     width: 130,
        //     renderCell: ( { row } ) => ''
        // },
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
                        <NewCampaignForm
                            onClose={ () => setMode( { new: false } ) }
                        // onSuccess={ fetchCampaigns }
                        />
                    </Paper> :
                    mode.edit ?
                        <Paper>
                            <Chip color="error" label="Nothing here yet" />
                            <button
                                className="ms-3 button is-secondary"
                                onClick={ () => { setMode( { edit: false } ) } }
                            >Back</button>

                            {/* <EditCampaignForm
                                canEdit={ true } //use permission here
                                id={ mode.id }
                                onUpdate={ fetchCampaigns }
                                onClose={ () => setMode( { edit: false, id: null } ) }
                            /> */}
                        </Paper>
                        :
                        <>
                            <PageHeader
                                title="Campaigns"
                                description="view, edit and add campaigns/promotions."
                                metaData={ `${ filteredData.length }` }
                            />
                            {/* buttons */ }
                            <div className="d-flex justify-content-between">
                                <div className="buttons has-addons">
                                    <button className="button bokx-btn btn-prim" onClick={ () => setMode( { new: true } ) }>
                                        <span className="bi bi-plus-circle me-2"></span>
                                        Add <span className="d-none d-md-inline ms-2">Campaign</span>
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
                            <Paper>
                                <Box sx={ { height: 500, width: '100%' } }>
                                    <DataGrid
                                        rows={ filteredData }
                                        // loading={ isFetching }
                                        columns={ columns( handleOpen, handleDelete ) }
                                    />
                                </Box>
                            </Paper>
                        </>
            }

        </section>
    );
}

export { CampaignPage };