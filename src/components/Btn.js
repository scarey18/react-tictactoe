import React from 'react';


class Btn extends React.Component {
	getClassList() {
		let classList = "button" + this.props.classList;
		if (this.props.isSelected) {
			classList += " is-selected";
		}
		return classList;
	}

	render() {
		return (
			<button
				className={this.getClassList()}
				id={this.props.id}
				disabled={this.props.gameState === 'playing'}
				onClick={() => this.props.onClick()}
			>
				{this.props.value}
			</button>
		);
	}
}


export default Btn;