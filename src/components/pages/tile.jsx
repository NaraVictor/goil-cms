import propType from "prop-types";
import { Link } from "react-router-dom";
import { Typography, Tooltip } from 'antd'
import { cedisLocale, findCurrency } from "../../helpers/utilities";
import _ from "lodash";
import { Chip } from "@mui/material";
import { getUser } from "../../helpers/auth";

const Tile = ( { title, icon, url, className, isLink = true, isAction = false, isActive = false, onClick } ) => {
    const content = (
        <div className="py-4">
            <span className={ `h5 bi ${ icon }` }></span>
            <p className="m-0">{ title }</p>
        </div>
    )
    return (
        <div
            onClick={ onClick }
            className={ `app-tile ${ isAction && ' action-tile ' } ${ isActive && 'tile-active' } ${ className }` }>
            {
                isLink ?
                    <Link to={ url || "#" } >
                        { content }
                    </Link>
                    :
                    <>
                        { content }
                    </>
            }
        </div >
    );
}

export const SellCard = ( { title, icon, className, url = "", isLink = true, isAction = false, isActive = false, onClick } ) => {
    return (
        <div
            onClick={ onClick }
            className={ `app-tile ${ isAction && ' action-tile ' } ${ isActive && 'tile-active' } ${ className }` }>
            <Link to={ url || "#" } >
                <div className="py-4">
                    <span className={ `h5 bi ${ icon }` }></span>
                    <p className="m-0">{ title }</p>
                </div>
            </Link>
        </div >
    );
}

export const SummaryCard = ( { label, data = 0, isLink = true, url, icon, className, alert = false, danger = false, warning = false,
    onclick } ) => {
    const { Paragraph } = Typography
    const content = (
        <Tooltip title={ label }>
            <div className="py-3">
                <h4 className="mb-2 data">{ data }</h4>
                <Paragraph ellipsis className="m-0 card-label" >
                    <span className={ `ms-2 bi ${ icon }` } />
                    { label }
                </Paragraph>
            </div>
        </Tooltip>
    )
    return (
        <div className={ `summary-card ${ alert && ' card-alert ' } ${ danger && ' card-danger ' } ${ warning && ' card-warning ' } ${ className }` } >
            {
                isLink ?
                    <Link to={ url || "#" } >
                        { content }
                    </Link>
                    :
                    <>
                        { content }
                    </>
            }
        </div >
    )
}

export const POSCard = ( { product: prod, className, onclick } ) => {
    const { Paragraph } = Typography

    return (
        <>
            <div className={ `summary-card text-start ${ className }` }
                onClick={ onclick }
            >
                { ( prod?.stock?.units_in_stock <= prod?.stock?.reorder_level && prod?.stock?.units_in_stock > 2 )
                    && <div className="m-0 stock-alert bg-warning"></div> }
                { prod?.stock?.units_in_stock < 3 && <div className="m-0 stock-alert bg-danger"></div> }
                <Tooltip title={ `${ prod.product_name } (${ prod?.stock[ 0 ]?.units_in_stock } left)` }>
                    <div className="py-1">
                        <Paragraph strong className="m-0 card-label" >
                            {
                                _.toString( prod.product_name ).trim().length > 30 ?
                                    _.toString( prod.product_name ).trim().substring( 0, 27 ) + '...'
                                    : prod.product_name
                            }
                        </Paragraph>
                        <small className="text-secondary">
                            { <Chip size="small" label={ <small>{ findCurrency( getUser().currency ).symbol } { cedisLocale.format( prod.retail_price ) }</small> } /> }
                            {
                                !prod?.is_a_service ?
                                    <div className="ms-1">{ prod?.stock[ 0 ]?.units_in_stock } units left</div>
                                    : <div className="ms-1"><strong><i className="text-secondary">service</i></strong></div>
                            }
                        </small>
                    </div>
                </Tooltip>
            </div >
        </>
    )
}

Tile.propType = {
    title: propType.string.isRequired,
    icon: propType.string.isRequired,
    url: propType.string,
    onClick: propType.func
}


export default Tile;


