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
        console.log("this.refs.file.files[0]:");
        console.log(this.refs.file.files[0]);
        fd.append('file', this.refs.file.files[0]);

        console.log("UPLOADING FILE");

        let user = this.state.user;

        $.ajax({
            url: '/api/song/upload/' + user,
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                console.log("SUCCESS!");
            }, error: function (xhr, status, error) {
                console.log("ERROR:");
                console.log(error);
            }
        });
        e.preventDefault()
    },

    onUserChange: function (e) {
        let user = e.target.value;
        this.setState({ user });
        console.log(`new user: ${user}`);
    },

    render: function () {
        return (
            <div>
                <form
                    method="POST"
                    encType="application/json"  >
                    Cancion: <input ref="file" type="file" name="song" className="upload-file" />
                    User: <input type="text" name="user" onChange={this.onUserChange} />
                    <input type="button" ref="button" value="Upload" onClick={this.uploadFile} />
                </form>

                <form
                    method="POST"
                    action="/api/sample/MARTIN" >
                    User: <input type="text" name="user" />
                    <input type="submit" ref="button" value="Upload" />
                </form>
            </div>
        );
    }
});

export default SongsApp;