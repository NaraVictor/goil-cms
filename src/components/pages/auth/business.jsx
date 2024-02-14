import { useAtom } from 'jotai';
import { shopAtom, shopCategoryAtom } from '../../../helpers/state/signup';
import { RequiredIndicator } from '../../shared'
import { Select } from '@mantine/core';
import currencies from '../../../currencies.json'
import { businessTypes } from '../../../helpers/config';


const BusinessStep = () => {
    const [ shop, setShop ] = useAtom( shopAtom )
    const [ category, setCategory ] = useAtom( shopCategoryAtom )


    return (
        <>
            <div className="mx-md-5 row">
                <div className="col-12 field mb-3">
                    <label className="mb-0" htmlFor="shop_name">Shop Name
                        <RequiredIndicator />
                    </label>
                    <input className="input" type="text"
                        value={ shop.shop_name }
                        onChange={ e => setShop( { field: 'shop_name', value: e.target.value } ) }
                        autoFocus
                        required
                        id="shop_name" placeholder="what is the shop name" />
                    <small className='text-muted'>the registered name of your shop</small>
                </div>
                {/* <div className="col-12 field">
                    <label htmlFor="email">Business Email
                        <RequiredIndicator />
                    </label>
                    <input
                        value={ shop.email }
                        onChange={ e => setShop( { field: 'email', value: e.target.value } ) }
                        className="input"
                        required
                        id='email'
                        type="email"
                        placeholder='business email'
                    />
                </div> */}
                <div className="col-12 field">
                    <label htmlFor="primary_contact">Primary Contact
                        <RequiredIndicator />
                    </label>
                    <input
                        value={ shop.primary_contact }
                        onChange={ e => setShop( { field: 'primary_contact', value: e.target.value } ) }
                        className="input"
                        required
                        type="tel"
                        id="primary_contact" placeholder="official contact" />
                </div>
                {/* <small className='text-muted'>Contact channels for business (email and phone)</small> */ }
                <div className="col-md-6 col-12 field">
                    <label className="mb-0" htmlFor="base_currency">Base Currency
                        <RequiredIndicator />
                    </label>
                    <Select
                        id='base_currency'
                        value={ shop.base_currency }
                        required
                        onChange={ ( value ) => setShop( { field: 'base_currency', value } ) }
                        size="md"
                        searchable
                        clearable
                        placeholder='pick currency'
                        data={
                            currencies.map( cur => {
                                return {
                                    value: cur.code,
                                    label: cur.name
                                }
                            }
                            )
                        }
                    />
                    <small className='text-muted'>will appear in invoices and receipts</small>
                </div>
                <div className="col-md-6 col-12 field">
                    <label className="mb-0" htmlFor="base_currency">
                        Category
                        <RequiredIndicator />
                    </label>
                    <Select
                        id='base_currency'
                        value={ category.title }
                        onChange={ value => setCategory( value ) }
                        required
                        size="md"
                        searchable
                        clearable
                        placeholder='pick a category'
                        data={
                            _.sortBy( businessTypes, [ 'name' ] ).map( bt => {
                                return {
                                    value: bt.id,
                                    label: bt.name
                                }
                            }
                            )
                        }
                    />
                    <small className='text-muted'>what do you sell</small>
                </div>
                {/* <div className="col-md-6 col-12 mt-3">
                    <label className="mb-0" htmlFor="has_delivery">
                        Do you accept delivery
                    </label>
                    <select className="input"
                        value={ shop.has_delivery }
                        required
                        onChange={ e => setShop( { field: 'has_delivery', value: e.target.value } ) }
                        id="has_delivery" placeholder="has_delivery">
                        <option value={ true }>YES</option>
                        <option value={ false }>NO</option>
                    </select>
                </div> */}
            </div>
        </>
    );
}

export default BusinessStep;