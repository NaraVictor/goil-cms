import { Loader, MultiSelect, Select } from '@mantine/core'
import { message } from 'antd'
import _ from 'lodash'
import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { RequiredIndicator } from '../../../components/shared'
import { getAllOutlets, getAllStaffs, getUser as getUserById, putUser } from '../../../helpers/api'
import { ROLES, getUser, refreshToken } from '../../../helpers/auth'

export default function EditUserForm ( { id, onUpdate } ) {
    const [ state, setState ] = useState( {} )

    useQuery( {
        queryFn: () => getUserById( id ),
        queryKey: [ 'user', id ],
        onSuccess: data =>
            setState( {
                id: data.id,
                staff_id: data.staff_id,
                shop_id: data.shop_id,
                role: data.role,
                email: data.email,
                outlets: data.assigned_outlets?.map( out => out.outlet_id )
            } )
    } );

    const { data: staffs = [] } = useQuery( {
        queryFn: () => getAllStaffs(),
        queryKey: [ 'staffs' ],
        retry: true
    } );

    const { data: outlets = [] } = useQuery( {
        queryFn: () => getAllOutlets( getUser().shop_id ),
        queryKey: [ 'all-outlets' ],
    } );


    const { mutateAsync, isLoading } = useMutation( ( data ) => putUser( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 200 ) {
                message.success( data.data.message );

                if ( id === getUser().id )
                    refreshToken()

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


    const handleSubmit = () => {
        if ( _.isEmpty( state.outlets ) ) {
            message.error( 'No outlets assigned' )
            return false
        }

        mutateAsync( state )
    }

    return (

        <>
            {
                _.isEmpty( state ) ?
                    <div className='d-flex align-items-center text-center'>
                        <Loader />
                        <span className='ms-3'>Fetching data...</span>
                    </div> :

                    <div>
                        <div className='field'>
                            <label htmlFor="staff_id">
                                Staff
                                <RequiredIndicator />
                            </label>
                            <Select
                                id='staff_id'
                                required
                                autoFocus
                                clearable
                                size="md"
                                value={ state.staff_id }
                                onChange={ ( value ) => setState( { ...state, staff_id: value } ) }
                                placeholder='select staff'
                                data={ staffs.map( st => {
                                    return {
                                        value: st.id,
                                        label: `${ st.first_name } ${ st.last_name }`
                                    }
                                } ) }
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor="role">
                                Role
                                <RequiredIndicator />
                            </label>
                            <Select
                                id='role'
                                value={ state.role }
                                required
                                onChange={ ( value ) => setState( { ...state, role: value } ) }
                                size="md"
                                clearable
                                placeholder='user role'
                                data={
                                    ROLES.map( role => {
                                        return {
                                            value: role.value,
                                            label: role.label
                                        }
                                    } )
                                }
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor="email">
                                Email Address
                                <RequiredIndicator />
                            </label>
                            <input
                                type="email"
                                id='email'
                                required
                                onChange={ ( e ) => setState( { ...state, email: e.target.value } ) }
                                value={ state.email }
                                className="input w-100"
                                placeholder='active email address'
                            />
                            <small>generated password, resets and other information will be sent here</small>
                        </div>
                        <div className='field'>
                            <label htmlFor="outlets">
                                Assigned Outlets
                                <RequiredIndicator />
                            </label>
                            <MultiSelect
                                id='outlets'
                                size="md"
                                required
                                onChange={ ( values ) => setState( { ...state, outlets: values } ) }
                                value={ state.outlets }
                                placeholder='select outlets user will have access to'
                                data={
                                    outlets.map( ol => {
                                        return {
                                            value: ol.id,
                                            label: ol.outlet_name
                                        }
                                    } )
                                }
                            />
                        </div>

                        <button
                            onClick={ handleSubmit }
                            className={ `button btn-prim mt-3 ${ isLoading && ' is-loading' }` } type='submit'
                        >
                            <span className="bi bi-check-all me-2"></span>
                            Update
                        </button>
                    </div>
            }
        </>

    )
}
