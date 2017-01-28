import React from 'react';
import Relay from 'react-relay';

import {
	Header,
	withRouter
} from 'react-router-native';


import ViewerQuery from '../../queries/viewer-query';
import {createRenderer} from '../../lib/relay-utils';

const AppHeader = withRouter ((props) => {
	const {viewer, location} = props;

	const {pathname} = location;

	const currentType = pathname.match (/tag/) ? 'tags' : 'items';
	const switchType = currentType === 'tags' ? 'items' : 'tags';

	const handleRightButtonPress = () => {
		props.router.push ('/' + switchType);
	};

	return (
		<Header
			{...props}
			style={{backgroundColor: '#CCCCCC'}}
			title={currentType + ' ' + viewer [currentType].total}
			rightButtonText={switchType + ' ' + viewer [switchType].total}
			onRightButtonPress={handleRightButtonPress}/>
	);
});

export default createRenderer (AppHeader, {

	queries: ViewerQuery,

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {
				items (first: 1) {
					total
				}
				tags (first: 1) {
					total
				}
			}
		`
	}
});