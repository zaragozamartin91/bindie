import React from 'react';
import ReactDom from 'react-dom';

import axios from 'axios';

const FileUpload = require('react-fileupload');

const SongsApp = React.createClass({
    getInitialState: function () {
        return { data_uri: null }
    },

    componentDidMount: function () {
        console.log("SongsApp did mount!");

    },

    handleFile: function (e) {
        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onload = function (upload) {
            this.setState({
                data_uri: upload.target.result
            });
            console.log(this.state.data_uri)
        }.bind(this);

        reader.readAsDataURL(file);
    },

    handleSubmit: function () {
        axios.post('/api/song/upload', {data:this.state.data_uri})
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    render() {
        /*set properties*/
        const options = {
            baseUrl: '/api/song/upload'
        }
        /*Use FileUpload with options*/
        /*Set two dom with ref*/

        return (
            <div>
                <FileUpload options={options}>
                    <button ref="chooseBtn">choose</button>
                    <button ref="uploadBtn">upload</button>
                </FileUpload>

            
                <form id="songUpload" method="POST" encType="multipart/form-data"
                    action="/api/song/upload">
                    <input type='file' name='song' />
                    <input type='submit' value='Subir!' />
                </form>

            </div>
        )
    }
});

export default SongsApp;