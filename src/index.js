import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './App.css';
function Menu() {
    return(
        <div className="menu">
            <h1 className="title">WebAily Short</h1>
        </div>
    )
}
function Info() {
    return(
        <div className="info-up">
            <h2>More than just shorten links</h2>
            <p>Create your own short link using our service.</p>
        </div>
    )
}
class App extends Component {
    state = {
        value: '',
        isLoading: false,
        error: null,
        start: '',
        shorted: undefined,
        btncopy: "Copy"
    }
    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }
    shortit = (event) => {
        const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
        const regex = new RegExp(expression);
        const inpt = document.getElementById("inpt-url");
        const toshort = this.state.value;
        if(toshort.match(regex)){
            inpt.classList.remove("error");
            this.setState({isLoading: true })
            const url = "https://webaily.web.app/shorturl?req=post";
            const params = {
                url: this.state.value,
                type: "short"
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
                this.setState({shorted : res.url, start: toshort, isLoading: false})
            })
            .catch(error => this.setState({ error, isLoading: false }));
            this.setState({isLoading: true, shorted: undefined})
        }else{
            inpt.classList.add("error");
        }
    }
    copy = (event) => {
        alert("s");
        navigator.clipboard.writeText(this.state.shorted);
        this.setState({btncopy:"Copied"});
    }
    render() {
        return (
            <div>
                <Menu/>
                <div className="cnt">
                    <Info/>
                    <div className="box">
                        <input className="inpt-url" id="inpt-url" placeholder="Shorten a link here..." type="url" value={this.state.value} onChange={this.handleChange}/>
                        <a className="btn short" onClick={this.shortit}>Shorten It!</a>
                    </div>
                    <div className="result">
                        {!this.state.isLoading && this.state.shorted !== undefined ? (
                            <div className="resultbox">
                                <div className="defaulturl"><div>{this.state.start}</div></div>
                                <div className="shortedurl"><div>{this.state.shorted}</div></div>
                                <a className="btn copy" onClick={this.copy}>{this.state.btncopy}</a>
                            </div>
                        ): (
                            null
                        )}
                        
                        {this.state.isLoading && this.state.shorted == undefined ? (
                            <div className="sk-cube-grid preloader" id="preloader">
                                <div className="sk-cube sk-cube1"></div>
                                <div className="sk-cube sk-cube2"></div>
                                <div className="sk-cube sk-cube3"></div>
                                <div className="sk-cube sk-cube4"></div>
                                <div className="sk-cube sk-cube5"></div>
                                <div className="sk-cube sk-cube6"></div>
                                <div className="sk-cube sk-cube7"></div>
                                <div className="sk-cube sk-cube8"></div>
                            <div className="sk-cube sk-cube9"></div>
                        </div>
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
ReactDOM.render(<App />, document.getElementById('root'));