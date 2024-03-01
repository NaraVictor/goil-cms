import { Loader, Modal } from "@mantine/core";
import { useAtom } from "jotai";
import Tile from "../../../components/pages/tile";
import { selectedProductsAtom } from "../../../helpers/state/sales";
import { useState } from "react";


const ProductsComponent = ( { products, isFetching } ) => {
    // atoms
    const [ , setSelected ] = useAtom( selectedProductsAtom )

    // state
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        size: 'md'
    } )


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
                                    onClick={ () => setSelected( prod ) }
                                />
                            </div>
                        } ) }
                    </div>
                }
            </div>
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                size={ modal.size }
            >
                { modal.content }
            </Modal>
        </div >
    );
}

export default ProductsComponent;