import { Badge, Box, Menu, Modal, Paper } from '@mantine/core';
import { DataGrid } from '@mui/x-data-grid';
import { Divider, message, Modal as AntModal } from 'antd'
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { PageHeader, SearchInput } from '../../../components/shared'
import { getAllSales, deleteSale } from '../../../helpers/api';
import EditSaleForm from './edit-sale'
import smalltalk from 'smalltalk';
import SaleReceipt from './receipt';
import { cedisLocale } from '../../../helpers/utilities';
import { useNavigate } from 'react-router-dom';
import { appLinks } from '../../../helpers/config';
import { Chip } from '@mui/material';


const columns = ( onOpen, onPrint, onReturn, onDelete ) => [
    {
        field: 'receipt_number',
        headerName: 'Receipt #',
        sortable: true,
        // flex: 1,
        width: 230,
        renderCell: ( param ) =>
            <>
                <Chip label={ param.value } color='info' />
                <small className='ms-2'>{ new Date( param.row.createdAt ).toLocaleString() }</small>
            </>
    },
    {
        field: 'user',
        headerName: 'Attendant',
        sortable: true,
        width: 230,
        // flex: 1,
        renderCell: ( { row } ) => row.creator && `${ row.creator.staff.first_name } ${ row.creator.staff.last_name }`

    },
    {
        field: 'customer',
        headerName: 'Customer',
        sortable: true,
        width: 200,
        // flex: 1,
        renderCell: ( { row } ) => row.customer ? row.customer.customer_name : 'N/A'
    },
    {
        field: 'sum_amount',
        headerName: 'Total Amount',
        sortable: true,
        width: 190,
        renderCell: ( { row } ) => cedisLocale.format( row.sum_amount )

    },
    {
        field: 'total_products',
        headerName: 'No of Items',
        sortable: true,
        width: 100,
        renderCell: ( { row } ) => row.children.length
    },
    {
        // headerName: 'Actions',
        // width: 50,
        flex: 1,
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
                                // className="text-primary"
                                color="blue"
                                onClick={ () => onOpen( row.id ) }
                                icon={ <span className="bi bi-arrow-up-right-square" /> }>
                                Open
                            </Menu.Item>
                            <Menu.Item
                                onClick={ () => onPrint( row.receipt_number ) }
                                icon={ <span className="bi bi-printer" /> }>
                                Receipt
                            </Menu.Item>
                            {/* <Menu.Item
                                onClick={ () => onReturn( row.id ) }
                                icon={ <span className="bi bi-reply-all" /> }>
                                Process Return
                            </Menu.Item> */}
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


export default function SaleHistoryComponent () {
    const [ filteredData, setFilteredData ] = useState( [] );
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        size: 'md'
    } )
    const [ antModal, setAntModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        width: ""
    } )
    const [ mode, setMode ] = useState( {
        edit: false,
        id: null
    } )
    const nav = useNavigate()

    // queries
    const { data: sales = [], isFetching, refetch } = useQuery( {
        queryFn: () => getAllSales(),
        queryKey: [ 'all-sales' ],
        onSuccess: data => setFilteredData( data )
    } );

    const handleOpen = ( id ) => setMode( { edit: true, id } )

    const handlePrint = ( receipt_number ) => {
        setAntModal( {
            title: 'receipt',
            content: <SaleReceipt receipt_number={ receipt_number } />,
            isOpen: true,
            width: '250px'
        } )
    }

    const handleReturn = ( id ) => { alert( `return clicked` ) }

    const handleDelete = ( id ) =>
        smalltalk.confirm(
            "Delete Sale", "This action cannot be undone. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteSale( id ).then( () => {
                message.success( 'Sale deleted successfully' )
                refetch()
            }
            )
        } ).catch( ex => {
            return false;
        } );


    return (
        <div className="mt-4 pb-4">
            <PageHeader
                title="Sales History"
                description="View, edit and manage your sales here"
                metaData={ `${ filteredData.length } sales` || '...' }
            />
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                size={ modal.size }
            >
                { modal.content }
            </Modal>
            <AntModal
                open={ antModal.isOpen }
                onCancel={ () => setAntModal( { ...antModal, isOpen: false } ) }
                title={ antModal.title }
                width={ antModal.width }
                footer={ false }
            >
                { antModal.content }
            </AntModal>
            {

                mode.edit ?
                    <Paper>
                        <EditSaleForm
                            canEdit={ true } //use permission here
                            id={ mode.id }
                            onClose={ () => setMode( { edit: false, id: null } ) }

                        />
                    </Paper>
                    :
                    <>
                        <div className="my-2 d-flex justify-content-between">
                            <div>
                                <button className="bokx-btn btn-prim"
                                    onClick={ () => nav( `${ appLinks.sales.index }/${ appLinks.sales.sell }`, { relative: false } ) }>
                                    <span className="bi bi-bag me-2 d-none d-md-inline"></span>
                                    SELL
                                </button>
                            </div>
                            {/* <div> */ }
                            {/* -> customer, status,  receipt | more filters -> user, outlet, date */ }
                            <SearchInput
                                autoFocus
                                placeholder="find sale by receipt #, customer or staff"
                                onChange={ value =>
                                    setFilteredData(
                                        sales.filter( fd =>
                                            fd.receipt_number.toLowerCase().includes( value.toLowerCase() ) ||
                                            fd.creator?.staff?.first_name.toLowerCase().includes( value.toLowerCase() ) ||
                                            fd.creator?.staff?.last_name.toLowerCase().includes( value.toLowerCase() )
                                        ) )
                                }
                            />
                            {/* </div> */ }
                        </div>
                        {/* <Divider /> */ }
                        <div>
                            <Paper>
                                <Box sx={ { height: 500, width: '100%' } }>
                                    <DataGrid
                                        rows={ filteredData }
                                        loading={ isFetching }
                                        columns={ columns( handleOpen, handlePrint, handleReturn, handleDelete ) }
                                    />
                                </Box>
                            </Paper>
                        </div>
                    </>
            }
        </div>
    )
}
