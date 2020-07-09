import aeec_logo from '../static/aeec.png'
import React from 'react'
import '../App.css'

const header = () => (
    <div>
    <header className="App-header">
        <img src={aeec_logo} alt='AEEC' height='100' width='100' />
    </header>
    </div>
)

export default header;