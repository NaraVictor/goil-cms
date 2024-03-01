import { Divider, Switch, message, } from "antd";

import Tile from "../../../components/pages/tile";
import { cedisLocale, validateItem } from "../../../helpers/utilities";

import smallTalk from 'smalltalk'
import { useMutation, useQuery } from "react-query";
import { getAllCategories, getAllOutlets, getAllSuppliers, getProduct, putProduct } from "../../../helpers/api";
import { getUser } from "../../../helpers/auth";
import _ from "lodash";
import { useState } from "react";
import { Alert, Modal, Select } from "@mantine/core";
import { RequiredIndicator } from "../../../components/shared";
import { LinearProgress } from "@mui/material";

import NewProductTypeForm from './new-product-type'
import NewSupplierForm from "./new-supplier";
import { IconX } from '@tabler/icons-react'

const stateTemplate = {
    product_name: '', product_code: '', description: '',
    supplier_price: 0, markup_price: 0, retail_price: 0,
    expiry_date: null, product_type: 'single',
    sku_type: '', sku_value: '', is_a_service: false, shop_category_id: '',
}


const prodStocksTemplate = {
    outlet_id: '',
    units_in_stock: 0,
    reorder_quantity: 0,
    reorder_level: 0
}

const prodSuppliersTemplate = {
    supplier_id: '',
    supplier_price: 0,
}

const prodVariantTemplate = {
    attribute: '',
    value: '',
}

const listType = {
    Supplier: 'supplier',
    Stock: 'stock',
    Variant: 'variant'
}

