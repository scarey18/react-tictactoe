import React from 'react';


class Scoreboard extends React.Component {
	render() {
		return (
			<React.Fragment>
				<div className="level">
					<h1 className="level-item title has-text-light" id="message">
						{this.props.message}
					</h1>
				</div>
				<div className="level is-mobile has-text-light" id="scoreboard">
					<div className="level-item has-text-centered">
						<div>
							<p id="player-symbol">Player</p>
							<p id="player-score">{this.props.playerScore}</p>
						</div>
					</div>
					<div className="level-item has-text-centered">
						<div>
							<p id="cpu-symbol">CPU</p>
							<p id="cpu-score">{this.props.cpuScore}</p>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}	
}


export default Scoreboard;