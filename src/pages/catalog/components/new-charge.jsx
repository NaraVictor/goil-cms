import { Divider, message, Select } from 'antd'
import _ from 'lodash';
import { useMutation, useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { postNewCharge } from '../../../helpers/api';
import { RequiredIndicator } from '../../../components/shared';

const NewChargeForm = ( { showFooter, onSuccess, showHeader = true, onClose } ) => {

    const { handleSubmit, register, reset } = useForm()


    const { mutateAsync, isLoading } = useMutation( ( data ) => postNewCharge( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );
                onSuccess()
                reset()
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
        <div className='pt-3'>
            {
                showHeader &&
                <>
                    <div className="d-flex justify-content-between align-items-center sticky-top bg-white pt-1 px-4">
                        <div>
                            <h5>New Charge</h5>
                        </div>
                        <div className='buttons has-addons'>
                            <button
                                onClick={ () => document.getElementById( 'submit_btn' ).click() }
                                className={ `button btn-prim ${ isLoading && ' is-loading' }` }>
                                <span className="bi bi-save me-2"></span>
                                Save
                            </button>
                            <button className="button bokx-btn" onClick={ onClose }>
                                <span className="bi bi-x-circle me-2"></span>
                                Close
                            </button>
                        </div>
                    </div>
                    <Divider />
                </>
            }
            <form onSubmit={ handleSubmit( mutateAsync ) } className="p-3">
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
                                maxLength={ 250 }
                                className="input"
                                placeholder="name of this charge"
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
                            <small>cost per unit</small>
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
                                placeholder="what is this charge for?"
                                { ...register( "description", { required: true } ) }
                            ></textarea>
                        </div>

                    </div>
                </div>
                <input type="submit" hidden id="submit_btn" />
                {
                    showFooter &&
                    <>
                        <Divider />
                        <button className={ `button btn-prim me-3 ${ isLoading && ' is-loading' }` }>
                            <span className="bi bi-save me-2"></span>
                            Save
                        </button>
                    </>
                }
            </form>

        </div>
    );
}

export default NewChargeForm;