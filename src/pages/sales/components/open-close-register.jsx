import { Divider, message } from "antd";
import _ from "lodash";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { DetailTile, RequiredIndicator } from "../../../components/shared";
import { getAllOutletRegisters, getPayments, getRegisterSequence, getRegisterSequencePayments, postNewRegisterSequence, putCloseSequence } from "../../../helpers/api";
import { getUser, refreshToken } from "../../../helpers/auth";
import { Chip, LinearProgress } from "@mui/material";
import { cedisLocale, findCurrency } from "../../../helpers/utilities";
import smallTalk from 'smalltalk'
import { nanoid } from 'nanoid'

export const OpenRegisterForm = ( { onUpdate, onClose, canEdit, } ) => {
    const [ sequence, setSequence ] = useState( {
        register_id: '',
        opening_float: 0,
        note: ''
    } )

    const { data: registers = [], isFetching, refetch } = useQuery( {
        queryFn: () => getAllOutletRegisters( getUser().outlet_id, 'closed' ),
        queryKey: [ 'available_outlet_registers' ],
    } );

    const { mutateAsync: createSequence, isLoading } = useMutation( ( data ) => postNewRegisterSequence( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );
                onUpdate( data.data.data )
                setSequence( {
                    register_id: '',
                    opening_float: 0,
                    note: ''
                } )
                refreshToken()
                refetch()
                return;
            }

            throw data;
        },
        onError: ( error, variables, context ) => {
            const err = error.response.data.message;
            if ( _.isArray( err ) ) {
                err.map( err =>
                    message.error( err.message )
                );
            }
            else {
                message.error( err );
            }
        },
        retry: true
    } );


    const handleRegisterCreation = ( data ) => {
        if ( !sequence.register_id ) {
            message.error( 'Register is required' )
            return
        }

        if ( !sequence.opening_float ) {
            message.error( 'Opening float required' )
            return
        }

        smallTalk.confirm(
            "Open Register", "Do you wish to open this register?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( value => {
            createSequence( sequence )
        } ).catch( ex => {
            return false;
        } );

    }


    return (
        <div className="pt-3">
            <div className="d-flex justify-content-between align-items-center sticky-top bg-white pt-1 px-4">
                <div>
                    <h5>Open Register</h5>
                </div>
                <div className='buttons has-addons'>
                    {/* {
                        canEdit && */}
                    <button
                        onClick={ handleRegisterCreation }
                        className={ `button btn-prim ${ isLoading && ' is-loading' }` }
                    >
                        <span className="bi bi-check-all me-2"></span>
                        <span className="d-none d-md-inline">
                            Open Register
                        </span>
                    </button>
                    {/* } */ }
                    <button className="button bokx-btn" onClick={ onClose }>
                        <span className="bi bi-x me-2"></span>
                        <span className="d-none d-md-inline">
                            Exit
                        </span>
                    </button>
                </div>
            </div>
            <Divider />
            {
                isFetching &&
                <LinearProgress color="success" className="mt-0 mb-2" />
            }
            <div className="p-4">
                <div className="row">
                    <div className="col-md-6 col-12">
                        <div className="field">
                            <label htmlFor="opening_float">Opening Float (Amount)
                                <RequiredIndicator />
                            </label>
                            <small className="d-block text-muted">how much cash you are starting today with</small>
                            <input
                                type="number"
                                step="0.01"
                                id="opening_float"
                                autoFocus
                                className="input"
                                placeholder="how much cash are you starting the day with?"
                                value={ sequence?.opening_float }
                                onChange={ ( e ) => setSequence( {
                                    ...sequence,
                                    opening_float: e.target.value
                                } ) }
                            />
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mt-3 mt-md-0">
                        <div className="field">
                            <label htmlFor="opening_float">Available Registers
                                <RequiredIndicator />
                            </label>
                            <small className="d-block text-muted">select an available register</small>
                            <select
                                placeholder="select register"
                                className="input"
                                required
                                value={ sequence?.register_id }
                                onChange={ ( e ) => setSequence( {
                                    ...sequence,
                                    register_id: e.target.value
                                } ) }
                            >
                                <option hidden selected value="" >select register</option>
                                {
                                    registers?.map( reg =>
                                        <option value={ reg.id } key={ reg.id }>{ reg.register_name }</option> )
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row my-3">
                    <div className="field">
                        <label htmlFor="note">Opening Note</label>
                        <textarea name="note"
                            placeholder="any opening notes ?"
                            id="note"
                            value={ sequence?.note }
                            onChange={ ( e ) => setSequence( {
                                ...sequence,
                                note: e.target.value
                            } ) }
                            cols="30" rows="4" className="textarea"></textarea>
                    </div>
                </div>
                {/* <button
                    onClick={ handleRegisterCreation }
                    className={ `button bokx-btn btn-prim ${ isLoading && ' is-loading ' }` }>
                    <span className="bi bi-play-circle me-2"></span>
                    Open Register
                </button> */}
            </div>
        </div>
    );
}


