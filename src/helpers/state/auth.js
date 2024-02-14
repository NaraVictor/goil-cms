import { atom } from "jotai";

const registerTemplate = {
    registerId: '',
    sequenceName: '',
    sequenceId: '',
    isOpen: false
}

// state
const _register = atom( registerTemplate );

// also for loggedIn user and token -> NOPE A REFERSH WILL WIPE CLEAN THE STATE
// save decryption keys in react env vars


// TODO: PUSH THIS TO LOCAL STORAGE


// atoms
export const registerAtom = atom(
    ( get ) => get( _register ),
    ( get, set, register ) => {

        // update register
        set( _register, register )
    } );


// handlers







