import { Box, Menu, Modal, Paper } from "@mantine/core";
import { DataGrid } from "@mui/x-data-grid";
import { Divider, message } from "antd";
import { useState } from "react";
import { PageHeader, SearchInput } from "../../components/shared";
import { deleteExpense, getAllExpenses } from "../../helpers/api";
import EditExpenseForm from "./components/edit-expense";
import NewExpenseForm from "./components/new-expense";
import { useQuery } from 'react-query'
import smalltalk from 'smalltalk';
import { cedisLocale } from "../../helpers/utilities";


const columns = ( onOpen, onDelete ) => [

    {
        field: 'id',
        headerName: 'SN',
        sortable: true,
        width: 90,
        renderCell: ( params ) => params.api.getRowIndexRelativeToVisibleRows( params.row.id ) + 1
    },
    // {
    //     field: 'outlet',
    //     headerName: 'Outlet',
    //     sortable: true,
    //     width: 150,
    // },
    {
        field: 'date',
        headerName: 'Date',
        sortable: true,
        width: 160,
        valueFormatter: ( { value } ) => new Date( value ).toDateString()
    },
    {
        field: 'description',
        headerName: 'Description',
        sortable: true,
        width: 350,
    },
    {
        field: 'amount',
        headerName: 'Amount',
        sortable: true,
        width: 150,
        valueFormatter: ( { value } ) => cedisLocale.format( value )
    },
    {
        field: 'category',
        headerName: 'Category',
        sortable: true,
        // width: 200,
        flex: 1,
        valueGetter: ( { row } ) => row.category.title
    },
    {
        // headerName: 'Actions',
        width: 50,
        renderCell: ( { row } ) => {
            return (
                <div className="d-flex">
                    <Menu>
                        <Menu.Target>
                            <button className="button is-small is-ghost px-2">
                                <span className="bi bi-list me-2"></span>
                                {/* Actions */ }
                            </button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item
                                color="blue"
                                onClick={ () => onOpen( row.id ) }
                                icon={ <span className="bi bi-arrow-up-right-square" /> }>
                                Open
                            </Menu.Item>
                            <Menu.Item
                                // className="text-danger"
                                color="red"
                                onClick={ () => onDelete( row.id ) }
                                icon={ <span className="bi bi-trash" /> }>
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </div>
            )
        }
    }
];


const ExpensesPage = ( props ) => {
    // const [ visible, setVisible ] = useState( false ); //drawer
    const [ filteredData, setFilteredData ] = useState( [] );
    const [ mode, setMode ] = useState( {
        new: false,
        edit: false,
        id: null
    } )
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null
    } )

    // queries
    const { data: expenses = [], isFetching, refetch: fetchExpenses } = useQuery( {
        queryFn: () => getAllExpenses(),
        queryKey: [ 'expenses' ],
        onSuccess: data => setFilteredData( data )
    } );


    const handleOpen = ( id ) => { setMode( { edit: true, id } ) }

    const handleDelete = ( id ) => {

        smalltalk.confirm(
            "Delete Expense", "This action cannot be undone. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteExpense( id ).then(
                () => {
                    message.success( "expense deleted successfully" )
                    fetchExpenses()
                }
            )
        } ).catch( ex => {
            return false;
        } );
    }



    return (
        <section className="mt-4 pb-4">
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
            >
                { modal.content }
            </Modal>

            {
                mode.new ?
                    <Paper>
                        <NewExpenseForm
                            onClose={ () => setMode( { edit: false, id: null } ) }
                            onSuccess={ fetchExpenses }
                        />
                    </Paper> :
                    mode.edit ?
                        <Paper>
                            <EditExpenseForm
                                canEdit={ true } //use permission here
                                id={ mode.id }
                                onUpdate={ fetchExpenses }
                                onClose={ () => setMode( { edit: false, id: null } ) }
                            />
                        </Paper> :
                        <>
                            <PageHeader
                                title="Expenses"
                                description="view, edit and add expenses"
                                metaData={ `${ filteredData.length }` || '...' }
                            />
                            {/* buttons */ }
                            <div className="mb-3">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <button className="bokx-btn btn-prim"
                                            onClick={ () => setMode( { new: true } ) }>
                                            <span className="bi bi-currency-dollar me-2 d-none d-md-inline"></span>
                                            Spend
                                        </button>
                                        {/* <button className="bokx-btn ms-2">
                                            <span className="bi bi-arrow-up-right-square me-2"></span>
                                            <span className="d-none d-md-inline">
                                                Export
                                            </span>
                                        </button> */}
                                    </div>
                                    {/* <div className="d-flex d-none d-md-inline"> */ }
                                    <SearchInput
                                        autoFocus
                                        onChange={ value =>
                                            setFilteredData(
                                                expenses.filter( fd =>
                                                    fd.description.toLowerCase().includes( value.toLowerCase() ) ||
                                                    fd.category.title.toLowerCase().includes( value.toLowerCase() ) ||
                                                    fd.amount.toString().toLowerCase().includes( value.toLowerCase() )
                                                ) )
                                        }
                                        placeholder="search by description, outlet,amount or category" />
                                    {/* </div> */ }
                                </div>

                            </div>
                            {/* buttons end */ }
                            {/* <Divider /> */ }
                            {/* <span className="ms-2">expenses cumulative summaries here. maybe a chart -> go into reports</span> */ }
                            <Paper>
                                <Box sx={ { height: 500, width: '100%' } }>
                                    <DataGrid
                                        rows={ filteredData }
                                        columns={ columns( handleOpen, handleDelete ) }
                                        loading={ isFetching }
                                    />
                                </Box>
                            </Paper>
                        </>
            }
        </section>
    );
}

export { ExpensesPage };