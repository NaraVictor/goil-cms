import { Divider } from 'antd'
import { useAtom } from 'jotai'
import { chargesAtom, deleteChargeAtom, serverChargesAtom, updateChargeAtom } from '../../../helpers/state/sales'
import { cedisLocale } from '../../../helpers/utilities'
import { nanoid } from 'nanoid'
import { Loader } from '@mantine/core'


export default function AddChargesComponent () {

    const [ allCharges ] = useAtom( serverChargesAtom )
    const [ charges, setCharges ] = useAtom( chargesAtom )
    const [ , deleteCharge ] = useAtom( deleteChargeAtom )
    const [ , updateCharge ] = useAtom( updateChargeAtom )

    return (
        <div>
            {
                allCharges.length === 0 ?
                    <span>
                        <Loader /> <span className='ms-2'>Looking for shop's charges...</span>
                    </span> :
                    <>
                        {/* Percentage or Figure */ }
                        {/* TODO -> update: Make it optional for user to select either percentage or numeric figure */ }
                        <Divider className='my-2' />
                        <div className="row">
                            <div className="col-md-5">Title</div>
                            <div className="col-md-2">Unit Price</div>
                            <div className="col-md-2">Units</div>
                            <div className="col-md-2">Subtotal</div>
                        </div>
                        <Divider className='my-2' />

                        <div className="row align-items-center">
                            {
                                charges?.map( charge =>
                                    <ChargeLineItem
                                        charge={ charge }
                                        allCharges={ allCharges }
                                        onDelete={ deleteCharge }
                                        onUpdate={ updateCharge }
                                    /> )
                            }
                        </div>
                        {/* <Divider className='my-2' /> */ }
                        {
                            allCharges.length !== charges.length &&
                            <button
                                className='button is-ghost'
                                autoFocus
                                onClick={ () =>
                                    setCharges()
                                }
                            >
                                <span className="bi bi-plus-circle me-2"></span>
                                Add Charge
                            </button>
                        }
                    </>
            }
        </div>
    )
}



const ChargeLineItem = ( { charge, allCharges, onDelete, onUpdate } ) => {

    return (
        <>
            <div className="col-md-5">
                <select
                    value={ charge.charge_id }
                    name="charge_id"
                    onChange={ ( e ) => onUpdate( {
                        id: charge.id,
                        field: 'charge_id',
                        value: {
                            charge_id: e.target.value,
                            charge: allCharges.find( ch => ch.id === e.target.value )
                        }
                    } ) }
                    className='input w-100'
                >
                    <option value="" selected disabled hidden>select a charge</option>
                    {
                        allCharges.map( ( ch ) =>
                            <option key={ ch.id } value={ ch.id }>{ ch.title }</option>
                        )
                    }

                </select>
            </div>
            <div className="col-md-2">
                <input
                    type="text"
                    name="unit_price"
                    disabled
                    value={ cedisLocale.format( parseFloat( charge.amount || 0 ) ) }
                    className="input" />
            </div>
            <div className="col-md-2">
                <input
                    onChange={ ( e ) => onUpdate( {
                        id: charge.id,
                        field: 'units',
                        value: parseFloat( e.target.value )
                    } ) }
                    value={ ( charge.units || 0 ) }
                    name="units"
                    type="number"
                    className="input" />
            </div>
            <div className="col-md-2">
                { cedisLocale.format( parseFloat( charge.amount * charge.units ) ) }
            </div>
            <div className="col-md-1 g-0">
                <button className="button is-ghost is-small" onClick={
                    () => onDelete( charge.id ) }>
                    <span className="bi bi-trash text-danger h6 mb-0"></span>
                </button>
            </div>
            <Divider className='my-2' />
        </>
    )
}
