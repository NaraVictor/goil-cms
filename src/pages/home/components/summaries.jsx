import { cedisLocale } from "../../../helpers/utilities"

const LowStocks = ( { data = [] } ) => {
    return (
        <table className="table table-hover">
            <thead>
                <th>Product</th>
                <th>Units in Stock</th>
                <th>Reorder Level</th>
            </thead>
            <tbody>
                {
                    data?.map( pro => {
                        return <tr>
                            <td>{ pro.product_name }</td>
                            <td>{ pro.stock[ 0 ].units_in_stock }</td>
                            <td>{ pro.stock[ 0 ].reorder_level }</td>
                        </tr>
                    } )
                }
            </tbody>
        </table>
    )
}

const PendingRestocks = ( { data } ) => {
    return (
        <table className="table table-hover">
            <thead>
                <th>Order Number</th>
                <th>Total Quantity</th>
                <th>Total Amount</th>
            </thead>
            <tbody>
                {
                    data?.map( rst => {
                        return <tr>
                            <td>{ rst.order_number }</td>
                            <td>{ rst.total_quantity }</td>
                            <td>{ cedisLocale.format( rst.total_amount ) }</td>
                        </tr>
                    } )
                }
            </tbody>
        </table>
    )
}

export { LowStocks, PendingRestocks }