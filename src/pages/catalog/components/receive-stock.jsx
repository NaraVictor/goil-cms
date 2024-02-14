import { Indicator, Loader, Alert as MAlert } from "@mantine/core";
import { Chip } from "@mui/material";
import { Alert, Divider, message, Tag } from "antd";
import _ from "lodash";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import smalltalk from 'smalltalk';
import { deleteRestockLine, getRestock, putReceiveStock } from "../../../helpers/api";
import { RequiredIndicator } from "../../../components/shared";
import { IconX } from "@tabler/icons-react";


const ReceiveStock = ( { id, onSuccess: onDone } ) => {

    const [ state, setState ] = useState( {} )
    const [ products, setProducts ] = useState( [] )
    const [ errMsg, setErrMsg ] = useState( '' )

    const { data, refetch, isFetching: fetchingRestock } = useQuery( {
        queryFn: () => getRestock( id ),
        queryKey: [ 'restock', id ],
        onSuccess: data => {
            setState( {
                id: data.id,
                received_date: data.date_received,
                note: data.note,
                supplier_invoice_number: data.supplier_invoice_number,
                order_number: data.order_number,
            } )

            const updatedProd = data.children.map( child => {
                return {
                    ...child,
                    received_quantity: child.order_quantity
                    // this way, a user can edit received quantity without limitation of min been order qty
                    // all null or zero figures will be eliminated
                }
            } )
            setProducts( updatedProd )
        }
    } );

    const handleDeleteLineItem = ( id ) => {
        smalltalk.confirm(
            "Delete Line", "This cannot be reversed. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteRestockLine( state.id, id )
                .then( () => {
                    refetch()
                    message.success( 'Item deleted!' )
                } )
        } ).catch( ex => {
            return false;
        } );
    }


    const { mutateAsync: receivePO, isLoading } = useMutation( ( data ) => putReceiveStock( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 200 ) {
                message.success( data.data.message );
                refetch()
                onDone();
                return;
            }

            throw data;
        },

        onError: ( error, variables, context ) => {
            const err = error.response.data.message;

            if ( _.isArray( err ) ) {
                err.map( err =>
                    setErrMsg( err.message )
                );
            }
            else {
                setErrMsg( err );
            }
        },
        retry: true
    } );


    const handleReceive = () => {
        if ( !state.received_date ) {
            setErrMsg( 'Please set received date' )
            return
        }

        if ( products.length === 0 ) {
            setErrMsg( 'No products found' )
            return
        }

        // TODO ALL RECEIVED QUANTITIES. WE CANT HAVE A ZERO
        // OR FOR AUDITING PURPOSES, IT NEED TO BE THERE TO SHOW THAT NONE WAS
        // RECEIVED

        smalltalk.confirm(
            "Confirm Purchase Order", "Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },

        }
        ).then( go => {
            setErrMsg( '' )
            receivePO( { purchaseOrder: state, products } )
        } ).catch( ex => {
            return false;
        } );

    }

    // <ol>
    //     <li>summary of purchase order</li>
    //     <li>list of all ordered products with space to edit received quantities</li>
    //     <li>ability to remove ordered products</li>
    //     <li>update receipt / order number, comment and prices</li>
    // </ol>

    return (
        <div>
            {
                _.isEmpty( state ) ?
                    <div className="mx-auto">
                        <Loader />
                        <span className="ms-2">Please wait...</span>
                    </div> :
                    data.is_received ?
                        <Tag color="error">This Purchase Order is already received</Tag> :
                        <div>
                            <button
                                onClick={ handleReceive }
                                className={ `button bokx-btn btn-prim ms-3 ${ isLoading && ' is-loading' }` }>
                                <span className="bi bi-check-all me-2"></span>
                                Confirm Stock
                            </button>
                            {
                                errMsg &&
                                <MAlert
                                    icon={ <IconX /> }
                                    variant="filled" color="red" className="text-center mt-3">
                                    { errMsg }
                                </MAlert>
                            }
                            {
                                products.filter( pro => !pro.received_quantity ).length > 0 &&
                                <Alert className="mx-3 mt-2" type="warning" message="There are products with zero or empty received quantities" />
                            }
                            <Divider>Summary</Divider>
                            <div className="row mb-0 p-3">
                                <div className="col">
                                    <Chip label="Purchase Order" />
                                    <div className="ms-2">
                                        <li><i>Date Created:</i> { new Date( data.createdAt ).toDateString() }</li>
                                        <li><i>Delivery Date: </i>{ new Date( data.delivery_date ).toDateString() }</li>
                                        <li><i>Supplier: </i>{ data.supplier.supplier_name }</li>
                                        <li><i>Total Products:</i> { products?.length }</li>
                                        <li><i>Initiator:</i> { data.creator.staff.first_name + " " + data.creator.staff.last_name }</li>
                                    </div>
                                </div>
                                <div className="col">
                                    <Chip label="Receiving Outlets" />
                                    <div className="ms-2">
                                        {
                                            data.outlets.map( out => {
                                                return <li>{ out.outlet.outlet_name }</li>
                                            } )
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* <Divider></Divider> */ }
                            <div className="row p-3">
                                <div className="field col">
                                    <label className="mb-0" htmlFor="order_number">Order Number</label>
                                    <input
                                        className="input"
                                        type="text"
                                        id="order_number"
                                        placeholder="order number"
                                        value={ state.order_number }
                                        // onChange={ e => setState( { ...state, order_number: e.target.value } ) }
                                        disabled
                                    />
                                    <small className="text-muted">leave blank to auto-generate</small>
                                </div>
                                <div className="field col">
                                    <label className="mb-0" htmlFor="supplier_invoice_number">Invoice Number</label>
                                    <input
                                        className="input"
                                        type="text"
                                        id="supplier_invoice_number"
                                        placeholder="enter supplier invoice number"
                                        value={ state.supplier_invoice_number }
                                        onChange={ e => setState( { ...state, supplier_invoice_number: e.target.value } ) }
                                    />
                                    <small className="text-muted">invoice number from supplier</small>
                                </div>
                                <div className="field col">
                                    <label className="mb-0" htmlFor="received_date">Date Received
                                        <RequiredIndicator />
                                    </label>
                                    <input
                                        className="input"
                                        type="date"
                                        required
                                        id="received_date"
                                        placeholder="date received"
                                        value={ state.received_date }
                                        onChange={ e => setState( { ...state, received_date: e.target.value } ) }
                                    />
                                    <small className="text-muted">date stocks were received.</small>
                                </div>
                            </div>
                            <div className="row px-3">
                                <div className="field col">
                                    <label className="mb-0" htmlFor="note">Note</label>
                                    <textarea
                                        className="textarea"
                                        id="note"
                                        rows={ 2 }
                                        placeholder="comment or note"
                                        value={ state.note }
                                        onChange={ e => setState( { ...state, note: e.target.value } ) }
                                    ></textarea>
                                    <small className="text-muted">comment or note</small>
                                </div>
                            </div>
                            <Divider>Products</Divider>
                            <div className="row p-3">
                                <table className="table table-bordered table-hover mt-2">
                                    <thead className="border">
                                        <th>SN</th>
                                        <th>Product</th>
                                        <th>Quantity Ordered</th>
                                        <th>Quantity Received</th>
                                        <th></th>
                                    </thead>
                                    <tbody>
                                        {
                                            products.map( ( line, index ) => {
                                                return <tr>
                                                    <td>{ ++index }</td>
                                                    <td>{ line.product.product_name }</td>
                                                    <td>
                                                        { line.order_quantity }
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input"
                                                            type="number"
                                                            value={ line.received_quantity }
                                                            onChange={ e => {
                                                                const prod = products.find( pro => pro.id === line.id )
                                                                prod.received_quantity = parseInt( e.target.value )

                                                                setProducts(
                                                                    products.map( product => {
                                                                        if ( product.id === prod.id )
                                                                            return prod
                                                                        return product
                                                                    } )
                                                                )
                                                            } }
                                                        />
                                                    </td>
                                                    <td>
                                                        <button className="button is-text is-small"
                                                            onClick={ () => handleDeleteLineItem( line.id ) }
                                                        >
                                                            <span className="bi bi-trash text-danger"></span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            } )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

            }
        </div>
    );
}

export default ReceiveStock;