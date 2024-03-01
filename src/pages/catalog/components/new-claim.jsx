import { Divider, message } from 'antd'
import { useState } from 'react';
import smallTalk from 'smalltalk'
import { useMutation } from 'react-query';
import { postClaimReward } from '../../../helpers/api';
import _ from 'lodash';
import { Alert, Modal, Select } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { Chip } from '@mui/material';
import Tile from '../../../components/pages/tile';
import { demoCampaigns, demoCustomers, demoProducts, demoRegisteredPrograms } from "../../../data"

const claimStateTemplate = {
    customer_id: null,
    points: 0,
    campaign_id: null
}


const NewClaimForm = ( { onSuccess, showHeader = true, onClose } ) => {

    const [ errMsg, setErrMsg ] = useState( '' )
    const [ state, setState ] = useState( claimStateTemplate )

    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        zIndex: 1000,
    } )

    // const { Option } = Select;
    const dateFormat = "MMM DD, yy";


    const { mutateAsync: claimReward, isLoading } = useMutation( ( data ) => postClaimReward( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );

                // clear states
                setState( claimStateTemplate )
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
            "Claim Reward", "You are about to claim royalty points, continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {

            claimReward( data );
            // campaignSchema.validate( state ).then( () => {
            //     setErrMsg( "" )
            //     claimReward( data );
            // } ).catch( ex => setErrMsg( ex ) )

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
                            <h5>Claim Reward</h5>
                        </div>
                        <div className="buttons has-addons">
                            <button
                                onClick={ createHandler }
                                className={ `button btn-prim ${ isLoading && ' is-loading' }` }>
                                <span className="bi bi-check-circle me-2"></span>
                                <span className="d-none d-md-inline">Claim Reward</span>
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
                        <div className="col-md-6 col-12 mb-3">
                            <Chip label="Customer" className='mb-3' />
                            <div className="field col-12">
                                <label className="mb-0" htmlFor="customer">Customer</label>
                                <Select
                                    id='customer'
                                    value={ state.customer_id }
                                    required
                                    onChange={ ( value ) => setState( { ...state, customer_id: value } ) }
                                    size="md"
                                    clearable
                                    searchable
                                    placeholder='select customer'
                                    data={ demoCustomers.map( cus => {
                                        return {
                                            value: cus.id,
                                            label: cus.full_name
                                        }
                                    } ) }
                                />
                            </div>
                            {
                                state.campaign_id &&
                                <div className="field col-12">
                                    <label className="mb-0" htmlFor="claimPoints">Reward Points</label>
                                    <input
                                        value={ state.points }
                                        onChange={ e => setState( { ...state, points: e.target.value } ) }
                                        className="input"
                                        type='number'
                                        id="claimPoints" placeholder="How many points do you wanna claim?" min={ 1 } />
                                    <small className="text-muted">minimum claim point is 1</small>
                                </div>
                            }
                            {
                                ( state.customer_id && state.points > 0 ) &&
                                <div className="mt-4">
                                    <strong>estimated value</strong>
                                    <h1 className='mb-0'>1.5L</h1>
                                    <strong><Chip color='primary' label="GHS 90" /></strong>
                                </div>
                            }
                        </div>

                        <div className="col-md-6 col-12">
                            {
                                demoRegisteredPrograms.filter( dr => dr.customer_id === state.customer_id ).length > 0 ?
                                    <>
                                        <Chip label="Registered Loyalty Programs" />
                                        <p>select campaign to claim points from</p>
                                        <div className="row mt-3">
                                            {
                                                demoRegisteredPrograms
                                                    .filter( rp => rp.customer_id === state.customer_id )
                                                    .map( ( camp ) => {
                                                        return <div className="col-12 col-md-6 mb-2">
                                                            <Tile
                                                                onClick={ () => setState( {
                                                                    ...state,
                                                                    campaign_id: camp.campaign_id
                                                                } ) }
                                                                isActive={ state.campaign_id === camp.campaign_id }
                                                                isAction
                                                                title={ demoCampaigns.find( cam => cam.id == camp.campaign_id ).campaign_name }
                                                                label="54 pts remaining"
                                                            />
                                                        </div>
                                                    } ) }
                                        </div>
                                    </> :
                                    <Chip className='mt-5' color='warning' label="No campaigns found for customer" />
                            }
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default NewClaimForm;