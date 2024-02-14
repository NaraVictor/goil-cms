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
        queryKey: [ 'shop' ],
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

            <PageHeader title="Shop" description="view and edit your shop information. Affects all related outlets" />
            <Divider className="my-3" />
            <button className="bokx-btn"
                onClick={ () => setModal( {
                    isOpen: true,
                    title: 'Update Shop',
                    content: <EditShopComponent id={ shop.id } onUpdate={ refetch } />
                } ) }
            >
                <span className="bi bi-pencil me-2"></span>
                Edit Shop
            </button>

            <Paper className="p-5 mt-3">
                {
                    isFetching &&
                    <LinearProgress color="success" />
                }
                <DetailTile title="Shop Name" detail={ shop.shop_name } icon="shop" />
                <Divider />
                <DetailTile title="Industry" detail={ shop.category && toTitleCase( shop.category ) } icon="buildings" />
                <Divider />
                <DetailTile title="Offer Delivery Service" detail={ shop.has_delivery ? "YES" : "NO" } icon="truck" />
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
                {/* <DetailTile title="VAT" detail={ shop.vat } icon="file-ruled" />
                <Divider /> */}
                <DetailTile title="TIN" detail={ shop.tin } icon="123" />
                <Divider />
                <DetailTile title="GPS Address" detail={ shop.gps_address } icon="globe-americas" />
                <Divider />
                <DetailTile title="Base Currency" detail={ `${ findCurrency( shop.base_currency )?.name } (${ findCurrency( shop.base_currency )?.symbol })` } icon="currency-exchange" />
                <Divider />
                <DetailTile title="MoMo Number" detail={ shop.momo_number } icon="phone" />
                <Divider />
                <DetailTile title="Website" detail={ shop.website } icon="globe" />
            </Paper>

        </section>
    );
}

export { StoreSetupPage };