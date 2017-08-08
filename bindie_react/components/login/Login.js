import React from 'react';
import ReactDom from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


/* ESTE FRAGMENTO DE CODIGO ES REQUERIDO PARA LOS EVENTOS DE TIPO TOUCH O CLICK EN COMPONENTES MATERIAL-UI */
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
/* -------------------------------------------------------------------------------------------------------- */

const Login = React.createClass({
    submitForm: function () {
        console.log("Submiting form");
        if (this.form) this.form.submit();
    },

    render: function () {
        return (
            <div>
                <h1>Bindie</h1>
                <MuiThemeProvider>
                    <Card>
                        <CardHeader
                            title="Iniciar sesion"
                            subtitle="Inicia sesion con una cuenta existente en BINDIE."
                            actAsExpander={true}
                            showExpandableButton={true}
                        />

                        <CardText expandable={true}>
                            <form method="POST" action="/login" ref={f => { this.form = f }}>
                                <TextField
                                    name="email"
                                    hint="email"
                                    floatingLabelText="email" /><br />

                                <TextField
                                    name="password"
                                    hintText="Password"
                                    floatingLabelText="Password"
                                    type="password" /><br />
                            </form>
                        </CardText>
                        <CardActions>
                            <FlatButton label="Iniciar sesion" onClick={this.submitForm} />
                        </CardActions>
                    </Card>

                </MuiThemeProvider >
            </div>
        );
    }
});

ReactDom.render(
    <Login />,
    document.getElementById('root')
);