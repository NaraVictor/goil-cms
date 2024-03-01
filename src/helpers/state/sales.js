import { message } from 'antd'
import { atom } from 'jotai'
import { nanoid } from 'nanoid'


// state
const _sale = atom( {
    discount: 0,
    customer_id: "",
    amount_paid: 0,
    subtotal: 0,
    campaign_id: "",
    claimed_points: 0
} )
const _products = atom( [] )


export const getSaleSubTotalAtom = atom( get => {
    let subtotal = 0
    get( _products ).map( p => {
        subtotal += parseFloat( p.unit_price )
    } )

    return subtotal
} )


export const getSumAtom = atom( get => {
    let subtotal = 0
    get( _products )?.map( p => {
        subtotal += parseFloat( p.unit_price )
    } )

    const discount = parseFloat( get( _sale ).discount ) || 0
    return parseFloat( subtotal - discount )
} )


// atoms
export const saleAtom = atom(
    ( get ) => get( _sale ),
    ( get, set, sale ) => {
        set( _sale, { ...get( _sale ), ...sale } )
    }
)


export const selectedProductsAtom = atom(
    ( get ) => get( _products ),
    ( get, set, product ) => {
        const prods = get( _products )
        const curProd = prods.find( p => p.id === product.id )

        if ( curProd )
            set( _products, get( _products ).filter( pro => pro.id !== product.id ) )

        // if ( curProd.stock.units_in_stock === curProd.quantity )
        //     return

        // set( _products, prods.map( p => {
        //     if ( p.id === product.id ) {
        //         p.quantity += 1
        //         return p
        //     }
        //     else
        //         return p
        // } ) )
        else
            set( _products, [ ...prods, product ] )
    }
)



// selected products handlers
export const deleteProductAtom = atom(
    null,
    ( get, set, id ) => {
        set( _products, get( _products ).filter( pro => pro.id !== id ) )
    } )


// get
export const getCompleteSaleAtom = atom( get => {
    const sale = get( _sale )
    const products = get( _products )

    return { sale, products }
} )


export const resetSaleAtom = atom(
    null,
    ( get, set, params ) => {
        set( _sale, {
            discount: 0,
            customer_id: "",
            amount_paid: 0,
            subtotal: 0,
            campaign_id: "",
            claimed_points: 0
        } )
        set( _products, [] )
    } )