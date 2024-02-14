import { useState } from "react";
import { Alert } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { useMutation } from "react-query";
import { postSendMessage } from "../helpers/api";
import { message } from "antd";
import _ from "lodash";
import validator from "validator";

const SendToOther = ( { orderId } ) => {
    const [ state, setState ] = useState( {
        recipient: '',
        channel: 'email', //or whatsapp
        source: 'purchaseOrder',
        action: 'invoice',
        data: { id: orderId }
    } )
    const [ errMsg, setErr ] = useState( '' )

    const { mutateAsync: sendMsg, isLoading } = useMutation( ( data ) => postSendMessage( data ), {
        onSuccess: ( data, variables, context ) => {

            if ( data.status === 201 ) {
                message.success( data.data.message );
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


    const handleSend = () => {

        if ( !state.recipient ) {
            // setErr( 'Please input email address' )
            message.error( `please input ${ state.channel === 'email' ? 'email address' : 'phone number' }` )
            return
        }


        if ( !state.channel ) {
            message.error( 'select either email or whatsapp' )
            return
        }


        if ( state.channel === 'email' && !validator.isEmail( state.recipient.trim() ) ) {
            message.error( 'invalid email address' )
            return
        }


        sendMsg( state )

    }


    return (
        <div>
            <div className="buttons has-addons mb-2">
                <button
                    onClick={ () => setState( { ...state, channel: 'email' } ) }
                    className={ `button bokx-btn is-small ${ state.channel === 'email' && ' btn-prim' }` }>
                    <span className="bi bi-envelope me-2"></span>
                    Email
                </button>
                <button
                    onClick={ () => setState( { ...state, channel: 'sms' } ) }
                    className={ `button bokx-btn is-small ${ state.channel === 'sms' && ' btn-prim' }` }>
                    <span className="bi bi-chat-left-text me-2"></span>
                    SMS
                </button>
                <button
                    onClick={ () => setState( { ...state, channel: 'whatsapp' } ) }
                    className={ `button bokx-btn is-small ${ state.channel === 'whatsapp' && ' btn-prim' }` }>
                    <span className="bi bi-whatsapp me-2"></span>
                    WhatsApp
                </button>
            </div>

            <div className="row">
                <div className="field col-12">
                    <label className="mb-0" htmlFor="channel">
                        { state.channel === 'whatsapp' ? 'WhatsApp Number' : state.channel === 'sms' ? 'Phone Number' : 'Email Address' }
                    </label>
                    <input
                        type={ state.channel === 'email' ? 'email' : 'tel' }
                        className="d-block w-100 input"
                        id="channel"
                        required
                        placeholder={ `enter ${ state.channel === 'whatsapp' ? 'whatsapp number' : state.channel === 'sms' ? 'phone number' : 'email address' } here` }
                        value={ state.recipient }
                        onChange={ e => setState( { ...state, recipient: e.target.value } ) }
                    />
                </div>
            </div>
            {/* { errMsg && (
                <Alert
                    icon={ <IconX /> }
                    variant="filled" color="red" className="text-center mt-3">
                    { errMsg }
                </Alert>
            ) } */}
            <button
                onClick={ handleSend }
                className={ `button bokx-btn btn-prim mt-3 ${ isLoading && ' is-loading' }` } >
                <span className="bi bi-send me-2"></span>
                Send
            </button>
        </div>
    );
};

export default SendToOther;
