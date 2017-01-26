import React, {Component} from 'react';
import Relay from 'react-relay';

import Header from './content/header';

import {
	StyleSheet,
	Text,
	View,
} from 'react-native';

class App extends Component {
	render () {
		const {routes, children, viewer} = this.props;

		console.log (children);

		return (
			<View>
				<Text>here</Text>
			</View>
		);
	}
}
				// <Text>Items Length: {this.props.viewer.items.edges.length}</Text>
			// <div>
			// 	<Header routes={routes} viewer={viewer}/>

			// 	<div className="content container">
			// 		{children}
			// 	</div>
			// </div>

export default Relay.createContainer (App, {

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {

				${Header.getFragment ('viewer')}

			}
		`
	}
});
