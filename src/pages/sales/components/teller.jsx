import { Divider, Modal as AntModal } from 'antd';
import { Modal, Select } from '@mantine/core'
import NewCustomerForm from '../../catalog/components/new-customer'
import { useEffect, useState } from 'react';
import AddDiscountComponent from './add-discount-component';
import AddNoteComponent from './add-note-component';
import ProductLineComponent from './product-line-component';
import AddChargesComponent from './add-xtra-charges';
import CheckOutComponent from './checkout';
import { cedisLocale, findCurrency, getOutletParkedSales, removeParkedSale } from '../../../helpers/utilities';
import { getAllCharges } from '../../../helpers/api';
import ParkedSalesComponent from './parked-sales';
import ParkSaleNote from './park-sale-note';
import { useAtom } from 'jotai';
import {
    chargesAtom, deleteProductAtom, getCompleteSaleAtom, getSaleSubTotalAtom,
    getTotalChargesAtom, getTotalPaymentsAtom, resetSaleAtom,
    restoreChargesAtom, restorePaymentsAtom, restoreSaleAtom, restoreSelectedProductsAtom,
    saleAtom, selectedProductsAtom, serverChargesAtom, updateProductAtom
} from '../../../helpers/state/sales';
import SaleReceipt from './receipt';
import { useQuery } from 'react-query';
import { getRegister, getUser } from '../../../helpers/auth';
import _ from 'lodash';
import smalltalk from 'smalltalk'
import { nanoid } from 'nanoid';


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
    const [ , deleteProduct ] = useAtom( deleteProductAtom )
    const [ , updateProduct ] = useAtom( updateProductAtom )
    const [ subTotal ] = useAtom( getSaleSubTotalAtom )
    const [ totalCharges ] = useAtom( getTotalChargesAtom )
    const [ , resetSale ] = useAtom( resetSaleAtom )
    const [ totalPayments ] = useAtom( getTotalPaymentsAtom )
    const [ completeSale ] = useAtom( getCompleteSaleAtom )

    // restores
    const [ , restoreSale ] = useAtom( restoreSaleAtom )
    const [ , restoreProducts ] = useAtom( restoreSelectedProductsAtom )
    const [ , restoreCharges ] = useAtom( restoreChargesAtom )
    const [ , restorePayments ] = useAtom( restorePaymentsAtom )


    // const [ update, setUpdate ] = useState( 1 )

    const sumTotal = parseFloat( ( subTotal + totalCharges ) - ( sale.discount || 0 ) )

    // others
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        size: ""
    } )
    const [ antModal, setAntModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        width: ""
    } )

    const { refetch: fetchCharges } = useQuery( {
        queryFn: () => getAllCharges(),
        queryKey: [ 'charges' ],
        enabled: false,
        onSuccess: data => setServerCharges( data )
    } );


    // parking / draft
    const handleSaveDrafting = () => {
        const user = getUser()
        let customer_name = null

        if ( completeSale.sale.customer_id ) {
            const cus = customers.find( cu => cu.id === completeSale.sale.customer_id )
            customer_name = cus.customer_name
        }

        const draftSale = {
            ...completeSale,
            date: new Date().toDateString(),
            user_name: user.staff_name,
            user_id: user.id,
            outlet_id: user.outlet_id,
            outlet_name: user.outlets.find( out => out.id === user.outlet_id ).outlet_name,
            customer_name,
            parking_id: nanoid()
        }

        setModal( {
            title: 'Save Draft',
            isOpen: true,
            content: <ParkSaleNote sale={ draftSale } onUpdate={ resetSale } />
        } )
    }

    const handleSaleRetrieve = ( parkedSale ) => {

        if ( products.length > 0 || charges.length > 0 ) {
            smalltalk.confirm(
                "Ongoing Sale", "There is an ongoing sale. Either clear or save it and try again!", {
                buttons: {
                    ok: 'OK',
                    cancel: 'CANCEL',
                },
            }
            )
            //     .then( go => {
            //     resetSale()
            // } )

        } else {

            removeParkedSale( parkedSale.parking_id, getUser().outlet_id )
            setModal( { ...modal, isOpen: false } )

            // restore sale
            restoreSale( parkedSale.sale )
            restoreProducts( parkedSale.products )
            restoreCharges( parkedSale.charges )
            restorePayments( parkedSale.payments )
        }
    }


    useEffect( () => {
        setSale( { ...sale, register_sequence_id: getRegister().sequence_id } )
    }, [] )


    return (
        <div className='stickyy-bottom'>
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                size={ modal.size || 'md' }
                zIndex={ 99 }
            >
                { modal.content }
            </Modal>
            <AntModal
                open={ antModal.isOpen }
                onCancel={ () => setAntModal( { ...antModal, isOpen: false } ) }
                title={ antModal.title }
                width={ antModal.width }
                footer={ false }
            >
                { antModal.content }
            </AntModal>
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
                {
                    ( products.length > 0 || charges.length > 0 ) &&
                    <button
                        className='button is-text px-2'
                        onClick={ handleSaveDrafting }
                    >
                        <span className="bi bi-pause-circle me-2"></span>
                        save draft
                    </button> }
                {
                    getOutletParkedSales( getUser().outlet_id )?.length > 0 &&
                    <button
                        className='button is-text px-2'
                        onClick={ () => setModal( {
                            title: 'Retrieve Sales',
                            size: 'xl',
                            isOpen: true,
                            content: <ParkedSalesComponent onRetrieve={ handleSaleRetrieve } />,
                        } ) }
                    >
                        <span className="bi bi-arrow-down-circle me-2"></span>
                        retrieve
                        {/* (only when there are parked sales) */ }
                    </button>
                }

            </div>
            <div className='bg-white rounded bokx-border pos-teller'>
                <div className="p-3">
                    {/* customer selection section */ }
                    <div className="row">
                        <div className="col-9">
                            <Select
                                id='customer_id'
                                value={ sale.customer_id }
                                nothingFound="No match"
                                onChange={ ( value ) => setSale( { ...sale, customer_id: value } ) }
                                size="md"
                                clearable
                                searchable
                                placeholder='select customer'
                                data={
                                    customers?.map( cu => {
                                        return {
                                            label: cu.customer_name,
                                            value: cu.id
                                        }
                                    } )
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
                                <span className="bi bi-plus-circle me-2"></span>
                                add
                            </button>
                        </div>
                    </div>
                    <Divider className='mb-0 mt-2' />
                    <div className='products-line pt-1'>
                        {
                            products?.length === 0 ?
                                <div className='text-secondary py-3'>selected items will show here</div> :
                                <table className='table stripped table-hover'>
                                    <tbody>
                                        {
                                            products.map( ( pro, i ) =>
                                                <tr>
                                                    <div className='row align-items-center'>
                                                        <div className="col-1">{ ++i }</div>
                                                        <div className="col-11 mb-">
                                                            <ProductLineComponent
                                                                prod={ pro }
                                                                onUpdate={ ( id, qty ) => updateProduct( { id, qty } ) }
                                                                onDelete={ id => deleteProduct( id ) } />
                                                        </div>
                                                    </div>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                        }

                    </div>
                    <Divider className='mt-0 mb-2' />
                    {/* add more */ }
                    {
                        products.length > 0 &&
                        <>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                    <strong>ADD</strong>
                                </div>
                                <div>
                                    {/* <button className='button is-ghost'>Promo Code</button> */ }
                                    <button className='button is-ghost px-1'
                                        title='add a discount'
                                        onClick={ () => {
                                            fetchCharges()
                                            setModal( {
                                                isOpen: true,
                                                title: 'Add Charges',
                                                size: 'lg',
                                                content: <AddChargesComponent />
                                            } )
                                        } }
                                    >
                                        {
                                            charges?.length > 0 &&
                                            <span className="bg-success text-white badge badge-success me-1">
                                                { charges?.length }
                                            </span>
                                        }
                                        Charges
                                    </button>
                                    <button className='button is-ghost px-1'
                                        title='add a discount'
                                        onClick={ () => setModal( {
                                            isOpen: true,
                                            title: 'Update Discount',
                                            content: <AddDiscountComponent
                                            />
                                        } ) }
                                    >Discount</button>
                                    <button className='button is-ghost px-1'
                                        title='add notes to this sale'
                                        onClick={ () => setModal( {
                                            isOpen: true,
                                            title: 'Update Notes',
                                            content: <AddNoteComponent
                                                note={ sale.note }
                                            />
                                        } ) }
                                    >
                                        {
                                            sale.note &&
                                            <span className="bi bi-info-circle-fill text-success me-1"></span>
                                        }
                                        Note</button>
                                </div>
                            </div>
                            <Divider className='my-2' />
                        </>
                    }
                    {
                        sale.discount > 0 &&
                        <div className='d-flex justify-content-between mb-2'>
                            <span>Discount</span>
                            <span>{ cedisLocale.format( sale.discount ) }</span>
                        </div>
                    }
                    {
                        charges?.length > 0 &&
                        <div className='d-flex justify-content-between mb-2'>
                            <span>Extra Charges</span>
                            <span>{ cedisLocale.format( totalCharges ) }</span>
                        </div>
                    }
                    <div className='d-flex justify-content-between'>
                        <strong>Subtotal</strong>
                        <strong>{ cedisLocale.format( subTotal ) }</strong>
                    </div>
                    {/* <Divider className='my-2' />
                    <div>
                        <strong>Tax</strong>
                    </div> */}
                </div>
                <hr className='mb-0' />
                <div className='px-3 py-4'
                // style={ {
                //     backgroundColor: "#ddd"
                // } }
                >
                    <button
                        disabled={ sumTotal === 0 }
                        onClick={ () => setModal( {
                            title: 'Check Out',
                            isOpen: true,
                            content: <CheckOutComponent
                                onUpdate={ ( data ) => {
                                    onFetchProducts()
                                    setModal( { isOpen: false } )
                                    setAntModal( {
                                        title: 'Receipt',
                                        isOpen: true,
                                        content: <SaleReceipt receipt_number={ data.receipt_number } />,
                                        width: '250px'
                                    } )
                                } }
                            />,
                            // size: 'lg'
                        } ) }
                        className={ `is-large button w-100 bokx-btn ${ totalPayments > 0 && ' btn-prim ' } d-flex justify-content-between` }>
                        <div>
                            { totalPayments > 0 ? 'Paid ' : 'Pay ' }
                            <small>{ products?.length || 0 } items</small></div>
                        <div><small>{ findCurrency( getUser().currency ).symbol } { cedisLocale.format( totalPayments > 0 ? totalPayments : sumTotal ) }</small></div>
                    </button>
                </div>
            </div >
        </div >
    );
}

export default TellerComponent;