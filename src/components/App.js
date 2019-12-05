import React, { Component } from 'react';
import Info from './Info';
import Preloader from './Preloader';
import Menu from './Menu';
import {CopyToClipboard} from 'react-copy-to-clipboard';
class App extends Component {
    state = {
        value: '',
        isLoading: false,
        error: null,
        start: '',
        shorted: undefined,
        btncopy: "Copy",
        disabledInpt: false
    }
    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }
    componentDidMount(){
        if(navigator.share){
            this.setState({btncopy: "Share"})
        }
    }
    shortit = (event) => {
        const inpt = document.getElementById("inpt-url");
        const toshort = this.state.value.toLowerCase();
        if(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(toshort) && /shortly\.page\.link\/[a-zA-Z0-9]/.test(toshort) !== true){
            inpt.classList.remove("error");
            this.setState({disabledInpt:true});
            this.setState({isLoading: true });
            const url = "https://webaily.web.app/shorturl?req=post";
            const params = {
                url: this.state.value.toLowerCase(),
                type: "short",
                token: "bGVzemVra0BsZXN6ZWtrLmV1"
            };
            fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
            .then(data => data.json())
            .then(res => {
                this.setState({shorted : res.url, start: toshort, isLoading: false});
                this.setState({disabledInpt:false});
            })
            .catch(error =>
                {
                   this.setState({ error, isLoading: false });
                   this.setState({disabledInpt:false});
                }
            );
            this.setState({isLoading: true, shorted: undefined})
        }else{
            inpt.classList.add("error");
        }
    }
    copy = (event) => {
        if(navigator.share) {
            navigator.share({
                title: "Shortened URL",
                url: this.state.shorted
            }).then(() => {
                console.log('shared');
            })
            .catch(console.error);
        }else {
            this.setState({btncopy:"Copied"});
            const thiss = this;
            setTimeout(function(){
                thiss.setState({btncopy: "Copy"})
            }, 3000); 
        }

    }
    onenter = (event) => {
        if (event.key === "Enter") {
            this.shortit();
        }
    }
    render() {
        return (
            <div className="cnt">
                <Menu/>
                <div>
                    <Info/>
                    <div className="box">
                        <input className="inpt-url" id="inpt-url" placeholder="Shorten a link here..." type="url" disabled = {(this.state.disabledInpt)? "disabled" : ""} value={this.state.value} onChange={this.handleChange} onKeyUp={this.onenter}/>
                        <a className="btn short" onClick={this.shortit}>Shorten It!</a>
                    </div>
                    <div className="result">
                        {!this.state.isLoading && this.state.shorted !== undefined ? (
                            <div className="resultbox">
                                <div className="defaulturl"><div>{this.state.start}</div></div>
                                <div className="shortedurl"><div>{this.state.shorted}</div></div>
                                <CopyToClipboard text={this.state.shorted}>
                                    <a className="btn copy" onClick={this.copy}>{this.state.btncopy}</a>
                                </CopyToClipboard>
                            </div>
                        ): (
                            null
                        )}
                        
                        {this.state.isLoading && this.state.shorted === undefined ? (
                            <Preloader/>
                        ): ( null
                        )}
                    </div>
                    <div className="footer">
                        <a href="https://leszekk.eu">Powered by Leszekk.eu</a>
                    </div>
                </div>
            </div>
        );
    }
}
export default App