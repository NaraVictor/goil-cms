import { message, Select } from 'antd';
import _ from 'lodash';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { getAllOutlets, postNewRegister } from '../../../helpers/api';
import { getUser } from '../../../helpers/auth';

const NewRegisterForm = ( { onUpdate } ) => {
    const [ state, setState ] = useState( {
        register_name: '',
        outlet_id: ''
    } )

    const { data: outlets = [], isFetching, refetch } = useQuery( {
        queryFn: () => getAllOutlets( getUser().shop_id ),
        queryKey: [ 'outlets' ]
    } )
    const { Option } = Select;


    const { mutateAsync: newRegister, isLoading } = useMutation( ( data ) => postNewRegister( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );
                // onUpdate()
                setState( {
                    register_name: '',
                    outlet_id: ''
                } )
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


    const handleRegisterCreation = ( data ) => {
        if ( !state.register_name ) {
            message.error( 'Register Name required' )
            return
        }

        if ( !state.outlet_id ) {
            message.error( 'Register Outlet required' )
            return
        }

        newRegister( state )
    }


    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div>
                        <label htmlFor="register_name">Register Name *</label>
                        <input
                            type="text"
                            id="register_name"
                            autoFocus
                            className="input"
                            placeholder="register name"
                            value={ state.register_name }
                            onChange={ e => setState( {
                                ...state,
                                register_name: e.target.value
                            } ) }
                        />
                    </div>
                    <div className="my-3">
                        <label htmlFor="outlet_id">Outlet *</label>
                        <Select
                            size='large'
                            className='d-block w-100'
                            name="outlet_id"
                            id='outlet_id' placeholder="select register outlet"
                            value={ state.outlet_id }
                            defaultValue="select outlet"
                            onChange={ value => setState( { ...state, outlet_id: value } ) }
                        >
                            {
                                outlets.map( out =>
                                    <Option value={ out.id }>{ out.outlet_name }</Option>
                                )
                            }
                        </Select>
                    </div>
                </div>
            </div>
            <button
                disabled={ !state.register_name }
                onClick={ handleRegisterCreation }
                className={ `${ isLoading && 'is-loading ' } button bokx-btn btn-prim sticky-bottom` }>
                <span className="bi bi-save me-2"></span>
                <small>Add Register</small>
            </button>
        </>
    );
}

export default NewRegisterForm;