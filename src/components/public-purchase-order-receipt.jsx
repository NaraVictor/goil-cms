import { Divider, Tag } from 'antd'
import { useQuery } from 'react-query'
import { Loader } from '@mantine/core'
import { Chip } from '@mui/material'
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { getPublicPurchaseOrder } from '../helpers/api'
import { cedisLocale } from '../helpers/utilities'
import errImg from '../static/img/error.png'
import lostImg from '../static/svg/icons/lost.svg'

const PublicPurchaseOrderReceipt = ( { orderNumber, orderHash } ) => {
    const printArea = useRef();
    const [ grandTotal, setTotal ] = useState( 0 )

    const { data, isFetching, isError } = useQuery( {
        queryFn: () => getPublicPurchaseOrder( orderNumber, orderHash ),
        queryKey: [ 'public-purchase-order', orderNumber ],
        onSuccess: data => {
            let sum = 0
            data.children?.forEach( line => {
                sum += ( line.unit_price * ( line?.received_quantity || line?.order_quantity ) )
            } )
            setTotal( sum )
        }
    } );

    const handlePrint = useReactToPrint( {
        content: () => printArea.current,
        documentTitle: "Purchase Order_" + data?.order_number,
        copyStyles: true,
    } );


    return (
        <div className='p-2'>
            {
                isFetching ?
                    <span><Loader /> please wait...</span> :
                    isError ?
                        <div className='text-center mx-auto'>
                            <div>
                                <img src={ errImg } width={ 100 } height={ 100 } className='mb-2' />
                            </div>
                            <Chip
                                label='There was an error processing your request'
                                color='error'
                            />
                        </div> :
                        !data ?
                            <div className='text-center mx-auto'>
                                <div>
                                    <img src={ lostImg } width={ 100 } height={ 100 } className='mb-2' />
                                </div>
                                <Chip
                                    label="We didn't find what you are looking for!"
                                />
                            </div>
                            :
                            <>
                                <button
                                    onClick={ handlePrint }
                                    className="button bokx-btn mb-2 ms-4">
                                    <span className="bi bi-printer me-2" />
                                    Print
                                </button>
                                <Divider />
                                <div className="p-4" ref={ printArea }>
                                    <div className="row">
                                        <div className="col-md-8 d-flex">
                                            {/* <img src={ logo } width={ 100 } height={ 100 } alt="shop logo" /> */ }
                                            <p className='d-inline ms4'>
                                                <h5 className='mb-0'>{ data.shop?.shop_name }</h5>
                                                <div>{ data.shop?.address }</div>
                                                <div>{ data.shop?.location }</div>
                                                <div>{ data.shop?.primary_contact }</div>
                                            </p>
                                        </div>
                                        <div className="col-md-4 col-12">
                                            <h4 className='mb-0'>Purchase Order</h4>
                                            <div>PO#: { data.order_number }</div>
                                            {
                                                data.is_received ?
                                                    <Tag color='green'>
                                                        <strong className='text-success'>Fulfilled</strong>
                                                    </Tag> :
                                                    <Tag color='red'>
                                                        <strong className='text-danger'>Pending</strong>
                                                    </Tag>
                                            }
                                        </div>

                                    </div>
                                    <Divider />
                                    <div className="row">
                                        <div className="col-md-6 col-12">
                                            <Tag className='px-2'><strong>Supplier</strong></Tag>
                                            <p>
                                                <strong><i>{ data.supplier?.supplier_name }</i></strong>
                                                <div>{ data.supplier?.contact }</div>
                                                <div>{ data.supplier?.address }</div>
                                                <div>{ data.supplier?.location }</div>
                                            </p>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <Tag><strong>Deliver To</strong></Tag>
                                            <div className="row">
                                                {
                                                    data.outlets.map(
                                                        out => {
                                                            return <div className='col-6 mb-2'>
                                                                <strong><i>{ out?.outlet?.outlet_name }</i></strong>
                                                                <div>{ out?.outlet?.location }</div>
                                                                <div>{ out?.outlet?.contact }</div>
                                                            </div>
                                                        }
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <Divider />
                                    <table className='table border p-2'>
                                        <tr>
                                            <th>SN</th>
                                            <th>Item Description</th>
                                            <th>Units</th>
                                            <th>Price</th>
                                            <th>Line Total</th>
                                        </tr>
                                        <tbody>
                                            {
                                                data.children?.map( ( line, index ) => {
                                                    return <tr>
                                                        <td>{ ++index }</td>
                                                        <td>{ line?.product?.product_name }</td>
                                                        <td>{ line?.received_quantity || line?.order_quantity }</td>
                                                        <td>{ line?.unit_price }</td>
                                                        <td>{ cedisLocale.format( line?.unit_price * ( line?.received_quantity || line?.order_quantity ) ) }</td>
                                                    </tr>
                                                } )
                                            }
                                            <tr colspan={ 5 }>
                                                <td colSpan={ 4 }>
                                                    <strong>TOTAL</strong>
                                                </td>
                                                <td><strong>{ cedisLocale.format( grandTotal ) }</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <Divider />
                                    <table className='table border w-50'>
                                        <tbody>
                                            <tr>
                                                <td>Issued On</td>
                                                <td>{ new Date( data.createdAt ).toDateString() }</td>
                                            </tr>
                                            <tr>
                                                <td>Expected On</td>
                                                <td>{ new Date( data.delivery_date ).toDateString() }</td>
                                            </tr>

                                            {
                                                data.is_received &&
                                                <tr>
                                                    <td>Received On</td>
                                                    <td>{ new Date( data.received_date ).toDateString() }</td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                    {/* <div className="row">
                                <div className="col">
                                    <Tag className='px-2 mb-2'><strong>Notes / Comments</strong></Tag>
                                    <div>
                                        { data.note ? data.note : '...' }
                                    </div>
                                </div>
                            </div> */}
                                </div>
                            </>
            }
        </div >
    )
}


export default PublicPurchaseOrderReceipt
