import React, { Component } from 'react';
import Preloader from './Preloader';
import Menu from './Menu';
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
                            <div className="center-box">
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
export default Api