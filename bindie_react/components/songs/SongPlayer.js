import React from 'react';
import ReactDom from 'react-dom';

const SongPlayer = React.createClass({
    /** song: Nombre del archivo de cancion a reproducir. La cancion se buscara en /public/songs/
     * nextSong: Callback a invocar para reproducir la siguiente cancion.
     */
    getDefaultProps: function () {
        return {
            song: null,
            nextSong: () => { }
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

    render: function () {
        if (this.props.song) {
            console.log("RENDERING SongPlayer!");
            let src = `/songs/${this.props.song}`;

            return (
                <audio
                    ref={audio => this.audio = audio}
                    onEnded={this.onSongEnd}
                    style={{ width: "100%" }}
                    controls>
                    <source src={src} type="audio/mpeg" />
                    <p>Your browser does not support the audio element.</p>
                </audio>
            )
        }
    }
});

export default SongPlayer;