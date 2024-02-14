import { Divider, message, Tag } from "antd";
import { useState } from "react";
import { Menu, Modal, MultiSelect, Select } from '@mantine/core'
import { RequiredIndicator } from "../../../components/shared";
import { useMutation, useQuery } from "react-query";
import _ from "lodash";
import { deleteRestockLine, getAllOutlets, getAllProducts, getAllSuppliers, getRestock, putRestock } from "../../../helpers/api";
import { getUser } from "../../../helpers/auth";
import { cedisLocale } from "../../../helpers/utilities";
import smalltalk from 'smalltalk';
import ReceiveStock from "./receive-stock";
import { Chip, LinearProgress } from "@mui/material";
import PurchaseOrderProductList from "./new-purchase-order-products";
import PurchaseOrderReceipt from "./purchase-order-receipt";
import { nanoid } from "nanoid";
import { format, isPast } from "date-fns";
import { dateFormat } from "../../../helpers/config";
import { IconBrandGmail, IconBrandWhatsapp, IconCategory, IconCopy, IconMenu, IconMessage, IconPlus, IconSend } from "@tabler/icons-react";
import SendToOther from "../../../components/send-to-other";


const EditPurchaseOrderForm = ( { id, canEdit, showHeader = true, onClose, onUpdate } ) => {

    const [ newProducts, setNewProducts ] = useState( [] )
    const [ state, setState ] = useState( {} )
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        zIndex: 100,
        size: "xl"
    } )
    const [ edit, setEdit ] = useState( false )

    const { data: suppliers = [] } = useQuery( {
        queryFn: () => getAllSuppliers(),
        queryKey: [ 'suppliers' ],
    } );

    const { data: serverOutlets = [] } = useQuery( {
        queryFn: () => getAllOutlets( getUser().shop_id ),
        queryKey: [ 'outlets' ],
    } );

    const { data: products = [], refetch: refetchProducts } = useQuery( {
        queryFn: () => getAllProducts(),
        queryKey: [ 'products' ],
        enabled: false,
    } );

    const { refetch: refetchRestock, isFetching: fetchingRestock } = useQuery( {
        queryFn: () => getRestock( id ),
        queryKey: [ 'restock', id ],
        onSuccess: data => {
            setState( {
                ...data,
                outlets: data.outlets.map( out => out.outlet_id ),
                delivery_date: new Date( data.delivery_date ).toISOString().substring( 0, 10 )
            } )
        }
    } );


    const { mutateAsync: updatePOrder, isLoading } = useMutation( ( data ) => putRestock( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 200 ) {
                message.success( data.data.message );
                onUpdate();
                refetchRestock()
                setNewProducts( [] )
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


    const handleUpdate = () => {
        if ( !state.supplier_id ) {
            message.error( 'Please select supplier' )
            return
        }

        if ( !state.delivery_date ) {
            message.error( 'Delivery date not set' )
            return
        }

        if ( isPast( new Date( state.delivery_date ) ) ) {
            message.error( 'Delivery date cannot be in the past' )
            return
        }

        if ( state.outlets.length === 0 ) {
            message.error( 'Please select outlet(s)' )
            return
        }

        smalltalk.confirm(
            "Update Purchase Order", "Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        } ).then( go => {
            updatePOrder( { restock: state, products: newProducts } )
        } ).catch( ex => {
            return false;
        } );

    }



    const handleDeleteLineItem = ( id ) => {

        if ( !id )
            return message.error( 'Error finding line ID' )

        smalltalk.confirm(
            "Delete Line Item", "This cannot be reversed. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteRestockLine( state.id, id )
                .then( ( res ) => {
                    if ( res.status === 204 ) {
                        refetchRestock()
                        onUpdate()
                        message.success( 'Item deleted!' )
                        return
                    }
                    message.error( 'Action not completed!' )
                } )
        } ).catch( ex => {
            return false;
        } );
    }



    // new products methods
    const handleAddNewProduct = () => {
        setNewProducts( [
            ...newProducts,
            {
                id: nanoid(),
                product_id: null,
                unit_price: 0,
                units_in_stock: 0,
                order_quantity: 0,
                is_new: true,
                product_name: ''
            }
        ] )
    }

    const handleDeleteNewProduct = ( id ) => {
        setNewProducts( newProducts.filter( pro => pro.id !== id ) )
    }

    const removeSelectedProducts = ( products = [], selected = [] ) => {
    }

    const handleUpdateNewProduct = ( params ) => {
        const { id, field, value } = params

        let prod = newProducts.find( pr => pr.id === id )

        if ( prod?.is_a_service )
            return //services not allowed


        if ( field === 'product_id' ) {

            if ( newProducts.find( pro => pro.product_id === value.product_id ) ) {
                message.error( 'already selected!' )
                return
            }

            prod.unit_price = parseFloat( value.product.supplier_price )
            prod.product_id = value.product_id
            prod.units_in_stock = value.product.stock.units_in_stock
            prod.product_name = value.product.product_name
            prod.order_quantity = value.product.stock.reorder_quantity
        }
        else if ( field === 'order_quantity' )
            prod.order_quantity = parseFloat( value )

        else
            prod[ field ] = value


        setNewProducts(
            newProducts.map( pro => {
                if ( pro.id === id )
                    return prod
                return pro
            } )
        )
    }


    return (
        <div className="pt-3">
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                size={ modal.size }
                zIndex={ modal.zIndex }
            >
                { modal.content }
            </Modal>
            {
                showHeader &&
                <>
                    <div className="d-flex justify-content-between align-items-center sticky-top bg-white px-4 pt-1"
                        style={ {
                            zIndex: 100
                        } }
                    >
                        <div>
                            <h5>Purchase Order
                                <span className="ms-2">
                                    {
                                        state.is_received ?
                                            <Tag color="green">Fulfilled <span className="bi bi-check-all" /></Tag> :
                                            <Tag color="orange">Pending <span className="bi bi-clock" /></Tag>
                                    }
                                </span>
                            </h5>
                        </div>
                        <div class="buttons has-addons is-right">
                            {
                                canEdit &&
                                <button className={ `button bokx-btn btn-prim ${ isLoading && ' is-loading' }` }
                                    onClick={ handleUpdate }
                                >
                                    <span className="bi bi-check-all me-2"></span>
                                    Update
                                </button>
                            }
                            {
                                state.is_received === false &&
                                <>
                                    <button className="button bokx-btn" onClick={ () => setModal( {
                                        title: 'Receive Stock',
                                        content: <ReceiveStock id={ state.id } onSuccess={ () => { refetchRestock(); onUpdate() } }
                                        />,
                                        isOpen: true,
                                        zIndex: 100,
                                        size: 'xl'
                                    } ) }>
                                        <span className="bi bi-arrow-down me-2"></span>
                                        Receive
                                    </button>
                                </>
                            }
                            <button className="button bokx-btn" onClick={ () => setModal( {
                                title: 'Purchase Order',
                                content: <PurchaseOrderReceipt orderNumber={ state.order_number } />,
                                isOpen: true,
                                zIndex: 950,
                                size: 'xl'
                            } ) }>
                                <span className="bi bi-printer me-2"></span>
                                Print
                            </button>
                            <button className="button bokx-btn is-danger" onClick={ onClose }>
                                <span className="bi bi-x-circle me-2"></span>
                                Close
                            </button>
                            <Menu>
                                <Menu.Target>
                                    <button
                                        className="button bokx-btn"
                                    >
                                        <IconMenu size={ 20 } />
                                    </button>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    {
                                        !state.is_received &&
                                        <>
                                            <Menu.Label pb={ 0 }>Action</Menu.Label>
                                            <Menu.Item
                                                onClick={ () => {
                                                    refetchProducts()
                                                    setEdit( true )
                                                } }
                                                mb={ 5 }
                                                icon={ <IconPlus size={ 20 } /> }
                                            >
                                                Add Products
                                            </Menu.Item>
                                            <Menu.Divider />
                                        </>
                                    }
                                    <Menu.Label>Messaging</Menu.Label>
                                    <Menu.Item
                                        icon={ <IconBrandGmail size={ 20 } /> }>
                                        Email Supplier
                                    </Menu.Item>
                                    <Menu.Item
                                        icon={ <IconBrandWhatsapp size={ 20 } /> }>
                                        WhatsApp Supplier
                                    </Menu.Item>
                                    <Menu.Item
                                        onClick={ () => setModal( {
                                            content: <SendToOther orderId={ id } />,
                                            isOpen: true,
                                            title: 'Send to Other',
                                            size: 'md'
                                        } ) }
                                        icon={ <IconSend size={ 20 } /> }>
                                        Send to Other
                                    </Menu.Item>
                                    {/* <Menu.Item
                                        icon={ <IconCopy size={ 20 } /> }>
                                        Copy Link
                                    </Menu.Item> */}
                                </Menu.Dropdown>
                            </Menu >
                        </div>
                    </div>
                    <Divider className="m-0" />
                </>
            }
            {
                fetchingRestock &&
                <LinearProgress color="success" className="mb-2" />
            }
            {
                state.children?.length > 0 &&
                <div className="p-3">
                    {/* <Chip label="Summary" /> */ }
                    <div className="row p-2 text-white bg-secondary">
                        <div className="col">
                            <Tag>Creator: </Tag>
                            <p className="m-0">
                                { state.creator.staff.first_name + " " + state.creator.staff.last_name }
                            </p>
                        </div>
                        <div className="col">
                            <Tag>Date Issued:</Tag>
                            <p className="m-0">
                                { new Date( state.createdAt ).toDateString() }
                            </p>
                        </div>
                        <div className="col">
                            <Tag>Date Received:</Tag>
                            <p className="m-0">
                                {
                                    state.received_date ?
                                        new Date( state.received_date ).toDateString() : 'N/A' }
                            </p>
                        </div>
                        <div className="col">
                            <Tag>Total Quantity:</Tag>
                            <p className="m-0">
                                { state.total_quantity }
                            </p>
                        </div>
                        <div className="col">
                            <Tag>Estimated Cost:</Tag>
                            <p className="m-0">
                                { cedisLocale.format( state.total_amount ) }
                            </p>
                        </div>
                    </div>

                    {/* 
                        received user
                        date received
                    */}

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
                            size="md"
                            searchable
                            clearable
                            nothingFound="No match"
                            allowDeselect
                            disabled={ state.is_received }
                            id='supplier_id'
                            placeholder="select supplier"
                            value={ state.supplier_id }
                            onChange={ value => setState( { ...state, supplier_id: value } ) }
                            data={
                                suppliers?.map( sup => {
                                    return {
                                        label: sup.supplier_name,
                                        value: sup.id
                                    }
                                } )
                            }
                        />

                    </div>
                    <div className="field col-md-6 col-12">
                        <label className="mb-0" htmlFor="outlets">
                            Receiving Outlets
                            <RequiredIndicator />
                        </label>
                        <MultiSelect
                            id='outlets'
                            size="md"
                            disabled={ state.is_received }
                            required
                            onChange={ ( values ) => setState( { ...state, outlets: values } ) }
                            value={ state.outlets }
                            placeholder='select outlets'
                            data={
                                serverOutlets?.map( ol => {
                                    return {
                                        value: ol.id,
                                        label: ol.outlet_name
                                    }
                                } )
                            }
                        />
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
                            value={ state.supplier_invoice_number }
                            onChange={ e => setState( { ...state, supplier_invoice_number: e.target.value } ) }
                        />
                        <small className="text-muted">(optional)</small>
                    </div>
                    <div className="field col-md-6 col-12">
                        <label className="mb-0" htmlFor="delivery_date">
                            Delivery Date
                            <RequiredIndicator />
                        </label>
                        <input
                            type="date"
                            className="d-block w-100 input"
                            id="delivery_date"
                            disabled={ state.is_received }
                            required
                            placeholder="choose date"
                            value={ state.delivery_date }
                            onChange={ e => setState( { ...state, delivery_date: e.target.value } ) }
                        />
                        <small className="text-muted">{ new Date( state.delivery_date ).toDateString() }</small>
                    </div>
                </div>
                <div className="row">
                    <div className="field col-md-6 col-12 mt-3 mt-md-0">
                        <label className="mb-0" htmlFor="order_number">Order Number</label>
                        <input
                            className="input"
                            type="text"
                            id="order_number"
                            placeholder="enter order number"
                            disabled
                            value={ state.order_number }
                        // onChange={ e => setState( { ...state, order_number: e.target.value } ) }
                        />
                        <small className="text-muted">This is to help you identify this order.</small>
                    </div>
                    <div className="field col-md-6 col-12">
                        <label className="mb-0" htmlFor="notes">Note</label>
                        <textarea
                            className="textarea"
                            size="large"
                            id="notes"
                            value={ state.note }
                            onChange={ e => setState( { ...state, note: e.target.value } ) }
                            placeholder="enter a note for this purchase order"></textarea>
                        <small className="text-muted">(optional)</small>
                    </div>
                </div>
                <Divider className="mb-0" />
                <div className="p-4">
                    <Chip label={ `Line Items (${ state.children?.length })` } />
                    <div>
                        <table className="table table-bordered table-hover mt-2">
                            <thead className="border">
                                <th>SN</th>
                                <th>Product</th>
                                <th>Quantity Ordered</th>
                                <th>Quantity Received</th>
                                <th>Supplier Price</th>
                                <th>Line Total</th>
                                <th>Status</th>
                                {/* <th></th> */ }
                            </thead>
                            <tbody>
                                {
                                    !state.children ?
                                        <p>Please wait...</p> :
                                        [ ...newProducts, ...state?.children ]?.map( ( line, index ) => {
                                            return <tr>
                                                <td>{ ++index }</td>
                                                <td>

                                                    { line?.product?.product_name || line?.product_name }</td>
                                                <td>
                                                    { line.order_quantity }
                                                </td>
                                                <td>{ line.received_quantity || 0 }</td>
                                                <td>{ line.unit_price }</td>
                                                <td>{ cedisLocale.format( (
                                                    ( parseFloat( line.unit_price ) * parseInt( line.order_quantity ) )
                                                ) ) }</td>
                                                <td>{
                                                    line.is_received ?
                                                        <Tag color="green"> Received</Tag> :
                                                        <Tag color="orange">Pending</Tag>
                                                }</td>
                                                {
                                                    ( !line.is_received && !line?.is_new ) &&
                                                    <td>
                                                        <button className="button is-text is-small"
                                                            onClick={ () => handleDeleteLineItem( line.id ) }
                                                        >
                                                            <span className="bi bi-trash text-danger"></span>
                                                        </button>
                                                    </td>
                                                }
                                                {
                                                    line?.is_new &&
                                                    <td>
                                                        <strong className="me-1">[New]</strong>
                                                    </td>
                                                }
                                            </tr>
                                        } )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <Modal
                    opened={ edit }
                    onClose={ () => setEdit( false ) }
                    title="Add Product"
                    zIndex={ 900 }
                    size="xl"
                >
                    <PurchaseOrderProductList
                        clearSelected={ () => setNewProducts( [] ) }
                        onAdd={ handleAddNewProduct }
                        onDelete={ handleDeleteNewProduct }
                        onUpdate={ handleUpdateNewProduct }
                        products={ products.filter( pro => !pro?.is_a_service ) }
                        selected={ newProducts }
                    />
                </Modal>
            </div>
        </div>
    );
}

export default EditPurchaseOrderForm;