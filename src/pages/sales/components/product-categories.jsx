import { Divider } from 'antd'
import React from 'react'

export default function ProductCategory ( { categories, onClick } ) {
    return (
        <div className='mt-3'>
            <div className="row align-items-center hover-hand py-2" onClick={ () => onClick( 'All' ) }>
                <div className="col-2">0</div>
                <div className="col-10">All</div>
            </div>
            <Divider className='m-0' />
            {
                categories.map( ( cat, index ) => <>
                    <div className="row align-items-center hover-hand py-2" onClick={ () => onClick( cat ) }>
                        <div className="col-2">{ ++index }</div>
                        <div className="col-10">{ cat.title }</div>
                    </div>
                    <Divider className='m-0' />
                </> )
            }
        </div>
    )
}
