import { Box, Modal, Paper, Menu } from "@mantine/core";
import { DataGrid } from "@mui/x-data-grid";
import { Divider, Drawer, message, } from "antd";
import { useEffect, useState } from "react";
import { PageHeader, SaveButton, SearchInput } from "../../components/shared";
import { deleteProduct, getAllProducts } from "../../helpers/api";
import EditItemForm from "./components/edit-product";
import NewProductForm from "./components/new-product";
import smalltalk from 'smalltalk';
import { useQuery } from 'react-query'
import { daysToExpiry } from "../../helpers/utilities";
import { Chip } from "@mui/material";
import { demoProducts } from "../../data";



const ProductsPage = ( props ) => {
    const [ filteredData, setFilteredData ] = useState( demoProducts );

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
    // const { data: products = [], isFetching, refetch: fetchProducts } = useQuery( {
    //     queryFn: () => getAllProducts(),
    //     queryKey: [ 'products' ],
    //     onSuccess: ( data ) => setFilteredData( data )
    // } );

    const products = demoProducts


    // handlers
    const handleOpen = ( id ) => {
        setMode( { edit: true, id } )
    }


    const handleDelete = ( id ) => {

        smalltalk.confirm(
            "Delete Product", "This action cannot be undone. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteProduct( id ).then(
                () => {
                    message.success( "Product Deleted" )
                    fetchProducts();
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
            field: 'product_name',
            headerName: 'Item Name',
            sortable: true,
            // flex: 1,
            width: 350,
            renderCell: ( { row } ) => row.product_name
        },
        {
            field: 'unit',
            headerName: 'Unit',
            sortable: true,
            width: 200,
            valueGetter: ( { row } ) => row.unit
        },
        {
            field: 'unit_price',
            headerName: 'Unit Price',
            sortable: true,
            width: 150,
            renderCell: ( { row } ) => row?.unit_price
        },
        // {
        //     field: 'sale_count',
        //     headerName: 'Sales #',
        //     sortable: true,
        //     width: 90
        // },
        {
            // headerName: 'Actions',
            // width: 100,
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
                        <NewProductForm
                            onClose={ () => setMode( { new: false } ) }
                        // onSuccess={ fetchProducts }
                        />
                    </Paper> :
                    mode.edit ?
                        <Paper>
                            <Chip color="error" label="Nothing here yet" />
                            <button
                                className="ms-3 button is-secondary"
                                onClick={ () => { setMode( { edit: false } ) } }
                            >Back</button>
                            {/* <EditItemForm
                                canEdit={ true } //use permission here
                                id={ mode.id }
                                onUpdate={ fetchProducts }
                                onClose={ () => setMode( { edit: false, product_id: null } ) }
                            /> */}
                        </Paper>
                        :
                        <>
                            <PageHeader title="Inventory" description="view, edit and add inventory"
                                metaData={ `${ filteredData.length } products` || '...' } />
                            {/* buttons */ }
                            <div className="d-flex justify-content-between">
                                <div className="buttons has-addons">
                                    <button className="button bokx-btn btn-prim"
                                        onClick={ () => setMode( { new: true } ) }
                                    >
                                        <span className="bi bi-plus-circle me-2"></span>
                                        Add
                                        <span className="ms-1 d-none d-md-inline">
                                            Item
                                        </span>
                                    </button>
                                </div>
                                {/* <div className="d-flex d-none d-md-inline"> */ }
                                <SearchInput
                                    onChange={ value =>
                                        setFilteredData(
                                            products.filter( fd =>
                                                fd.product_name.toLowerCase().includes( value.toLowerCase() ) ||
                                                fd.unit.toLowerCase().includes( value.toLowerCase() )
                                            ) )
                                    }
                                    placeholder="search by name, unit"
                                    autoFocus />
                                {/* </div> */ }
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

export { ProductsPage };