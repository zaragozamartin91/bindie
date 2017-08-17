import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import axios from 'axios';
import TextField from 'material-ui/TextField';

const BandManager = React.createClass({
    getInitialState: function () {
        return {
            dataSource: [],
        };
    },

    handleUpdateInput: function (value) {
        axios.get(`/api/user/query/${value}`)
            .then(res => {
                if (res.err) return console.error(res.err);
                let pairs = res.data.pairs;
                console.log(pairs);
                let dataSource = pairs.map(d => `${d.name}::${d.email}`);
                this.setState({ dataSource });
            })
            .catch(err => {
                console.error(err);
            });
    },

    render: function () {
        return (
            <div>
                <h1>Crear banda</h1>

                <TextField
                    name="name"
                    hintText="Nombre" /><br />

                <AutoComplete
                    hintText="Ingresar integrante"
                    dataSource={this.state.dataSource}
                    onUpdateInput={this.handleUpdateInput} />
            </div>
        );
    }
});

export default BandManager;