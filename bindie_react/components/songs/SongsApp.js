import React from 'react';
import ReactDom from 'react-dom';

import axios from 'axios';

import FlatButton from 'material-ui/FlatButton';
import AlbumIcon from 'material-ui/svg-icons/av/album';

const SongsApp = React.createClass({
    getInitialState: function () {
        return {
            band: null,
            uploadSuccMsg: null,
            uploadErrMsg: null
        }
    },

    uploadFile: function (e) {
        let fd = new FormData();
        console.log("this.fileInput.files[0]:");
        console.log(this.fileInput.files[0]);
        console.log(`this.refs.band.value = ${this.refs.band.value}`);

        fd.append('file', this.fileInput.files[0]);
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
                this.setState({
                    uploadSuccMsg: "Cancion subida exitosamente",
                    uploadErrMsg: ""
                });
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    uploadSuccMsg: "",
                    uploadErrMsg: "Error al subir cancion"
                });
            });

        e.preventDefault()
    },

    onBandChange: function (e) {
        let band = e.target.value;
        this.setState({ band });
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

        /* SI NO SE INGRESO UNA BANDA, SE DESHABILITA EL BOTON DE SUBIDA DE CANCIONES */
        let uploadButtonDisabled = this.state.band ? false : true;

        let succMsgElem = this.state.uploadSuccMsg ?
            <p style={{ color: "green" }}>{this.state.uploadSuccMsg}</p> :
            <div />

        let errMsgElem = this.state.uploadErrMsg ?
            <p style={{ color: "red" }}>{this.state.uploadErrMsg}</p> :
            <div />

        return (
            <div>
                {succMsgElem}
                {errMsgElem}

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
                        ref={fi => { this.fileInput = fi }}
                        type="file"
                        name="song"
                        className="upload-file"
                        style={styles.uploadInput}
                        onChange={this.uploadFile}
                        disabled={uploadButtonDisabled} />
                </FlatButton>
            </div>
        );
    }
});

export default SongsApp;