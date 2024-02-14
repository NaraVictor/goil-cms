import { atom } from "jotai";
// import _ from "lodash";

// retrieve checkedStatus
const checkedKey = "isSystemChecked";
export const IsSystemChecked = () => {
	return sessionStorage.getItem( checkedKey ) ? true : false;
};

export const SystemIsChecked = () => {
	sessionStorage.setItem( checkedKey, true );
};

// modal
const _modal = atom( { isOpen: false, content: null, size: '', title: '' } )
export const getModalAtom = atom( ( get ) => get( _modal ) )
export const setModalAtom = atom( null, ( get, set, state ) => {
	set( _modal, state )
} )




