import React from 'react';

var Index = React.createClass({
    render: function () {
        return (
            <div>
                <h1>Bienvenido a Bindie!</h1>
                <audio
                    style={{ width: "50%" }}
                    controls>
                    <source src="/sample" type="audio/ogg" />
                    <p>Your browser does not support the audio element.</p>
                </audio>
            </div>
        );
    }
});

export default Index;