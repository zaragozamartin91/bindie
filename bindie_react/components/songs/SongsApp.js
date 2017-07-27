import React from 'react';
import ReactDom from 'react-dom';

import axios from 'axios';

const SongsApp = React.createClass({
    getInitialState: function () {
        return { data_uri: null }
    },

    componentDidMount: function () {
        console.log("SongsApp did mount!");

    },

    render() {
        return (
            <div>
            
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