import { Loader, Menu, Modal, Pagination } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { POSCard } from "../../../components/pages/tile";
import { SearchInput } from '../../../components/shared'
import { selectedProductsAtom } from "../../../helpers/state/sales";
import ProductCategory from "./product-categories";
import { IconEraser } from "@tabler/icons-react";
import { cedisLocale, generateRoute } from "../../../helpers/utilities";
import { Link, useNavigate } from "react-router-dom";
import { appLinks } from "../../../helpers/config";


const ProductsComponent = ( { products, categories, isFetching } ) => {
    const nav = useNavigate()

    // atoms
    const [ , setSelected ] = useAtom( selectedProductsAtom )

    // state
    const [ filteredProd, setFilteredProd ] = useState( [] )
    const [ activeCategory, setCat ] = useState( "" )
    const [ pagination, setPagination ] = useState( {
        pick: 'X',
        skip: 0,
        page: 1,
        pages: 'N' // Math.ceil( parseFloat( products.length / 20 ) ),
    } )

    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        size: 'md'
    } )

    const handleChangeCategory = ( category ) => {
        if ( category === 'All' || category === "" ) {
            setFilteredProd( products )
            setCat( "" )
            return
        }

        setFilteredProd( products.filter( pro => pro.category.id === category.id ) )
        setCat( category.title )
    }

    const handleSearch = ( query ) => {
        if ( _.isEmpty( query ) )
            setFilteredProd( products )

        setFilteredProd( products.filter( pro =>
            pro.product_name.toLowerCase().includes( query.toLowerCase() ) ||
            pro.product_code.toLowerCase().includes( query.toLowerCase() )
        ) )
    }

    const handleNext = () => { }
    const handlePrev = () => { }


    useEffect( () => {
        setFilteredProd( products )
    }, [ isFetching, products ] )


    return (
        <div>
            <div className="d-flex m-0 p-0">
                <SearchInput
                    className="w-100"
                    placeholder="Start typing or scanning to search..."
                    autoFocus
                    onChange={ handleSearch } />
                <Menu>
                    <Menu.Target>
                        <button
                            className="button me-2"
                            title="Change Selected Category"
                        >
                            <span span className={ `me-2 bi bi-funnel${ activeCategory && '-fill bokx-color' }` }>
                            </span>
                            { activeCategory || ' Filter' }
                        </button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label pb={ 0 }>Categories</Menu.Label>
                        <Menu.Item
                            onClick={ () => handleChangeCategory( 'All' ) }
                            py={ 5 }
                        >
                            <IconEraser className="me-2" size={ 17 } /> All Products
                        </Menu.Item>
                        <Menu.Divider />
                        {
                            categories?.filter( cat => products?.find( pro => pro.category?.id === cat.id ) ).map( ( cat, index ) => <>
                                <Menu.Item
                                    onClick={ () => handleChangeCategory( cat ) }
                                    py={ 5 }
                                >
                                    <span
                                        className={ `${ cat.title === activeCategory && ' text-success ' }` }
                                    >
                                        <div className="d-flex justify-content-between">
                                            <span>{ cat.title }</span>
                                            <span>({ products.filter( pro => pro.category?.id === cat.id ).length })</span>
                                        </div>
                                    </span>
                                </Menu.Item>
                            </> )
                        }
                    </Menu.Dropdown >
                </Menu>
            </div >
            <div className="row me-3 mt-2">
                {
                    isFetching &&
                    <div><Loader /> Fetching products... </div>
                }
                {
                    !isFetching && filteredProd.length > 0 ?
                        filteredProd?.map( pro =>
                            <div div className="col-md-3 col-4 g-1" >
                                <POSCard
                                    onclick={ () => setSelected( pro ) }
                                    product={ pro }
                                    className="px-2 pos-card"
                                />
                            </div>
                        )
                        :
                        <div className="mt-3">
                            { !isFetching &&
                                <p className="mb-1">No products yet!</p>
                            }
                            <Link
                                className="button bokx-btn"
                                to={ generateRoute( [ appLinks.catalog.index, appLinks.catalog.inventory ] ) }
                            >
                                <span className="bi bi-plus-circle me-2"></span>
                                Add Product
                            </Link>
                        </div>
                }
            </div>
            {/* <div className="d-flex align-items-center pe-4 justify-content-between">
                <div class="buttons has-addons mt-3">
                    <button className="button bokx-btn" onClick={ handlePrev }>
                        <span className="bi bi-arrow-left me-2"></span>
                        Prev</button>
                    <button className="button bokx-btn" onClick={ handleNext }>
                        Next
                        <span className="bi bi-arrow-right ms-2"></span>
                    </button>
                </div>
                <p>showing <strong>{ pagination.pick }</strong> of <strong>{ pagination.pages }</strong></p>
            </div> */}

            {/* <Pagination className="g-0 mt-3" total={ pagination.pages } /> */ }
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                size={ modal.size }
            >
                { modal.content }
            </Modal>
        </div >
    );
}

export default ProductsComponent;