export const CloseRegisterForm = ( { id, onUpdate, canEdit, onClose } ) => {

    const [ state, setState ] = useState( { note: '', register_id: '', id: '' } )
    const [ payments, setPayments ] = useState( [] )

    // --- sums
    const totalExpected = payments.reduce( ( sum, item ) => sum += parseFloat( item.amount_expected ), 0 )
    const totalCounted = payments.reduce( ( sum, item ) => sum += parseFloat( item.amount_counted ), 0 )


    const { data: sequence = {}, isFetching, refetch } = useQuery( {
        queryFn: () => getRegisterSequence( id ),
        queryKey: [ 'register_sequence', id ],
        onSuccess: data => setState( {
            note: data.note,
            id,
            register_id: sequence.register_id,
        } )
    } );


    const { refetch: refetchPayments } = useQuery( {
        queryFn: () => getPayments( null, id, 'group' ),
        queryKey: [ 'sales_payments', id ],
        enabled: !sequence.is_closed,
        onSuccess: data => {

            // grouping based on payment methods
            const groupedPayments = []
            data.map( pay => {
                const fndMthd = groupedPayments.find( py => py.payment_method.trim().toLowerCase() === pay.method.trim().toLowerCase() )

                if ( fndMthd ) {
                    fndMthd.amount_expected += pay.amount
                    groupedPayments.filter( gp => gp.payment_method !== fndMthd.payment_method ).push( fndMthd )
                } else {
                    groupedPayments.push( {
                        recordId: nanoid(),
                        payment_method: pay.method,
                        amount_expected: pay.amount,
                        amount_counted: 0
                    } )
                }
            } )

            setPayments( groupedPayments )
        }
    } );


    const { refetch: refetchSequencePayments } = useQuery( {
        queryFn: () => getRegisterSequencePayments( id ),
        queryKey: [ 'sequence_payments', id ],
        enabled: sequence.is_closed,
        onSuccess: data => setPayments( data )
    } );




    const { mutateAsync: closeRegister, isLoading } = useMutation( ( data ) => putCloseSequence( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 200 ) {
                message.success( data.data.message );
                onUpdate( data.data.data )
                refreshToken()
                refetch()
                return;
            }

            throw data;
        },
        onError: ( error, variables, context ) => {
            const err = error.response.data.message;
            if ( _.isArray( err ) ) {
                err.map( err =>
                    message.error( err.message )
                );
            }
            else {
                message.error( err );
            }
        },
        retry: true
    } );


    const handleCloseRegister = () => {

        // validations here
        // check if the register is closed
        // ensure payments have valid values

        // use schema here
        // registerSchema.validate()

        if ( sequence.is_closed ) {
            message.error( 'Register is clsoed' )
            return
        }

        smallTalk.confirm(
            "Close Register", "Closing a register cannot be undone. Continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( value => {

            closeRegister( { sequence: state, payments } )

        } ).catch( ex => {
            return false;
        } );
    }


    const handleUpdateAmtCounted = ( recordId, value ) => {
        const updatedPays = payments.map( p => {
            if ( p.recordId === recordId )
                p.amount_counted = parseFloat( value )

            return p
        } )
        setPayments( updatedPays )
    }


    const handleDeletePayment = ( recordId ) => {
        const newPayments = payments.filter( pay => pay.recordId !== recordId )
        setPayments( newPayments )
    }

    return (
        <div className="pt-3">
            <div className="d-flex justify-content-between align-items-center sticky-top bg-white pt-1 px-4">
                <div>
                    <h5>{ sequence.is_closed ? 'Register Sequence ' : 'Close Register' }</h5>
                </div>
                <div className='buttons has-addons'>
                    {/* {
                        canEdit && */}
                    {
                        !sequence.is_closed &&
                        // <button className="button bokx-btn" >
                        //     <span className="bi bi-bag me-2"></span>
                        //     <span className="d-none d-md-inline">
                        //         Sales
                        //     </span>
                        // </button> :
                        <button
                            onClick={ handleCloseRegister }
                            className={ `button bokx-btn btn-prim ${ isLoading && ' is-loading ' }` }
                        >
                            <span className="bi bi-stop-circle me-2"></span>
                            <span className="d-none d-md-inline">
                                Close Register
                            </span>
                        </button>
                    }
                    {/* } */ }
                    <button className="button bokx-btn" onClick={ onClose }>
                        <span className="bi bi-x me-2"></span>
                        <span className="d-none d-md-inline">
                            Exit
                        </span>
                    </button>
                </div>
            </div>
            <Divider />
            {
                isFetching &&
                <LinearProgress color="success" className="mb-2" />
            }
            {
                !isFetching &&
                <div className="px-4">
                    <div className="mt-3 align-items-center">
                        <Chip label="Register Sequence" className="mb-4" />
                        <DetailTile
                            title="Sequence"
                            icon="list-stars"
                            firstCol="col-4"
                            secondCol="col-8"
                            detail={ sequence?.sequence_name } />
                        <Divider className="my-2" />
                        <DetailTile
                            title="Register"
                            icon="inbox"
                            firstCol="col-4"
                            secondCol="col-8"
                            detail={ sequence?.register?.register_name } />
                        <Divider className="my-2" />
                        <DetailTile
                            title="Creator"
                            icon="person"
                            firstCol="col-4"
                            secondCol="col-8"
                            detail={ `${ sequence?.creator?.staff?.first_name } ${ sequence?.creator?.staff?.last_name }` } />
                        <Divider className="my-2" />
                        <DetailTile
                            title="Outlet"
                            icon="shop"
                            firstCol="col-4"
                            secondCol="col-8"
                            detail={ sequence?.register?.outlet?.outlet_name } />
                        <Divider className="my-2" />
                        <DetailTile
                            title="Opening Time"
                            icon="stopwatch"
                            firstCol="col-4"
                            secondCol="col-8"
                            detail={ new Date( sequence?.open_time ).toUTCString() } />
                        <Divider className="my-2" />
                        {
                            sequence.is_closed &&
                            <>
                                <DetailTile
                                    title="Closing Time"
                                    icon="clock-history"
                                    firstCol="col-4"
                                    secondCol="col-8"
                                    detail={ new Date( sequence?.close_time ).toUTCString() } />
                                <Divider className="my-2" />
                            </>
                        }
                        <DetailTile
                            title="Opening Float"
                            icon="currency-dollar"
                            firstCol="col-4"
                            secondCol="col-8"
                            detail={ `${ findCurrency( getUser().currency )?.symbol } ${ cedisLocale.format( sequence?.opening_float ) }` } />
                        <Divider className="my-2" />
                        <DetailTile
                            title="Closing Balance"
                            icon="currency-exchange"
                            firstCol="col-4"
                            secondCol="col-8"
                            detail={ `${ findCurrency( getUser().currency )?.symbol } ${ cedisLocale.format( sequence?.opening_float + totalCounted ) }` } />
                    </div>
                    <Divider />
                    <Chip label="Payments Summary" className="mb-2" />
                    <div className="p-3">
                        <div className="row my-3">
                            <div className="col-3"><strong>Payment Method</strong></div>
                            <div className="col-3"><strong>Cash Expected</strong></div>
                            <div className="col-3"><strong>Cash Counted</strong></div>
                            <div className="col-2"><strong>Difference</strong></div>
                        </div>
                        {
                            payments.map( pay => {
                                return <div className="row mt-2" key={ pay.recordId }>
                                    <div className="col-3">
                                        { pay.payment_method }
                                    </div>
                                    <div className="col-3">
                                        { cedisLocale.format( pay.amount_expected ) }
                                    </div>
                                    <div className="col-3">
                                        <div className="field">
                                            <input
                                                disabled={ sequence.is_closed ? true : false }
                                                type="number"
                                                id="amount_counted"
                                                autoFocus
                                                className="input"
                                                placeholder={ `counted ${ pay.payment_method }` }
                                                value={ pay.amount_counted }
                                                onChange={ e => handleUpdateAmtCounted( pay.recordId, e.target.value ) }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-2">
                                        { pay.amount_counted - pay.amount_expected }
                                    </div>
                                    <div className="col-1">
                                        {
                                            !sequence.is_closed &&
                                            <button
                                                onClick={ () => handleDeletePayment( pay.recordId ) }
                                                className="button is-small is-text text-danger">
                                                <span className="bi bi-trash"></span>
                                            </button>
                                        }
                                    </div>
                                </div>
                            } )
                        }
                        <Divider />
                        <div className="row">
                            <div className="col-3"><strong>Estimated Sums</strong></div>
                            <div className="col-3"><strong>{ cedisLocale.format( totalExpected ) }</strong></div>
                            <div className="col-3"><strong>{ cedisLocale.format( totalCounted ) }</strong></div>
                            <div className="col-2"><strong>{ cedisLocale.format( totalCounted - totalExpected ) }</strong></div>
                        </div>
                    </div>
                    <Divider />
                    <Chip label="Closing Summary" className="mb-4" />
                    <div className="field pb-5">
                        <label htmlFor="">Note</label>
                        <textarea
                            name="closing_note"
                            disabled={ sequence.is_closed ? true : false }
                            placeholder="add register closing note (optional)" id="closing_note"
                            value={ state?.note }
                            onChange={ e => setState( { ...state, note: e.target.value } ) }
                            className="textarea" cols="30" rows="3"></textarea>
                    </div>
                </div>
            }
        </div>
    );
}

