import React from 'react'
import { ACTIONS } from './App'

export default function DigitButton({dispatch, digit}) {
  return (
    <button className='dark-button border-r-50' onClick={() => dispatch({type: ACTIONS.ADD_DIGIT, payload: {digit}})}>{digit}</button>
  )
}