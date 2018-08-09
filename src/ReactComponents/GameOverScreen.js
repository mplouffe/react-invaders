import React from 'react';

export default class GameOverScreen extends React.Component {
    constructor(args) {
        super(args);
        this.state = { score: args.score };
    }

    render() {
        return (
            <div>
                <span className="title-screen title-screen__title">Game Over!</span>
                <span className="title-screen score">Score: { this.state.score }</span>
                <span className="title-screen pressEnter">Press enter to continue</span>
            </div>
        );
    }
}