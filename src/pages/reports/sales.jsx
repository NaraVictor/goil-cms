import { Divider, } from "antd";
import { PageHeader } from "../../components/shared";

const SalesReportPage = ( props ) => {


    return (
        <section className="mt-4">
            <PageHeader title="Sales Report" description="keep using the app and we will generate reports soon!" />

            <Divider />
            {/* products table */ }
            <p>showing x records</p>

        </section>
    );
}

export { SalesReportPage };