import Tile from "../../components/pages/tile";
import { SectionHeader } from "../../components/shared";
import { Divider } from 'antd'
import { subnavs } from "../../helpers/config";

const SalesIndex = ( props ) => {
    return (
        <section className="mt-3">
            <SectionHeader className="my-4" title="Sale" description="commit, configure and access sales information" />
            <Divider />
            <div className="row">
                {
                    subnavs.sell.map( nav =>
                        <div className="mb-3 col-md-3 col-6" key={ nav.name }>
                            <Tile isAction title={ nav.name } icon={ nav.icon } url={ nav.url } />
                        </div>
                    )
                }
            </div>

        </section>
    );
}

export { SalesIndex };