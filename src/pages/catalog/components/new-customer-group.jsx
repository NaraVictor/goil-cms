import { message } from "antd";
import _ from "lodash";
import { useState } from "react";
import { useMutation } from "react-query";
import { postNewCategory } from "../../../helpers/api";

const NewCustomerGroupForm = ( { onUpdate } ) => {
    const [ state, setState ] = useState( {
        title: '',
        type: 'customer'
    } )


    const { mutateAsync, isLoading } = useMutation( ( data ) => postNewCategory( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );
                setState( {
                    title: '',
                    type: 'customer'
                } )
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
            <form
                onSubmit={ e => {
                    e.preventDefault()
                    mutateAsync( state )
                } }
            >
                <div className="field">
                    <label className="mb-0" htmlFor="title">Title</label>
                    <input
                        value={ state.title }
                        onChange={ e => setState( { ...state, title: e.target.value } ) }
                        className="input" type="text"
                        autoFocus
                        id="title" placeholder="enter category title here" />
                </div>
                <button
                    disabled={ state.title.length === 0 }
                    className={ `button btn-prim mt-3 ${ isLoading && ' is-loading' }` } type='submit' >
                    <span className="bi bi-save me-2"></span>
                    Save
                </button>
            </form>
        </div>
    );
}

export default NewCustomerGroupForm;