import { Divider, message } from "antd";
import { useState } from "react";
import { Modal, MultiSelect, Select } from '@mantine/core'
import { RequiredIndicator } from "../../../components/shared";
import { useMutation, useQuery } from "react-query";
import _ from "lodash";
import { getAllOutlets, getAllProducts, getAllSuppliers, postNewRestock } from "../../../helpers/api";
import PurchaseOrderProductList from "./new-purchase-order-products";
import { getUser } from "../../../helpers/auth";
import { useAtom } from "jotai";
import {
    clearProductsAtom, deleteProductAtom, getCompleteRestockAtom, getRestockTotalCostAtom, getRestockTotalQtyAtom,
    resetRestockAtom, restockAtom, selectedProductsAtom, updateProductAtom
} from "../../../helpers/state/restock";
import { cedisLocale } from "../../../helpers/utilities";
import smalltalk from 'smalltalk';
import { isPast } from "date-fns";


const NewPurchaseOrderForm = ( { showFooter = true, onSuccess, showHeader = true, onClose } ) => {
    const [ isModalVisible, setIsModalVisible ] = useState( false ); //modal

    const [ restock, setRestock ] = useAtom( restockAtom )
    const [ restockTotal ] = useAtom( getRestockTotalCostAtom )
    const [ restockQuantity ] = useAtom( getRestockTotalQtyAtom )
    const [ completeRestock ] = useAtom( getCompleteRestockAtom )
    const [ selectedProducts, addProduct ] = useAtom( selectedProductsAtom )
    const [ , deleteProduct ] = useAtom( deleteProductAtom )
    const [ , updateProduct ] = useAtom( updateProductAtom )
    const [ , clearSelected ] = useAtom( clearProductsAtom )
    const [ , resetRestock ] = useAtom( resetRestockAtom )

    const { data: suppliers = [] } = useQuery( {
        queryFn: () => getAllSuppliers(),
        queryKey: [ 'suppliers' ],
    } );

    const { data: outlets = [] } = useQuery( {
        queryFn: () => getAllOutlets( getUser().shop_id ),
        queryKey: [ 'outlets' ],
    } );

    const { data: products = [] } = useQuery( {
        queryFn: () => getAllProducts(),
        queryKey: [ 'products' ],
    } );


    const { mutateAsync: postRestock, isLoading } = useMutation( ( data ) => postNewRestock( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );
                resetRestock()
                onSuccess();
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


    const handleSubmit = () => {
        if ( !completeRestock.supplier_id ) {
            message.error( 'Please select supplier' )
            return
        }

        if ( !completeRestock.delivery_date ) {
            message.error( 'Delivery date not set' )
            return
        }

        if ( isPast( new Date( completeRestock.delivery_date ) ) ) {
            message.error( 'Delivery date cannot be in the past' )
            return
        }

        if ( completeRestock.outlets.length === 0 ) {
            message.error( 'Please select outlet(s)' )
            return
        }

        if ( completeRestock.products.length === 0 ) {
            message.error( 'Please add product(s)' )
            return
        }

        smalltalk.confirm(
            "Create Purchase Order", "Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            postRestock( completeRestock )
        } ).catch( ex => {
            return false;
        } );

    }


    return (
        <div className="pt-3">
            {
                showHeader &&
                <>
                    <div className="d-flex justify-content-between align-items-center sticky-top bg-white pt-1 px-4">
                        <div>
                            <h5><span className="d-inline d-md-none">New PO</span> <span className="d-none d-md-inline">Create Purchase Order</span></h5>
                        </div>

                        <div className="buttons has-addons">
                            <button
                                onClick={ handleSubmit }
                                className={ `button btn-prim ${ isLoading && ' is-loading' }` }>
                                <span className="bi bi-send me-2"></span>
                                <span className="d-none d-md-inline">Submit</span>
                            </button>
                            {
                                restock.supplier_id &&
                                <button className="button bokx-btn" onClick={ resetRestock }>
                                    <span className="bi bi-reply me-2"></span>
                                    <span className="d-none d-md-inline">Reset</span>
                                </button>
                            }
                            <button className="button bokx-btn" onClick={ onClose }>
                                <span className="bi bi-x-circle me-2"></span>
                                <span className="d-none d-md-inline">Close</span>
                            </button>
                        </div>
                    </div>
                    <Divider />
                </>
            }
            {
                selectedProducts.length > 0 &&
                <div className="p-3">
                    {/* <Chip label="Summary" /> */ }
                    <div className="row p-2 text-white bokx-bg">
                        <div className="col">
                            Products Count: { selectedProducts.length }
                        </div>
                        <div className="col">
                            Total Purchase Quantity: { restockQuantity }
                        </div>
                        <div className="col">
                            Estimated Cost: { cedisLocale.format( restockTotal ) }
                        </div>
                    </div>
                </div>
            }
            <div className="p-3">
                <div className="row">
                    <div className="field col-md-6 col-12">
                        <label className="mb-0" htmlFor="supplier_id">
                            Supplier
                            <RequiredIndicator />
                        </label>
                        <Select
                            // size='large'
                            size="md"
                            searchable
                            clearable
                            nothingFound="No match"
                            allowDeselect
                            id='supplier_id'
                            placeholder="select supplier"
                            value={ restock.supplier_id }
                            onChange={ value => setRestock( { ...restock, supplier_id: value } ) }
                            data={
                                suppliers?.map( sup => {
                                    return {
                                        label: sup.supplier_name,
                                        value: sup.id
                                    }
                                } )
                            }
                        />
                        {/* <select
                                size='large'
                                id='supplier'
                                placeholder="select supplier"
                                className='w-100 input'
                                required
                                { ...register( "supplier_id", { required: true } ) }

                            >
                                <option value="" selected disabled hidden>Choose supplier</option>
                                {
                                    suppliers.map( sup => <option key={ sup.id } value={ sup.id }>{ sup.supplier_name }</option> )
                                }
                            </select> */}
                        {/* <small className="text-muted">max 50 characters</small> */ }
                    </div>
                    <div className="field col-md-6 col-12">
                        <label className="mb-0" htmlFor="outlets">
                            Receiving Outlets
                            <RequiredIndicator />
                        </label>
                        <MultiSelect
                            id='outlets'
                            size="md"
                            required
                            onChange={ ( values ) => setRestock( { ...restock, outlets: values } ) }
                            value={ restock.outlets }
                            placeholder='select outlets'
                            data={
                                outlets.map( ol => {
                                    return {
                                        value: ol.id,
                                        label: ol.outlet_name
                                    }
                                } )
                            }
                        />
                        {/* <select
                                size='large'
                                id='outlet'
                                placeholder="select outlet"
                                className='w-100 input'
                                { ...register( "outlet_id", { required: true } ) }

                            >
                                <option value="" selected disabled hidden>Choose outlet</option>
                                <option key={ "all" } value="all">All</option>
                                {
                                    outlets.map( out => <option key={ out.id } value={ out.id }>{ out.outlet_name }</option> )
                                }
                            </select> */}
                    </div>
                </div>
                <div className="row">
                    <div className="field col-md-6 col-12 mt-3 mt-md-0">
                        <label className="mb-0" htmlFor="supplier_invoice_number">Supplier Invoice Number</label>
                        <input
                            className="input"
                            type="text"
                            id="supplier_invoice_number"
                            placeholder="enter supplier invoice number"
                            value={ restock.supplier_invoice_number }
                            onChange={ e => setRestock( { ...restock, supplier_invoice_number: e.target.value } ) }
                        />
                        <small className="text-muted">(optional)</small>
                    </div>
                    <div className="field col-md-6 col-12">
                        <label className="mb-0" htmlFor="deliveryDate">
                            Delivery Date
                            <RequiredIndicator />
                        </label>
                        <input
                            type="date"
                            format={ "MMM DD, YYYY" }
                            className="d-block w-100 input"
                            id="deliveryDate"
                            required
                            placeholder="choose date"
                            value={ restock.delivery_date }
                            onChange={ e => setRestock( { ...restock, delivery_date: e.target.value } ) }
                        />
                        <small className="text-muted">{ restock.delivery_date && new Date( restock.delivery_date ).toDateString() }</small>
                    </div>
                </div>
                <div className="row">
                    {/* <div className="field col-md-6 col-12 mt-3 mt-md-0">
                        <label className="mb-0" htmlFor="order_number">Purchase Order Number</label>
                        <input
                            className="input"
                            type="text"
                            id="order_number"
                            placeholder="leave blank to auto-generate"
                            value={ restock.order_number }
                            onChange={ e => setRestock( { ...restock, order_number: e.target.value } ) }
                        />
                        <small className="text-muted">This is to help you identify this order. Leave blank to auto-generate</small>
                    </div> */}
                    <div className="field col-12 mt-3 mt-md-0">
                        <label className="mb-0" htmlFor="notes">Note</label>
                        <textarea
                            className="textarea"
                            size="large"
                            id="notes"
                            value={ restock.note }
                            onChange={ e => setRestock( { ...restock, note: e.target.value } ) }
                            placeholder="enter a note for this purchase order"></textarea>
                        <small className="text-muted">(optional)</small>
                    </div>
                </div>
                {/* {
                    showFooter &&
                    <>
                        <Divider />
                        <button className={ `button btn-prim me-3 ${ isLoading && ' is-loading' }` }>
                            <span className="bi bi-send me-2"></span>
                            Submit Order
                        </button>
                    </>
                } */}
                <div className="my-3 d-flex align-items-center">
                    <button className="button is-secondary"
                        onClick={ () => setIsModalVisible( true ) }>
                        <span className="bi bi-plus-square me-2"></span>
                        Add Products
                    </button>
                    <p className="ms-3 mb-0">{ selectedProducts.length > 0 ? <><strong>{ selectedProducts.length }</strong> products added</> : 'Click to add products!' }</p>
                </div>
            </div>

            <Modal
                opened={ isModalVisible }
                onClose={ () => setIsModalVisible( false ) }
                size="xl"
                title="Add Products"
                zIndex={ 1200 }
            >
                <PurchaseOrderProductList
                    selected={ selectedProducts }
                    products={ products.filter( pro => !pro?.is_a_service ) } //no services allowed
                    onUpdate={ updateProduct }
                    onAdd={ addProduct }
                    onDelete={ deleteProduct }
                    clearSelected={ clearSelected }
                />
            </Modal>
        </div>
    );
}

export default NewPurchaseOrderForm;