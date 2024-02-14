import { message } from 'antd'
import React, { useState } from 'react'
import { RequiredIndicator } from '../../../components/shared'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query';
import { postNewOutlet } from '../../../helpers/api';
import { getUser } from '../../../helpers/auth';

export default function NewOutletForm ( { onUpdate } ) {
    const { handleSubmit, register, reset } = useForm();

    const { mutateAsync, isLoading } = useMutation( ( data ) => postNewOutlet( getUser().shop_id, data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );
                reset()
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


    const postSubmit = ( data ) => mutateAsync( data );


    return (
        <form onSubmit={ handleSubmit( postSubmit ) }>
            <div className='field'>
                <label htmlFor="outlet_name">
                    Outlet Name
                    <RequiredIndicator />
                </label>
                <input
                    type="text"
                    id='outlet_name'
                    autoFocus
                    { ...register( 'outlet_name', { required: true } ) }
                    className="input w-100"
                    placeholder='Outlet official name'
                />
            </div>
            <div className='field'>
                <label htmlFor="contact">
                    Contact
                    <RequiredIndicator />
                </label>
                <input
                    type="tel"
                    id='contact'
                    { ...register( 'contact', { required: true } ) }
                    className="input w-100"
                    placeholder='primary contact of outlet'
                />
            </div>
            {/* <div className='field'>
                <label htmlFor="location">
                    location
                    <RequiredIndicator />
                </label>
                <input
                    type="text"
                    id='location'
                    { ...register( 'location', { required: true } ) }
                    className="input w-100"
                    placeholder='primary contact of outlet'
                />
            </div> */}
            <div className='field'>
                <label htmlFor="city">
                    City
                    <RequiredIndicator />
                </label>
                <input
                    type="text"
                    id='city'
                    { ...register( 'city', { required: true } ) }
                    className="input w-100"
                    placeholder='input outlet city'
                />
                {/* TODO: ADD CITIES */ }
            </div>
            <div className='field'>
                <label htmlFor="receipt_abbreviation">
                    Receipt Abbreviation
                    <RequiredIndicator />
                </label>
                <input
                    type="text"
                    maxLength={ 3 }
                    id='receipt_abbreviation'
                    { ...register( 'receipt_abbreviation', { required: true } ) }
                    className="input w-100"
                    placeholder='3 unique characters for receipt number'
                />
            </div>
            <div className='field'>
                <label htmlFor="address">
                    Address
                </label>
                <input
                    type="text"
                    id='address'
                    { ...register( 'address' ) }
                    className="input w-100"
                    placeholder='Outlet physical address'
                />
            </div>

            <button className={ `button btn-prim mt-3 ${ isLoading && ' is-loading' }` } type='submit'>
                <span className="bi bi-save me-2"></span>
                Save
            </button>
        </form >
    )
}
