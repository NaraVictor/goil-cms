import { Divider, message, Switch } from 'antd'
import _ from 'lodash';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { RequiredIndicator } from '../../../components/shared';
import { getAllCategories, getCustomer, putCustomer } from '../../../helpers/api';

const EditCustomerForm = ( { id, canEdit, showHeader = true, onClose, onUpdate, showFooter } ) => {

    const { handleSubmit, register, getValues } = useForm( {
        defaultValues: async () => getCustomer( id )
    } )

    const [ accepts_marketing, setAccepts ] = useState( getValues( 'accepts_marketing' ) )

    const { data: categories = [] } = useQuery( {
        queryFn: () => getAllCategories( 'customer' ),
        queryKey: [ 'customer-categories' ],
    } );


    const { mutateAsync, isLoading } = useMutation( ( data ) => putCustomer( data ), {
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


    return (
        <div className='pt-3'>
            {
                showHeader &&
                <>
                    <div className="d-flex justify-content-between align-items-center sticky-top bg-white pt-1 px-4">
                        <div>
                            <h5>Customer Details</h5>
                        </div>
                        <div className='buttons has-addons'>
                            {
                                canEdit &&
                                <button
                                    onClick={ () => {
                                        document.getElementById( 'submit_btn' ).click();
                                    } }
                                    className={ `button btn-prim ${ isLoading && ' is-loading' }` }
                                >
                                    <span className="bi bi-check-all me-2"></span>
                                    <span className="d-none d-md-inline">
                                        Update
                                    </span>
                                </button>
                            }
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
            <form
                className='p-4'
                onSubmit={ handleSubmit( data => mutateAsync( { ...data, accepts_marketing } ) ) }
            >
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
                            placeholder="customer name"
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
                            {
                                categories.map( cat =>
                                    <option key={ cat.id } value={ cat.id }>{ cat.title }</option>
                                )
                            }
                        </select>
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
                <input type="submit" hidden id='submit_btn' />
            </form>
            {
                canEdit &&
                showFooter &&
                <div className="ps-4 pb-2">
                    <button
                        onClick={ () => {
                            document.getElementById( 'submit_btn' ).click();
                        } }
                        className={ `button btn-prim me-2 ${ isLoading && ' is-loading' }` }
                    >
                        <span className="bi bi-check-all me-2"></span>
                        Update
                    </button>
                </div>
            }
        </div>
    );
}

export default EditCustomerForm;