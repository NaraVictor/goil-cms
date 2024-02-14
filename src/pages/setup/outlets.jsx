import { Divider, message, } from "antd";
import { DetailTile, PageHeader } from "../../components/shared";
import { LinearProgress, Paper } from '@mui/material'
import { Modal } from '@mantine/core'
import { useState } from "react";
import NewOutletForm from "./components/new-outlet";
import EditOutletComponent from "./components/edit-outlet";
import { useMutation, useQuery } from "react-query";
import { getAllOutlets, putCloseOutlet, putMakeHQ } from "../../helpers/api";
import _ from "lodash";
import { getUser } from "../../helpers/auth";
import smallTalk from 'smalltalk'

const OutletsSetupPage = ( props ) => {
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null
    } )

    // queries
    const { data: outlets = [], isFetching, refetch } = useQuery( {
        queryFn: () => getAllOutlets( getUser().shop_id ),
        queryKey: [ 'outlets' ],
        refetchOnWindowFocus: false,
    } );

    const { mutateAsync: makeHQ, isLoading: makingHQ } = useMutation( ( id ) => putMakeHQ( id ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 200 ) {
                message.success( data.data.message );
                refetch()
                // message.success( 'HQ updated!' )
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


    const { mutateAsync: closeDown, isLoading: closingDown } = useMutation( ( id ) => putCloseOutlet( id ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 200 ) {
                message.success( data.data.message );
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


    const handleCloseDown = ( id ) => {
        smallTalk.confirm( "Close Outlet?", "Closing an outlet cannot be reversed. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        } ).then( () => closeDown( id ) )
    }


    return (
        <section className="mt-4">
            <PageHeader title="Outlets" description="View and edit all linked branches/outlets of your shop" />

            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
            >
                { modal.content }
            </Modal>

            {/* <Divider className="my-3" /> */ }
            <button className="bokx-btn btn-prim"
                onClick={ () => setModal( {
                    isOpen: true,
                    title: 'Add Outlet',
                    content: <NewOutletForm onUpdate={ refetch } />
                } ) }
            >
                <span className="bi bi-plus-circle me-2"></span>
                Add Outlet
            </button>

            <Paper className="p-5 mt-3">
                { isFetching && <LinearProgress color="success" /> }
                {
                    outlets.map( out =>
                        <div className="row align-items-center hover-hand pt-4" key={ out.id }>
                            <div className="col-7">
                                <DetailTile
                                    className="py-4"
                                    firstCol="col-md-4"
                                    secondCol="col-md-7"
                                    title={ out.outlet_name }
                                    detail={
                                        <>
                                            { out.is_main && <kbd>MAIN</kbd> } { out.city }
                                        </>
                                    }
                                    icon="shop" />
                            </div>
                            <div className="col-5">
                                <button
                                    className="button is-ghost"
                                    onClick={ () => setModal( {
                                        isOpen: true,
                                        title: 'Edit Outlet',
                                        content: <EditOutletComponent id={ out.id } onUpdate={ refetch } />
                                    } ) }>
                                    <span className="bi bi-pencil me-2"></span>
                                    edit
                                </button>
                                <button
                                    onClick={ () => handleCloseDown( out.id ) }
                                    className={ `button is-ghost text-danger ${ closingDown && ' is-loading' }` }>
                                    <span className="bi bi-power me-2"></span>
                                    close down
                                </button>
                                {
                                    !out.is_main && <button
                                        onClick={ () => makeHQ( out.id ) }
                                        className={ `button bokx-btn ${ makingHQ && ' is-loading' }` }>
                                        <span span className="bi bi-shop me-2"></span>
                                        Make HQ
                                    </button>
                                }
                            </div>
                            <Divider className="mb-0" />
                        </div>
                    )
                }
            </Paper>

        </section >
    );
}

export { OutletsSetupPage };