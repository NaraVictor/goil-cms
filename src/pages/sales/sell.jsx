import PageTitle from "../../components/page-title";
import ProductsComponent from "./components/products";
import TellerComponent from "./components/teller";
import _ from "lodash";
import { getAllCustomers, getAllProducts } from "../../helpers/api";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { CounterComponent } from "./components/counter";

const SellPage = ( props ) => {
    const nav = useNavigate()

    // queries
    const { data: products, isFetching, refetch: fetchProducts } = useQuery( {
        queryFn: () => getAllProducts(),
        queryKey: [ 'products' ],
    } );

    const { data: customers = [], refetch: fetchCustomers } = useQuery( {
        queryFn: () => getAllCustomers(),
        queryKey: [ 'customers' ],
    } );


    return (
        <>
            <section className="mt-4">
                <PageTitle title="Sell" />
                {
                    <div className="row">
                        <div className="col-md-8 col-12">
                            <ProductsComponent
                                isFetching={ false }
                                products={ [
                                    {
                                        id: '1234',
                                        product_name: 'Petrol',
                                        unit: 'litre',
                                        unit_price: 12.99
                                    },
                                    {
                                        id: '1223',
                                        product_name: 'Diesel',
                                        unit: 'litre',
                                        unit_price: 16.54
                                    },
                                    {
                                        id: '1211',
                                        product_name: 'Engine Oil',
                                        unit: 'litre',
                                        unit_price: 55
                                    },
                                ] }
                            />
                        </div>
                        <div className="mb-5 mb-md-0 col-md-4 col-12">
                            <TellerComponent
                                customers={ customers }
                                onFetchCustomers={ fetchCustomers }
                                onFetchProducts={ fetchProducts }
                            />
                        </div>
                    </div>
                }
            </section>
            <CounterComponent />
        </>
    );
}

export { SellPage };