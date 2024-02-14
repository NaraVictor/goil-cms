import PageTitle from "../../components/page-title";
import ProductsComponent from "./components/products";
import TellerComponent from "./components/teller";
import _ from "lodash";
import { getAllCategories, getAllCustomers, getAllProducts } from "../../helpers/api";
import { useQuery } from "react-query";
import { isRegisterOpen } from "../../helpers/auth";
import { Chip } from "@mui/material";
import cashReg from '../../static/img/register.png'
import { useNavigate } from "react-router-dom";
import { appLinks } from "../../helpers/config";
import { generateRoute } from "../../helpers/utilities";
import { useEffect, useState } from "react";

const SellPage = ( props ) => {
    const nav = useNavigate()
    const [ products, setProd ] = useState( [] )

    // queries
    const { isFetching, refetch: fetchProducts } = useQuery( {
        queryFn: () => getAllProducts(),
        queryKey: [ 'products' ],
        onSuccess: data => setProd( data?.map( pro => {
            return {
                ...pro,
                retail_price: parseFloat( pro.markup_price + pro.supplier_price )
            }
        } ) )
    } );

    const { data: categories = [], refetch: fetchCategories } = useQuery( {
        queryFn: () => getAllCategories( 'product' ),
        queryKey: [ 'categories' ],
    } );

    const { data: customers = [], refetch: fetchCustomers } = useQuery( {
        queryFn: () => getAllCustomers(),
        queryKey: [ 'customers' ],
    } );


    return (
        <section className="mt-4">
            <PageTitle title="Sell" />
            {
                isRegisterOpen() ?
                    <div className="row">
                        <div className="col-md-8 col-12">
                            <ProductsComponent
                                isFetching={ isFetching }
                                products={ products.filter( pros => pros?.is_a_service || pros?.stock[ 0 ]?.units_in_stock > 0 ) }
                                categories={ categories }
                            />
                        </div>
                        <div className="order-first order-md-1 mb-5 mb-md-0 col-md-4 col-12 g-0">
                            <TellerComponent
                                customers={ customers }
                                onFetchCustomers={ fetchCustomers }
                                onFetchProducts={ fetchProducts }
                            />
                        </div>
                    </div> :
                    <div className="p-4 text-center">
                        <img className="mt-5 pb-3" src={ cashReg } alt="cash register iamge" width={ 200 } height={ 200 } />
                        <div className="mb-2">
                            <Chip color="info" label="Register Closed. Open or join one to continue selling" />
                        </div>
                        <button
                            onClick={ () => nav( generateRoute( [ appLinks.sales.index, appLinks.sales.register ] ) ) }
                            className="bokx-btn btn-prim">Open Register</button>
                    </div>

            }
        </section>
    );
}

export { SellPage };