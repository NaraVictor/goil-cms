import { Alert, Modal, Select } from "@mantine/core";
import { Divider, message } from "antd";
import _ from "lodash";
import { useState } from "react";
import { useMutation } from "react-query";

import { RequiredIndicator } from "../../../components/shared";
import { postNewProduct } from "../../../helpers/api";
import smallTalk from 'smalltalk'
import { IconX } from "@tabler/icons-react";


const productsStateTemplate = {
    product_name: '', description: '',
    unit_price: 0,
    unit: null,
}


const NewProductForm = ( { onSuccess, showHeader = true, onClose } ) => {

    const [ errMsg, setErrMsg ] = useState( '' )
    const [ state, setState ] = useState( productsStateTemplate )

    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        zIndex: 1000,
    } )

    const { mutateAsync: createProduct, isLoading } = useMutation( ( data ) => postNewProduct( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );

                setState( productsStateTemplate )
                onSuccess()
                return;
            }

            throw data;
        },
        onError: ( error, variables, context ) => {
            const err = error.response.data.message;
            if ( _.isArray( err ) ) {
                err?.map( err =>
                    message.error( err.message )
                );
            }
            else {
                message.error( err );
            }
        },
        retry: true
    } );


    const createHandler = () => {
        smallTalk.confirm(
            "Add Product", "You are about to update inventory, continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {

            // const { isError, message, data } = validateItem( product, stocks, variants, suppliers )

            // if ( !isError ) {
            setErrMsg( "" )
            createProduct( data );
            return;
            // }

            setErrMsg( message )

        } ).catch( ex => {
            return false;
        } );

    }


    return (
        <div className="pt-3">
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                zIndex={ modal.zIndex }
            >
                { modal.content }
            </Modal>
            {
                showHeader &&
                <>
                    <div className="d-flex justify-content-between align-items-center sticky-top bg-white pt-1 px-4">
                        <div>
                            <h5>New Product</h5>
                        </div>
                        <div className="buttons has-addons">
                            <button
                                onClick={ createHandler }
                                className={ `button btn-prim ${ isLoading && ' is-loading' }` }>
                                <span className="bi bi-save me-2"></span>
                                <span className="d-none d-md-inline">Save</span>
                            </button>
                            <button className="button bokx-btn" onClick={ onClose }>
                                <span className="bi bi-x-circle me-2"></span>
                                <span className="d-none d-md-inline">Close</span>
                            </button>
                        </div>
                    </div>
                    <Divider />
                </>
            }
            {
                errMsg &&
                <Alert
                    className="mx-4"
                    icon={ <IconX /> }
                    variant="filled" color="red">
                    { errMsg }
                </Alert>
            }
            <div className="p-4">
                <div className="row">
                    <div className="field col-12">
                        <label className="mb-0" htmlFor="product_name">
                            Name
                            <RequiredIndicator />
                        </label>
                        <input
                            className="input"
                            type="text"
                            id="product_name"
                            required
                            value={ state.product_name }
                            onChange={ e => setState( { ...state, product_name: e.target.value } ) }
                            autoFocus
                            placeholder="enter the product name here" />
                    </div>

                </div>
                <div className="row py-3">
                    <div className="field col-md-6 col-12">
                        <label className="mb-0" htmlFor="product_unit">
                            Product Unit
                            <RequiredIndicator />
                        </label>
                        <Select
                            id='product_unit'
                            value={ state?.unit }
                            required
                            onChange={ ( value ) => setState( { ...state, unit: value } ) }
                            size="md"
                            clearable
                            searchable
                            placeholder='select item unit'
                            data={
                                [
                                    {
                                        value: 'litre',
                                        label: 'Litre'
                                    },
                                    {
                                        value: 'box',
                                        label: 'Box'
                                    }
                                ]
                            }
                        />
                    </div>
                    <div className="field col-md-6 col-12">
                        <label className="mb-0" htmlFor="unit_price">
                            Unit Price
                            {
                                state.unit && <span className="ms-1">(per { _.capitalize( state.unit ) })</span>
                            }
                            <RequiredIndicator />
                        </label>
                        <input
                            value={ state.unit_price }
                            onChange={ e => setState( { ...state, unit_price: e.target.value } ) }
                            required
                            className="input"
                            type="number" step="0.01"
                            id="unit_price" placeholder="0.00" />
                    </div>
                </div>
                <div className="row">
                    <div className="field col-12">
                        <label className="mb-0" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            rows={ 3 }
                            value={ state.description }
                            onChange={ e => setState( { ...state, description: e.target.value } ) }
                            className="textarea"
                            placeholder="provide a description"></textarea>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default NewProductForm;





