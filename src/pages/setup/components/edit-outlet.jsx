import { Loader, Select } from '@mantine/core'
import { message } from 'antd'
import _ from 'lodash'
import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { RequiredIndicator } from '../../../components/shared'
import { getOutlet, putOutlet } from '../../../helpers/api'
import { getUser } from '../../../helpers/auth'

export default function EditOutletComponent ( { id, onUpdate } ) {
    const [ state, setState ] = useState( {} )

    useQuery( {
        queryFn: () => getOutlet( getUser().shop_id, id ),
        queryKey: [ 'outlet', id ],
        onSuccess: data => setState( data )
    } );


    const { mutateAsync, isLoading } = useMutation( ( data ) => putOutlet( getUser().shop_id, data ), {
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
        <div>
            {
                _.isEmpty( state ) ?
                    <div className='d-flex align-items-center text-center'>
                        <Loader />
                        <span className='ms-3'>Fetching data...</span>
                    </div> :
                    <form onSubmit={ ( e ) => {
                        e.preventDefault()
                        mutateAsync( state )
                    } }>
                        <div className='field'>
                            <label htmlFor="outlet_name">
                                Outlet Name
                                <RequiredIndicator />
                            </label>
                            <input
                                type="text"
                                id='outlet_name'
                                required
                                value={ state.outlet_name }
                                onChange={ ( e ) => setState( {
                                    ...state,
                                    outlet_name: e.target.value
                                } ) }
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
                                required
                                value={ state.contact }
                                className="input w-100"
                                placeholder='primary contact of outlet'
                                onChange={ ( e ) => setState( {
                                    ...state,
                                    contact: e.target.value
                                } ) }
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
                                required
                                value={ state.location }
                                className="input w-100"
                                placeholder='location of outlet'
                                onChange={ ( e ) => setState( {
                                    ...state,
                                    location: e.target.value
                                } ) }
                            />
                        </div> */}
                        <div className='field'>
                            <label htmlFor="city">
                                City
                                <RequiredIndicator />
                            </label>
                            <input
                                value={ state.city }
                                onChange={ ( e ) => setState( {
                                    ...state,
                                    city: e.target.value
                                } ) }
                                placeholder="outlet city"
                                type="text"
                                id='city'
                                required
                                className='input'
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor="receipt_abbreviation">
                                Receipt Abbreviation
                                <RequiredIndicator />
                            </label>
                            <input
                                type="text"
                                required
                                id='receipt_abbreviation'
                                maxLength={ 3 }
                                className="input w-100"
                                placeholder='3 unique characters for receipt number'
                                value={ state.receipt_abbreviation }
                                onChange={ ( e ) => setState( {
                                    ...state,
                                    receipt_abbreviation: e.target.value
                                } ) }
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor="address">
                                Address
                            </label>
                            <input
                                type="text"
                                id='address'
                                value={ state.address }
                                className="input w-100"
                                placeholder='Outlet physical address'
                                onChange={ ( e ) => setState( {
                                    ...state,
                                    address: e.target.value
                                } ) }
                            />
                        </div>

                        <button className={ `button btn-prim mt-3 ${ isLoading && ' is-loading' }` }>
                            <span className="bi bi-check-all me-2"></span>
                            Update
                        </button>
                    </form>
            }
        </div>
    )
}
