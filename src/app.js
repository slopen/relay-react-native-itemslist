import React, {Component} from 'react';

import {
	StyleSheet,
	Text,
	View,
} from 'react-native';

import Relay from 'react-relay';
import {createRenderer} from './lib/relay-utils';
import RelayStore from './lib/relay-store';

// import {
//   Router,
//   nativeHistory,
//   useRouterHistory,
//   applyRouterMiddleware
// } from 'react-router-native';

// import useRelay from 'react-router-relay';
// import RelayLocalSchema from 'relay-local-schema';

// import routes from './components/routes';

const ViewerQuery = {
  	viewer: () => Relay.QL`
		query {
	  		viewer
		}
  	`
};

// Relay.injectNetworkLayer (
// 	new Relay.DefaultNetworkLayer ('http://192.168.0.239:9000/graphql')
// );

RelayStore.reset (
	new Relay.DefaultNetworkLayer ('http://192.168.0.239:9000/graphql')
);

// export default () => (
//   	<Router
//     	addressBar
//     	environment={Relay.Store}
//     	history={nativeHistory}
//     	render={applyRouterMiddleware (useRelay)}>

//     	{routes}

//   	</Router>
// );

class RelayApp extends Component {
	render() {
		return (
			<View style={styles.center}>
				<Text>Items Length: {this.props.viewer.items.edges.length}</Text>
			</View>
		);
	}
}

export default createRenderer (RelayApp, {

	queries: ViewerQuery,

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {
				items (first: 10) {
					edges {
						node {
							name
						}
					}
				}
			}
		`,
	},
});

const styles = StyleSheet.create({
	center: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
})