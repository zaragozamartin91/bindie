import React from 'react';
import ReactDom from 'react-dom';


import axios from 'axios';

const SongsApp = React.createClass({
    getInitialState: function () {
        return {}
    },

    componentDidMount: function () {
        console.log("SongsApp did mount!");
    },

    render: function () {
        return (
            <div>
                Users
            </div>
        );
    }
});

export default SongsApp;