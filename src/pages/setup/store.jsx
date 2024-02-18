import { Divider, } from "antd";
import { DetailTile, PageHeader } from "../../components/shared";
import { LinearProgress, Paper } from "@mui/material"
import { Modal } from '@mantine/core'
import { useState } from "react";
import EditShopComponent from "./components/edit-shop";
import { useQuery } from "react-query";
import { getShop } from "../../helpers/api";
import { getUser } from "../../helpers/auth";
import _ from "lodash";
import { findCurrency, toTitleCase } from "../../helpers/utilities";

const StoreSetupPage = ( props ) => {
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null
    } )

    // queries
    const { data: shop = {}, isFetching, refetch } = useQuery( {
        queryFn: () => getShop( getUser().shop_id ),
        queryKey: [ 'station' ],
    } );


    return (
        <section className="mt-4">
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
            >
                { modal.content }
            </Modal>

            <PageHeader title="Station" description="view and edit your station information. Affects all related transactions" />
            <Divider className="my-3" />
            <button className="bokx-btn"
                onClick={ () => setModal( {
                    isOpen: true,
                    title: 'Update Station',
                    content: <EditShopComponent id={ shop.id } onUpdate={ refetch } />
                } ) }
            >
                <span className="bi bi-pencil me-2"></span>
                Edit Station
            </button>

            <Paper className="p-5 mt-3">
                {
                    isFetching &&
                    <LinearProgress color="success" />
                }
                <DetailTile title="Station Name" detail={ shop.station_name } icon="shop" />
                <Divider />
                <DetailTile title="Contacts" detail={ <div>
                    <div>{ shop.primary_contact }</div>
                    <div>{ shop.secondary_contact }</div>
                </div> } icon="telephone" />
                <Divider />
                <DetailTile title="Email" detail={ shop.email } icon="envelope" />
                <Divider />
                <DetailTile title="Address" detail={ shop.address } icon="geo" />
                <Divider />
                <DetailTile title="GPS Address" detail={ shop.gps_address } icon="globe-americas" />

            </Paper>

        </section>
    );
}

export { StoreSetupPage };