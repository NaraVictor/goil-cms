import { Alert, MultiSelect, Select } from '@mantine/core'
import { message } from 'antd'
import React, { useState } from 'react'
import { RequiredIndicator } from '../../../components/shared'
import { useMutation, useQuery } from 'react-query'
import _ from 'lodash'
import { getAllOutlets, getAllStaffs, postAddUser } from '../../../helpers/api'
import { ROLES, getUser } from '../../../helpers/auth'

const newUserTemplate = {
    staff_id: '',
    role: '',
    email: '',
    outlets: []
}

export default function NewUserForm ( { onUpdate } ) {
    const [ state, setState ] = useState( newUserTemplate )


    const { data: staffs = [] } = useQuery( {
        queryFn: () => getAllStaffs(),
        queryKey: [ 'staffs' ],
    } );

    const { data: outlets = [] } = useQuery( {
        queryFn: () => getAllOutlets( getUser().shop_id ),
        queryKey: [ 'outlets' ],
    } );


    const { mutateAsync, isLoading } = useMutation( ( data ) => postAddUser( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );
                onUpdate()
                setState( newUserTemplate )
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


    const postSubmit = () =>
        mutateAsync( state );



    return (
        <form onSubmit={ e => {
            e.preventDefault()

            if ( state.outlets.length === 0 )
                return message.error( 'assign user to 1 or more outlets' )

            postSubmit()
        } }>
            <div className='field'>
                <label htmlFor="staff_id">
                    Staff
                    <RequiredIndicator />
                </label>
                <Select
                    id='staff_id'
                    required
                    autoFocus
                    searchable
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

                        // [ { value: ROLES.shopOwner, label: 'Shop Owner' },
                        // { value: ROLES.manager, label: 'Manager' },
                        // { value: ROLES.accounts, label: 'Accounts' },
                        // { value: ROLES.attendant, label: 'Attendant' },                    ]
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
                <small>user will have access to the assigned outlet's data</small>
            </div>


            <Alert>
                User will receive login instructions and a temporary password via the email address above
            </Alert>
            <button className={ `button btn-prim mt-3 ${ isLoading && ' is-loading' }` } type='submit' >
                <span className="bi bi-save me-2"></span>
                Save
            </button>
        </form>
    )
}
