// import { Divider, message } from 'antd'
// import { useAtom } from 'jotai'
// import React from 'react'
// import { paymentMethods } from '../../../helpers/config'
// import { deletePaymentAtom, updatePaymentAtom, paymentsAtom, getTotalPaymentsAtom, getCompleteSaleAtom, resetSaleAtom, getSumAtom } from '../../../helpers/state/sales'
// import { cedisLocale, findCurrency } from '../../../helpers/utilities'
// import smallTalk from 'smalltalk'
// import { useMutation } from 'react-query'
// import { postNewSale } from '../../../helpers/api'
// import _ from 'lodash'
// import { Modal } from '@mantine/core'
// import { useState } from 'react'
// import { getRegister, getUser } from '../../../helpers/auth'

// export default function CheckOutComponent ( { onUpdate } ) {
//     const [ payments, setPayments ] = useAtom( paymentsAtom )
//     const [ totalPayments ] = useAtom( getTotalPaymentsAtom )
//     const [ amountDue ] = useAtom( getSumAtom )
//     const [ , updatePayments ] = useAtom( updatePaymentAtom )
//     const [ , deletePayments ] = useAtom( deletePaymentAtom )
//     const [ completeSale ] = useAtom( getCompleteSaleAtom )
//     const [ , resetSale ] = useAtom( resetSaleAtom )

//     const balance = parseFloat( amountDue ) - parseFloat( totalPayments )

//     const [ modal, setModal ] = useState( {
//         isOpen: false,
//         title: '',
//         content: null,
//         size: ""
//     } )

//     const { mutateAsync: commitSale, isLoading } = useMutation( ( data ) => postNewSale( data ), {
//         onSuccess: ( data, variables, context ) => {
//             if ( data.status === 201 ) {
//                 message.success( data.data.message );
//                 resetSale()
//                 onUpdate( data.data.data ) //mute if no listerner or caller
//                 return;
//             }

//             throw data;
//         },
//         onError: ( error, variables, context ) => {
//             const err = error.response.data.message;
//             if ( _.isArray( err ) ) {
//                 err.map( err =>
//                     message.error( err.message )
//                 );
//             }
//             else {
//                 message.error( err );
//             }
//         },
//         retry: true
//     } );



//     const handleCheckOut = () => {
//         // check for line items
//         if ( completeSale.products.length === 0 ) {
//             message.error( 'No products detected' )
//             return
//         }

//         // check for payment methods
//         if ( completeSale.payments.length === 0 ) {
//             message.error( 'No payments found' )
//             return
//         }

//         // check for customer if there is balance
//         if ( totalPayments < amountDue && !completeSale.sale.customer_id ) {
//             message.error( 'A customer is required for incomplete payments' )
//             return
//         }

//         if ( completeSale.products.filter( prod => !prod.quantity ).length > 0 ) {
//             message.error( 'Invalid product(s) quantities' )
//             return
//         }

//         if ( completeSale.payments.filter( pay => !pay.method ).length > 0 ) {
//             message.error( 'Invalid payment method' )
//             return
//         }

//         // process sale
//         smallTalk.confirm(
//             "Commit Sale", "You are about to commit a sale transaction, continue?", {
//             buttons: {
//                 ok: 'YES',
//                 cancel: 'NO',
//             },

//         }
//         ).then( go => {
//             commitSale( completeSale );
//         } ).catch( ex => {
//             return false;
//         } );
//     }

//     return (
//         <div>
//             <Modal
//                 onClose={ () => setModal( { ...modal, isOpen: false } ) }
//                 opened={ modal.isOpen }
//                 title={ modal.title }
//                 size={ modal.size || 'md' }
//                 zIndex={ 100 }
//             >
//                 { modal.content }
//             </Modal>

//             <div>
//                 {/* <Divider orientation='left' orientationMargin={ 0 } className="mb-1">Sale Summary</Divider> */ }
//                 <div className="row">
//                     <div className="col-6">
//                         <div >
//                             <div>Amount Due</div>
//                             <h4 className='alert alert-danger'>
//                                 { cedisLocale.format( amountDue ) }
//                             </h4>
//                         </div>
//                     </div>
//                     <div className="col-6">
//                         <div >
//                             <div>Amount Paid</div>
//                             <h4 className='alert alert-success'>{ cedisLocale.format( totalPayments ) }</h4>
//                         </div>
//                     </div>
//                     <div className="col-12">
//                         <div className={ `alert alert-${ balance > 0 ? 'danger' : balance < 0 ? 'success' : 'secondary' }` }>
//                             <div>
//                                 {
//                                     balance > 0 ? 'Customer owes' : balance < 0 ? 'Pay customer the balance below' : 'Perfection 😊'
//                                 }
//                             </div>
//                             <h1 className='mb-0'>{ findCurrency( getUser().currency ).symbol } { cedisLocale.format( balance ) }</h1>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div>
//                 <Divider orientation='left' orientationMargin={ 0 } className="mb-1">Payment Methods</Divider>
//                 {/* <p className='text-secondary'>Please select payment methods</p> */ }
//                 {
//                     payments.map( ( pay, index ) =>
//                         <PaymentMethod
//                             usedMethods={ payments }
//                             payment={ pay }
//                             key={ index }
//                             onUpdate={ updatePayments }
//                             onDelete={ deletePayments }
//                         /> )
//                 }
//                 {
//                     amountDue > 0 &&
//                     <button onClick={ setPayments } className="button is-small">
//                         <span className="bi bi-plus-circle me-2"></span>
//                         Add Payment
//                     </button>
//                 }
//             </div>


//             <div>
//                 {/* <Divider orientation='left' orientationMargin={ 0 } className="mb-1">Check Out</Divider>
//                 <p className='text-secondary'>Commit sale</p> */}
//                 <Divider />
//                 <button
//                     disabled={ amountDue === 0 }
//                     onClick={ handleCheckOut }
//                     className={ `${ isLoading && 'is-loading ' } is-large button w-100 bokx-btn btn-prim sticky-bottom` }>
//                     <span className="bi bi-check-circle me-2"></span>
//                     <small> Check Out</small>
//                 </button>
//             </div>
//         </div>
//     )
// }



// export const PaymentMethod = ( { usedMethods, payment, onUpdate, onDelete } ) => {

//     return (
//         <div className="row align-items-center mb-2">
//             <div className="col-5">
//                 <select
//                     value={ payment.method }
//                     onChange={ e => onUpdate( { id: payment.id, field: 'method', value: e.target.value } ) }
//                     className='input w-100'
//                 >
//                     <option value="" selected disabled hidden>Choose method</option>
//                     {
//                         paymentMethods?.map( mth => <option value={ mth.title }>{ mth.title }</option> )
//                     }
//                 </select>
//             </div>
//             <div className="col-5">
//                 <input
//                     value={ payment.amount }
//                     onChange={ e => onUpdate( { id: payment.id, field: 'amount', value: e.target.value } ) }
//                     type="number"
//                     className="input"
//                     placeholder='amount paid' step="0.01" />
//             </div>
//             <div className="col-1 g-0">
//                 <button className='button' onClick={ () => onDelete( payment.id ) }>
//                     <span className="bi bi-trash text-danger"></span>
//                 </button>
//             </div>
//         </div>
//     )
// }
