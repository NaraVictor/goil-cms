import { Divider, } from "antd";
import { PageHeader } from "../../components/shared";
import { generateRoute } from "../../helpers/utilities";

const StatusPage = ( props ) =>
{


    return (
        <section className="mt-4">
            <PageHeader title="Status" description="placeholder" />

            <Divider />

            {/* products table */ }
            <p>showing x records</p>

        </section>
    );
}

export { StatusPage };