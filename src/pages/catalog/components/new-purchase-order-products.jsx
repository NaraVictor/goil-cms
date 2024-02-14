import { Divider } from "antd";
import { Loader, Select } from '@mantine/core'
import { cedisLocale } from "../../../helpers/utilities";

const PurchaseOrderProductList = ( { products, selected, onAdd, onDelete, onUpdate, clearSelected } ) => {

    return (
        <div>
            {
                !products ?
                    <span><Loader /> Loading products...</span>
                    :
                    <>
                        <PurchaseOrderProductsHeader />
                        <Divider />

                        {
                            selected?.map( ( sl, index ) =>
                                <>
                                    <PurchaseOrderProductLine
                                        sn={ ++index }
                                        remove={ onDelete }
                                        update={ onUpdate }
                                        item={ sl }
                                        products={ products }
                                    />
                                    <Divider className="my-2" />
                                </>
                            )
                        }

                        <div className="buttons mt-4">
                            <button
                                onClick={ onAdd }
                                className="button bokx-btn">
                                <span className="bi bi-plus-circle me-2"></span>
                                Add Product
                            </button>
                            {
                                selected.length > 0 &&
                                <button
                                    className="button"
                                    onClick={ clearSelected }
                                >
                                    Clear
                                </button>
                            }
                        </div>
                    </>
            }
        </div>
    );
}



const PurchaseOrderProductsHeader = () => {
    return (
        <div className="row">
            <div className="col-1 d-none d-md-inline">#</div>
            <div className="col-md-3 col-4 g-0">Product</div>
            <div className="col-1 d-none d-md-inline">Current Qty</div>
            <div className="col-md-2 col-3">Restock Qty</div>
            <div className="col-2">Unit Price</div>
            <div className="col-2">Subtotal</div>
        </div>
    )
}



const PurchaseOrderProductLine = ( { sn, remove, update, products, item } ) => {

    return (
        <>
            <div className="row align-items-center">
                <div className="col-1 d-none d-md-inline">
                    { sn }
                </div>
                <div className="col-md-3 col-4 g-0">
                    <Select
                        name="product"
                        searchable
                        clearable
                        nothingFound="No match"
                        placeholder="select product"
                        value={ item.product_id }
                        onChange={ e => update( {
                            id: item.id,
                            field: 'product_id',
                            value: {
                                product_id: e,
                                product: products.find( pro => pro.id === e )
                            }
                        } ) }
                        data={
                            products?.map( prod => {
                                return {
                                    label: prod.product_name,
                                    value: prod.id
                                }
                            } )
                        }
                    />
                </div>
                <div className="col-1 d-none d-md-inline">{ item?.units_in_stock }</div>
                <div className="col-md-2 col-3">
                    <input
                        className="input"
                        type="number"
                        id="quantity"
                        value={ item.order_quantity }
                        onChange={ e => update( {
                            id: item.id,
                            field: 'order_quantity',
                            value: e.target.value
                        } ) }
                    /></div>
                <div className="col-2">{ item.unit_price }</div>
                <div className="col-2">{ cedisLocale.format( parseFloat( item.order_quantity ) * parseFloat( item.unit_price ) ) }</div>
                <div className="col-1 g-0">
                    <button className="button is-ghost" onClick={ () => remove( item.id ) }>
                        <span className="bi bi-trash text-danger"></span>
                    </button>
                </div>
            </div>
            {/* <div className="row">
                <div className="col-12 p-2">
                    <small>Expected Total Quantity: <kbd>14</kbd></small>
                    <small className="ms-2">Estimated Product Restock Cost: <kbd>250.00</kbd></small>
                </div>
            </div> */}
        </>
    )
}

export default PurchaseOrderProductList;