import { Loader } from "@mantine/core";
import { useAtom } from "jotai";
import Tile from "../../../components/pages/tile";
import { selectedProductsAtom } from "../../../helpers/state/sales";
import _ from "lodash";


const ProductsComponent = ( { products, isFetching } ) => {
    // atoms
    const [ selected, setSelected ] = useAtom( selectedProductsAtom )
    console.log( { selected } );
    return (
        <div>
            <div className="me-3 mt-2">
                {
                    isFetching &&
                    <div><Loader color="orange" /> please wait... </div>
                }
                {
                    ( !isFetching && !_.isEmpty( products ) ) &&
                    <div className="row">
                        { products?.map( prod => {
                            return <div className="col-6 mb-2">
                                <Tile
                                    title={ <h3>{ prod.product_name }</h3> }
                                    isAction
                                    isActive={ !_.isEmpty( selected.find( p => p.id == prod.id ) ) }
                                    onClick={ () => setSelected( prod ) }
                                />
                            </div>
                        } ) }
                    </div>
                }
            </div>
        </div >
    );
}

export default ProductsComponent;