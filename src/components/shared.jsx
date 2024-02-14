import { useNavigate } from "react-router-dom";
import { appLinks } from "../helpers/config";
import PageTitle from "./page-title";
import { Chip } from "@mui/material";

const BackButton = ( { className, label = "Back" } ) => {
    const navigate = useNavigate()

    return (
        <button className={ `bokx-btn ${ className }` } onClick={ () => navigate( -1, { replace: false } ) }>
            <span className="me-md-2 bi bi-arrow-left" />
            <span className="d-none d-md-inline-block">{ label }</span>
        </button>
    )
}
const HomeButton = ( { className, label = "Home" } ) => {
    const navigate = useNavigate()

    return (
        <button className={ `bokx-btn ${ className }` } onClick={ () => navigate( appLinks.home, { replace: false } ) }>
            <span className="me-md-2 bi bi-house" />
            <span className="d-none d-md-inline-block">{ label }</span>
        </button>
    )
}


const RequiredIndicator = ( props ) => {
    return (
        <small className="text-danger ms-1">
            *
        </small>
    );
}

const SectionHeader = ( { title, description, className } ) => {

    return (
        <div className={ `d-flex justify-content-between ${ className }` }>
            <PageTitle title={ title } />
            <div>
                <h5 className="mb-0 page-title">{ title }</h5>
                <p className="mt-0 text-muted">{ description }</p>
            </div>
            <div>
                <HomeButton />
            </div>
        </div>
    )
}


const PageHeader = ( { title, description, className, metaData } ) => {
    //page header
    return (
        <div className={ `d-flex justify-content-between ${ className }` }>
            <PageTitle title={ title } />
            <div>
                <h5 className="mb-0 page-header">{ title }{ metaData && <Chip className="ms-2" label={ metaData } /> }</h5>
                <p className="mt-0 text-muted">{ description }</p>
            </div>
            <div>
                <BackButton />
            </div>
        </div>
    )
}


const SaveButton = ( { title = "Save", icon = 'bi-save', click } ) => {
    return (
        <button className="bokx-btn btn-prim" onClick={ click }>
            <span className={ `bi ${ icon } me-2` }>    </span>
            { title }
        </button>
    )
}

const SearchInput = ( { placeholder = "", onChange, autoFocus, className } ) => {
    return ( <div className={ `field ${ className }` }>
        <div className="control has-icons-left has-icons-right">
            <input className="input" autoFocus={ autoFocus } type="search" placeholder={ placeholder } onChange={ ( e ) => onChange( e.target.value ) } />
            <span className="icon is-small is-left">
                <i className="bi bi-search"></i>
            </span>
        </div>
    </div> )
}

const DetailTile = ( { title, detail, icon, className, firstCol, secondCol } ) => {
    return (
        <div className={ `row ${ className }` }>
            <div className={ `${ firstCol ?? 'col-md-3' } col` }>
                <span className={ `bi bi-${ icon } h5 me-3` }></span>
                <strong>{ title }</strong>
            </div>
            <div className={ `${ secondCol ?? 'col-md-9' } col` }>
                { detail }
            </div>
        </div>
    )
}


export { RequiredIndicator, SectionHeader, PageHeader, SaveButton, SearchInput, DetailTile };