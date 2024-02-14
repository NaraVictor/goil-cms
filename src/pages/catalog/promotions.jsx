import { Divider, Typography, Input, Drawer, } from "antd";
import { useState } from "react";
import { PageHeader, SaveButton } from "../../components/shared";
import NewPromotionForm from "./components/new-promotion";

const PromotionsPage = ( props ) =>
{
    const [ visible, setVisible ] = useState( false ); //drawer
    const { Search } = Input;

    return (
        <section className="mt-4">
            <PageHeader title="Promotions" description="view, edit and add promotions." />
            {/* buttons */ }
            <div className="mt-3">
                <button className="bokx-btn btn-prim" onClick={ () => setVisible( true ) }>
                    Add Promotion
                </button>
                <button className="bokx-btn ms-2">
                    <span className="d-none d-md-inline me-2">
                        Export
                    </span>
                    <span className="bi bi-arrow-up-right-square"></span>
                </button>
            </div>
            {/* buttons end */ }
            <Divider />
            <p>Find promotion</p>
            <div className="row">
                <div className="col-md-4 col-12">
                    <Search
                        placeholder="search promotions"
                        size="large"
                    />
                </div>
                <div className="col-md-4 col-9">
                    <Typography>Filters: </Typography>

                </div>
                <div className="col-md-4 col-3">
                    More Filters (drop down like proposed component for profile view)
                </div>
            </div>
            <Divider />

            <p>table columns</p>
            <p>------</p>
            <p>name</p>
            <p>start n end date</p>
            <p>outlets available in</p>
            <p>view, edit n delete</p>
            <p>------</p>
            {/* products table */ }
            <p>showing x records</p>


            <Drawer key={ Math.random() } footer={ <SaveButton /> } title="Add Promotion" placement="right" onClose={ () => setVisible( false ) } visible={ visible }>
                <NewPromotionForm />
            </Drawer>
        </section>
    );
}

export { PromotionsPage };