import aeec_logo from '../aeec.png'
import React from 'react'
import '../App.css'

const header = (props) => (
    <div>
    <header className="App-header">
        <img src={aeec_logo} alt='AEEC' height='100' width='100' />
        {/* <span><h3>{props.dashboard}</h3></span> */}
    </header>
    </div>
)

export default header;