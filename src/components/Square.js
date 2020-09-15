import React from 'react';


class Square extends React.Component {
	getClassList() {
		let classList = "cell has-text-centered";
		if (this.props.id < 6) {
			classList += " no-bottom-border";
		}
		if ([0, 1, 3, 4, 6, 7].includes(this.props.id)) {
			classList += " no-right-border";
		}
		if (this.props.highlighted) {
			classList += " highlighted";
		}
		return classList;
	}

	render() {
		return (
			<div
				id={"cell-" + this.props.id} 
				className={this.getClassList()} 
				onClick={() => this.props.onClick()}
			>
				{this.props.value}
			</div>
		)
	}
}


export default Square;