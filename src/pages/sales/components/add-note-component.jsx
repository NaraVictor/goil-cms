import { message } from 'antd'
import { useAtom } from 'jotai'
import React from 'react'
import { useState } from 'react'
import { saleAtom } from '../../../helpers/state/sales'

export default function AddNoteComponent ( { note, onUpdate } ) {

  const [ sale, setSale ] = useAtom( saleAtom )

  return (
    <div>
      <textarea
        name="note" id="saleNote"
        className='textarea'
        cols="30" rows="10"
        placeholder='start typing here'
        value={ sale.note }
        onChange={ ( e ) => setSale( { note: e.target.value } ) }
      ></textarea>
      {/* <button className='button btn-prim mt-3'
        onClick={ () => {
          onUpdate( state )
          message.success( 'done' )
        } }
      >
        <span className="bi bi-check-all me-2"></span>
        Update
      </button> */}
    </div>
  )
}
