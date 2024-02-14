import { useAtom } from "jotai";
import { useState } from "react";
import { shopAtom, userAtom } from "../../../helpers/state/signup";
import { RequiredIndicator } from "../../shared";
import { Chip } from "@mui/material";

const UserSetup = () => {
    const [ user, setUser ] = useAtom( userAtom )
    const [ , setShop ] = useAtom( shopAtom )
    const [ showpwd, setShowPwd ] = useState( false )

    return ( <>
        <form >
            <div className="mx-md-5 row">
                <Chip label="this will also be used for billing. you can change this later!" className="mb-3" />
                <div className="col-md-6 col-12 ">
                    <label htmlFor="firstName">
                        First Name
                        <RequiredIndicator />
                    </label>
                    <input
                        className="input"
                        value={ user.first_name }
                        onChange={ e => setUser( { field: 'first_name', value: e.target.value } ) }
                        required
                        type="text"
                        autoFocus
                        id="firstName" placeholder="first name" />
                </div>

                <div className="mt-3 col-md-6 col-12 mt-md-0">
                    <label htmlFor="lastName">
                        Last Name
                        <RequiredIndicator />
                    </label>
                    <input
                        className="input"
                        value={ user.last_name }
                        onChange={ e => setUser( { field: 'last_name', value: e.target.value } ) }
                        required
                        type="text"
                        id="lastName" placeholder="last name" />
                </div>

                {/* <div className="mt-3 col-md-6  col-12">
                <label className="mb-0" htmlFor="gender">
                    Gender
                    <RequiredIndicator />
                </label>
                <select
                    className="input"
                    value={ user.gender }
                    onChange={ e => setUser( { field: 'gender', value: e.target.value } ) }
                    required
                    id="gender"
                    placeholder="gender">
                    <option value="" selected disabled>select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div> */}


                {/* username */ }
                <div className="mt-3 col-12">
                    <label className="mb-0" htmlFor="email">
                        Email
                        <RequiredIndicator />
                    </label>
                    <input
                        className="input"
                        type="email"
                        value={ user.email }
                        onChange={ e => {
                            setUser( { field: 'email', value: e.target.value } )
                            setShop( { field: 'email', value: e.target.value } )
                        } }
                        required
                        id="email"
                        placeholder="email" />
                    {/* <small>will become shop's official email (you can change it later)</small> */ }
                </div>
                <div className="mt-3 col-12">
                    <label className="mb-0" htmlFor="password">
                        Password
                        <RequiredIndicator />
                    </label>
                    <input
                        className="input"
                        value={ user.password }
                        onChange={ e => setUser( { field: 'password', value: e.target.value } ) }
                        required
                        type={ showpwd ? 'text' : 'password' }
                        id="password" placeholder="password" />
                    <a className="is-ghost p-0"
                        onClick={ ( e ) => { e.preventDefault(); setShowPwd( !showpwd ) } }
                    >
                        { showpwd ? "hide" : "show" } password
                    </a>
                </div>
            </div>
        </form>
    </> );
}

export default UserSetup;