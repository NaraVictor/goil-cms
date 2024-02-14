import { Loader } from "@mantine/core";
import { message } from "antd";
import _ from "lodash";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getCategory, putCategory } from "../../../helpers/api";

const EditCategoryForm = ( { id, canEdit, type, onUpdate } ) => {
    // type: customer, expense, product
    const [ state, setState ] = useState( {
        title: '',
        id
    } )

    useQuery( {
        queryFn: () => getCategory( id ),
        queryKey: [ 'expense-category', id ],
        onSuccess: data => setState( data )
    } );


    const { mutateAsync, isLoading } = useMutation( ( data ) => putCategory( state ), {
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
                    <>
                        <Loader />
                        <span className="ms-2">Please wait...</span>
                    </> :
                    <form
                        onSubmit={ e => {
                            e.preventDefault()
                            mutateAsync( state )
                        } }
                    >
                        <div className="field">
                            <label className="mb-0" htmlFor="title">Title</label>
                            <input className="input" type="text"
                                value={ state.title }
                                onChange={ e => setState( {
                                    ...state,
                                    title: e.target.value
                                } ) }
                                autoFocus
                                disabled={ !canEdit }
                                id="title" placeholder="enter category title here" />
                        </div>
                        {
                            canEdit &&
                            <button
                                disabled={ state.title.length === 0 }
                                className={ `button btn-prim mt-3 ${ isLoading && ' is-loading' }` } type='submit' >
                                <span className="bi bi-check-all me-2"></span>
                                Update
                            </button>
                        }
                    </form>
            }

        </div>
    );
}

export default EditCategoryForm;