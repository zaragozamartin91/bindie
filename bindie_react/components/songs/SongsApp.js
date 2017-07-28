import React from 'react';
import ReactDom from 'react-dom';

import axios from 'axios';

var $ = require("jquery");

const SongsApp = React.createClass({
    getInitialState: function () {
        return { user: "UNKNOWN" }
    },

    uploadFile: function (e) {
        let fd = new FormData();
        console.log("this.file.files[0]:");
        console.log(this.file.files[0]);
        console.log(`this.refs.user.value = ${this.refs.user.value}`);
        
        fd.append('file', this.file.files[0]);
        fd.append('foo', 'bar');

        console.log("UPLOADING FILE");

        let user = this.state.user;

        var config = {
            onUploadProgress: function (progressEvent) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`percentage: ${percentCompleted}`);
            }
        };

        axios.post('/api/song/upload/' + user, fd, config)
            .then(function (res) {
                console.log(res);
            })
            .catch(function (err) {
                console.error(err);
            });

        e.preventDefault()
    },

    onUserChange: function (e) {
        let user = e.target.value;
        this.setState({ user });
        console.log(`new user: ${user}`);
    },

    uploadSample: function () {
        axios.post('/api/sample/MARTIN', { user: "MARTIN" })
            .then(res => {
                console.log(res);
            }).catch(err => {
                console.error(err);
            })
    },

    render: function () {
        return (
            <div>
                <form
                    method="POST"
                    encType="application/json"  >
                    Cancion: <input ref={file => { this.file = file }} type="file" name="song" className="upload-file" />
                    User: <input type="text" name="user" onChange={this.onUserChange} ref="user" />
                    <input type="button" ref="button" value="Upload" onClick={this.uploadFile} />
                </form>

                <form
                    method="POST" >
                    User: <input type="text" name="user" />
                    <input type="button" value="Upload" onClick={this.uploadSample} />
                </form>
            </div>
        );
    }
});

export default SongsApp;