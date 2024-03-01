import { PageHeader } from "../../components/shared";
import { Tabs } from '@mantine/core'
import SaleHistoryComponent from "./components/history";
import ParkedSalesComponent from "./components/parked-sales-component";

const SalesHistoryPage = ( props ) => {


    return (
        <section className="mt-4">
            {/* <PageHeader
                title="Sales History"
                description="View, edit and manage your sales here"
            // metaData={ `${ filteredData.length } items` || '...' }
            /> */}
            <SaleHistoryComponent />
        </section>
    );
}

export { SalesHistoryPage };