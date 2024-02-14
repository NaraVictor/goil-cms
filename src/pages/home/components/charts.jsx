import React from 'react'
import { expensesChartData, salesChartData } from '../../../helpers/charts-data'
import { Chart as ChartJs, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2'

ChartJs.register( ...registerables )

const SalesChart = ( { data } ) => {
    return (
        <Line
            data={ salesChartData( data ) }
            height={ 90 }
            width={ 200 }
        />
    )
}


const ExpensesChart = ( { data } ) => {
    return (
        <>
            <Line
                data={ expensesChartData( data ) }
                height={ 90 }
                width={ 200 }
            />
        </>
    )
}


export { SalesChart, ExpensesChart } 
