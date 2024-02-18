import { Divider, message, Switch, } from "antd";
import { DetailTile, PageHeader } from "../../components/shared";
import { Paper, Select } from '@mantine/core'
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getSettings, putSettings, getAllCategories } from "../../helpers/api";
import _ from "lodash";
import smalltalk from 'smalltalk';
import { LinearProgress } from "@mui/material";

const GeneralSetupPage = ( props ) => {
    const [ state, setState ] = useState( {} )

    // queries
    const { data: expense_categories = [] } = useQuery( {
        queryFn: () => getAllCategories( 'expense' ),
        queryKey: [ 'expenses_category' ],
    } );

    const { refetch, isFetching } = useQuery( {
        queryFn: () => getSettings(),
        queryKey: [ 'settings' ],
        onSuccess: data => setState( data )
    } );




    const { mutateAsync: updateSettings, isLoading } = useMutation( ( data ) => putSettings( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data ) {
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



    const handleUpdateSettings = () =>
        smalltalk.confirm(
            "Update Settings", "You are about to change your station configurations. Continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            updateSettings( state )
        } ).catch( ex => {
            return false;
        } );



    return (
        <section className="mt-4">
            <PageHeader title="General Settings" description="Configure application-wide settings" />
            <button
                className={ `button btn-prim mt-3 ${ isLoading && 'is-loading' }` }
                onClick={ handleUpdateSettings }
            >
                <span className="bi bi-check-all me-2"></span>
                Update Settings
            </button>
            {/* <Divider /> */ }

            <Paper className="p-5 mt-3">
                { isFetching && <LinearProgress color="warning" className="mb-2" /> }
                <span><i>settings here</i></span>
                {/* <DetailTile title="Purchase Order Category"
                    detail={
                        <Select
                            value={ state?.expense_category_id }
                            onChange={ value => setState( {
                                ...state,
                                expense_category_id: value
                            } ) }
                            placeholder="select category"
                            searchable
                            clearable
                            allowDeselection
                            data={
                                expense_categories.map( cat => {
                                    return {
                                        value: cat.id,
                                        label: cat.title
                                    }
                                } )
                            }
                        />
                    } icon="collection" />
                <Divider />
                <DetailTile title="Auto Add Purchase Order"
                    detail={
                        <>
                            <Switch
                                onChange={ value => setState( {
                                    ...state,
                                    add_purchase_order_expense: value
                                } ) }
                                checked={ state?.add_purchase_order_expense }
                                className="me-2" />
                            { state?.add_purchase_order_expense ? "YES" : "NO" }
                        </>
                    } icon="check2-circle" />
                <Divider /> */}
            </Paper>
        </section>
    );
}

export { GeneralSetupPage };