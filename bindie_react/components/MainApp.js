import React from 'react';
import ReactDom from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import Index from './Index';
import SongsApp from './songs/SongsApp';

import SongPlayer from './songs/SongPlayer';

/* ESTE FRAGMENTO DE CODIGO ES REQUERIDO PARA LOS EVENTOS DE TIPO TOUCH O CLICK EN COMPONENTES MATERIAL-UI */
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
/* -------------------------------------------------------------------------------------------------------- */

/* PAGINAS USADAS PARA EL ENRUTAMIENTO */
const PAGES = {
    index: <Index />,
    songs: <SongsApp />
};

const MainApp = React.createClass({
    getInitialState: function () {
        return {
            currPage: 'index',
            drawerOpen: false,
            songIndex: 0
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

    componentWillMount: function () {
        console.log("MainApp will mount!");
        this.playlist = [
            "babasonicos-carismatico.mp3",
            "Fake Tales Of San Francisco.mp3",
            "Take Me Out.mp3"
        ];
    },

    nextSong: function () {
        if (this.playlist.length) {
            let songIndex = (this.state.songIndex + 1) % this.playlist.length;
            this.setState({ songIndex });
        }
    },

    render: function () {
        console.log("RENDERING MainApp!");
        let currentPage = PAGES[this.state.currPage];
        let song = this.playlist[this.state.songIndex];

        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        onLeftIconButtonTouchTap={this.appBarLeftTap}
                        title="Bindie" />

                    <Drawer open={this.state.drawerOpen} docked={false} onRequestChange={this.onDrawerRequestChange} >
                        <MenuItem onTouchTap={e => this.gotoPage('index')}>Principal</MenuItem>
                        <MenuItem onTouchTap={e => this.gotoPage('songs')}>Canciones</MenuItem>
                    </Drawer>

                    <SongPlayer nextSong={this.nextSong} song={song} />

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

