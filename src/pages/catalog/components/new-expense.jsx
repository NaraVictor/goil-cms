import { Divider, message, Select } from 'antd'
import _ from 'lodash';
import { useMutation, useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { getAllCategories, postNewExpense } from '../../../helpers/api';
import { RequiredIndicator } from '../../../components/shared';
import { Modal } from '@mantine/core';

import NewExpenditureTypeForm from './new-expenditure-type'
import { useState } from 'react';

const NewExpenseForm = ( { showFooter, onSuccess, showHeader = true, onClose } ) => {

    const { handleSubmit, register, reset } = useForm()

    const { data: categories = [], refetch: fetchExpenses } = useQuery( {
        queryFn: () => getAllCategories( 'expense' ),
        queryKey: [ 'expense-categories' ],
    } );


    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        zIndex: 1000,
    } )


    const { mutateAsync, isLoading } = useMutation( ( data ) => postNewExpense( data ), {
        onSuccess: ( data, variables, context ) => {
            if ( data.status === 201 ) {
                message.success( data.data.message );
                reset()
                onSuccess()
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
        <div className='pt-3'>
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                zIndex={ modal.zIndex }
            >
                { modal.content }
            </Modal>
            {
                showHeader &&
                <>
                    <div className="d-flex justify-content-between align-items-center sticky-top bg-white pt-1 px-4">
                        <div>
                            <h5>New Expense</h5>
                        </div>
                        <div className='buttons has-addons'>
                            <button
                                onClick={ () => document.getElementById( 'submit_btn' ).click() }
                                className={ `button btn-prim ${ isLoading && ' is-loading' }` }>
                                <span className="bi bi-save me-2"></span>
                                Save
                            </button>
                            <button className="button bokx-btn" onClick={ onClose }>
                                <span className="bi bi-x-circle me-2"></span>
                                Close
                            </button>
                        </div>
                    </div>
                    <Divider />
                </>
            }
            <form onSubmit={ handleSubmit( mutateAsync ) } className="p-3">
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
                                maxLength={ 250 }
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
                                <option value="" selected disabled>select</option>
                                {
                                    categories.map( cat =>
                                        <option value={ cat.id } id={ cat.id }>{ cat.title }</option> )
                                }
                            </select>
                            <p
                                onClick={ () => setModal( {
                                    title: 'Add Category',
                                    isOpen: true,
                                    content: <NewExpenditureTypeForm onUpdate={ fetchExpenses } />,
                                    zIndex: 1200
                                } ) }
                                className="text-secondary hover-hand d-inline-block p-1 mb-0">
                                <span className="bi bi-plus-circle me-2"></span>
                                add category
                            </p>
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
                        </div>

                    </div>
                </div>
                <input type="submit" hidden id="submit_btn" />
                {
                    showFooter &&
                    <>
                        <Divider />
                        <button className={ `button btn-prim me-3 ${ isLoading && ' is-loading' }` }>
                            <span className="bi bi-save me-2"></span>
                            Save
                        </button>
                    </>
                }
            </form>

        </div>
    );
}

export default NewExpenseForm;