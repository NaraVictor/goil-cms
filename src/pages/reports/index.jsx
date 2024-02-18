import Tile from "../../components/pages/tile";
import { PageHeader } from "../../components/shared";
import { Divider } from "antd";
import { subnavs } from "../../helpers/config";

const ReportsIndex = ( props ) => {
    return (
        <section className="mt-3">
            <PageHeader className="my-4" title="Reporting" description="View organized summary of business and application information" />
            <Divider />
            <div className="row">
                {
                    subnavs.reporting.map( nav =>
                        <div className="mb-3 col-md-3 col-6" key={ nav.name }>
                            <Tile isAction title={ nav.name } icon={ nav.icon } url={ nav.url } />
                        </div>
                    )
                }
            </div>

        </section>
    );
}

export { ReportsIndex };