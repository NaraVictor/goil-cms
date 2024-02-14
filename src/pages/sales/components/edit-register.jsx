import { Loader } from '@mantine/core';
import { message, Select } from 'antd';
import _ from 'lodash';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { getAllOutlets, getRegister, putRegister } from '../../../helpers/api';
import { getUser } from '../../../helpers/auth';

const EditRegisterForm = ( { id, canEdit, onUpdate } ) => {
    const [ state, setState ] = useState( {} )

    const { isFetching, refetch } = useQuery( {
        queryFn: () => getRegister( id ),
        queryKey: [ 'register', id ],
        onSuccess: data => setState( data )
    } );

    const { data: outlets = [] } = useQuery( {
        queryFn: () => getAllOutlets( getUser().shop_id ),
        queryKey: [ 'outlets' ]
    } )

    const { mutateAsync: updateRegister, isLoading } = useMutation( ( data ) => putRegister( data ), {
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
                !state ?
                    <div className='d-flex align-items-center text-center'>
                        <Loader />
                        <span className='ms-3'>Fetching data...</span>
                    </div>
                    :
                    <div className="row">
                        <div className="col-12">
                            <div>
                                <label htmlFor="register_name">Register Name *</label>
                                <input
                                    type="text"
                                    id="register_name"
                                    required
                                    value={ state.register_name }
                                    onChange={ ( e ) => setState( {
                                        ...state,
                                        register_name: e.target.value
                                    } ) }
                                    autoFocus
                                    className="input"
                                    placeholder="register name"
                                />
                            </div>
                            <div className="my-3">
                                <label htmlFor="outlet_id">Outlet *</label>
                                <select
                                    value={ state.outlet_id }
                                    onChange={ e => setState( {
                                        ...state,
                                        outlet_id: e.target.value
                                    } ) }
                                    size='large' className='d-block input w-100' name="outlet_id" id='registerOutlet'
                                    placeholder="select register outlet">
                                    {
                                        outlets.map( out =>
                                            <option selected={ state.outlet_id } value={ out.id }>{ out.outlet_name }</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                        {
                            canEdit &&
                            <div className="col">
                                <button
                                    onClick={ () => {
                                        updateRegister( {
                                            id: state.id,
                                            register_name: state.register_name,
                                            outlet_id: state.outlet_id,
                                        } )
                                    } }
                                    className={ `button btn-prim mt-3 ${ isLoading && ' is-loading' }` }>
                                    <span className="bi bi-check-all me-2"></span>
                                    Update
                                </button>
                            </div>
                        }
                    </div>
            }
        </>
    );
}

export default EditRegisterForm;