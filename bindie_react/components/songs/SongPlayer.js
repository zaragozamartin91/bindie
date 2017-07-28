import React from 'react';
import ReactDom from 'react-dom';

const SongPlayer = React.createClass({
    getInitialState: function() {
        return {
            current: 0
        }
    },

    getDefaultProps: function () {
        return {
            song: "Kalimba.mp3"
        }
    },

    playNext: function (e) {

    },

    render: function () {
        let src = `/songs/${this.props.song}`;

        return (
            <audio
                ref={audio => this.audio = audio}
                onEnded={this.playNext}
                style={{ padding: "10px", width: "100%" }}
                controls>
                <source src={src} type="audio/mpeg" />
                <p>Your browser does not support the audio element.</p>
            </audio>
        )
    }
});

export default SongPlayer;