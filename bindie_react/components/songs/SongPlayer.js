import React from 'react';
import ReactDom from 'react-dom';

import FlatButton from 'material-ui/FlatButton';
import PlayNextIcon from 'material-ui/svg-icons/av/skip-next';
import PlayPreviousIcon from 'material-ui/svg-icons/av/skip-previous';

const SongPlayer = React.createClass({
    /** song: Nombre del archivo de cancion a reproducir. La cancion se buscara en /public/songs/
     * nextSong: Callback a invocar para reproducir la siguiente cancion.
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

    componentDidUpdate: function (prevProps, prevState) {
        console.log("SongPlayer DID UPDATE!");
        let prevSong = prevProps.song || "";
        let currSong = this.props.song || "";
        if (prevSong.valueOf() != currSong.valueOf()) {
            console.log(`prevSong: ${prevSong} | currSong: ${currSong}`);
            this.audio.src = `/songs/${currSong}`;
            this.audio.load();
            this.audio.play();
        }
    },

    prevSong: function () {
        console.log(`this.audio.currentTime: ${this.audio.currentTime}`);
        if (this.audio.currentTime < 3) {
            this.props.prevSong();
        } else {
            this.audio.currentTime = 0;
        }
    },

    render: function () {
        if (this.props.song) {
            console.log("RENDERING SongPlayer!");
            let src = `/songs/${this.props.song}`;

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
                            onClick={this.props.nextSong} />
                    </div>
                </div>
            )
        }
    }
});

export default SongPlayer;