import { Divider, Select, Tag } from "antd";
import _ from "lodash";
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { cedisLocale, findCurrency } from "../../../helpers/utilities";
import { useQuery } from "react-query";
import { getSaleReceipt } from "../../../helpers/api";
import { Loader } from "@mantine/core";
import { format } from 'date-fns'

// variables -> hooks are first called before variables. the code in onSuccess wont find these variables if 
// sent into the component
// let base_currency, operator, sum_amount = 0, balance = 0, amount_paid = 0, discount = 0
const SaleReceipt = ( { receipt_number } ) => {
    // const printSize = localStorage.getItem( 'printerSize' ) || '58' //defaults printer dimension to 58mm when a prev is not found

    // hooks
    const [ size, setSize ] = useState( localStorage.getItem( 'printerSize' ) || '58' )
    const [ receipt, setReceipt ] = useState( {} )
    const printArea = useRef();

    // query
    const { data, isFetching } = useQuery( {
        queryFn: () => getSaleReceipt( receipt_number ),
        queryKey: [ 'receipt', receipt_number ],
        cacheTime: 0,
        onSuccess: data =>
            setReceipt( {
                ...data,
                base_currency: data.outlet.shop.base_currency,
                // operator: `${ receipt.creator.staff.first_name } ${ receipt.creator.staff.last_name }`,
                // enabling it here errors out
                sum_amount: ( parseFloat( data.sum_amount ) || 0 ),
                discount: ( parseFloat( data.discount ) || 0 ),
                amount_paid: ( parseFloat( data.amount_paid ) || 0 ),
                balance: parseFloat( ( data.sum_amount - data.discount ) - data.amount_paid ),
            } )
        // sum all charges --- or NOT 😊
    } );


    // handlers
    const handlePrint = useReactToPrint( {
        content: () => printArea.current,
        documentTitle: "receipt " + receipt.receipt_number,
        copyStyles: true,
        bodyClass: "sale-receipt"
    } );


    const handleSizeChange = ( size ) => {
        setSize( size )
        localStorage.setItem( 'printerSize', size.toString() )
    }

    return (
        // size58
        <>
            <div className={ `sale-receipt ${ size === '58' ? ' print-size-58' : ' print-size-80' }` }>
                {
                    isFetching ?
                        <Loader> loading...</Loader> :
                        <>
                            <div className="receipt-content p-2" ref={ printArea }>
                                <div className="header">
                                    <h6 className="mb-0 receipt-title">{ receipt.outlet.shop.shop_name }</h6>
                                    <p className="m-0">{ receipt.outlet.outlet_name } - { receipt.outlet.city } </p>
                                    <p className="m-0">{ receipt.outlet.contact }</p>
                                    {/* <Divider className="my-1 mt-3" /> */ }
                                    <hr className="my-2" />
                                    <h5 className="m-0">#{ receipt.receipt_number }</h5>
                                    <div className="m-0 text-muted d-flex justify-content-between">
                                        <p className="m-0 p-0">{ size !== '58' ? 'Official Receipt' : 'Receipt' }
                                            {/* <span className="me-1"> Sale Date:</span> */ }
                                        </p>
                                        <p className="m-0 p-0">{ `${ format( new Date( receipt.createdAt ), "EEE MMM dd, yy" ) }` }</p>
                                        {/* - ${ format( new Date( receipt.createdAt ), "hh:mm" ) } */ }
                                    </div>
                                    {/* <Divider className="my-1 mb-3" /> */ }
                                    <hr className="mt-1 mb-2" />
                                </div>
                                <div className="body">
                                    { receipt.children.map( ( s ) => (
                                        <div className="row mb-2 g-1" key={ s.productId }>
                                            <div className="col-8 m-0">
                                                <i className="me-1">
                                                    (<span>{ s.quantity }x</span>)
                                                </i>
                                                { s.product.product_name }
                                            </div>
                                            <div className="col-3 p-0 m-0" style={ { textAlign: "right" } }>
                                                { cedisLocale.format(
                                                    parseInt( s.quantity ) * parseFloat( s.unit_price )
                                                ) }
                                            </div>
                                            {/* <Divider className="my-1" /> */ }
                                        </div>
                                    ) ) }
                                    {
                                        !_.isEmpty( receipt.charges ) &&
                                        receipt.charges.map( ( ch, ind ) => (
                                            <div className="row mb-2 g-1" key={ ind }>
                                                <div className="col-8 m-0">
                                                    <i className="me-1">
                                                        (<span>{ ch.units }x</span>)
                                                    </i>
                                                    { ch.charge?.title }
                                                </div>
                                                <div className="col-3 p-0 m-0" style={ { textAlign: "right" } }>
                                                    { cedisLocale.format(
                                                        ( parseInt( ch.units ) * parseFloat( ch.amount ) )
                                                    ) }
                                                </div>
                                                {/* <Divider className="my-1" /> */ }
                                            </div>
                                        ) )
                                    }
                                </div>
                                {/* <Divider className="my-2" /> */ }
                                <hr className="my-2" />
                                <div className="receipt--footer p--2">
                                    {
                                        receipt.discount > 0 ?
                                            <>
                                                <div className="row g-0 m-0">
                                                    <div className="col-6">
                                                        Subtotal:
                                                        {/* ({ receipt.base_currency.toUpperCase() }): */ }
                                                    </div>
                                                    <div className="col-5 m-0 p-0" style={ { textAlign: "right" } }>
                                                        { cedisLocale.format( parseFloat( receipt.sum_amount || 0 ) ) }
                                                    </div>
                                                </div>
                                                <div className="row g-0 m-0">
                                                    <div className="col-6">
                                                        Discount:
                                                    </div>
                                                    <div className="col-5 m-0 p-0" style={ { textAlign: "right" } }>
                                                        { cedisLocale.format( receipt.discount || 0 ) }
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <div className="row g-0 m-0">
                                                <div className="col-6">
                                                    Total:
                                                    {/* ({ receipt.base_currency.toUpperCase() }): */ }
                                                </div>
                                                <div className="col-5 m-0 p-0" style={ { textAlign: "right" } }>
                                                    <strong>
                                                        { cedisLocale.format( parseFloat( receipt.sum_amount ) ) }
                                                    </strong>
                                                </div>
                                            </div>
                                    }

                                    {/* <Divider className="my-1" /> */ }
                                    <div className="row g-0 m-0">
                                        <div className="col-6" >
                                            Paid:
                                        </div>
                                        <div className="col-5 m-0 p-0" style={ { textAlign: "right" } }>
                                            { cedisLocale.format( receipt.amount_paid ) }
                                        </div>
                                        <div className="col-6">
                                            Balance:
                                        </div>
                                        <div className="col-5 m-0 p-0" style={ { textAlign: "right" } }>
                                            <strong className="ms-1">
                                                { `${ findCurrency( receipt.base_currency ).symbol } ${ cedisLocale.format( receipt.balance ) }` }
                                            </strong>
                                        </div>
                                    </div>
                                    <Divider className="my-1" />
                                    <small className="text-left">
                                        <i>
                                            Operator: { `${ data?.creator?.staff.first_name } ${ data?.creator?.staff.last_name }` }
                                        </i>
                                    </small>
                                    {/* <Divider className="my-1" /> */ }
                                    <small className="d-block">
                                        {/* <strong>receipt date:</strong> */ }
                                        { new Date().toUTCString() }
                                    </small>
                                    {/* <small className="d-block">
                                        Bokx POS
                                        &copy;{ new Date().getFullYear() } Waffle LLC
                                    </small> */}
                                    {/* <p className="my-3">
										---- END ----
									</p> */}
                                </div>
                                {/* insert ends */ }
                            </div>
                        </>
                }
                <div className="p-2">
                    <button
                        className="mt-3 w-100 d-flex align-items-center button btn-prim"
                        onClick={ handlePrint }>
                        <span className="bi bi-printer me-2"></span>
                        Print
                    </button>
                    <select
                        placeholder="select printer size"
                        className="input mt-2 is-small mb-1"
                        value={ size } onChange={ e => handleSizeChange( e.target.value ) }>
                        <option value="58">Printer width: 58 mm</option>
                        <option value="80">Printer width: 80 mm</option>
                    </select>
                    <Tag color="gold" clas>selection will be remembered</Tag>
                </div>
            </div >

        </>
    );
};

export default SaleReceipt;
