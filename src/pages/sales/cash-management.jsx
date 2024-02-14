import { Divider, } from "antd";
import { PageHeader } from "../../components/shared";

const CashManagementPage = ( props ) =>
{


    return (
        <section className="mt-4">
            <PageHeader title="Cash Management" description="control your cash" />

            <Divider />

            {/* products table */ }
            <p>showing x records</p>

        </section>
    );
}

export { CashManagementPage };