import { Group, Paper } from "@mantine/core";
import { Divider, Tag, } from "antd";
import { PageHeader } from "../../components/shared";
import { Chip } from "@mui/material";

const BillingSetupPage = ( props ) => {


    return (
        <section className="my-4">
            <PageHeader title="Billings" description="Your billing plan" />
            {/* <Divider /> */ }
            <div className="buttons has-addons">
                <button className="button bokx-btn btn-prim">
                    <span className="bi bi-arrow-up me-2"></span>
                    Upgrade
                </button>
                {/* <button className="button bokx-btn">
                    <span className="bi bi-file-binary me-2" />
                    Receipts (replaced with payments history -> downloadable receipts)
                </button> */}
            </div>
            <div className="row">
                <div className="col-12 col-md-5">
                    <div className="row">
                        <div className="col-12">
                            <Paper className="p-4 bokx-bg">
                                <div className="d-flex justify-content-between">
                                    <Chip label="You plan" className="mb-3 bg-white" />
                                    <button className="button is-ghost text-white">
                                        cancel
                                    </button>
                                </div>
                                {/* <Divider /> */ }
                                <h4 className="my-0 text-white">Premium</h4>
                                <p className="mb-0 text-info">Renews on December 4, 2024</p>
                                {/* <p className="mb-0">Ends on December 2024 (trial only)</p> */ }
                            </Paper>
                        </div>
                        <div className="col-12 mt-2">
                            <Paper className="p-4">
                                <div className="d-flex justify-content-between">
                                    <Chip label="Payment Methods" className="mb-3" />
                                    <button className="button is-ghost">
                                        <span className="bi bi-plus me-2"></span>
                                        add
                                    </button>
                                </div>
                            </Paper>
                        </div>
                    </div>
                </div>
                <Divider className="d-inline d-md-none" />
                <div className="col-12 col-md-7 mt-md-0">
                    <Paper className="p-4">
                        <div className="d-flex justify-content-between">
                            <Chip label="Billing Contact" className="mb-3" />
                            <button className="button is-ghost">
                                <span className="bi bi-check-all me-2"></span>
                                update
                            </button>
                        </div>
                        <div className="row">
                            <div className='col-12 col-md-6 field'>
                                <label htmlFor="billing_name">
                                    Billing Name
                                </label>
                                <input
                                    type="text"
                                    id='billing_name'
                                    required
                                    // onChange={ ( e ) => setState( { ...state, email: e.target.value } ) }
                                    // value={ state.email }
                                    className="input w-100"
                                    placeholder='person or company to bill to'
                                />
                            </div>
                            <div className='col-12 col-md-6 field'>
                                <label htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id='email'
                                    required
                                    // onChange={ ( e ) => setState( { ...state, email: e.target.value } ) }
                                    // value={ state.email }
                                    className="input w-100"
                                    placeholder='email address'
                                />
                            </div>
                            <div className='col-12 field'>
                                <label htmlFor="billing_address">
                                    Billing Address
                                </label>
                                <input
                                    type="email"
                                    id='billing_address'
                                    required
                                    // onChange={ ( e ) => setState( { ...state, email: e.target.value } ) }
                                    // value={ state.email }
                                    className="input w-100"
                                    placeholder='physical billing address'
                                />
                            </div>
                            <div className='col-12 field'>
                                <label htmlFor="country">
                                    Country
                                </label>
                                <input
                                    type="email"
                                    id='country'
                                    required
                                    // onChange={ ( e ) => setState( { ...state, email: e.target.value } ) }
                                    // value={ state.email }
                                    className="input w-100"
                                    placeholder='country'
                                />
                            </div>
                        </div>
                    </Paper>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <Paper className="p-4">
                        <Chip label="Payment History" className="mb-3" />
                        <table className="table">
                            <tr>
                                <th>Date</th>
                                <th>Invoice Number</th>
                                <th>Amount</th>
                                <th></th>
                            </tr>
                            <tbody>
                                <tr>
                                    <td>October 15, 2023</td>
                                    <td>WAF-01992-23</td>
                                    <td>$60</td>
                                    <td><a href="#">Download PDF</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </Paper>
                </div>
            </div >
        </section >
    );
}

export { BillingSetupPage };