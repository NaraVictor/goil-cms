import { usePaystackPayment } from 'react-paystack';

const PayStackPayment = ( { config, onSuccess, onClose, onBefore, isDataValid } ) => {
    const initializePayment = usePaystackPayment( config );


    // const onClose = () => {
    //     // implementation for  whatever you want to do when the Paystack dialog closed.
    //     // console.log( 'paystack payment closed' )
    // }

    return (
        <div>
            <button
                className='paystack-button'
                onClick={ () => {
                    onBefore().then( () => {
                        initializePayment( onSuccess, onClose )
                    } )
                } }>Pay Now</button>
        </div>
    );
};

export default PayStackPayment;