import { Center, Modal, SegmentedControl, Skeleton } from "@mantine/core";
import { Divider } from "antd";
import { useState } from "react";
import PageTitle from "../../components/page-title";
import Tile, { SummaryCard } from "../../components/pages/tile";
import { appLinks } from "../../helpers/config";
import { cedisLocale, generateRoute } from "../../helpers/utilities";
import { getAllExpenses, getAllProducts, getAllRestocks, getAllSales } from "../../helpers/api";
import { useQuery } from "react-query";
import NewExpenseForm from '../catalog/components/new-expense'
import { isToday } from "date-fns";
import { TopSellingProducts } from "./components/top-products";
import { ExpensesChart, SalesChart } from "./components/charts";
import _ from "lodash";
import { LowStocks, PendingRestocks } from "./components/summaries";
import arraySort from "array-sort";
// import { getUser } from "../../helpers/auth";
import { Chip } from "@mui/material";

const HomeIndex = ( props ) => {
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null
    } )
    const [ pendingRestocks, setPendingRestocks ] = useState( [] )
    const [ lowStocks, setLowStocks ] = useState( [] )
    const [ sumExpenses, setSumExpenses ] = useState( 0 )
    const [ income, setIncome ] = useState( 0 )
    const [ tab, setTab ] = useState( 'sales' )

    // const user = getUser();

    // queries
    const { data: sales = [], isFetching: fetchingSales, refetch: refetchSales } = useQuery( {
        queryFn: () => getAllSales( true ),
        queryKey: [ 'light-sales' ],
        onSuccess: data => {
            let total = 0
            data.forEach( sale => total += sale.amount_paid )
            setIncome( total )
        }
    } );

    const { data: expenses = [], isFetching: fetchingExpenses, refetch: refetchExpenses } = useQuery( {
        queryFn: () => getAllExpenses( true ),
        queryKey: [ 'light-expenses' ],
        onSuccess: data => {
            let total = 0
            data.forEach( exp => total += exp.amount )
            setSumExpenses( total )
        }
    } );


    const { data: products = [], isFetching: fetchingProducts } = useQuery( {
        queryFn: () => getAllProducts( true ),
        queryKey: [ 'light-products' ],
        onSuccess: data => {
            const lows = data?.filter( pro => !pro?.is_a_service )?.filter( prod => ( prod?.stock[ 0 ]?.units_in_stock <= prod?.stock[ 0 ]?.reorder_level ) )
            setLowStocks( lows )
        }
    } );


    // const { data: restocks = [], isFetching: fetchingRestocks } = useQuery( {
    //     queryFn: () => getAllRestocks( true ),
    //     queryKey: [ 'light-restocks' ],
    //     onSuccess: data => setPendingRestocks( data.filter( re => re.is_received === false ) )
    // } );


    // handlers
    // const getTopProducts = ( data = [], count = 0 ) => {
    //     data = arraySort( data, 'sale_count', { reverse: true } )
    //     if ( count > data.length || count === 0 ) count = data.length
    //     let sum = 0

    //     const topList = data
    //         .filter( d => d.sale_count > 0 )
    //         .map( data => {
    //             if ( count > sum ) {
    //                 ++sum
    //                 return data
    //             }
    //         } )

    //     return topList
    // }


    return (
        <section className="my-3 pb-3">
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
            >
                { modal.content }
            </Modal>

            <PageTitle title="Home" />
            {/* <div className="d-flex justify-content-between">
                <div>
                    <h5 className="page-title mb-0">Home</h5>
                    <p className="title-4"><b>{ user.staff_name.split( " " )[ 0 ] }</b>, what do you wanna do today?</p>
                </div>
                <div title="Your Active Register & Sequence">
                    {
                        user?.register?.id &&
                        <Chip label={ `${ user?.register?.register_name } (${ user?.register?.sequence_name })` } />
                    }
                </div>
            </div> */}

            <div className="my-5 row">
                <div className="col-md-3">
                    <p><strong>ACTION</strong></p>
                    <Tile
                        isActive isAction title="SELL" icon="bi-basket"
                        url={ generateRoute( [ appLinks.sales.index, appLinks.sales.sell ] ) }
                    />
                </div>
                <div className="col-md-6">
                    <p><strong>SUMMARY</strong></p>
                    <div className="row">
                        <div className="mb-3 col-md-6 col-12">
                            {/* <Skeleton visible={ fetchingSales === true }> */ }
                            <SummaryCard label="sales today" data={ sales.filter( sale => isToday( new Date( sale.createdAt ) ) ).length } />
                            {/* </Skeleton> */ }
                        </div>
                        <div className="mb-3 col-md-6 col-12">
                            {/* <Skeleton visible={ fetchingProducts === true }> */ }
                            <SummaryCard
                                label="campaigns"
                                data={ ( products?.filter( pr => pr?.is_a_service || pr?.stock[ 0 ]?.units_in_stock > 0 )?.length || 0 ) } />
                            {/* </Skeleton> */ }
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            {/* <Skeleton visible={ fetchingSales === true }> */ }
                            <SummaryCard label="customers" data={ cedisLocale.format( income ) } />
                            {/* </Skeleton> */ }
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            {/* <Skeleton visible={ fetchingExpenses === true }> */ }
                            <SummaryCard label="claims" data={ cedisLocale.format( sumExpenses || 0 ) } />
                            {/* </Skeleton> */ }
                        </div>
                        {/* <Skeleton visible={ fetchingRestocks === true }
                            onClick={ () => {
                                pendingRestocks.length > 0 &&
                                    setModal( {
                                        title: "Pending Restocks",
                                        content: <PendingRestocks data={ pendingRestocks } />,
                                        isOpen: true
                                    } )
                            } }
                        >
                            { pendingRestocks.length > 0 ?
                                <SummaryCard warning label="restocks" data={ ( pendingRestocks.length || 0 ) } />
                                : <SummaryCard label="restocks" data={ ( pendingRestocks.length || 0 ) } />
                            }
                        </Skeleton> */}
                    </div>
                </div>
                <div className="col-md-3">
                    <p><strong>DESTINATIONS</strong></p>
                    <div className="row">
                        <div className="mb-3 mb-md-0 col-md-6 col-12">
                            <Tile isAction title="sales" icon="bi-currency-dollar"
                                url={ generateRoute( [ appLinks.catalog.index, appLinks.catalog.inventory ] ) }
                            />
                        </div>

                        <div className="mb-3 mb-md-0 col-md-6 col-12">
                            <Tile isAction title="customers" icon="bi-people"
                                url={ generateRoute( [ appLinks.catalog.index, appLinks.catalog.customers ] ) }
                            />
                        </div>
                        <div className="mb-3 mb-md-0 col-md-6 col-12">
                            <Tile isAction title="campaigns" icon="bi-megaphone"
                                url={ generateRoute( [ appLinks.catalog.index, appLinks.catalog.expenses ] ) }
                            />
                        </div>
                        <div className="mb-3 mb-md-0 col-md-6 col-12">
                            <Tile isAction title="claims" icon="bi-card-checklist"
                                url={ generateRoute( [ appLinks.reports.index ] ) }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Divider />

            <SalesChart data={ sales } key='saleschart' />
            {/* <SegmentedControl
                className="mb-2"
                size="md"
                value={ tab }
                onChange={ setTab }
                data={ [
                    {
                        label: (
                            <Center>
                                <span className="bi bi-bag me-2"></span>
                                Sales
                            </Center>
                        ),
                        value: 'sales'
                    },
                    {
                        value: 'expenses',
                        label:
                            (
                                <Center>
                                    <span className="bi bi-currency-dollar me-2"></span>
                                    Expenses
                                </Center>
                            ),
                    },
                    {
                        value: 'topcampaigns',
                        label: (
                            <Center>
                                <span className="bi bi-sort-up me-2"></span>
                                Top Products
                            </Center>
                        )
                    },
                ] }
            />
            { tab === 'sales' && <SalesChart data={ sales } key='saleschart' /> }
            { tab === 'expenses' && <ExpensesChart data={ expenses } key='expenseschart' /> }
            { tab === 'topcampaigns' && <TopSellingProducts data={ getTopProducts( products, 5 ) } key='topselling' /> } */}
        </section>
    );
}

export { HomeIndex };