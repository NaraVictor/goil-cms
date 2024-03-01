import { Modal, Select } from '@mantine/core'
import NewCustomerForm from '../../catalog/components/new-customer'
import { useState } from 'react';
import { useAtom } from 'jotai';
import {
    resetSaleAtom,
    saleAtom, selectedProductsAtom
} from '../../../helpers/state/sales';
import _ from 'lodash';
import Tile from '../../../components/pages/tile';
import { Chip } from '@mui/material';
import { demoCampaigns, demoRegisteredPrograms } from '../../../data';


const TellerComponent = ( {
    customers,
    onFetchCustomers
} ) => {
    const [ products ] = useAtom( selectedProductsAtom )
    const [ sale, setSale ] = useAtom( saleAtom )
    const [ , resetSale ] = useAtom( resetSaleAtom )

    // others
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        size: ""
    } )

    return (
        <div className='sticy-bottom'>
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                size={ modal.size || 'md' }
                zIndex={ 99 }
            >
                { modal.content }
            </Modal>

            <div className="d-flex mb-2 mt-3 mt-md-0">
                {
                    products.length > 0 &&
                    <button
                        className='button is-text px-2'
                        onClick={ () => resetSale() }
                    >
                        <span className="bi bi-trash me-2 h4"></span>
                        clear
                    </button>
                }
                {
                    sale.customer_id &&
                    <button className='button is-text px-2 ms-3'>
                        <span className="bi bi-gift me-2 h4"></span>
                        Claim points
                    </button>
                }
            </div>
            <div className='bg-white rounded bokx-border pos-teller'>
                <div className="p-3">
                    {/* customer selection section */ }
                    <div className="row">
                        <div className="col-10">
                            <Select
                                id='customer_id'
                                value={ sale.customer_id }
                                nothingFound="No match"
                                onChange={ ( value ) => setSale( { ...sale, customer_id: value } ) }
                                size="md"
                                clearable
                                searchable
                                placeholder='select customer'
                                data={ customers?.map( cus => {
                                    return {
                                        value: cus.id,
                                        label: cus.full_name
                                    }
                                } ) }
                            />
                        </div>
                        <div className="col-2 g-0">
                            <button
                                className='button'
                                onClick={ () => setModal( {
                                    isOpen: true,
                                    title: 'New Customer',
                                    content: <NewCustomerForm
                                        showHeader={ false }
                                        showFooter
                                        onSuccess={ onFetchCustomers }
                                    />
                                } ) }
                            >
                                <span className="bi bi-plus-circle"></span>
                            </button>
                        </div>
                    </div>
                    <div className='products-line'>
                        {
                            demoRegisteredPrograms.filter( rp => rp.customer_id === sale.customer_id ).length > 0 &&
                            <div className="py-3">
                                <Chip label="Enrolled Loyalty Programs" className='mb-3' />
                                <div className="row">
                                    {
                                        demoRegisteredPrograms
                                            .filter( rp => rp.customer_id === sale.customer_id )
                                            .map( ( camp ) => {
                                                return <div className="col-12 mb-2">
                                                    <Tile
                                                        // onClick={ () => setState( {
                                                        //     ...state,
                                                        //     campaignId: '126'
                                                        // } ) }
                                                        // isActive={ state.campaignId === '126' }
                                                        isAction
                                                        title={ demoCampaigns.find( cam => cam.id == camp.campaign_id ).campaign_name }
                                                        label="54 pts remaining"
                                                    />
                                                </div>
                                            } )
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div >
        </div >
    );
}

export default TellerComponent;