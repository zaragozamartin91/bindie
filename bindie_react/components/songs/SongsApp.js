import React from 'react';
import ReactDom from 'react-dom';

import axios from 'axios';

var $ = require("jquery");

const SongsApp = React.createClass({
    uploadFile: function (e) {
        var fd = new FormData();
        console.log("this.refs.file.files[0]:");
        console.log(this.refs.file.files[0]);
        fd.append('file', this.refs.file.files[0]);

        console.log("UPLOADING FILE");

        $.ajax({
            url: '/api/song/upload',
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
    render: function () {
        return (
            <div>
                <form ref="uploadForm" className="uploader" encType="multipart/form-data" >
                    Cancion: <input ref="file" type="file" name="song" className="upload-file" />
                    User: <input type="text" name="user" />
                    <input type="button" ref="button" value="Upload" onClick={this.uploadFile} />
                </form>
            </div>
        );
    }
});

export default SongsApp;