import { DatePicker, Divider, Select, message } from 'antd'
import { useState } from 'react';
import NewPromoCodeForm from './new-promo-code';
import smallTalk from 'smalltalk'
import { useMutation } from 'react-query';
import { postNewCampaign } from '../../../helpers/api';
import _ from 'lodash';
import { campaignSchema } from '../../../helpers/schemas';
import { Alert, Modal } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

const campaignStateTemplate = {
    discountType: 'cash',
}


const NewCampaignForm = ( { onSuccess, showHeader = true, onClose } ) => {

    const [ errMsg, setErrMsg ] = useState( '' )
    const [ state, setState ] = useState( campaignStateTemplate )

    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        zIndex: 1000,
    } )

    const { RangePicker } = DatePicker;
    const { Option } = Select;
    const dateFormat = "MMM DD, yy";

    // handlers
    const handleResetFilters = () => {
        // setFilteredData( sales );
    };

    const handleDiscountType = () => {
        // 
    }



    const { mutateAsync: createCampaign, isLoading } = useMutation( ( data ) => postNewCampaign( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );

                // clear states
                setState( campaignStateTemplate )
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


    const createHandler = () => {
        smallTalk.confirm(
            "Add Campaign", "You are about to add a new campaign, continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {

            campaignSchema.validate( state ).then( () => {
                setErrMsg( "" )
                createCampaign( data );
            } ).catch( ex => setErrMsg( ex ) )

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
                            <h5>New Campaign</h5>
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
                <div>
                    <div className="row">
                        <div className="field col-12">
                            <label className="mb-0" htmlFor="campaignName">Campaign Name</label>
                            <input className="input"
                                id="campaignName" placeholder="enter campaign/promotion name" maxLength={ 50 } />
                            <small className="text-muted">max 50 characters</small>
                        </div>
                        <div className="my-2 field col-12">
                            <label className="mb-0" htmlFor="description">Short Description</label>
                            <textarea className="textarea"
                                id="description" placeholder="enter a short description to explain the campaign" maxLength={ 200 } ></textarea>
                            <small className="text-muted">max 200 characters</small>
                        </div>
                        <div className="my-2 field col-12">
                            <label className="mb-0 d-block" htmlFor="dates">Dates</label>
                            <RangePicker
                                name="date-range"
                                id='dates'
                                size='large'
                                className='w-100'
                                format={ dateFormat }
                                onChange={ ( e ) => handleDateFilter( e ) }
                            />
                        </div>
                        {/* <div className="my-2 field col-12">
                            <label className="mb-0 d-block" htmlFor="outlets">Outlets</label>
                            <Select
                                mode="multiple"
                                size='large'
                                id='outlets'
                                placeholder="Please select"
                                className='w-100'
                            defaultValue={ [ 'a10', 'c12' ] }
                            onChange={ handleChange }
                            >
                                <Option key='key'></Option>
                    </Select>
                </div> */}
                        <div className="my-2 field col-12">
                            <label className="mb-0" htmlFor="discount">Discount Type</label>
                            <div>
                                <div className="buttons has-addons mb-0">
                                    <button className="button is-info">%</button>
                                    <button className="button">GHS</button>
                                </div>
                                <div className="control has-icons-left has-icons-right mt-0">
                                    <input className="input" type="number" step="0.01" min={ 0 }
                                        id="discount"
                                    // placeholder='switch based on selected (%=enter figure without symbol)'
                                    />

                                    <span className="icon is-small is-left">
                                        <i className="bi bi-cash"></i>
                                    </span>
                                    {/* <span className="icon is-small is-left">
                                    <i className="bi bi-percent"></i>
                                </span> */}
                                </div>
                            </div>
                        </div>
                        <div className="my-3 col-12">
                            <button className='button d-inline' type='link'
                                onClick={ () => setModal( {
                                    title: "New Campaign",
                                    isOpen: true,
                                    content: <NewPromoCodeForm />
                                } ) }>
                                Add Code
                                <span className="bi bi-plus-square ms-2"></span>
                            </button>
                            <p>
                                <strong>x</strong> codes added
                            </p>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default NewCampaignForm;