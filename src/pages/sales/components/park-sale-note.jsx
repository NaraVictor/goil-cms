import { Alert } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import _ from 'lodash'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { setOutletParkedSales } from '../../../helpers/utilities'
import { getUser } from '../../../helpers/auth'

export default function ParkSaleNote ( { sale, onUpdate } ) {
    const [ done, setDone ] = useState( false )

    const handleParkSale = () => {
        setOutletParkedSales( sale, getUser().outlet_id )
        setDone( true )
        onUpdate()
    }

    return (
        <div className='field'>
            <label htmlFor="">You are about to park this sale. Add a note for easy identification by the next person who continues this sale.</label>
            <textarea rows={ 3 }
                onChange={ ( e ) => sale.parking_note = e.target.value }
                value={ sale.parking_note }
                placeholder="add parking notes here" autoFocus className="textarea w-100 my-2" ></textarea>
            {
                done &&
                <Alert
                    icon={ <IconCheck /> }
                    variant="filled" color="green" className="text-center my-3">
                    Sale successfully parked. Anyone from this outlet can view and retrieve this parked (saved) sale draft.
                </Alert>
            }
            {
                !done &&
                <button
                    onClick={ handleParkSale }
                    className="bokx-btn btn-prim">
                    <span className="bi bi-arrow-down-circle me-2"></span>
                    Park Sale
                </button>
            }
        </div>
    )
}
