import { Divider } from 'antd'
import React from 'react'
import { useState, useEffect } from 'react'
import { getUser } from '../../../helpers/auth'
import _ from 'lodash'
import { getOutletParkedSales } from '../../../helpers/utilities'
import { isToday } from 'date-fns'

export default function ParkedSalesComponent ( { onRetrieve } ) {
    const [ drafts, setDrafts ] = useState( [] )

    useEffect( () => {
        const drafts = getOutletParkedSales( getUser().outlet_id )

        if ( drafts )
            setDrafts( drafts )

    }, [] )


    return (
        <div>
            <div className="row">
                <div className="col-5"><strong>Parked Sale</strong></div>
                <div className="col-3"><strong>Customer</strong></div>
                <div className="col-3"><strong>Parking Note</strong></div>
                <div className="col-1"><strong></strong></div>
            </div>
            <Divider className='my-1' />
            {
                drafts.map( df => {
                    return <div className="row hover-hand py-4">
                        <div className="col-5">
                            { df.products.length > 1 ?
                                <>
                                    <li>{ `${ df.products[ 0 ].quantity }x - ${ df.products[ 0 ].product_name }` }</li>
                                    <li>{ `${ df.products[ 1 ].quantity }x - ${ df.products[ 1 ].product_name }` }</li>
                                </> :
                                <li>{ `${ df.products[ 0 ].quantity }x - ${ df.products[ 0 ].product_name }` }</li>
                            }
                            {
                                ( df.products.length - 2 ) > 0 &&
                                <strong className='me-2'>
                                    { `+${ df.products.length - 2 } other product(s)` }
                                </strong>
                            }
                            <strong>
                                {
                                    `${ df.charges.length } charges`
                                }
                            </strong>
                            <strong className='ms-2'>
                                {
                                    df.sale.discount > 0 && `and ${ df.sale.discount } discount`
                                }
                            </strong>
                            <small className='text-secondary d-block mt-1'>Parked { isToday( new Date( df.date ) ) ? ' today ' : ' on ' + new Date( df.date ).toDateString() } by { df.user_name }</small>
                        </div>
                        <div className="col-3">{ df.customer_name || 'N/A' }</div>
                        <div className="col-3">{ df.parking_note || 'none' }</div>
                        <div className="col-1 g-0"
                            onClick={ () => onRetrieve( df ) }
                        >
                            <button className="button is-ghost">
                                <span className="bi bi-arrow-down-circle h5"></span>
                            </button>
                        </div>
                    </div>
                } )
            }
        </div >
    )
}
