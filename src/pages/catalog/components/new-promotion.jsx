import { DatePicker, Modal, Select } from 'antd'
import { useState } from 'react';
import { SaveButton } from '../../../components/shared';
import NewPromoCodeForm from './new-promo-code';

const NewPromotionForm = ( props ) =>
{
    const [ discountType, setDiscountType ] = useState( 'cash' );
    const [ isModalVisible, setIsModalVisible ] = useState( false );

    const { RangePicker } = DatePicker;
    const { Option } = Select;
    const dateFormat = "MMM DD, yy";

    // handlers
    const handleResetFilters = () =>
    {
        // setFilteredData( sales );
    };

    const handleDiscountType = () =>
    {
        // 
    }

    const handleAddCodes = ( event ) =>
    {
        event.preventDefault();
        setIsModalVisible( true );

    }


    return (
        <div>
            <form>
                <div className="row">
                    <div className="field col-12">
                        <label className="mb-0" htmlFor="promotionName">Promotion Name</label>
                        <input className="input"
                            id="promotionName" placeholder="enter promotion name" maxLength={ 50 } />
                        <small className="text-muted">max 50 characters</small>
                    </div>
                    <div className="my-2 field col-12">
                        <label className="mb-0" htmlFor="description">Short Description</label>
                        <textarea className="textarea"
                            id="description" placeholder="enter a short description to explain the promotion" maxLength={ 200 } ></textarea>
                        <small className="text-muted">max 200 characters</small>
                    </div>
                    <div className="my-2 field col-12">
                        <label className="mb-0 d-block" htmlFor="dates">Dates</label>
                        <RangePicker
                            name="date-range"
                            id='dates'
                            size='large'
                            className='w-100'
                            format={ dateFormat }
                            onChange={ ( e ) => handleDateFilter( e ) }
                        />
                    </div>
                    <div className="my-2 field col-12">
                        <label className="mb-0 d-block" htmlFor="outlets">Outlets</label>
                        <Select
                            mode="multiple"
                            size='large'
                            id='outlets'
                            placeholder="Please select"
                            className='w-100'
                        // defaultValue={ [ 'a10', 'c12' ] }
                        // onChange={ handleChange }
                        >
                            {/* <Option key='key'></Option> */ }
                        </Select>
                    </div>
                    <div className="my-2 field col-12">
                        <label className="mb-0" htmlFor="discount">Discount Type</label>
                        <div>
                            <div class="buttons has-addons mb-0">
                                <button class="button is-info">%</button>
                                <button class="button">GHS</button>
                            </div>
                            <div class="control has-icons-left has-icons-right mt-0">
                                <input className="input" type="number" step="0.01" min={ 0 }
                                    id="discount"
                                // placeholder='switch based on selected (%=enter figure without symbol)'
                                />

                                <span class="icon is-small is-left">
                                    <i class="bi bi-cash"></i>
                                </span>
                                {/* <span class="icon is-small is-left">
                                    <i class="bi bi-percent"></i>
                                </span> */}
                            </div>
                        </div>
                    </div>
                    <div className="my-3 col-12">
                        <button className='button d-inline' type='link' onClick={ handleAddCodes }>
                            Add Code
                            <span className="bi bi-plus-square ms-2"></span>
                        </button>
                        <p>
                            <strong>x</strong> codes added
                        </p>
                    </div>
                </div>
            </form>

            {/*  add codes modal */ }
            <Modal title="Add Code" footer={ <SaveButton icon='' title='Add Promo Code' /> } visible={ isModalVisible } onCancel={ () => setIsModalVisible( false ) }>
                <NewPromoCodeForm />
            </Modal>
        </div>
    );
}

export default NewPromotionForm;