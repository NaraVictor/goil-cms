import { Divider, message, Select } from 'antd'
import { useMutation, useQuery } from 'react-query';
import { getCharge, putCharge } from '../../../helpers/api';
import { useForm } from 'react-hook-form';
import { RequiredIndicator } from '../../../components/shared';

const EditChargeForm = ( { id, canEdit, showHeader = true, onClose, onUpdate } ) => {

    const { handleSubmit, register } = useForm( {
        defaultValues: async () => getCharge( id )
    } )


    const { mutateAsync, isLoading } = useMutation( ( data ) => putCharge( data ), {
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

        <div className="pt-3">
            {
                showHeader &&
                <>
                    <div className="d-flex justify-content-between align-items-center sticky-top bg-white pt-1 px-4">
                        <div>
                            <h5>Charge Details</h5>
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
                                    Update
                                </button>
                            }
                            <button className="button bokx-btn" onClick={ onClose }>
                                <span className="bi bi-x-circle me-2"></span>
                                Close
                            </button>
                        </div>
                    </div>
                    <Divider />
                </>
            }

            <form onSubmit={ handleSubmit( mutateAsync ) } className="p-4">
                <div className="row">
                    <div className="col-12">
                        <div>
                            <label htmlFor="title">
                                Title
                                <RequiredIndicator />
                            </label>
                            <input
                                type="text"
                                id='title'
                                autoFocus
                                className="input"
                                maxLength={ 250 }
                                placeholder="charge title / name"
                                { ...register( "title", { required: true } ) }
                            />
                        </div>
                        <div className="my-3">
                            <label htmlFor="amount">
                                Amount
                                <RequiredIndicator />
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                id='amount'
                                className="input"
                                placeholder="amount spent"
                                { ...register( "amount", { required: true } ) }
                            />
                        </div>
                        <div className="my-3">
                            <label htmlFor="description">
                                Description
                                <RequiredIndicator />
                            </label>
                            <textarea
                                type="number"
                                step="0.01"
                                min="0"
                                id='description'
                                className="textarea"
                                placeholder="What is this charge and when is it used"
                                { ...register( "description", { required: true } ) }
                            ></textarea>
                        </div>

                    </div>
                </div>
                <button hidden type='submit' id='submit_btn'></button>
            </form>
        </div>
    );
}

export default EditChargeForm;