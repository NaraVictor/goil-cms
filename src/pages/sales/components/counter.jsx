import { Input } from "@mantine/core"
import { Chip } from "@mui/material"

export const CounterComponent = ( { } ) => {


    return (
        <div className="bg-white bokx-border rounded p-4 counter-component text-center">
            <div className="row">
                {/* <div className="col-6 col-md-4">
                    <Chip label={ 3 } />
                    <strong className="ms-2">Products</strong>
                </div> */}
                <div className="col-6">
                    <h2 className="mb-0">GHS 100.00</h2>
                    <Chip color="info" label={ <strong className="text-white">1.2 Litres</strong> } />
                </div>
                <div className="col-6">
                    <Input
                        type="number"
                        id="amount_paid"
                        placeholder="amount paid"
                        // className="input"
                        size="lg"

                    />
                    <button
                        className="button w-100 is-info"
                    >
                        <strong>Submit</strong>
                    </button>
                </div>
            </div>
        </div>
    )

}

//                     <li>contains the submit button</li>
//                     <li>shows amt paid & no of litres above it</li>
//                     <li>show payment methods when submit is pressed on mobile</li>
