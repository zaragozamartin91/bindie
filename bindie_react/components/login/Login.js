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
                <div style={{color: "rgba(0, 0, 0, 0.87)", backgroundColor: "rgb(0, 188, 212)", transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms", boxSizing: "border-box", fontFamily: "Roboto, sans-serif", boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px", borderRadius: "0px", position: "relative", zIndex: 1100, width: "100%", display: "flex", paddingLeft: "24px", paddingRight: "24px",}}>
                    <h1 style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: "0px", paddingTop: "0px", letterSpacing: "0px", fontSize: "24px", fontWeight: 400, color: "rgb(255, 255, 255)", height: "64px", lineHeight: "64px", flex: "1 1 0%"}}>Bindie</h1>
                </div>
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