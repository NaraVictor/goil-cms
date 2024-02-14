import { Divider, Typography, Input, } from "antd";
import { PageHeader } from "../../components/shared";

const OrdersPage = ( props ) =>
{

    const { Search } = Input;

    return (
        <section className="mt-4">
            <PageHeader title="Orders" description="view, edit and add orders. Orders are exclusively from the marketplace" />
            {/* buttons */ }
            <div className="mt-3">
                <button className="bokx-btn btn-prim">
                    Open Online Store
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
            <p>Find Order</p>
            <div className="row">
                <div className="col-md-4 col-12">
                    <Search
                        placeholder="search orders"
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

            {/* products table */ }
            <p>showing x records</p>

        </section>
    );
}

export { OrdersPage };