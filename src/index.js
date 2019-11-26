import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
firebase.initializeApp({
    apiKey: "AIzaSyBvvkfXmOi6aN6EZ1Q1wlkiuO6QoIrL-54",
    authDomain: "webaily.firebaseapp.com",
    databaseURL: "https://webaily.firebaseio.com",
    projectId: "webaily",
    storageBucket: "webaily.appspot.com",
    messagingSenderId: "9902598182",
    appId: "1:9902598182:web:caba56c535ea060a7cdee7"
});
function Menu() {
    return(
        <div className="menu">
            <h1 className="title"><a href="/">WebAily Short</a></h1>
            <div>
                <a href="/api">API</a>
            </div>
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
function Preloader() {
    return(
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
    )
}
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
            const url = "https://webaily.web.app/shorturl";
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
class Api extends Component {
    state = {
        isLogged: false,
        isLoading: false,
        uid: '',
        error: ''
    }
    auth = (e) => {
        const thiss = this;
        this.setState({isLoading: true});
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                thiss.setState({isLogged: true});
                if (user != null) {
                    const uid = window.btoa(user.email)
                    thiss.setState({uid: uid, error: ''});
                }
            } else {
                thiss.setState({isLogged: false, uid: ''});
            }
            thiss.setState({isLoading: false});
        })
    }
    login = (e) => {
        this.setState({error: ""});
        const thiss = this;
        var provider = new firebase.auth.GoogleAuthProvider();
        if(e === "github"){
            provider = new firebase.auth.GithubAuthProvider();
        }
        firebase.auth().signInWithPopup(provider).then(function(result) {
            thiss.auth();
        }).catch(error => {
            if(error !== "auth/cancelled-popup-request"){
                thiss.setState({error: error.message});
            }
        })
    }
    signOut = (e) => {
        firebase.auth().signOut();
    }
    componentDidMount(){
        this.auth();
    }
    render() {
        return (
            <div>
                <Menu/>
                <div className="center">
                    {!this.state.isLogged && this.state.isLoading? (
                        <Preloader/>
                    ) : (null)}
                    {!this.state.isLogged && !this.state.isLoading ? (
                        <div>
                            <h2>Login to get API</h2>
                            <div className="login-box">
                                <a className="login-google btn" onClick={this.login}>Login via Google</a>
                                <a className="login-google btn" onClick={() => this.login("github")}>Login via GitHub</a>
                            </div>
                            <div className="err">{this.state.error}</div>
                        </div>
                    ) : (null)}
                    {!this.state.isLoading && this.state.isLogged && this.state.uid ?(
                        <div>
                            <div className="logout" onClick={this.signOut}></div>
                            <div className="code">
                                <i>POST //</i> https://webaily.web.app/shorturl
                                <pre className="json-prev">
                                    {"{"}
                                    <br></br>
                                    &nbsp; "url" : "<span className="green">&lt;URL&gt;</span>",
                                    <br></br>
                                    &nbsp; "type" : "<span className="green">&lt;short/long&gt;</span>"
                                    <br></br>
                                    &nbsp; "token" : "<span className="green">{this.state.uid}</span>"
                                    <br></br>
                                    {"}"}
                                </pre>
                            </div>
                        </div>
                    ) : (null)}

                </div>
            </div>
        );
    }
}
class RouterApp extends Component{
    render(){
        return(
            <Router>
                <Route exact path="/" component={App}/>
                <Route path="/API" component={Api}/>
            </Router>
        )
    }
}
ReactDOM.render(<RouterApp />, document.getElementById('root'));