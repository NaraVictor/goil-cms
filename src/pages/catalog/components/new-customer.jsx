import { Divider, message, Select } from 'antd'
import _ from 'lodash';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { RequiredIndicator } from '../../../components/shared';
import { getAllCategories, postNewCustomer } from '../../../helpers/api';

import NewCustomerTypeForm from './new-customer-group'
import { Modal } from '@mantine/core';

const NewCustomerForm = ( { showFooter, onSuccess, showHeader = true, onClose } ) => {

    const { Option } = Select;
    const { handleSubmit, register, reset } = useForm()
    const [ accepts_marketing, setAccepts ] = useState( false )
    const [ value, setValue ] = useState()

    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        zIndex: 1000,
    } )

    const { data: categories = [], refetch: fetchCustomers } = useQuery( {
        queryFn: () => getAllCategories( 'customer' ),
        queryKey: [ 'customer-categories' ],
    } );

    const { mutateAsync, isLoading } = useMutation( ( data ) => postNewCustomer( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );
                reset()
                onSuccess()
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


    // handlers
    const handleCountryChange = ( e ) => console.log( 'country change: ', e );

    const handlePhoneChange = ( e ) => {
        setValue( e )
        // console.log( 'country is: ', parsePhoneNumber( e ).country );
    };


    return (
        <div className='pt-3'>
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
                            <h5>New Customer</h5>
                        </div>
                        <div className='buttons has-addons'>
                            <button
                                onClick={ () => document.getElementById( 'submit_btn' ).click() }
                                className={ `button btn-prim  ${ isLoading && ' is-loading' }` }>
                                <span className="bi bi-save me-2"></span>
                                <span className="d-none d-md-inline">
                                    Save
                                </span>
                            </button>
                            <button className="button bokx-btn" onClick={ onClose }>
                                <span className="bi bi-x-circle me-2"></span>
                                <span className="d-none d-md-inline">
                                    Close
                                </span>
                            </button>
                        </div>
                    </div>
                    <Divider />
                </>
            }
            <form className="p-4" autoComplete={ true } onSubmit={ handleSubmit( data => mutateAsync( {
                ...data,
                // accepts_marketing
            } ) ) }>
                <div className="row">
                    <div className="mb-3 col-12">
                        <label htmlFor="customer_name">
                            Name
                            <RequiredIndicator />
                        </label>
                        <input
                            type="text"
                            autoFocus
                            id="customer_name"
                            className="input"
                            placeholder="first name"
                            { ...register( "customer_name", { required: true } ) }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3 col-12">
                        <label htmlFor="contact">
                            Primary Contact
                            <RequiredIndicator />
                        </label>
                        <input
                            type="tel"
                            maxLength={ 15 }
                            id="contact"
                            className="input"
                            placeholder="primary contact"
                            { ...register( "contact", { required: true } ) }
                        />
                    </div>
                    <div className="col-md-6 mb-3 col-12">
                        <label htmlFor="secondary_contact">Secondary Contact</label>
                        <input
                            type="tel"
                            maxLength={ 15 }
                            id="secondary_contact"
                            className="input"
                            placeholder="secondary contact"
                            { ...register( "secondary_contact" ) }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3 col-12">
                        <label htmlFor="gender">
                            Gender
                            <RequiredIndicator />
                        </label>
                        <select
                            id="gender"
                            size='large'
                            className='d-block w-100 input'
                            placeholder="select a gender"
                            { ...register( "gender", { required: true } ) }
                        >
                            <option value="" selected disabled>select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="N/A">Not Applicable</option>
                        </select>
                    </div>
                    <div className="col-md-6 col-12">
                        <label htmlFor="category">Category
                            <RequiredIndicator />
                        </label>
                        <select
                            name="category"
                            id="category"
                            className="d-block w-100 input"
                            placeholder="select customer type"
                            size='large'
                            { ...register( "customer_category_id", { required: true } ) }
                        >
                            <option value="" selected disabled>choose a category</option>
                            {
                                categories.map( cat =>
                                    <option key={ cat.id } value={ cat.id }>{ cat.title }</option>
                                )
                            }
                        </select>
                        <p
                            onClick={ () => setModal( {
                                title: 'Add Category',
                                isOpen: true,
                                content: <NewCustomerTypeForm onUpdate={ fetchCustomers } />,
                                zIndex: 1200
                            } ) }
                            className="text-secondary hover-hand d-inline-block p-1 mb-0">
                            <span className="bi bi-plus-circle me-2"></span>
                            add category
                        </p>
                    </div>
                </div>

                <div className="my-3">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id='email'
                        className="input"
                        placeholder="email address of customer"
                        { ...register( "email" ) }
                    />
                </div>
                <div className="my-3">
                    <label htmlFor="address">Location</label>
                    <input
                        type="text"
                        id='address'
                        className="input"
                        placeholder="address or location of customer"
                        { ...register( "location" ) }
                    />
                </div>
                <div className="my-3">
                    <label htmlFor="note">Note</label>
                    <textarea
                        id='note'
                        className="textarea"
                        placeholder="enter note for customer"
                        { ...register( "notes" ) }
                    ></textarea>
                </div>
                {/* <div className="my-3">
                    <Switch id='accepts_marketing'
                        checked={ accepts_marketing }
                        onChange={ () => setAccepts( !accepts_marketing ) }
                    />
                    <label htmlFor="accepts_marketing" className='ms-2'>Opt-in for email marketing?
                        <strong className='ms-3'>
                            { accepts_marketing ? "YES" : "NO" }
                        </strong></label>
                </div> */}

                <input type="submit" hidden id="submit_btn" />

                {
                    showFooter &&
                    <>
                        <Divider />
                        <button type='submit' className={ `button btn-prim me-3 ${ isLoading && ' is-loading' }` }>
                            <span className="bi bi-save me-2"></span>
                            Save
                        </button>
                    </>
                }
            </form>
        </div>
    );
}

export default NewCustomerForm;