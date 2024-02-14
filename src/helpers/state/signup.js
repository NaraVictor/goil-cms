import { atom } from "jotai";
import { plans } from '../config'
import codes from '../../plan-codes.json'


// templates 
const shopTemplate = {
    shop_name: '',
    email: '',
    primary_contact: '',
    base_currency: '',
    has_delivery: false,
}
const userTemplate = {
    first_name: '', last_name: '', email: '', password: '', gender: 'Male'
}

const planTemplate = {
    plan: null,
    code: null,
    interval: null,
    price: 0,
    couponCode: null,
    discount: 0,
}

// state
const _shop = atom( shopTemplate );
const _user = atom( userTemplate );
const _plan = atom( planTemplate );
const _shopCategory = atom( { title: '' } );

// atoms
export const shopAtom = atom(
    ( get ) => get( _shop ),
    ( get, set, params ) => {
        const { field, value } = params;
        const shop = get( _shop );

        // update shop
        set( _shop, { ...shop, [ field ]: value } )
    } );


export const userAtom = atom(
    ( get ) => get( _user ),
    ( get, set, params ) => {
        const { field, value } = params;

        // update user
        set( _user, { ...get( _user ), [ field ]: value } )
    } );


export const shopCategoryAtom = atom(
    ( get ) => get( _shopCategory ),
    ( get, set, title ) => {
        set( _shopCategory, { title } );
    } );


export const shopPlanAtom = atom(
    ( get ) => get( _plan ),
    ( get, set, params ) => {
        const { field, value } = params;

        if ( value === 'free' )
            set( _plan, {
                ...planTemplate,
                plan: value
            } );
        else
            set( _plan, {
                ...get( _plan ),
                [ field ]: value,
            } );


        const plan = get( _plan );
        if ( plan.plan !== 'free' && plan.interval !== null ) {

            const planCost = plans?.find( pl => pl?.plan === plan?.plan )[ plan?.interval ];
            const code = codes?.find( cd => ( ( cd?.plan === plan?.plan ) && ( cd?.interval === plan?.interval ) ) );

            set( _plan, {
                ...get( _plan ),
                price: planCost,
                code: code?.code,
            } )
        }

    } );


// handlers
export const getSignUpAtom = atom( get => {
    const shop = get( _shop )
    const category = get( _shopCategory )
    const user = get( _user )
    const plan = get( _plan )

    return { shop, user, category, plan }
} )



export const resetSignUpAtom = atom(
    null,
    ( get, set, params ) => {
        set( _shop, shopTemplate )
        set( _user, userTemplate )
        set( _shopCategory, { title: '' } )
    } )


// export const validateSignUpData = {}




