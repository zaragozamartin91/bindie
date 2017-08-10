import React from 'react';
import ReactDom from 'react-dom';

import FlatButton from 'material-ui/FlatButton';
import PlayNextIcon from 'material-ui/svg-icons/av/skip-next';
import PlayPreviousIcon from 'material-ui/svg-icons/av/skip-previous';

/**
 * Tiempo de espera para cargar la siguiente / anterior cancion.
 */
const SONG_LOAD_WAIT = 1000;

const SongPlayer = React.createClass({
    /**
     * Indica si acaso se esta cargando la siguiente/anterior cancion.
     */
    loadingSong: false,

    /** 
     * song: cancion a reproducir.
     * nextSong: callback de siguiente cancion
     * prevSong: callback de anterior cancion
     */
    getDefaultProps: function () {
        return {
            song: null,
            nextSong: () => { },
            prevSong: () => { }
        }
    },

    onSongEnd: function (e) {
        console.log("SONG ENDED!");
        this.props.nextSong();
    },

    getSongSrc: function (song) {
        return `/api/song/${song}`;
    },

    componentDidUpdate: function (prevProps, prevState) {
        console.log("SongPlayer DID UPDATE!");
        let prevSong = prevProps.song || "";
        let currSong = this.props.song || "";
        if (prevSong.valueOf() != currSong.valueOf()) {
            console.log(`prevSong: ${prevSong} | currSong: ${currSong}`);
            this.audio.src = this.getSongSrc(currSong);
            this.audio.load();
            this.audio.play();
        }
    },

    nextSong: function () {
        if (this.loadingSong) return;

        this.loadingSong = true;
        setTimeout(e => {
            this.loadingSong = false;
            this.props.nextSong();
        }, SONG_LOAD_WAIT);
    },

    prevSong: function () {
        console.log(`this.audio.currentTime: ${this.audio.currentTime}`);
        if (this.audio.currentTime < 3) {
            if (this.loadingSong) return;

            this.loadingSong = true;
            return setTimeout(e => {
                this.loadingSong = false;
                this.props.prevSong();
            }, SONG_LOAD_WAIT);
        } else this.audio.currentTime = 0;
    },

    render: function () {
        if (this.props.song) {
            console.log("RENDERING SongPlayer!");
            let src = this.getSongSrc(this.props.song);

            const isFirefox = typeof InstallTrigger !== 'undefined';
            const audioCtrlStyle = {
                width: "50%",
                borderRadius: 0
            };
            if (isFirefox) {
                audioCtrlStyle.backgroundColor = "#484848";
                audioCtrlStyle.color = "#FFFFFF";
            } else {
                audioCtrlStyle.backgroundColor = "#fafafa";
                audioCtrlStyle.color = "#5a5a5a";
            }

            return (
                <div style={{ width: "100%" }}>
                    <audio
                        ref={audio => this.audio = audio}
                        onEnded={this.onSongEnd}
                        style={{ width: "100%" }}
                        controls>
                        <source src={src} type="audio/mpeg" />
                        <p>Your browser does not support the audio element.</p>
                    </audio>
                    <div style={{ width: "100%" }}>
                        <FlatButton
                            icon={<PlayPreviousIcon />}
                            style={audioCtrlStyle}
                            onClick={this.prevSong} />
                        <FlatButton
                            icon={<PlayNextIcon />}
                            style={audioCtrlStyle}
                            onClick={this.nextSong} />
                    </div>
                </div>
            )
        }
    }
});

export default SongPlayer;