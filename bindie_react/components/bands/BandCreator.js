import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import axios from 'axios';
import TextField from 'material-ui/TextField';

const delim = '::';

const BandCreator = React.createClass({
    getInitialState: function () {
        return {
            dataSource: [],
            currMemberValue: "",
        };
    },

    handleUpdateInput: function (value) {
        console.log(`Member value: ${value}`);

        axios.get(`/api/user/query/${value}`)
            .then(res => {
                if (res.err) return console.error(res.err);
                let pairs = res.data.pairs;
                
                let dataSource = pairs.map(this.buildMemberString);
                let currMemberValue = value;
                this.setState({ dataSource, currMemberValue });
            })
            .catch(err => {
                console.error(err);
            });
    },

    buildMemberString: function (pair) {
        return `${pair.name}${delim}${pair.email}`;
    },

    splitMemberString: function (memberString) {
        let split = memberString.split(delim);
        return { name: split[0], email: split[1] };
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

export default BandCreator;