import React from 'react';

import axios from 'axios';

import FlatButton from 'material-ui/FlatButton';
import AlbumIcon from 'material-ui/svg-icons/av/album';
import TextField from 'material-ui/TextField';

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
        let file = this.fileInput.files[0];

        if (file) {
            console.log("ARCHIVO A SUBIR:");
            console.log(file);
            console.log(`TIPO DEL ARCHIVO": ${file.type}`);

            /* SI EL TIPO DE ARCHIVO ES MUSICA ENTONCES PROCEDO A SUBIR EL ARCHIVO */
            if (file.type == "audio/mpeg" || file.type == "audio/mp3") {
                fd.append('file', file);
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
                    }).catch(err => {
                        console.error(err);
                        this.setState({
                            uploadSuccMsg: "",
                            uploadErrMsg: "Error al subir cancion"
                        });
                    });
            } else {
                /* SI EL ARCHIVO NO ES DE MUSICA INDICO UN MENSAJE DE ERROR */
                this.setState({
                    uploadSuccMsg: "",
                    uploadErrMsg: "El tipo de archivo no es mp3"
                });
            }
        } else console.log("NO SE INDICO UN ARCHIVO A SUBIR");

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

                <TextField
                    hintText="Banda"
                    onChange={this.onBandChange} />

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