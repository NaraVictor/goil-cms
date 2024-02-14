import { Divider, Typography, Input, } from "antd";
import { PageHeader } from "../../components/shared";

const InventoryCountPage = ( props ) =>
{

    const { Search } = Input;

    return (
        <section className="mt-4">
            <PageHeader title="Inventory Count" description="count, compare and re-concile physical stock levels with digital levels" />

            <Divider />
            {/* <p>Find Order</p>
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
            </div> */}
            {/* <Divider /> */ }

            {/* products table */ }
            <p>showing x records</p>

        </section>
    );
}

export { InventoryCountPage };