import { message } from 'antd'
import { atom } from 'jotai'
import { nanoid } from 'nanoid'


const productTemplate = {
    id: nanoid(),
    product_id: null,
    unit_price: 0,
    order_order_quantity: 0,
    units_in_stock: 0
}


// state
const _restock = atom( {
    supplier_id: "",
    supplier_invoice_number: "",
    delivery_date: "",
    order_number: "",
    note: "",
    outlets: []
} )
const _products = atom( [] )

const _newProducts = atom( [] )


// methods
export const getRestockTotalCostAtom = atom( get => {
    let subtotal = 0
    get( _products ).map( p => {
        subtotal += ( parseFloat( p.unit_price ) * parseInt( p.order_quantity ) )
    } )

    return subtotal
} )

export const getRestockTotalQtyAtom = atom( get => {
    let subtotal = 0
    get( _products ).map( p => {
        subtotal += parseInt( p.order_quantity )
    } )

    return subtotal
} )



// atoms
export const restockAtom = atom(
    ( get ) => get( _restock ),
    ( get, set, restock ) => {
        set( _restock, { ...get( _restock ), ...restock } )
    }
)


export const selectedProductsAtom = atom(
    ( get ) => get( _products ),
    ( get, set, product ) => {
        const prods = get( _products )

        // if ( prods.find( p => p.product_id === product.product_id ) )
        //     return false
        // else
        set( _products, [
            ...prods,
            {
                id: nanoid(),
                product_id: null,
                unit_price: 0,
                units_in_stock: 0,
                order_quantity: 0,
            } ]
        )
    }
)


// selected products handlers
export const deleteProductAtom = atom(
    null,
    ( get, set, id ) => {
        set( _products, get( _products ).filter( pro => pro.id !== id ) )
    } )

export const clearProductsAtom = atom(
    null,
    ( get, set, id ) => {
        set( _products, [] )
    } )


export const updateProductAtom = atom(
    null,
    ( get, set, params ) => {
        const { id, field, value } = params

        let prod = get( _products ).find( pr => pr.id === id )

        if ( field === 'product_id' ) {

            // check if product had been selected already
            if ( get( _products ).find( pro => pro.product_id === value.product_id ) ) {
                message.error( 'already selected!' )
                return
            }

            prod.unit_price = parseFloat( value.product.supplier_price )
            prod.product_id = value.product_id
            prod.units_in_stock = value.product?.stock[ 0 ]?.units_in_stock
            prod.order_quantity = value.product?.stock[ 0 ]?.reorder_quantity

        }

        else if ( field === 'order_quantity' ) {
            // using/allowing negative values for stock control reasons - ATM
            prod.order_quantity = parseInt( value )
        }
        else
            prod[ field ] = value


        set(
            _products,
            get( _products ).map( pro => {
                if ( pro.id === id )
                    return prod
                return pro
            } )
        )
    } )



// get
export const getCompleteRestockAtom = atom( get => {
    const restock = get( _restock );
    const products = get( _products );

    return { ...restock, products }
} )



export const resetRestockAtom = atom(
    null,
    ( get, set, params ) => {
        set( _restock, {
            supplier_id: "",
            supplier_invoice_number: "",
            delivery_date: "",
            order_number: "",
            note: "",
            outlets: []
        } )
        set( _products, [] )
    } )



// new restock products -> edit restock (lazy implementation)
// TODO: Refactor code to satisfy polymophism (using same methods)


// export const selectedNewProductsAtom = atom(
//     ( get ) => get( _newProducts ),
//     ( get, set, product ) => {
//         const prods = get( _newProducts )

//         set( _newProducts, [
//             ...prods,
//             {
//                 id: nanoid(),
//                 product_id: null,
//                 unit_price: 0,
//                 units_in_stock: 0,
//                 order_quantity: 0,
//                 is_new: true,
//                 product_name: ''
//             } ]
//         )
//     }
// )


// export const deleteNewProductAtom = atom(
//     null,
//     ( get, set, id ) => {
//         set( _newProducts, get( _newProducts ).filter( pro => pro.id !== id ) )
//     } )

// export const clearNewProductsAtom = atom(
//     null,
//     ( get, set, id ) => {
//         set( _newProducts, [] )
//     } )


// export const updateNewProductAtom = atom(
//     null,
//     ( get, set, params ) => {
//         const { id, field, value } = params

//         let prod = get( _newProducts ).find( pr => pr.id === id )

//         if ( field === 'product_id' ) {

//             prod.unit_price = parseFloat( value.product.supplier_price )
//             prod.product_id = value.product_id
//             prod.units_in_stock = value.product.stock.units_in_stock
//             prod.product_name = value.product.product_name
//             // prod.order_quantity = value.product.stock.reorder_order_quantity

//         }
//         else if ( field === 'order_quantity' )
//             prod.order_quantity = parseFloat( value )

//         else
//             prod[ field ] = value


//         set(
//             _newProducts,
//             get( _newProducts ).map( pro => {
//                 if ( pro.id === id )
//                     return prod
//                 return pro
//             } )
//         )
//     } )
