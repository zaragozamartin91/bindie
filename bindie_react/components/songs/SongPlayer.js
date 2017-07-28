import React from 'react';
import ReactDom from 'react-dom';

const SongPlayer = React.createClass({
    getDefaultProps: function () {
        return {
            song: "Fake Tales Of San Francisco.mp3"
        }
    },

    onEnded: function (e) {
        console.log("SONG ENDED!");
    },

    render: function () {
        let src = `/songs/${this.props.song}`;

        return (
            <audio
                ref={audio => this.audio = audio}
                onEnded={this.onEnded}
                style={{ width: "100%" }}
                controls>
                <source src={src} type="audio/mpeg" />
                <p>Your browser does not support the audio element.</p>
            </audio>
        )
    }
});

export default SongPlayer;