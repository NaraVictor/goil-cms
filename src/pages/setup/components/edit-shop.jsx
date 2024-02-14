import { Loader, Select } from '@mantine/core';
import { message } from 'antd'
import _ from 'lodash';
import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query';
import { RequiredIndicator } from '../../../components/shared'
import { getShop, putShop } from '../../../helpers/api';
import currencies from '../../../currencies.json'
import { refreshToken } from '../../../helpers/auth';

export default function EditShopComponent ( { id, onUpdate } ) {
    const [ state, setState ] = useState( {} )

    useQuery( {
        queryFn: () => getShop( id ),
        queryKey: [ 'shop', id ],
        onSuccess: data => setState( data )
    } );


    const { mutateAsync, isLoading } = useMutation( ( data ) => putShop( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 200 ) {
                message.success( data.data.message );
                onUpdate();
                refreshToken();
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
        <>
            {
                _.isEmpty( state ) ?
                    <div className='d-flex align-items-center text-center'>
                        <Loader />
                        <span className='ms-3'>Fetching data...</span>
                    </div> :
                    <form onSubmit={ e => {
                        e.preventDefault();
                        mutateAsync( state )
                    } }>
                        <div className='field'>
                            <label htmlFor="shop_name">
                                Shop Name
                                <RequiredIndicator />
                            </label>
                            <input
                                type="text"
                                id='shop_name'
                                autoFocus
                                required
                                value={ state.shop_name }
                                onChange={ ( e ) => setState( {
                                    ...state,
                                    shop_name: e.target.value
                                } ) }
                                className="input w-100"
                                placeholder='shop name'
                            />
                        </div>
                        <div className="row field">
                            <div className="col-md-6 col-12">
                                <div className='field'>
                                    <label htmlFor="primary_contact">
                                        Primary Contact
                                        <RequiredIndicator />
                                    </label>
                                    <input
                                        type="tel"
                                        id='primary_contact'
                                        required
                                        value={ state.primary_contact }
                                        onChange={ ( e ) => setState( {
                                            ...state,
                                            primary_contact: e.target.value
                                        } ) }
                                        className="input w-100"
                                        placeholder='contact number'
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 col-12 mt-3 mt-md-0">
                                <div className='field'>
                                    <label htmlFor="secondary_contact">
                                        Secondary Contact
                                    </label>
                                    <input
                                        type="tel"
                                        id='secondary_contact'
                                        value={ state.secondary_contact }
                                        onChange={ ( e ) => setState( {
                                            ...state,
                                            secondary_contact: e.target.value
                                        } ) }
                                        className="input w-100"
                                        placeholder='contact number'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='field'>
                            <label htmlFor="email">
                                Email
                                <RequiredIndicator />
                            </label>
                            <input
                                type="email"
                                id='email'
                                required
                                value={ state.email }
                                onChange={ ( e ) => setState( {
                                    ...state,
                                    email: e.target.value
                                } ) }
                                className="input w-100"
                                placeholder='active email address'
                            />
                        </div>
                        <div className="row field">
                            <div className='col-md-6 col-12 field'>
                                <label htmlFor="tin">
                                    TIN
                                </label>
                                <input
                                    type="text"
                                    id='tin'
                                    value={ state.tin }
                                    onChange={ ( e ) => setState( {
                                        ...state,
                                        tin: e.target.value
                                    } ) }
                                    className="input w-100"
                                    placeholder='tin number'
                                />
                            </div>
                            <div className='col-md-6 col-12 field'>
                                <label htmlFor="gps_address">
                                    GPS Address
                                </label>
                                <input
                                    type="text"
                                    id='gps_address'
                                    value={ state.gps_address }
                                    onChange={ ( e ) => setState( {
                                        ...state,
                                        gps_address: e.target.value
                                    } ) }
                                    className="input w-100"
                                    placeholder='gps address'
                                />
                            </div>
                        </div>
                        <div className="row field">
                            <div className='col-md-6 col-12 field'>
                                <label htmlFor="base_currency">
                                    Base Currency
                                </label>
                                <Select
                                    id='base_currency'
                                    value={ state.base_currency }
                                    required
                                    onChange={ ( value ) => setState( {
                                        ...state,
                                        base_currency: value
                                    } ) }
                                    size="md"
                                    searchable
                                    clearable
                                    placeholder='pick currency'
                                    data={
                                        currencies.map( cur => {
                                            return {
                                                value: cur.code,
                                                label: cur.name
                                            }
                                        }
                                        )
                                    }
                                />
                            </div>
                            <div className='col-md-6 col-12 field'>
                                <label htmlFor="momo_number">
                                    MoMo Number
                                </label>
                                <input
                                    type="tel"
                                    id='momo_number'
                                    value={ state.momo_number }
                                    onChange={ ( e ) => setState( {
                                        ...state,
                                        momo_number: e.target.value
                                    } ) }
                                    className="input w-100"
                                    placeholder='mobile money number'
                                />
                            </div>
                        </div>

                        <div className='field'>
                            <label htmlFor="website">
                                Website
                            </label>
                            <input
                                type="text"
                                id='website'
                                value={ state.website }
                                onChange={ ( e ) => setState( {
                                    ...state,
                                    website: e.target.value
                                } ) }
                                className="input w-100"
                                placeholder='shop website here'
                            />
                        </div>

                        <button
                            className={ `button btn-prim mt-3 ${ isLoading && ' is-loading' }` } type="submit"            >
                            <span
                                className="bi bi-check-all me-2"></span>
                            Update
                        </button>
                    </form>
            }
        </>

    )
}
