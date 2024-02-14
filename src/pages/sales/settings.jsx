import { Divider, } from "antd";
import { PageHeader } from "../../components/shared";

const SellSettingsPage = ( props ) =>
{


    return (
        <section className="mt-4">
            <PageHeader title="Settings" description="Configure sales" />

            <Divider />

            {/* products table */ }
            <p>showing x records</p>

        </section>
    );
}

export { SellSettingsPage };