const EditItemForm = ( { id, onClose, canEdit, showHeader = true, onUpdate } ) => {

    const [ errMsg, setErrMsg ] = useState( '' )
    const [ state, setState ] = useState( stateTemplate )
    const [ suppliers, setSuppliers ] = useState( [] )
    const [ variants, setVariant ] = useState( [] )
    const [ stocks, setStocks ] = useState( [] )

    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        zIndex: 1200,
    } )

    let supplierPrice = ( suppliers[ 0 ]?.supplier_price || state?.supplier_price || 0 )
    let markupPercent = ( ( state.markup_price || 0 ) / supplierPrice ) * 100
    let retailPrice = parseFloat( supplierPrice ) + ( parseFloat( state.markup_price ) || 0 )

    const { refetch: fetchProduct, isFetching } = useQuery( {
        queryFn: () => getProduct( id ),
        queryKey: [ 'product', id ],
        onSuccess: data => {

            setState( {
                ..._.omit( data, [ 'stock', 'variants', 'suppliers', 'category', 'sale_count' ] ),
                expiry_date: data.expiry_date && new Date( data.expiry_date ).toISOString().substring( 0, 10 )
            } )

            setStocks( data?.stock.map( stk => {
                return {
                    ..._.omit( stk, [ 'outlet' ] ),
                    recordId: Math.random() + new Date().getTime(),
                    server_copy: true
                }
            } ) )

            setSuppliers( data?.suppliers?.map( sup => {
                return {
                    ..._.omit( sup, [ 'supplier' ] ),
                    recordId: Math.random() + new Date().getTime(),
                    server_copy: true
                }
            } ) )

            setVariant( data?.variants?.map( vr => {
                return {
                    attribute: vr.attribute,
                    value: vr.value,
                    recordId: Math.random() + new Date().getTime(),
                    server_copy: true
                }
            } ) )
        }
    } );

    const { data: categories = [], refetch: fetchCategories } = useQuery( {
        queryFn: () => getAllCategories( 'product' ),
        queryKey: [ 'product-categories' ],
    } );

    const { data: outlets = [] } = useQuery( {
        queryFn: () => getAllOutlets( getUser().shop_id ),
        queryKey: [ 'outlets' ],
    } );

    const { data: Allsuppliers = [], refetch: fetchSuppliers } = useQuery( {
        queryFn: () => getAllSuppliers(),
        queryKey: [ 'suppliers' ],
    } );


    const { mutateAsync, isLoading } = useMutation( ( data ) => putProduct( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 200 ) {
                message.success( data.data.message );
                fetchProduct()
                onUpdate()
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

    const updateProduct = () => {
        smallTalk.confirm(
            "Update Item", "You are about to update this item, continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( value => {

            const { isError, message, data } = validateItem( state, stocks, variants, suppliers )

            if ( !isError ) {
                setErrMsg( "" )
                mutateAsync( data );
                return;
            }

            setErrMsg( message )

        } ).catch( ex => {
            return false;
        } );

    }



    // handlers
    const addHandler = ( type ) => {
        switch ( type ) {
            case listType.Supplier:
                if ( suppliers.length === Allsuppliers.length ) {
                    message.error( `Only ${ Allsuppliers.length } supplier(s) available` )
                    return
                }

                setSuppliers( [
                    ...suppliers,
                    {
                        ...prodSuppliersTemplate,
                        recordId: Math.random() + new Date().getTime()
                    }
                ] )
                break;

            case listType.Stock:
                if ( stocks.length === outlets.length ) {
                    message.error( `Only ${ outlets.length } outlet(s) available` )
                    return
                }

                setStocks( [
                    ...stocks,
                    {
                        ...prodStocksTemplate,
                        recordId: Math.random() + new Date().getTime()
                    }
                ] )
                break;

            case listType.Variant:
                setVariant( [
                    ...variants,
                    {
                        ...prodVariantTemplate,
                        recordId: Math.random() + new Date().getTime()
                    }
                ] )
                break;

            default:
                break;
        }
    }



    const removeHandler = ( type, id ) => {
        switch ( type ) {
            case listType.Supplier:
                setSuppliers( suppliers.filter( sp => sp.recordId !== id ) )
                break;

            case listType.Stock:
                setStocks( stocks.filter( st => st.recordId !== id ) )
                break;

            case listType.Variant:
                setVariant( variants.filter( vr => vr.recordId !== id ) )
                break;

            default:
                break;
        }
    }



    const updateHandler = ( type, recordId, field, value ) => {
        switch ( type ) {
            case listType.Supplier:
                let sup = suppliers.find( sp => sp.recordId === recordId )

                if ( [ 'supplier_price' ].find( f => f === field ) )
                    if ( value < 0 )
                        value = 0

                if ( ( field === 'supplier_id' ) && suppliers.find( sup => sup.supplier_id === value ) ) {
                    message.error( 'already selected!' )
                    return
                }


                sup[ field ] = value
                setSuppliers( suppliers.map( sp => {
                    if ( sp.recordId === recordId )
                        return sup
                    return sp
                } ) )
                break;

            case listType.Stock:
                let stk = stocks.find( st => st.recordId === recordId )
                if ( [ 'units_in_stock', 'reorder_level', 'reorder_quantity' ].find( f => f === field ) )
                    if ( value < 0 )
                        value = 0

                if ( ( field === 'outlet_id' ) && stocks.find( stk => stk.outlet_id === value ) ) {
                    message.error( 'already selected!' )
                    return
                }

                stk[ field ] = value
                setStocks( stocks.map( st => {
                    if ( st.recordId === recordId )
                        return stk

                    return st
                } ) )

                break;

            case listType.Variant:
                let vr = variants.find( v => v.recordId === recordId )

                vr[ field ] = value
                setVariant( variants.map( v => {
                    if ( v.recordId === recordId )
                        return vr

                    return v
                } ) )
                break;

            default:
                break;
        }
    }




    return (
        <div className="pt-3">
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                zIndex={ modal.zIndex }
            >
                { modal.content }
            </Modal>
            {
                showHeader &&
                <>
                    <div className="d-flex justify-content-between align-items-center sticky-top bg-white pt-1 px-4">
                        <div>
                            <h5>Product Details</h5>
                        </div>
                        <div className="buttons has-addons">
                            {
                                canEdit &&
                                <button
                                    className={ `button bokx-btn btn-prim ${ isLoading && ' is-loading' }` }
                                    onClick={ updateProduct }
                                >
                                    <span className="bi bi-check-all me-md-2"></span>
                                    <span className="d-none d-md-inline">Update</span>
                                </button>
                            }
                            <button className="button bokx-btn" onClick={ onClose }>
                                <span className="bi bi-x-circle me-md-2"></span>
                                <span className="d-none d-md-inline">Close</span>
                            </button>
                        </div>
                    </div>
                    <Divider />
                </>
            }
            {
                isFetching &&
                <LinearProgress color="success" className="mb-2" />
            }
            {
                !isFetching &&
                <>
                    {
                        errMsg &&
                        <Alert
                            className="mx-4"
                            icon={ <IconX /> }
                            variant="filled" color="red">
                            { errMsg }
                        </Alert>
                    }
                    <div className="p-4">
                        <h6 className="mb-0">GENERAL INFORMATION</h6>
                        <span className="text-muted">basic / general information for this product</span>
                        <div className="mt-3 row">
                            <div className="field col-md-8 col-12">
                                <label className="mb-0" htmlFor="product_name">
                                    Name
                                    <RequiredIndicator />
                                </label>
                                <input
                                    className="input"
                                    type="text"
                                    id="product_name"
                                    required
                                    value={ state.product_name }
                                    onChange={ e => setState( { ...state, product_name: e.target.value } ) }
                                    autoFocus
                                    placeholder="enter a product name here" />
                            </div>
                            <div className="field col-md-4 col-12">
                                <label className="mb-0" htmlFor="expiry_date">
                                    Expiry Date
                                </label>
                                <input
                                    className="input"
                                    type="date"
                                    id="expiry_date"
                                    value={ state.expiry_date }
                                    onChange={ e => setState( { ...state, expiry_date: e.target.value } ) }
                                    placeholder="product expiry date" />
                                <small>{ state.expiry_date && new Date( state.expiry_date ).toDateString() }</small>
                            </div>
                        </div>

                        {/* <p>product tag</p> */ }
                        <div className="mt-3 row">
                            <div className="field col-12">
                                <label className="mb-0" htmlFor="shop_category_id">
                                    Product Category
                                    <RequiredIndicator />
                                </label>
                                <Select
                                    id='shop_category_id'
                                    value={ state.shop_category_id }
                                    required
                                    onChange={ ( value ) => setState( { ...state, shop_category_id: value } ) }
                                    size="md"
                                    searchable
                                    clearable
                                    placeholder='select a category'
                                    data={
                                        categories.map( cat => {
                                            return {
                                                value: cat.id,
                                                label: cat.title
                                            }
                                        }
                                        )
                                    }
                                />
                                <p
                                    onClick={ () => setModal( {
                                        title: 'Add Product Category',
                                        isOpen: true,
                                        content: <NewProductTypeForm onUpdate={ fetchCategories } />,
                                        zIndex: 1200
                                    } ) }
                                    className="text-secondary hover-hand d-inline-block p-1">
                                    <span className="bi bi-plus-circle me-2"></span>
                                    add category
                                </p>
                            </div>

                        </div>
                        <div className="mt-3 row">
                            <div className="field col-12">
                                <label className="mb-0" htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={ state.description }
                                    onChange={ e => setState( { ...state, description: e.target.value } ) }
                                    className="textarea"
                                    placeholder="choose a description"></textarea>
                            </div>
                        </div>
                        <Divider />
                        <h6 className="mt-4 mb-0">INVENTORY MANAGEMENT</h6>
                        <span className="text-muted">choose how you want to manage product</span>

                        <div className="my-5 row">
                            <p>Inventory Type</p>
                            <div className="col-md-3 col-6">
                                <Tile isLink={ false }
                                    title="Single"
                                    onClick={ () => setState( { ...state, product_type: 'single' } ) }
                                    isActive={ state.product_type === 'single' }
                                    className="hover-hand" />
                            </div>
                            <div className="col-md-3 col-6">
                                <Tile
                                    isLink={ false }
                                    onClick={ () => setState( { ...state, product_type: 'variant' } ) }
                                    isActive={ state.product_type === 'variant' }
                                    title="Variant"
                                    className="hover-hand" />
                            </div>
                        </div>
                        {
                            state.product_type === 'single' &&
                            <div className="mt-5 row">
                                <h6>SKU</h6>
                                <div className="col-md-3 col-5">
                                    <Select
                                        id='sku_type'
                                        value={ state.sku_type }
                                        onChange={ ( value ) => setState( { ...state, sku_type: value } ) }
                                        size="md"
                                        clearable
                                        placeholder='SKU Type'
                                        data={ [
                                            { value: 'auto', label: 'Auto-Generated' },
                                            { value: 'en', label: 'EN' },
                                            { value: 'isbn', label: 'ISBN' },
                                            { value: 'jan', label: 'JAN' },
                                            { value: 'itf', label: 'ITF' },
                                        ] }
                                    />
                                </div>
                                <div className="col-md-4 col-7 g-0">
                                    <input
                                        className="input"
                                        value={ state.sku_value }
                                        onChange={ ( e ) => setState( { ...state, sku_value: e.target.value } ) }
                                        type="text"
                                        id="sku_code"
                                        placeholder="SKU code here" />
                                </div>
                            </div>
                        }


                        {
                            state.product_type === 'variant' &&
                            <>
                                <h6>Variants </h6>
                                { variants.length === 0 && <i>Add your first variant</i> }
                                {
                                    variants.map( vr =>
                                        <div className="mb-2 row">
                                            <div className="col-md-3 col-5">
                                                <Select
                                                    id='sku_type'
                                                    value={ vr.attribute }
                                                    onChange={ value => updateHandler(
                                                        listType.Variant,
                                                        vr.recordId,
                                                        'attribute',
                                                        value
                                                    ) }
                                                    size="md"
                                                    clearable
                                                    placeholder='attribute'
                                                    data={ [
                                                        { value: 'color', label: 'Color' },
                                                        { value: 'size', label: 'Size' },
                                                        { value: 'material', label: 'Material' },
                                                        { value: 'other', label: 'Other' },
                                                    ] }
                                                />
                                            </div>
                                            <div className="col-md-7 col-6 g-0">
                                                <input
                                                    value={ vr.value }
                                                    onChange={ e => updateHandler(
                                                        listType.Variant,
                                                        vr.recordId,
                                                        'value',
                                                        e.target.value
                                                    ) }
                                                    required
                                                    className="input"
                                                    type="text"
                                                    id="variantValue"
                                                    placeholder="variant value (e.g. red, medium etc)" />
                                            </div>
                                            <button
                                                onClick={ () => removeHandler( listType.Variant, vr.recordId ) }
                                                className="button col-1 is-ghost">
                                                <span className="bi bi-trash text-danger"></span>
                                            </button>
                                        </div>
                                    )
                                }
                                <button
                                    onClick={ () => addHandler( listType.Variant ) }
                                    className="button bokx-btn mt-1 rounded d-block" >
                                    <span className="bi bi-plus-square me-2"></span>
                                    add variant
                                </button>
                            </>
                        }


                        <Divider />
                        <h6 className="mt-4">SUPPLIERS</h6>
                        <p className="mt-0 text-muted">Purchase price is selected from the first supplier</p>
                        {
                            suppliers.map( sp =>
                            ( <div className="row mb-2">
                                <div className="col-md-3 col-5">
                                    <Select
                                        id='supplier_id'
                                        required
                                        value={ sp.supplier_id }
                                        onChange={ value => updateHandler(
                                            listType.Supplier,
                                            sp.recordId,
                                            'supplier_id',
                                            value
                                        ) }
                                        searchable
                                        size="md"
                                        clearable
                                        placeholder='Supplier'
                                        data={ Allsuppliers.map( sp => {
                                            return {
                                                label: sp.supplier_name,
                                                value: sp.id
                                            }
                                        } ) }
                                    />
                                    <small className="text-muted">Supplier name</small>
                                </div>
                                <div className="col-md-7 col-6 g-0">
                                    <input
                                        required
                                        value={ sp.supplier_price }
                                        onChange={ e => updateHandler(
                                            listType.Supplier,
                                            sp.recordId,
                                            'supplier_price',
                                            e.target.value
                                        ) }
                                        className="input"
                                        type="number"
                                        step="0.01"
                                        id="supplier_price" placeholder="supplier price" />
                                    <small className="text-muted">supplier price (purchase price)</small>
                                </div>
                                {
                                    suppliers.length > 1 &&
                                    <button
                                        onClick={ () => removeHandler( listType.Supplier, sp.recordId ) }
                                        className="button col-1 is-ghost">
                                        <span className="bi bi-trash text-danger"></span>
                                    </button>
                                }
                            </div> )
                            )
                        }
                        {
                            suppliers.length !== Allsuppliers.length &&
                            <button
                                onClick={ () => addHandler( listType.Supplier ) }
                                className="button bokx-btn mt-1 rounded d-block">
                                <span className="bi bi-plus-square me-2"></span>
                                add supplier
                            </button>
                        }
                        <p
                            onClick={ () => setModal( {
                                title: 'New Supplier',
                                isOpen: true,
                                content: <NewSupplierForm onSuccess={ fetchSuppliers } showFooter showHeader={ false } />,
                                zIndex: 1200
                            } ) }
                            className="text-secondary hover-hand d-inline-block p-1 mt-2 mb-0">
                            <span className="bi bi-plus-circle me-2"></span>
                            create new supplier
                        </p>

                        <Divider />

                        <h6 className="mb-4">INVENTORY LEVELS</h6>
                        <div className="my-3 row">
                            <div className="col-12">
                                <Switch id="check" checked={ state.is_a_service }
                                    onChange={ () => setState( { ...state, is_a_service: !state.is_a_service } ) }
                                />
                                <label htmlFor="check"
                                    className="ms-2">Mark as a Service? <strong>{ `${ state.is_a_service ? '(YES)' : '(NO)' }` }</strong></label>
                                <p className="text-muted">Service-based inventory units are not tracked</p>
                            </div>
                        </div>
                        {
                            state.is_a_service ? "" :
                                stocks.length === 0 ?
                                    <kbd>MUST Add Outlets and their initial quantities</kbd>
                                    :
                                    <>
                                        <div className="row mb-4">
                                            <div className="col-md-3 col-3"><strong>Outlet</strong></div>
                                            <div className="col-md-3 col-3 g-0 ms-md-3"><strong>Initial Units</strong></div>
                                            <div className="col-md-2 col-3 g-0 ms-md-2b"><strong>Re-Order Point</strong></div>
                                            <div className="col-md-2 col-3 g-0 ms-md-2b"><strong>Re-Order Quantity</strong></div>
                                        </div>
                                        {
                                            stocks.map( stk => <div className="row mb-2">
                                                {
                                                    stk.server_copy ?
                                                        <>
                                                            <div className="col-md-3 col-3 g-0 ms-md-3">
                                                                <Select
                                                                    id='outlet_id'
                                                                    value={ stk.outlet_id }
                                                                    required
                                                                    size="md"
                                                                    disabled
                                                                    placeholder='Outlet'
                                                                    data={
                                                                        outlets
                                                                            ?.map( out => {
                                                                                return {
                                                                                    label: out.outlet_name,
                                                                                    value: out.id
                                                                                }
                                                                            } ) }
                                                                />
                                                            </div>
                                                            <div className="col-md-3 col-3 g-0">
                                                                <input
                                                                    className="input"
                                                                    type="number"
                                                                    required
                                                                    disabled
                                                                    value={ stk.units_in_stock }
                                                                    id="units_in_stock" />
                                                            </div>
                                                        </> :
                                                        <>
                                                            <div className="col-md-3 col-3 g-0 ms-md-3">
                                                                <Select
                                                                    id='outlet_id'
                                                                    value={ stk.outlet_id }
                                                                    onChange={ data => updateHandler(
                                                                        listType.Stock,
                                                                        stk.recordId,
                                                                        'outlet_id',
                                                                        data
                                                                    ) }
                                                                    required
                                                                    size="md"
                                                                    placeholder='Outlet'
                                                                    data={
                                                                        outlets
                                                                            ?.map( out => {
                                                                                return {
                                                                                    label: out.outlet_name,
                                                                                    value: out.id
                                                                                }
                                                                            } ) }
                                                                />
                                                            </div>
                                                            <div className="col-md-3 col-3 g-0">
                                                                <input
                                                                    className="input"
                                                                    type="number"
                                                                    required
                                                                    value={ stk.units_in_stock }
                                                                    onChange={ e => updateHandler(
                                                                        listType.Stock,
                                                                        stk.recordId,
                                                                        'units_in_stock',
                                                                        e.target.value
                                                                    ) }
                                                                    id="units_in_stock" />
                                                            </div>
                                                        </>
                                                }
                                                <div className="col-md-2 col-3 g-0">
                                                    <input
                                                        className="input"
                                                        type="number"
                                                        required
                                                        value={ stk.reorder_level }
                                                        onChange={ e => updateHandler(
                                                            listType.Stock,
                                                            stk.recordId,
                                                            'reorder_level',
                                                            e.target.value
                                                        ) }
                                                        id="reorder_level" />
                                                </div>
                                                <div className="col-md-2 col-3 g-0">
                                                    <input
                                                        className="input"
                                                        type="number"
                                                        required
                                                        value={ stk.reorder_quantity }
                                                        onChange={ e => updateHandler(
                                                            listType.Stock,
                                                            stk.recordId,
                                                            'reorder_quantity',
                                                            e.target.value
                                                        ) }
                                                        id="reorder_quantity" />
                                                </div>
                                                {
                                                    stocks.length > 1 &&
                                                    <button
                                                        onClick={ () => removeHandler( listType.Stock, stk.recordId ) }
                                                        className="button col-1 is-ghost">
                                                        <span className="bi bi-trash text-danger"></span>
                                                    </button>
                                                }
                                            </div> )
                                        }
                                    </>
                        }

                        {
                            !state.is_a_service &&
                            stocks.length !== outlets.length &&
                            <button
                                onClick={ () => addHandler( listType.Stock ) }
                                className="mt-1 button bokx-btn rounded d-block"
                            >
                                <span className="bi bi-plus-square me-2"></span>
                                Add Stock
                            </button>
                        }
                        <Divider />

                        <h6>PRICING</h6>
                        <div className="mt-4 row">
                            <div className="col-6 col-md-4">Supplier/Purchase Price</div>
                            <div className="col-6">{ supplierPrice > 0 ? cedisLocale.format( supplierPrice ) : '0.00' }</div>
                        </div>
                        <div className="my-4 row align-items-center">
                            <div className="col-6 col-md-4">Markup Price (Profit per unit)</div>
                            <div className="col-6 align-items-center">
                                <input
                                    value={ state.markup_price }
                                    onChange={ e => setState( { ...state, markup_price: e.target.value } ) }
                                    required
                                    className="input w-50"
                                    type="number" step="0.01"
                                    id="markup_price" placeholder="0.00" />
                                <p className="ms-2 d-inline-block pt-2">
                                    { markupPercent > 0 ? `${ markupPercent.toFixed( 2 ) } %` : '0 %' }
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 col-md-4">Retail/Unit Price (excluding tax)</div>
                            <div className="col-6">
                                <h5>{ cedisLocale.format( retailPrice ) }</h5>
                            </div>
                        </div>

                    </div>
                </>
            }
        </div>
    );
}

export default EditItemForm;
