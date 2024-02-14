import { message } from 'antd'
import { atom, useAtom } from 'jotai'
import { nanoid } from 'nanoid'


const paymentTemplate = { id: null, method: '', amount: 0 }

// state
const _sale = atom( {
    discount: 0,
    note: "",
    customer_id: "",
    amount_paid: 0,
    // sum_amount: 0,
    subtotal: 0,
    total_charges: 0
    //promotion_code_id: "",
} )
const _charges = atom( [] )
const _serverCharges = atom( [] )
const _products = atom( [] )
const _payments = atom( [] )


// methods
// export const sumTotal = cedisLocale.format( parseFloat( ( subTotal + totalCharges ) - sale.discount ) )

export const getSaleSubTotalAtom = atom( get => {
    let subtotal = 0
    get( _products ).map( p => {
        subtotal += ( parseFloat( p.retail_price ) * parseInt( p.quantity ) )
    } )

    return subtotal
} )


export const getTotalChargesAtom = atom(
    get => {
        let total = 0
        get( _charges ).map( c => {
            total += parseFloat( c.amount ) * parseInt( c.units )
        } )
        return total
    }
)


export const getTotalPaymentsAtom = atom(
    get => {
        let total = 0
        get( _payments ).map( c => {
            total += parseFloat( c.amount || 0 )
        } )
        return total
    }
)

export const getSumAtom = atom( get => {
    // const sumTotal = parseFloat( ( subTotal + totalCharges ) - sale.discount )
    let subtotal = 0
    get( _products )?.map( p => {
        subtotal += ( parseFloat( p.retail_price ) * parseInt( p.quantity ) )
    } )

    let totalCharges = 0
    get( _charges )?.map( c => {
        totalCharges += parseFloat( c.amount || 0 ) * parseInt( c.units || 0 )
    } )

    const discount = parseFloat( get( _sale ).discount ) || 0
    return parseFloat( ( subtotal + totalCharges ) - discount )
} )


// atoms
export const serverChargesAtom = atom(
    ( get ) => get( _serverCharges ),
    ( get, set, charges ) => {
        const ch = get( _serverCharges )
        set( _serverCharges, charges )
    }
)

export const chargesAtom = atom(
    ( get ) => get( _charges ),
    ( get, set, charge ) => {
        const ch = get( _charges )
        set( _charges, [ ...ch,
        {
            id: nanoid(),
            charge_id: '',
            amount: 0,
            units: 1
        } ] )
    }
)

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

        if ( curProd ) {
            if ( curProd.stock.units_in_stock === curProd.quantity )
                return

            set( _products, prods.map( p => {
                if ( p.id === product.id ) {
                    p.quantity += 1
                    return p
                }
                else
                    return p
            } ) )
        }
        else
            set( _products, [ ...prods, { ...product, quantity: 1 } ] )
    }
)


export const paymentsAtom = atom(
    get => get( _payments ),
    ( get, set, payment ) => {
        set( _payments, [ ...get( _payments ), { id: nanoid(), method: '', amount: 0 } ] )
    }
)


// restore
export const restoreChargesAtom = atom(
    null,
    ( get, set, charges ) => {
        set( _charges, charges )
    }
)

export const restoreSaleAtom = atom(
    null,
    ( get, set, sale ) => {
        set( _sale, sale )
    }
)

export const restoreSelectedProductsAtom = atom(
    null,
    ( get, set, products ) => {
        set( _products, products )
    }
)

export const restorePaymentsAtom = atom(
    null,
    ( get, set, payments ) => {
        set( _payments, payments )
    }
)


// selected products handlers
export const deleteProductAtom = atom(
    null,
    ( get, set, id ) => {
        set( _products, get( _products ).filter( pro => pro.id !== id ) )
    } )


export const updateProductAtom = atom(
    null,
    ( get, set, params ) => {
        const { id, qty } = params

        let quantity = parseInt( qty )
        // validated during check out
        // if ( quantity < 1 ) {
        //     quantity = 1
        //     message.error( 'Quantity cannot be less than 1' )
        //     return
        // }

        let prod = get( _products ).find( pr => pr.id === id )
        if ( quantity > prod.stock.units_in_stock )
            quantity = prod.stock.units_in_stock

        prod.quantity = quantity

        set(
            _products,
            get( _products ).map( pro => {
                if ( pro.id === id )
                    return prod

                return pro
            } )
        )
    } )


// charges handlers
export const deleteChargeAtom = atom(
    null,
    ( get, set, id ) => {
        const charges = get( _charges )
        const newList = charges.filter( charge => charge.id !== id )
        set( _charges, newList )
    }
)

export const updateChargeAtom = atom(
    null,
    ( get, set, params ) => {

        const { id, field, value } = params
        const charge = get( _charges ).find( charge => charge.id === id );
        charge[ field ] = value;

        //
        if ( field === 'charge_id' ) {

            // check if charge had been selected already
            if ( get( _charges ).find( chr => chr.charge_id === value.charge_id ) ) {
                message.error( 'already selected!' )
                return
            }

            charge.amount = parseFloat( value.charge.amount )
            charge.charge_id = value.charge_id
        }
        else
            charge[ field ] = value


        // update charges
        set( _charges,
            get( _charges )
                .map( chr => {
                    if ( chr.id === id )
                        return charge
                    return chr
                } )
        )

    }
)



// payments handler
export const deletePaymentAtom = atom(
    null,
    ( get, set, id ) => {
        set( _payments, get( _payments ).filter( pay => pay.id !== id ) )
    } )


export const updatePaymentAtom = atom(
    null,
    ( get, set, params ) => {
        const { id, field, value } = params

        // prevent duplicate methods
        if ( ( field === 'method' ) && get( _payments ).find( pay => pay.method === value ) ) {
            message.error( 'method already selected!' )
            return
        }

        const updatedPayment = get( _payments ).find( pay => pay.id === id );
        updatedPayment[ field ] = value;

        // update payments
        set( _payments,
            get( _payments )
                .map( pay => {
                    if ( pay.id === id )
                        return updatedPayment
                    return pay
                } )
        )
    } )



// get
export const getCompleteSaleAtom = atom( get => {
    const sale = get( _sale )
    const payments = get( _payments )
    const charges = get( _charges )
    const products = get( _products )

    // sale.discount = sale.discount && 0
    return { sale, payments, charges, products }
} )


export const resetSaleAtom = atom(
    null,
    ( get, set, params ) => {
        set( _sale, {
            discount: 0,
            note: "",
            customer_id: "",
            amount_paid: 0,
            // sum_amount: 0,
            subtotal: 0,
            total_charges: 0
            //promotion_code_id: "",
        } )
        set( _charges, [] )
        set( _products, [] )
        set( _payments, [] )
    } )