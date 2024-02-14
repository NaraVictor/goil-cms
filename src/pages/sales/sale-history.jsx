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

            {/* <Tabs defaultValue="Sales" className="mb-5" color="grape">
                <Tabs.List>
                    <Tabs.Tab value="Sales" icon={ <span className="bi bi-clock-history h5" /> }> <h6>Sales</h6> </Tabs.Tab>
                    <Tabs.Tab value="Returns" icon={ <span className="bi bi-reply-all h5" /> }> <h6>Returns</h6></Tabs.Tab>
                    <Tabs.Tab value="Parked" icon={ <span className="bi bi-pause-circle h5" /> }> <h6>Parked Sales</h6></Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="Sales">
                    <SaleHistoryComponent />
                </Tabs.Panel>

                <Tabs.Panel value="Returns">
                    sales returns
                </Tabs.Panel>

                <Tabs.Panel value="Parked">
                    <ParkedSalesComponent />
                </Tabs.Panel>
            </Tabs> */}
        </section>
    );
}

export { SalesHistoryPage };