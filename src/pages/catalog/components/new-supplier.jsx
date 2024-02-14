import { Divider, message } from "antd";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { RequiredIndicator } from "../../../components/shared";
import { postNewSupplier } from "../../../helpers/api";

const NewSupplierForm = ( { showFooter, onSuccess, showHeader = true, onClose } ) => {

    const { handleSubmit, register, reset } = useForm()

    const { mutateAsync, isLoading } = useMutation( ( data ) => postNewSupplier( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );
                reset()
                onSuccess()
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
                            <h5>New Supplier</h5>
                        </div>
                        <div className="buttons has-addons">
                            <button
                                onClick={ () => {
                                    document.getElementById( 'submit_btn' ).click()
                                } }
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
            <form onSubmit={ handleSubmit( mutateAsync ) } className="p-4">
                <div className="row">
                    <div className="col-12">
                        <div className="field">
                            <label htmlFor="supplier_code">Supplier Code
                            </label>
                            <input
                                type="text"
                                id="supplier_code"
                                className="input"
                                placeholder="supplier code"
                                { ...register( "supplier_code" ) }
                            />
                            {/* <small>Leave blank for a code to be auto-generated</small> */ }
                        </div>
                        <div className="field">
                            <label htmlFor="supplier_name">Supplier Name
                                <RequiredIndicator />
                            </label>
                            <input
                                type="text"
                                id="supplier_name"
                                autoFocus
                                className="input"
                                placeholder="supplier name"
                                { ...register( "supplier_name", { required: true } ) }
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="contact">
                                Contact
                                <RequiredIndicator />
                            </label>
                            <input
                                type="tel"
                                maxLength={ 15 }
                                id="contact"
                                className="input"
                                placeholder="supplier contact number"
                                { ...register( "contact", { required: true } ) }
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="input"
                                placeholder="email address of supplier"
                                { ...register( "email" ) }
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="location">
                                Location
                                <RequiredIndicator />
                            </label>
                            <input
                                type="text"
                                id="location"
                                className="input"
                                placeholder="location of supplier"
                                { ...register( "location", { required: true } ) }
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="address">
                                Address
                                <RequiredIndicator />
                            </label>
                            <input
                                type="text"
                                id="address"
                                className="input"
                                placeholder="address of supplier"
                                { ...register( "address" ) }
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="default_markup">
                                Default Markup
                                {/* <RequiredIndicator /> */ }
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                id="default_markup"
                                className="input"
                                placeholder="GHS xx.xx"
                                { ...register( "default_markup" ) }
                            />
                        </div>
                    </div>
                </div>
                <input type="submit" hidden id='submit_btn' />
                {
                    showFooter &&
                    <>
                        <Divider />
                        <button
                            type="submit"
                            className={ `button btn-prim me-3 ${ isLoading && ' is-loading' }` }>
                            <span className="bi bi-save me-2"></span>
                            Save
                        </button>
                    </>
                }
            </form>
        </div>
    );
}

export default NewSupplierForm;