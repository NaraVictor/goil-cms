import { Box, Menu, Modal, Paper } from "@mantine/core";
import { DataGrid } from "@mui/x-data-grid";
import { Divider, message, Tag } from "antd";
import { useState } from "react";
import { PageHeader, SearchInput } from "../../components/shared";
import NewPurchaseOrderForm from './components/new-purchase-order';
import ReceiveStock from './components/receive-stock';
import { cedisLocale } from '../../helpers/utilities'
import EditPurchaseOrderForm from "./components/edit-purchase-order";
import { useQuery } from "react-query";
import { deleteRestock, getAllRestocks } from "../../helpers/api";
import smalltalk from 'smalltalk';
import PurchaseOrderReceipt from "./components/purchase-order-receipt";



const columns = ( onReceive, onOpen, onPrint, onDelete ) => [

    {
        field: 'id',
        headerName: 'SN',
        sortable: true,
        width: 60,
        renderCell: ( params ) => params.api.getRowIndexRelativeToVisibleRows( params.row.id ) + 1
    },
    {
        field: 'createdAt',
        headerName: 'Date',
        sortable: true,
        width: 150,
        valueFormatter: ( { value } ) => value ? new Date( value ).toDateString() : '-'
    },
    {
        field: 'order_number',
        headerName: 'Order #',
        sortable: true,
        width: 150,
    },
    {
        field: 'supplier_invoice_number',
        headerName: 'Invoice #',
        sortable: true,
        width: 150,
    },
    {
        field: 'supplier',
        headerName: 'Supplier',
        sortable: true,
        width: 220,
        renderCell: ( { value } ) => value.supplier_name
    },
    // {
    //     field: 'total_quantity',
    //     headerName: 'Quantity',
    //     sortable: true,
    //     width: 100,
    // },
    {
        field: 'total_amount',
        headerName: 'Sum Amount',
        sortable: true,
        width: 120,
        valueFormatter: ( { value } ) => cedisLocale.format( value )
    },
    // {
    //     field: 'received_date',
    //     headerName: 'Date Received',
    //     sortable: true,
    //     // width: 120,
    //     flex: 1,
    //     valueFormatter: ( { value } ) => value ? new Date( value ).toDateString() : '-'
    // },
    {
        field: 'is_received',
        headerName: 'Status',
        sortable: true,
        // width: 80,
        flex: 1,
        renderCell: ( { value } ) => <>
            {
                value ? <Tag color="green">Fulfilled</Tag> : <Tag color="red">Pending</Tag>
            }
        </>
    },

    {
        // headerName: 'Actions',
        // flex: 1,
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
                            {
                                !row.is_received &&
                                <Menu.Item
                                    color="teal"
                                    onClick={ () => onReceive( row.id ) }
                                    icon={ <span className="bi bi-arrow-down" /> }>
                                    Receive
                                </Menu.Item>
                            }
                            <Menu.Item
                                color="blue"
                                onClick={ () => onOpen( row.id ) }
                                icon={ <span className="bi bi-arrow-up-right-square" /> }>
                                Open
                            </Menu.Item>
                            <Menu.Item
                                onClick={ () => onPrint( row.order_number ) }
                                icon={ <span className="bi bi-printer" /> }>
                                Print
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



const RestocksPage = ( props ) => {
    const [ filteredData, setFilteredData ] = useState( [] );
    const fdLen = filteredData.length

    const [ mode, setMode ] = useState( {
        new: false,
        edit: false,
        id: null
    } )
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        zIndex: 100
    } )


    // queries
    const { data: restocks = [], isFetching, refetch: fetchRestocks } = useQuery( {
        queryFn: () => getAllRestocks(),
        queryKey: [ 'restocks' ],
        onSuccess: data => setFilteredData( data )
    } );


    // handlers
    const handleReceive = ( id ) => setModal( {
        content: <ReceiveStock id={ id } onSuccess={ fetchRestocks } />,
        isOpen: true,
        title: 'Receive Stock',
        zIndex: 100
    } )

    const handleOpen = ( id ) => { setMode( { edit: true, id } ) }

    const handlePrint = ( order_number ) => {
        setModal( {
            title: 'Purchase Order',
            content: <PurchaseOrderReceipt orderNumber={ order_number } />,
            isOpen: true
        } )
    }

    const handleDelete = ( id ) => {
        smalltalk.confirm(
            "Delete Restock", "This action cannot be undone. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteRestock( id ).then( () => {
                message.success( 'Restock deleted successfully' )
                fetchRestocks()
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
                size="xl"
                zIndex={ modal.zIndex }
            >
                { modal.content }
            </Modal>
            {
                mode.new ?
                    <Paper>
                        <NewPurchaseOrderForm
                            onClose={ () => setMode( { edit: false, id: null } ) }
                            onSuccess={ fetchRestocks }
                        />
                    </Paper> :
                    mode.edit ?
                        <Paper>
                            <EditPurchaseOrderForm
                                canEdit={ true } //use permission here
                                id={ mode.id }
                                onClose={ () => setMode( {
                                    edit: false, //use permission here 
                                    id: null
                                } ) }
                                onUpdate={ fetchRestocks }
                            />
                        </Paper> :
                        <>
                            <PageHeader
                                title="Restocks"
                                description="Create a purchase order then fulfill it into a restock action"
                                metaData={ `${ fdLen === 0 ? '0' : fdLen === 1 ? fdLen + ' order' : fdLen + ' orders' }` || '...' }
                            />
                            {/* buttons */ }
                            <div className="mb-3 d-flex justify-content-between">
                                <button className="bokx-btn btn-prim" onClick={ () => setMode( { new: true } ) }>
                                    <span className="bi bi-plus-circle me-2 d-none d-md-inline"></span>
                                    Create <span className="d-none d-md-inline">Purchase Order</span>
                                </button>
                                {/* <button className="bokx-btn ms-2" onClick={ () => setModal( {
                                content: <ReceiveStock />,
                                isOpen: true,
                                title: 'Receive Stock'
                            } ) }>
                                <span className="me-2 bi bi-box-arrow-in-left"></span>
                                Receive Stock
                            </button> */}
                                {/* <button className="bokx-btn ms-2">
                                    <span className="me-2 bi bi-arrow-up-right-square"></span>
                                    Export
                                </button> */}
                                <SearchInput
                                    onChange={ value =>
                                        setFilteredData(
                                            restocks.filter( fd =>
                                                fd.order_number.toLowerCase().includes( value.toLowerCase() ) ||
                                                fd.supplier_invoice_number.toLowerCase().includes( value.toLowerCase() ) ||
                                                fd.supplier.supplier_name.toLowerCase().includes( value.toLowerCase() )
                                                // fd.product_name.toLowerCase().includes( value.toLowerCase() )
                                            ) )
                                    }
                                    placeholder="search order # or supplier"
                                    autoFocus />
                            </div>
                            {/* buttons end */ }
                            {/* <Divider /> */ }
                            <Paper>
                                <Box sx={ { height: 500, width: '100%' } }>
                                    <DataGrid
                                        columns={ columns( handleReceive, handleOpen, handlePrint, handleDelete ) }
                                        rows={ filteredData }
                                        loading={ isFetching }
                                    />
                                </Box>
                            </Paper>
                        </>
            }
        </section >
    );
}

export { RestocksPage };