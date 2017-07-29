import React from 'react';
import ReactDom from 'react-dom';

import axios from 'axios';

import FlatButton from 'material-ui/FlatButton';
import AlbumIcon from 'material-ui/svg-icons/av/album';

const SongsApp = React.createClass({
    getInitialState: function () {
        return {
            band: null,
            uploadSuccMsg: null
        }
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
            .then(res => {
                console.log(res);
                this.setState({ uploadSuccMsg: "Cancion subida exitosamente" });
            })
            .catch(err => {
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
        const styles = {
            uploadButton: {
                verticalAlign: 'middle',
            },
            uploadInput: {
                cursor: 'pointer',
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                width: '100%',
                opacity: 0,
            },
        };

        let uploadButtonDisabled = this.state.band ? false : true;

        let msgElem = this.state.uploadSuccMsg ?
            <p style={{ color: "green" }}>{this.state.uploadSuccMsg}</p> :
            <div />

        return (
            <div>
                {msgElem}

                Banda: <input
                    type="text"
                    name="band"
                    onChange={this.onBandChange}
                    ref="band" />

                <FlatButton
                    label="Subir una cancion"
                    labelPosition="before"
                    style={styles.uploadButton}
                    containerElement="label"
                    icon={<AlbumIcon />}
                    disabled={uploadButtonDisabled} >
                    
                    <input
                        ref={file => { this.file = file }}
                        type="file"
                        name="song"
                        className="upload-file"
                        style={styles.uploadInput}
                        onChange={this.uploadFile}
                        disabled={uploadButtonDisabled} />
                </FlatButton>

                <form
                    style={{ padding: "10px" }}
                    method="POST" >
                    User: <input type="text" name="user" />
                    <input type="button" value="Upload" onClick={this.uploadSample} />
                </form>
            </div>
        );
    }
});

export default SongsApp;