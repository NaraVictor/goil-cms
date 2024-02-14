import { Divider } from "antd";
import Tile from "../../components/pages/tile";
import { SectionHeader } from "../../components/shared";
import { subnavs } from "../../helpers/config";

const CatalogIndex = ( props ) => {
    return (
        <section className="mt-3">
            <SectionHeader className="my-4" title="Catalog" description="Access and manipulate list of data" />
            <Divider />
            <div className="row">
                {
                    subnavs.catalog.map( nav =>
                        <div className="mb-3 col-md-3 col-6" key={ nav.name }>
                            {/* <span className="bi bi-info-circle"></span> */ }
                            <Tile isAction title={ nav.name } icon={ nav.icon } url={ nav.url } />
                        </div>
                    )
                }
            </div>
        </section>
    );
}

export { CatalogIndex };