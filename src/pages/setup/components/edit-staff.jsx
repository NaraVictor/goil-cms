import { Alert, Loader, MultiSelect, Select } from '@mantine/core'
import { message } from 'antd'
import _ from 'lodash'
import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { RequiredIndicator } from '../../../components/shared'
import { getStaff, putStaff } from '../../../helpers/api'

export default function EditStaffForm ( { id, onUpdate } ) {
    const [ state, setState ] = useState( {} )

    useQuery( {
        queryFn: () => getStaff( id ),
        queryKey: [ 'staff', id ],
        onSuccess: data => setState( data )
    } );

    const { mutateAsync, isLoading } = useMutation( ( data ) => putStaff( data ), {
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

        <>
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
                        <div className='row mb-2'>
                            <div className="col-6">
                                <label htmlFor="first_name">
                                    First Name
                                    <RequiredIndicator />
                                </label>
                                <input
                                    type="text"
                                    id='first_name'
                                    required
                                    onChange={ ( e ) => setState( { ...state, first_name: e.target.value } ) }
                                    value={ state.first_name }
                                    className="input w-100"
                                    placeholder='staff first name'
                                />

                            </div>
                            <div className="col-6">
                                <label htmlFor="last_name">
                                    Last Name
                                    <RequiredIndicator />
                                </label>
                                <input
                                    type="text"
                                    id='last_name'
                                    required
                                    onChange={ ( e ) => setState( { ...state, last_name: e.target.value } ) }
                                    value={ state.last_name }
                                    className="input w-100"
                                    placeholder='active email address'
                                />
                            </div>
                        </div>
                        <div className='row mb-2'>
                            <div className="col-6">
                                <label htmlFor="primary_contact">
                                    Primary Contact
                                    <RequiredIndicator />
                                </label>
                                <input
                                    type="text"
                                    id='primary_contact'
                                    maxLength={ 15 }
                                    required
                                    onChange={ ( e ) => setState( { ...state, primary_contact: e.target.value } ) }
                                    value={ state.primary_contact }
                                    className="input w-100"
                                    placeholder='primary contact'
                                />

                            </div>
                            <div className="col-6">
                                <label htmlFor="secondary_contact">
                                    Secondary Contact
                                </label>
                                <input
                                    type="text"
                                    maxLength={ 15 }
                                    id='secondary_contact'
                                    onChange={ ( e ) => setState( { ...state, secondary_contact: e.target.value } ) }
                                    value={ state.secondary_contact }
                                    className="input w-100"
                                    placeholder='other number'
                                />
                            </div>
                        </div>
                        <div className='field'>
                            <label htmlFor="gender">
                                Gender
                                <RequiredIndicator />
                            </label>
                            <Select
                                id='gender'
                                value={ state.gender }
                                required
                                onChange={ ( value ) => setState( { ...state, gender: value } ) }
                                size="md"
                                clearable
                                placeholder='select gender'
                                data={ [
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                ]
                                }
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor="email">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id='email'
                                onChange={ ( e ) => setState( { ...state, email: e.target.value } ) }
                                value={ state.email }
                                className="input w-100"
                                placeholder='active email address'
                            />
                        </div>

                        <div className='field'>
                            <label htmlFor="dob">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                id='dob'
                                onChange={ ( e ) => setState( { ...state, dob: e.target.value } ) }
                                value={ state.dob }
                                className="input w-100"
                                placeholder='date of birth'
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor="job_title">
                                Job Title
                            </label>
                            <input
                                type="text"
                                id='job_title'
                                onChange={ ( e ) => setState( { ...state, job_title: e.target.value } ) }
                                value={ state.job_title }
                                className="input w-100"
                                placeholder='e.g. MD, Sales Clerk etc'
                            />
                        </div>

                        <button className={ `button btn-prim mt-3 ${ isLoading && ' is-loading' }` } type='submit'
                        >
                            <span className="bi bi-check-all me-2"></span>
                            Update
                        </button>
                    </form>
            }
        </>

    )
}
