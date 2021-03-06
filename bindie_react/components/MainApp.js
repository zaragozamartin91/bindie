import React from 'react';
import ReactDom from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import axios from 'axios';

import Index from './Index';
import SongsApp from './songs/SongsApp';
import SongPlayer from './songs/SongPlayer';
import BandCreator from './bands/BandCreator';

/* ESTE FRAGMENTO DE CODIGO ES REQUERIDO PARA LOS EVENTOS DE TIPO TOUCH O CLICK EN COMPONENTES MATERIAL-UI */
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
/* -------------------------------------------------------------------------------------------------------- */

/* PAGINAS USADAS PARA EL ENRUTAMIENTO */
const PAGES = {
    index: <Index />,
    songs: <SongsApp />,
    bands: <BandCreator />
};

const MainApp = React.createClass({
    getInitialState: function () {
        return {
            currPage: 'index',
            drawerOpen: false,
            songIndex: 0,
            playlist: []
        }
    },

    appBarLeftTap: function () {
        let drawerOpen = this.state.drawerOpen;
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

    componentDidMount: function () {
        /* SE CARGAN LAS CANCIONES DESPUES QUE EL COMPONENTE HAYA SIDO MONTADO */
        console.log("MainApp DID MOUNT!");

        axios.post('/api/song/allSongs')
            .then(response => {
                let data = response.data;
                if (data.err) {
                    console.error("Error al obtener las canciones");
                } else {
                    console.log(`CARGANDO PLAYLIST: [${data.songs}]`);
                    this.setState({ playlist: data.songs });
                }
            }).catch(error => {
                console.error(error);
            });
    },

    nextSong: function () {
        if (this.state.playlist.length) {
            let songIndex = (this.state.songIndex + 1) % this.state.playlist.length;
            this.setState({ songIndex });
        } else {
            this.setState({ songIndex: 0 });
        }
    },

    prevSong: function () {
        if (this.state.playlist.length) {
            let songIndex = this.state.songIndex - 1;
            songIndex = songIndex < 0 ? this.state.playlist.length - 1 : songIndex;
            this.setState({ songIndex });
        } else {
            this.setState({ songIndex: 0 });
        }
    },

    render: function () {
        console.log("RENDERING MainApp!");
        let currentPage = PAGES[this.state.currPage];

        let song = this.state.playlist[this.state.songIndex];
        let songPlayer = song ?
            <SongPlayer
                nextSong={this.nextSong}
                prevSong={this.prevSong}
                song={song} /> :
            <div />

        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        onLeftIconButtonTouchTap={this.appBarLeftTap}
                        title="Bindie" />

                    <Drawer open={this.state.drawerOpen} docked={false} onRequestChange={this.onDrawerRequestChange} >
                        <MenuItem onTouchTap={e => this.gotoPage('index')}>Principal</MenuItem>
                        <MenuItem onTouchTap={e => this.gotoPage('songs')}>Canciones</MenuItem>
                        <MenuItem onTouchTap={e => this.gotoPage('bands')}>Mis bandas</MenuItem>
                    </Drawer>

                    {songPlayer}

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

