import { Divider, message } from "antd"
import _ from "lodash"
import { nanoid } from "nanoid"
import { useState } from "react"
import { useMutation } from "react-query"
import { PaymentMethod } from "./checkout"
import smallTalk from 'smalltalk'
import { putSalePayment } from "../../../helpers/api"



export const AddPayment = ( { sale_id, onUpdate } ) => {
    const [ payments, setPayments ] = useState( [] )
    const [ totalPayments, setTotal ] = useState( 0 )

    const getTotalPayments = () => {
        let total = 0
        payments.map( c => {
            total += parseFloat( c.amount || 0 )
        } )
        setTotal( total )
        // return total
    }

    const deletePayments = ( id ) => {
        setPayments( payments.filter( pay => pay.id !== id ) )
        getTotalPayments()
    }


    const updatePayments = ( { id, field, value } ) => {
        const updatedPayment = payments.find( pay => pay.id === id );
        updatedPayment[ field ] = value;

        setPayments(
            payments
                .map( pay => {
                    if ( pay.id === id )
                        return updatedPayment
                    return pay
                } )
        )
        getTotalPayments()
    }


    const { mutateAsync, isLoading } = useMutation( ( data ) => putSalePayment( sale_id, data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 200 ) {
                message.success( data.data.message );
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

    const makePayment = () => {
        smallTalk.confirm(
            "Confirm Payment", "Do you wish to update sales payment?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            mutateAsync( payments );
        } ).catch( ex => {
            return false;
        } );
    }


    return (
        <>
            {/* <Divider orientation='left' orientationMargin={ 0 } className="mb-1">Payment Methods</Divider> */ }
            {
                payments.map( ( pay, index ) =>
                    <PaymentMethod
                        usedMethods={ payments }
                        payment={ pay }
                        key={ index }
                        onUpdate={ updatePayments }
                        onDelete={ deletePayments }
                    /> )
            }
            <button onClick={ () => setPayments(
                [
                    ...payments,
                    {
                        id: nanoid(),
                        method: '',
                        amount: 0,
                        transaction_id: sale_id
                    }
                ] ) } className="button is-small">
                <span className="bi bi-plus-circle me-2"></span>
                Add Payment
            </button>
            <Divider />
            <p>Total Payment: { totalPayments }</p>
            <Divider />
            <button
                onClick={ makePayment }
                className={ `button bokx-btn ${ isLoading && ' is-loading ' }` }>
                <span className="bi bi-check me-2"></span>
                Pay
            </button>
        </ >
    )
}