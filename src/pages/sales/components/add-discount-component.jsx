import { useAtom } from 'jotai'
import _ from 'lodash'
import React from 'react'
import { saleAtom } from '../../../helpers/state/sales'

export default function AddDiscountComponent () {

    const [ sale, setSale ] = useAtom( saleAtom )

    return (
        <div>
            {/* Percentage or Figure */ }
            {/* TODO -> update: Make it optional for user to select either percentage or numeric figure */ }
            <input
                type="number"
                step="0.01"
                autoFocus
                value={ sale.discount }
                className="input w-100"
                placeholder='input discount here (e.g 20)'
                onChange={ ( e ) =>
                    setSale( {
                        discount: parseFloat( e.target.value ),
                    } )
                }
            />
            {/* <button className='button btn-prim mt-3'
                onClick={ () => {
                    // onUpdate( state )
                    message.success( 'done' )
                } }
            >
                <span className="bi bi-check-all me-2"></span>
                Update
            </button> */}
        </div>
    )
}
