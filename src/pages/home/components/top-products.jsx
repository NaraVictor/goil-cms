import React from 'react'
import { cedisLocale } from '../../../helpers/utilities'
import { Box, Paper } from '@mantine/core';
import { DataGrid } from '@mui/x-data-grid';
import _ from 'lodash';

const TopSellingProducts = ( { data } ) => {
    const columns = [
        {
            field: 'id',
            headerName: 'SN',
            sortable: true,
            width: 60,
            renderCell: ( params ) => params.api.getRowIndexRelativeToVisibleRows( params.row.id ) + 1
        },
        {
            field: 'product_name',
            headerName: 'Product',
            sortable: true,
            // width: 200,
            flex: 1
        },
        {
            // field: 'n',
            headerName: 'Price',
            sortable: true,
            // width: 150,
            flex: 0.5,
            renderCell: ( { row } ) => cedisLocale.format( ( row.markup_price + row.supplier_price ) )
        },
        {
            field: 'sale_count',
            headerName: 'No. Sold',
            sortable: true,
            flex: 0.5,
            renderCell: ( { row } ) => row.sale_count || 0
        },
    ];


    return (
        <>
            <p className='mt-0 pt-0'>Top selling products by number of unique sales</p>
            <Paper>
                <Box sx={ { height: 500, width: '100%' } }>
                    <DataGrid
                        rows={ data }
                        columns={ columns }
                    />
                </Box>
            </Paper>
        </>
    );
}


export { TopSellingProducts }