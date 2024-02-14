import { Avatar, Loader, Modal } from "@mantine/core";
import { Chip } from "@mui/material";
import { Divider, message } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { deleteSalePayment, getSale } from "../../../helpers/api";
import { cedisLocale } from "../../../helpers/utilities";
import SaleReceipt from "./receipt";
import EditCustomerForm from '../../catalog/components/edit-customer'
import { AddPayment } from "./add-payment";
import _ from "lodash";
import smallTalk from 'smalltalk';
import errImg from '../../../static/img/error.png'


const EditSaleForm = ( { id, onClose, canEdit, showHeader = true } ) => {

    const [ sale, setSale ] = useState( {} )
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        size: "",
        zIndex: 1040
    } )
    // queries
    const { isFetching, refetch: refetchSale } = useQuery( {
        queryFn: () => getSale( id ),
        queryKey: [ 'sale', id ],
        onSuccess: data => {
            let totalCharges = 0,
                totalPayments = 0,
                linesTotal = 0

            // sum charges
            data.charges.length > 0 &&
                data.charges.forEach( ch => totalCharges += ( parseInt( ch.units ) * parseFloat( ch.amount ) ) )

            // sum payments
            data.payments.length > 0 &&
                data.payments.forEach( payment => totalPayments += parseFloat( payment.amount ) )

            // sum line total
            data.children.length > 0 &&
                data.children.forEach( line => linesTotal += ( parseInt( line.quantity ) * parseFloat( line.unit_price ) ) )

            setSale( {
                ...data,
                balance: ( parseFloat( data.sum_amount ) - ( parseFloat( data.discount ) || 0 ) ) - parseFloat( data.amount_paid ),
                totalCharges,
                totalPayments,
                linesTotal
            } )
        }
    } );


    const deletePayment = ( id ) => {
        smallTalk.confirm(
            "Confirm Deletion", "Do you wish to delete this sales payment?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteSalePayment( id )
                .then( res => {
                    if ( res.status === 204 ) {
                        refetchSale()
                        message.success( 'payment deleted' )
                    }
                } )
                .catch( () => message.error( "Couldn't delete" ) )
        } ).catch( ex => {
            return false;
        } );
    }


    return (
        <div className="pt-3">
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                size={ modal.size || 'md' }
                zIndex={ modal.zIndex }
            >
                { modal.content }
            </Modal>
            {
                showHeader &&
                <>
                    <div className="d-flex justify-content-between align-items-center sticky-top bg-white pt-1 px-4"
                        style={ { zIndex: 100 } }
                    >
                        <div>
                            <h5>Sale Details</h5>
                        </div>
                        <div class="buttons has-addons is-right">
                            <button class="button bokx-btn ">
                                <span className="bi bi-reply me-2"></span>
                                Reverse
                            </button>
                            <button class="button bokx-btn"
                                onClick={ () => setModal( {
                                    content: <SaleReceipt receipt_number={ sale.receipt_number } />,
                                    title: 'Receipt',
                                    isOpen: true,
                                    zIndex: 1200,
                                    size: 'xs'
                                } ) }
                            >
                                <span className="bi bi-printer me-2"></span>
                                Print
                            </button>
                            <button
                                class="button bokx-btn"
                                onClick={ () => setModal( {
                                    content: <AddPayment
                                        sale_id={ sale.id }
                                        onUpdate={ refetchSale }
                                    />,
                                    title: 'Add Payment',
                                    isOpen: true,
                                    zIndex: 100,
                                } ) }
                            >
                                <span className="bi bi-plus me-2"></span>
                                Add Payment
                            </button>
                            <button className="button bokx-btn is-danger" onClick={ onClose }>
                                <span className="bi bi-x-circle me-2"></span>
                                Close
                            </button>
                        </div>
                    </div>
                    <Divider />
                </>
            }
            {
                isFetching ? <Loader className="m-3">Please wait...</Loader> :
                    !sale ?
                        <div className='text-center mx-auto'>
                            <div>
                                <img src={ errImg } width={ 100 } height={ 100 } className='mb-2' />
                            </div>
                            <Chip
                                label='Nothing to show at the moment'
                                color='warning'
                            />
                        </div>
                        :
                        sale &&
                        <div className="pb-3">
                            <div className="border rounded m-4">
                                <div className="d-flex justify-content-between p-3">
                                    <div>
                                        <h3 className="mb-1">#{ sale.receipt_number }</h3>
                                        <p className="mt-0">{ new Date( sale.createdAt ).toUTCString() }</p>
                                    </div>

                                </div>
                                <Divider className="mb-2 mt-0" />
                                <div className="row px-3">
                                    <div className="col">
                                        <Chip label="Attendant" />
                                        <div className="d-flex align-items-center mt-2">
                                            <Avatar className="me-2" title={ sale.creator?.staff?.first_name } ></Avatar> { `${ sale.creator?.staff?.first_name } ${ sale.creator?.staff?.last_name }` }
                                        </div>
                                    </div>
                                    <div className="col">
                                        <Chip label="Customer" />
                                        <div className="d-flex align-items-center mt-2">
                                            {
                                                !sale.customer ? "N/A" :
                                                    <>
                                                        <Avatar className="me-2" title={ sale.customer_name }></Avatar>
                                                        { sale.customer.customer_name }

                                                        <button className="ms-2 button is-ghost p-2"

                                                            onClick={ () => setModal( {
                                                                title: 'Customer',
                                                                content: <EditCustomerForm
                                                                    id={ sale.customer.id }
                                                                    showHeader={ false }
                                                                    showFooter
                                                                    canEdit
                                                                    onUpdate={ refetchSale }
                                                                />,
                                                                isOpen: true,
                                                                zIndex: 1400
                                                            } ) }
                                                        >
                                                            <span className="bi bi-arrow-up-right-square"></span>
                                                        </button>
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <Divider className="my-2" />
                                <div className="p-3">
                                    <Chip label="Summary" />
                                    <div className="row p-3">
                                        <div className="col border">
                                            <p className="mb-0 mt-2 text-muted">Total Amount</p>
                                            <h5>{ cedisLocale.format( sale.sum_amount ) }</h5>
                                        </div>
                                        <div className="col border">
                                            <p className="mb-0 mt-2 text-muted">Amount Paid</p>
                                            <h5>{ cedisLocale.format( sale.amount_paid ) }</h5>
                                        </div>
                                        <div className="col border">
                                            <p className="mb-0 mt-2 text-muted">Discount</p>
                                            <h5>{ sale.discount || 0 }</h5>
                                        </div>
                                        <div className="col border">
                                            <p className="mb-0 mt-2 text-muted">Balance</p>
                                            <h5>{ cedisLocale.format( sale.balance ) }</h5>
                                        </div>
                                    </div>
                                </div>
                                <Divider className="my-2" />
                                <div className="row p-3">
                                    <div className="col">
                                        <Chip label="Payments" />
                                        <table className="table table-bordered border rounded table-hover mt-2">
                                            <thead>
                                                <td>Date</td>
                                                <td>Method</td>
                                                <td>Amount</td>
                                                <td></td>
                                            </thead>
                                            <tbody>
                                                { sale.payments?.map( pay => {
                                                    return <tr>
                                                        <td>{ new Date( pay.createdAt ).toDateString() }</td>
                                                        <td>{ pay.method }</td>
                                                        <td>{ cedisLocale.format( pay.amount ) }</td>
                                                        <td>
                                                            <button
                                                                onClick={ () => deletePayment( pay.id ) }
                                                                className="button is-ghost is-small">
                                                                <span className="bi bi-trash"></span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                } ) }
                                            </tbody>
                                            <tfoot style={ {
                                                backgroundColor: "#eee"
                                            } }>
                                                <th colSpan={ 2 } >Total Payments</th>
                                                <th>{ cedisLocale.format( sale.totalPayments ) }</th>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className="col">
                                        <Chip label="Extra Charges" />
                                        {
                                            _.isEmpty( sale.charges ) ?
                                                <p>N/A</p> :
                                                <table className="table table-bordered border rounded table-hover mt-2">
                                                    <thead>
                                                        <td>SN</td>
                                                        <td>Description</td>
                                                        <td>Units</td>
                                                        <td>Amount</td>
                                                        <td>Total</td>
                                                    </thead>
                                                    <tbody>
                                                        { sale.charges?.map( ( chr, i ) => {
                                                            return <tr>
                                                                <td>{ ++i }</td>
                                                                <td>{ chr.charge.title }</td>
                                                                <td>{ chr.units }</td>
                                                                <td>{ cedisLocale.format( chr.amount ) }</td>
                                                                <td>{ cedisLocale.format(
                                                                    ( parseFloat( chr.amount ) * parseInt( chr.units ) )
                                                                ) }</td>
                                                            </tr>
                                                        } ) }
                                                    </tbody>
                                                    <tfoot style={ {
                                                        backgroundColor: "#eee"
                                                    } }>
                                                        <th colSpan={ 4 } >Total Charges</th>
                                                        <th>{ cedisLocale.format( sale.totalCharges ) }</th>
                                                    </tfoot>
                                                </table>
                                        }
                                    </div>

                                </div>
                                <Divider className="my-2" />
                                <div className="row m-3">
                                    <div className="col-12">
                                        <Chip label="Notes" />
                                        <p className="mt-2">
                                            { !sale.note ? "N/A" : sale.note }
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Divider className="my-2" />
                            <div className="border rounded m-4">
                                <div className="p-4">
                                    <Chip label="Line Items" />
                                    <table className="table table-bordered border rounded table-hover mt-3">
                                        <thead className="table-light">
                                            <th>SN</th>
                                            <th>Description</th>
                                            <th>Unit Price</th>
                                            <th>Quantity</th>
                                            <th>Line Total</th>
                                        </thead>
                                        <tbody>
                                            {
                                                sale.children?.map( ( prod, ind ) => {
                                                    return <tr>
                                                        <td>{ ++ind }</td>
                                                        <td>{ prod.product.product_name }</td>
                                                        <td>{ prod.unit_price }</td>
                                                        <td>{ prod.quantity }</td>
                                                        <td>{ cedisLocale.format( parseFloat( prod.quantity ) * parseFloat( prod.unit_price ) ) }</td>
                                                    </tr>
                                                } )
                                            }
                                        </tbody>
                                        <tfoot style={ {
                                            backgroundColor: "#eee"
                                        } }>
                                            <th colSpan={ 4 } >SUM</th>
                                            <th>{ cedisLocale.format( sale.linesTotal ) }</th>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
            }
        </div >
    );
}

export default EditSaleForm;