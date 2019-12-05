import React, { Component } from 'react';
import Menu from './Menu';
class Apps extends Component {
    render() { 
        return (
            <div className="center">
                <Menu/>
                <h2>Download</h2>
                <div className="center-box">
                    <a className="btn dl" href="https://www.icloud.com/shortcuts/85bb275fbce74a70bf2c1a681b50f8a9" target="_blank">Siri Shortcut</a>
                </div>  
            </div>

        )
    }
}
export default Apps