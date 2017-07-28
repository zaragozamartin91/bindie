import React from 'react';
import ReactDom from 'react-dom';

const SongPlayer = React.createClass({
    getDefaultProps: function () {
        return {
            song: "Fake Tales Of San Francisco.mp3",
            nextSong: () => { }
        }
    },

    onSongEnd: function (e) {
        console.log("SONG ENDED!");
        this.props.nextSong();
    },

    componentDidUpdate: function (prevProps, prevState) {
        console.log("SongPlayer did update!");
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
});

export default SongPlayer;