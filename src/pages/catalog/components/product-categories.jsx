import { Box, Menu, Modal, Paper } from "@mantine/core";
import { DataGrid } from "@mui/x-data-grid";
import { Divider, message, } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { deleteCategory, getAllCategories } from "../../../helpers/api";
import EditCategoryForm from "./edit-category";
import NewProductTypeForm from "./new-product-type";
import smalltalk from 'smalltalk';



const columns = ( onEdit, onDelete ) => [
    {
        field: 'title',
        headerName: 'Title',
        sortable: true,
        flex: 1,
    },
    // {
    //     field: 'type',
    //     headerName: 'Type',
    //     sortable: true,
    //     width: 150
    // },
    {
        field: 'number_of_products',
        headerName: 'Products',
        sortable: true,
        // width: 250
        flex: 1,

    },

    {
        // headerName: 'Actions',
        width: 100,
        renderCell: ( { row } ) => {
            return (
                <div className="d-flex">
                    <Menu>
                        <Menu.Target>
                            <button className="button is-small is-ghost px-2">
                                <span className="bi bi-list me-2"></span>
                                Actions
                            </button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item
                                onClick={ () => onEdit( row.id ) }
                                icon={ <span className="bi bi-pencil" /> }>
                                Edit
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

const ProductCategoriesPage = ( props ) => {
    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null
    } )

    // queries
    const { data = [], isFetching, refetch } = useQuery( {
        queryFn: () => getAllCategories( 'product' ),
        queryKey: [ 'product-categories' ],
    } );


    // handlers
    const handleEdit = ( id ) => {
        setModal( {
            title: 'Edit Product Category',
            isOpen: true,
            content: <EditCategoryForm id={ id } type="product" onUpdate={ refetch } canEdit={ true } />
        } )
    }

    const handleDelete = ( id ) =>
        smalltalk.confirm(
            "Delete Category", "This action cannot be undone. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteCategory( id ).then( () => {
                message.success( 'Category deleted successfully' )
                refetch()
            }
            )
        } ).catch( ex => {
            return false;
        } );


    return (
        <section className="mt-4 pb-4">
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
            >
                { modal.content }
            </Modal>
            {/* buttons */ }
            <div className="mt-3">
                <button className="bokx-btn btn-prim" onClick={ () =>
                    setModal( {
                        content: <NewProductTypeForm onUpdate={ refetch } />,
                        title: 'Add Product Category',
                        isOpen: true
                    } )
                }>
                    <span className="bi bi-plus-circle me-2"></span>
                    Add Product Category
                </button>
            </div>
            {/* buttons end */ }
            <Divider />

            <Paper>
                <Box sx={ { height: 500, width: '100%' } }>
                    <DataGrid
                        rows={ data }
                        loading={ isFetching }
                        columns={ columns( handleEdit, handleDelete ) }
                    />
                </Box>
            </Paper>
        </section>
    );
}

export default ProductCategoriesPage;