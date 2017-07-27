import React from 'react';
import ReactDom from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import Index from './Index';
import SongsApp from './songs/SongsApp';

/* ESTE FRAGMENTO DE CODIGO ES REQUERIDO PARA LOS EVENTOS DE TIPO TOUCH O CLICK EN COMPONENTES MATERIAL-UI */
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
/* -------------------------------------------------------------------------------------------------------- */

const PAGES = {
    index: <Index />,
    songs: <SongsApp />
};

const MainApp = React.createClass({
    getInitialState: function () {
        return {
            currPage: 'index',
            drawerOpen: false
        }
    },

    appBarLeftTap: function () {
        console.log('AppBar tap!');
        const drawerOpen = this.state.drawerOpen;
        this.setState({ drawerOpen: !drawerOpen });
    },

    /* Esta funcion se ejecutara cada vez que se solicite cambiar el estado de la barra. */
    onDrawerRequestChange: function (open) {
        this.setState({ drawerOpen: open });
    },

    gotoPage: function (page) {
        console.log("GOING TO PAGE: " + page);
        this.setState({ currPage: page, drawerOpen: false });
    },

    render: function () {
        let currentPage = PAGES[this.state.currPage];

        return (
            <MuiThemeProvider>
                <div>
                    <AppBar onLeftIconButtonTouchTap={this.appBarLeftTap} />

                    <Drawer open={this.state.drawerOpen} docked={false} onRequestChange={this.onDrawerRequestChange} >
                        <MenuItem onTouchTap={e => this.gotoPage('index')}>Principal</MenuItem>
                        <MenuItem onTouchTap={e => this.gotoPage('songs')}>Canciones</MenuItem>
                    </Drawer>

                    {currentPage}
                </div>
            </MuiThemeProvider>
        );
    }
});

ReactDom.render(
    <MainApp />,
    document.getElementById('root')
);

