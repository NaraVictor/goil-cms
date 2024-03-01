import { Divider } from 'antd';
import { Modal, Select } from '@mantine/core'
import NewCustomerForm from '../../catalog/components/new-customer'
import { useState } from 'react';
import { useAtom } from 'jotai';
import {
    chargesAtom,
    resetSaleAtom,
    saleAtom, selectedProductsAtom, serverChargesAtom
} from '../../../helpers/state/sales';
import _ from 'lodash';
import { Chip } from '@mui/material';
import Tile from '../../../components/pages/tile';


const TellerComponent = ( {
    customers,
    onFetchCustomers,
    onFetchProducts
} ) => {
    // atoms
    const [ charges ] = useAtom( chargesAtom )
    const [ products ] = useAtom( selectedProductsAtom )
    const [ sale, setSale ] = useAtom( saleAtom )
    const [ , setServerCharges ] = useAtom( serverChargesAtom )
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

            <div className="d-flex mb-2">
                {
                    ( products.length > 0 || charges.length > 0 ) &&
                    <button
                        className='button is-text px-2'
                        onClick={ () => resetSale() }
                    >
                        <span className="bi bi-trash me-2"></span>
                        clear
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
                                // value={ sale.customer_id }
                                nothingFound="No match"
                                // onChange={ ( value ) => setSale( { ...sale, customer_id: value } ) }
                                size="md"
                                clearable
                                searchable
                                placeholder='select customer'
                                data={ [
                                    { value: '123', label: 'John Doe' },
                                    { value: '124', label: 'Jack Toronto' },
                                    { value: '125', label: 'Ama Ghana' },
                                ]
                                    // customers?.map( cu => {
                                    //     return {
                                    //         label: cu.customer_name,
                                    //         value: cu.id
                                    //     }
                                    // } )
                                }
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
                                {/* add */ }
                            </button>
                        </div>
                    </div>
                    <div className='products-line'>
                        {/*
                        <div className="py-3">
                        <Chip label="Enrolled Loyalty Programs" className='mb-3' /> 
                        <div className="row">
                            <div className="col-12 mb-2">
                                <Tile
                                    // onClick={ () => setState( {
                                    //     ...state,
                                    //     campaignId: '126'
                                    // } ) }
                                    // isActive={ state.campaignId === '126' }
                                    isAction
                                    title="Bronze"
                                    label="54 pts remaining"
                                />
                            </div>
                        </div> 
                        </div>
                        */}
                    </div>
                </div>
            </div >
        </div >
    );
}

export default TellerComponent;