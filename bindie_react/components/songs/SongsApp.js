import React from 'react';
import ReactDom from 'react-dom';

import axios from 'axios';

const SongsApp = React.createClass({
    getInitialState: function () {
        return { band: "UNKNOWN" }
    },

    uploadFile: function (e) {
        let fd = new FormData();
        console.log("this.file.files[0]:");
        console.log(this.file.files[0]);
        console.log(`this.refs.band.value = ${this.refs.band.value}`);
        
        fd.append('file', this.file.files[0]);
        fd.append('foo', 'bar');

        console.log("UPLOADING FILE");

        let band = this.state.band;

        var config = {
            onUploadProgress: function (progressEvent) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`percentage: ${percentCompleted}`);
            }
        };

        axios.post('/api/song/upload/' + band, fd, config)
            .then(function (res) {
                console.log(res);
            })
            .catch(function (err) {
                console.error(err);
            });

        e.preventDefault()
    },

    onBandChange: function (e) {
        let band = e.target.value;
        this.setState({ band });
        console.log(`new band: ${band}`);
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
                    Band: <input type="text" name="band" onChange={this.onBandChange} ref="band" />
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