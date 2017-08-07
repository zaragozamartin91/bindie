import React from 'react';
import ReactDom from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

/* ESTE FRAGMENTO DE CODIGO ES REQUERIDO PARA LOS EVENTOS DE TIPO TOUCH O CLICK EN COMPONENTES MATERIAL-UI */
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
/* -------------------------------------------------------------------------------------------------------- */

const Login = React.createClass({
    submitForm: function () {
        console.log("Submiting form");
        this.form.submit();
    },

    render: function () {
        return (
            <MuiThemeProvider>
                <Paper zDepth={2} >
                    <form method="POST" action="/login" ref={f => { this.form = f }}>
                        <TextField
                            name="email"
                            hint="email"
                            floatingLabelText="email" /><br/>

                        <TextField
                            name="password"
                            hintText="Password"
                            floatingLabelText="Password"
                            type="password" /><br/>

                        <RaisedButton
                            label="Iniciar sesion"
                            onClick={this.submitForm}
                            primary={true} />
                    </form>
                </Paper>
            </MuiThemeProvider >
        );
    }
});

ReactDom.render(
    <Login />,
    document.getElementById('root')
);