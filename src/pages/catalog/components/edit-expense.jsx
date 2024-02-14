import { Divider, message } from 'antd'
import { useMutation, useQuery } from 'react-query';
import { getAllCategories, getExpense, putExpense } from '../../../helpers/api';
import { useForm } from 'react-hook-form';
import { RequiredIndicator } from '../../../components/shared';
import { LinearProgress } from '@mui/material';


const EditExpenseForm = ( { id, canEdit, showHeader = true, onClose, onUpdate } ) => {

    const { handleSubmit, register, getValues } = useForm( {
        defaultValues: async () => getExpense( id ).then( res => {
            return {
                ...res,
                date: new Date( res.date ).toISOString().substring( 0, 10 )
            }
        } )
    } )

    const { data: categories = [], isFetching } = useQuery( {
        queryFn: () => getAllCategories( 'expense' ),
        queryKey: [ 'expense-categories' ],
    } );



    const { mutateAsync, isLoading } = useMutation( ( data ) => putExpense( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 200 ) {
                message.success( data.data.message );
                onUpdate()
                return;
            }

            throw data;
        },

        onError: ( error, variables, context ) => {
            const err = error.response.data.message;

            if ( _.isArray( err ) ) {
                err.map( err =>
                    message.error( err.message )
                );
            }
            else {
                message.error( err );
            }
        },
        retry: true
    } );


    return (

        <div className="pt-3">
            {
                showHeader &&
                <>
                    <div className="d-flex justify-content-between align-items-center sticky-top bg-white pt-1 px-4">
                        <div>
                            <h5>Expense Details</h5>
                        </div>
                        <div className='buttons has-addons'>
                            {
                                canEdit &&
                                <button
                                    onClick={ () => {
                                        document.getElementById( 'submit_btn' ).click();
                                    } }
                                    className={ `button btn-prim ${ isLoading && ' is-loading' }` }
                                >
                                    <span className="bi bi-check-all me-2"></span>
                                    Update
                                </button>
                            }
                            <button className="button bokx-btn" onClick={ onClose }>
                                <span className="bi bi-x-circle me-2"></span>
                                Close
                            </button>
                        </div>
                    </div>
                    <Divider />
                </>
            }
            {
                isFetching &&
                <LinearProgress color="success" className="mb-2" />
            }
            <form onSubmit={ handleSubmit( mutateAsync ) } className="p-4">
                <div className="row">
                    <div className="col-12">
                        <div>
                            <label htmlFor="description">
                                Description
                                <RequiredIndicator />
                            </label>
                            <input
                                type="text"
                                id='description'
                                autoFocus
                                className="input"
                                placeholder="describe expenditure"
                                { ...register( "description", { required: true } ) }
                            />
                        </div>
                        <div className="my-3">
                            <label htmlFor="amount">
                                Amount
                                <RequiredIndicator />
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                id='amount'
                                className="input"
                                placeholder="amount spent"
                                { ...register( "amount", { required: true } ) }
                            />
                        </div>
                        <div>
                            <label htmlFor="categories">
                                Category
                                <RequiredIndicator />
                            </label>
                            <select
                                size='large'
                                name="categories"
                                id="categories"
                                className="d-block w-100 input"
                                placeholder='select expense category'
                                { ...register( "category_id", { required: true } ) }
                            >
                                {
                                    categories.map( cat =>
                                        <option value={ cat.id } id={ cat.id }>{ cat.title }</option> )
                                }
                            </select>
                        </div>
                        <div className="my-3">
                            <label htmlFor="date">
                                Date
                                <RequiredIndicator />
                            </label>
                            <input
                                type="date"
                                id='date'
                                className="input"
                                placeholder="input expenditure date"
                                { ...register( "date", { required: true } ) }
                            />
                            <small className="text-muted">{ new Date( getValues( 'date' ) ).toDateString() }</small>
                        </div>

                    </div>
                </div>
                <button hidden type='submit' id='submit_btn'></button>
            </form>
        </div>
    );
}

export default EditExpenseForm;