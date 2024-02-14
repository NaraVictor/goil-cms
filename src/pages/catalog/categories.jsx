import { PageHeader } from "../../components/shared";
import ProductCategoriesPage from "./components/product-categories";
import CustomerCategoriesPage from "./components/customer-categories";
import ExpensesCategoriesPage from "./components/expenses-categories";
import { Center, SegmentedControl } from "@mantine/core";
import { useState } from "react";

const CategoriesPage = ( props ) => {

    const [ tab, setTab ] = useState( "customers" )

    return (
        <div className="mt-4">
            <PageHeader title={ `Categories` } description="Manage all types of categories here" />

            <SegmentedControl
                defaultValue="customers"
                size="md"
                value={ tab }
                onChange={ setTab }
                data={ [
                    {
                        label: (
                            <Center>
                                <span className="bi bi-people me-2"></span>
                                Customers
                            </Center>
                        ),
                        value: 'customers',
                    },
                    {
                        value: 'expenses',
                        label: (
                            <Center>
                                <span className="bi bi-currency-dollar me-2"></span>
                                Expenses
                            </Center>
                        )
                    },
                    {
                        value: 'products',
                        label: (
                            <Center>
                                <span className="bi bi-archive me-2"></span>
                                Products
                            </Center>
                        )
                    },
                ] }
            />


            { tab === 'customers' && <CustomerCategoriesPage /> }
            { tab === 'products' && <ProductCategoriesPage /> }
            { tab === 'expenses' && <ExpensesCategoriesPage /> }

        </div>
    );
}

export { CategoriesPage };