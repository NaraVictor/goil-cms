import { DatePicker, Divider, Select, message } from 'antd'
import { useState } from 'react';
import NewPromoCodeForm from './new-promo-code';
import { Modal } from '@mantine/core';
import { Alert, LinearProgress } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { getCampaign, putCampaign } from '../../../helpers/api';
import smallTalk from 'smalltalk'
import { campaignSchema } from '../../../helpers/schemas';
import { useMutation, useQuery } from 'react-query';
import _ from 'lodash';


const campaignStateTemplate = {
    discountType: 'cash',
}

const EditCampaignForm = ( { id, onClose, canEdit, showHeader = true, onUpdate } ) => {
    const [ errMsg, setErrMsg ] = useState( '' )
    const [ state, setState ] = useState( campaignStateTemplate )


    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        zIndex: 1200,
    } )

    const { RangePicker } = DatePicker;
    const { Option } = Select;
    const dateFormat = "MMM DD, yy";

    // queries
    const { refetch: fetchCampaign, isFetching } = useQuery( {
        queryFn: () => getCampaign( id ),
        queryKey: [ 'campaign', id ],
    } )

    // handlers
    const handleResetFilters = () => {
        // setFilteredData( sales );
    };

    const handleDiscountType = () => {
        // 
    }


    const { mutateAsync, isLoading } = useMutation( ( data ) => putCampaign( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 200 ) {
                message.success( data.data.message );
                fetchCampaign()
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

    const updateCampaign = () => {
        smallTalk.confirm(
            "Update Campaign", "You are about to update this campaign, continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( value => {

            campaignSchema.validate().then( () => {
                setErrMsg( "" )
                mutateAsync( state );
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
                            <h5>Campaign Details</h5>
                        </div>
                        <div className="buttons has-addons">
                            {
                                canEdit &&
                                <button
                                    className={ `button bokx-btn btn-prim ${ isLoading && ' is-loading' }` }
                                    onClick={ updateCampaign }
                                >
                                    <span className="bi bi-check-all me-md-2"></span>
                                    <span className="d-none d-md-inline">Update</span>
                                </button>
                            }
                            <button className="button bokx-btn" onClick={ onClose }>
                                <span className="bi bi-x-circle me-md-2"></span>
                                <span className="d-none d-md-inline">Close</span>
                            </button>
                        </div>
                    </div>
                    <Divider />
                </>
            }
            {
                isFetching &&
                <LinearProgress color="success" className="mb-2" />
            }
            {
                !isFetching &&
                <>
                    {
                        errMsg &&
                        <Alert
                            className="mx-4"
                            icon={ <IconX /> }
                            variant="filled" color="red">
                            { errMsg }
                        </Alert>
                    }
                    <div>
                        <div className="row">
                            <div className="field col-12">
                                <label className="mb-0" htmlFor="promotionName">Promotion Name</label>
                                <input className="input"
                                    id="promotionName" placeholder="enter promotion name" maxLength={ 50 } />
                                <small className="text-muted">max 50 characters</small>
                            </div>
                            <div className="my-2 field col-12">
                                <label className="mb-0" htmlFor="description">Short Description</label>
                                <textarea className="textarea"
                                    id="description" placeholder="enter a short description to explain the promotion" maxLength={ 200 } ></textarea>
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
                                    <div class="buttons has-addons mb-0">
                                        <button class="button is-info">%</button>
                                        <button class="button">GHS</button>
                                    </div>
                                    <div class="control has-icons-left has-icons-right mt-0">
                                        <input className="input" type="number" step="0.01" min={ 0 }
                                            id="discount"
                                        // placeholder='switch based on selected (%=enter figure without symbol)'
                                        />

                                        <span class="icon is-small is-left">
                                            <i class="bi bi-cash"></i>
                                        </span>
                                        {/* <span class="icon is-small is-left">
                                    <i class="bi bi-percent"></i>
                                </span> */}
                                    </div>
                                </div>
                            </div>
                            <div className="my-3 col-12">
                                <button className='button d-inline' type='link' onClick={ () => {
                                    setModal( {
                                        title: "Add Promo Codes",
                                        isOpen: true,
                                        content: <NewPromoCodeForm />
                                    } )
                                } }>
                                    Add Code
                                    <span className="bi bi-plus-square ms-2"></span>
                                </button>
                                <p>
                                    <strong>x</strong> codes added
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            }


        </div>
    );
}

export default EditCampaignForm;