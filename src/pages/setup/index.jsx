import Tile from "../../components/pages/tile";
import PageTitle from "../../components/page-title";
import { SectionHeader } from "../../components/shared";
import { Divider } from "antd";
import { subnavs } from "../../helpers/config";

const SetupIndex = ( props ) => {
    return (
        <section className="mt-3">
            <SectionHeader className="my-4" title="Setup" description="Configure application level settings and functionality" />
            <Divider />
            <div className="row">

                {
                    subnavs.setup.map( nav =>
                        <div className="mb-3 col-md-3 col-6" key={ nav.name }>
                            <Tile isAction title={ nav.name } icon={ nav.icon } url={ nav.url } />
                        </div>
                    )
                }

            </div>
        </section>
    );
}

export { SetupIndex };