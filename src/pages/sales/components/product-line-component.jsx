import React from 'react'
import { cedisLocale, findCurrency } from '../../../helpers/utilities'
import { getUser } from '../../../helpers/auth'

export default function ProductLineComponent ( { prod, onUpdate, onDelete } ) {
    return (
        <div className='row g-0'>
            <div className="col-7">{ prod.product_name }
                <small className='d-block text-secondary'>@{ findCurrency( getUser().currency ).symbol } { cedisLocale.format( prod.retail_price ) }</small>
            </div>
            {/* <div className="col-2"></div> */ }
            <div className="col-3">
                <input
                    type="number"
                    step="0.01"
                    className='input'
                    value={ prod.quantity }
                    onChange={ ( e ) => onUpdate( prod.id, e.target.value ) }
                />
            </div>
            <div className="col-1 g-0">
                <button className='button is-text'
                    onClick={ () => onDelete( prod.id ) }
                >
                    <span className="bi bi-trash text-danger"></span>
                </button>
            </div>
        </div>
    )
}
