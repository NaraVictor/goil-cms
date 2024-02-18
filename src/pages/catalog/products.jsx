import { Box, Modal, Paper, Menu } from "@mantine/core";
import { DataGrid } from "@mui/x-data-grid";
import { Divider, Drawer, message, } from "antd";
import { useEffect, useState } from "react";
import { PageHeader, SaveButton, SearchInput } from "../../components/shared";
import { deleteProduct, getAllProducts } from "../../helpers/api";
import EditProductForm from "./components/edit-product";
import NewProductForm from "./components/new-product";
import smalltalk from 'smalltalk';
import { useQuery } from 'react-query'
import { cedisLocale, daysToExpiry } from "../../helpers/utilities";
import { Chip } from "@mui/material";



const ProductsPage = ( props ) => {
    const [ filteredData, setFilteredData ] = useState( [] );
    const [ colors, setColor ] = useState( {
        red: false,
        yellow: false,
        gray: false,
        black: false
    } );

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
    const { data: products = [], isFetching, refetch: fetchProducts } = useQuery( {
        queryFn: () => getAllProducts(),
        queryKey: [ 'products' ],
        onSuccess: ( data ) => setFilteredData( data )
    } );


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
        // {
        //     field: 'is_a_service',
        //     headerName: 'Type',
        //     sortable: true,
        //     width: 100,
        //     renderCell: ( { row } ) => row.is_a_service ? 'Service' : 'Product'
        // },
        {
            field: 'item_name',
            headerName: 'Item Name',
            sortable: true,
            // flex: 1,
            width: 350,
            renderCell: ( { row } ) => {
                let classes

                if ( !row.is_a_service ) {
                    if ( ( row?.stock[ 0 ]?.units_in_stock <= row?.stock[ 0 ]?.reorder_level ) && row?.stock[ 0 ]?.units_in_stock > 2 )
                        classes = " bg-warning text-black p-3 w-100 "

                    if ( row?.stock[ 0 ]?.units_in_stock < 3 )
                        classes = " bg-danger text-white p-3 w-100 "
                }

                if ( daysToExpiry( row?.expiry_date ) <= 90 && daysToExpiry( row?.expiry_date ) > 0 )
                    classes = " bg-secondary text-white p-3 w-100 "

                if ( daysToExpiry( row?.expiry_date ) < 1 )
                    classes = " bg-dark text-white p-3 w-100 "


                return <span className={ classes }> { row.product_name } </span>
            }
        },
        {
            field: 'category',
            headerName: 'Category',
            sortable: true,
            // width: 130,
            flex: 1,
            valueGetter: ( { row } ) => row.category?.title
        },
        {
            field: 'stock',
            headerName: 'Units',
            sortable: true,
            width: 100,
            renderCell: ( { row } ) => row?.stock[ 0 ]?.units_in_stock || <Chip label="n/a" />
        },
        {
            field: 'rtp',
            headerName: 'Retail Price',
            sortable: true,
            width: 130,
            renderCell: ( { row } ) =>
                cedisLocale.format( parseFloat( row?.markup_price ) + parseFloat( row?.supplier_price ) )
        },
        {
            field: 'sale_count',
            headerName: 'Sales #',
            sortable: true,
            width: 90
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
                                {/* <Menu.Item
                                onClick={ () => onEdit( row.id ) }
                                icon={ <span className="bi bi-pencil" /> }>
                                Edit
                            </Menu.Item> */}
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



    useEffect( () => {

        filteredData.forEach( fd => {
            if ( !fd.is_a_service ) {
                if ( ( fd?.stock[ 0 ]?.units_in_stock <= fd?.stock[ 0 ]?.reorder_level ) && fd?.stock[ 0 ]?.units_in_stock > 2 )
                    setColor( { ...colors, yellow: true } )

                if ( fd?.stock[ 0 ]?.units_in_stock < 3 )
                    setColor( { ...colors, red: true } )
            }

            if ( daysToExpiry( fd?.expiry_date ) <= 90 && daysToExpiry( fd?.expiry_date ) > 0 )
                setColor( { ...colors, gray: true } )


            if ( daysToExpiry( fd.expiry_date ) < 1 )
                setColor( { ...colors, black: true } )
        } )

    }, [ filteredData ] )


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
                            onSuccess={ fetchProducts }
                        />
                    </Paper> :
                    mode.edit ?
                        <Paper>
                            <EditProductForm
                                canEdit={ true } //use permission here
                                id={ mode.id }
                                onUpdate={ fetchProducts }
                                onClose={ () => setMode( { edit: false, product_id: null } ) }
                            />
                        </Paper>
                        :
                        <>
                            <PageHeader title="Inventory" description="view, edit and add inventory"
                                metaData={ `${ filteredData.length } items` || '...' } />
                            {/* buttons */ }
                            <div className="d-flex justify-content-between">
                                <div className="buttons has-addons">
                                    <button className="button bokx-btn btn-prim"
                                    // onClick={ () => setMode( { new: true } ) }
                                    >
                                        <span className="bi bi-plus-circle me-2"></span>
                                        Add
                                        <span className="ms-1 d-none d-md-inline">
                                            Item
                                        </span>
                                    </button>
                                    {/* <button className="button bokx-btn">
                                        <span className="bi bi-download me-2"></span>
                                        <span className="d-none d-md-inline">
                                            Import
                                        </span>
                                    </button> */}
                                    {/* <button className="button bokx-btn">
                                            <span className="me-2 bi bi-arrow-up-right-square"></span>
                                            <span className="d-none d-md-inline">
                                                Export
                                            </span>
                                        </button> */}
                                </div>
                                {/* <div className="d-flex d-none d-md-inline"> */ }
                                <SearchInput
                                    onChange={ value =>
                                        setFilteredData(
                                            products.filter( fd =>
                                                fd.product_name.toLowerCase().includes( value.toLowerCase() ) ||
                                                fd.category.title.toLowerCase().includes( value.toLowerCase() )
                                                // fd.product_name.toLowerCase().includes( value.toLowerCase() )
                                            ) )
                                    }
                                    placeholder="search by name, category"
                                    autoFocus />
                                {/* </div> */ }
                            </div>
                            {/* buttons end */ }
                            <div className="mb-2 d-flex">
                                { colors.red && <small className="px-2 d-block p-1 bg-danger text-white">Critical (Less than 3 units)</small> }
                                { colors.yellow && <small className="px-2 d-block p-1 bg-warning">Warning (Below reorder level)</small> }
                                { colors.gray && <small className="px-2 d-block p-1 bg-secondary text-white">Expiring (About to expire)</small> }
                                { colors.black && <small className="px-2 d-block p-1 bg-dark text-white">Expired (Already expired)</small> }
                            </div>
                            {/* products table */ }
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

export { ProductsPage };