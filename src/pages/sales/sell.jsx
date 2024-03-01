import PageTitle from "../../components/page-title";
import ProductsComponent from "./components/products";
import TellerComponent from "./components/teller";
import _ from "lodash";
import { getAllCustomers, getAllProducts } from "../../helpers/api";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { CounterComponent } from "./components/counter";
import { demoCustomers, demoProducts } from "../../data";

const SellPage = ( props ) => {
    const nav = useNavigate()

    // queries
    const { data: products = demoProducts, isFetching, refetch: fetchProducts } = useQuery( {
        queryFn: () => getAllProducts(),
        queryKey: [ 'products' ],
    } );

    const { data: customers = demoCustomers, refetch: fetchCustomers } = useQuery( {
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
                                products={ products }
                            />
                        </div>
                        <div className="mb-5 mb-md-0 pb-5 pb-md-0 col-md-4 col-12">
                            <TellerComponent
                                customers={ customers }
                                onFetchCustomers={ fetchCustomers }
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