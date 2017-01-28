import React from 'react';
import Relay from 'react-relay';

import {
	withRouter
} from 'react-router-native';

import {
	ScrollView,
	View
} from 'react-native';

import ViewerQuery from '../../../queries/viewer-query';
import {createRenderer} from '../../../lib/relay-utils';

import TagPreview from './preview';
import ScrollableList from '../list';


class TagsListComponent extends ScrollableList {

	getItems = () => this.props.viewer.tags

	onItemNavigate = (id) => this.props.router.push ('/tag/' + id)

	render () {
		const tags = this.getItems ();

		const {
			onItemNavigate,
			onScroll
		} = this;

		return (
			<View>
				<ScrollView
					automaticallyAdjustContentInsets={false}
					onScroll={onScroll}
					scrollEventThrottle={250}>

					{tags.edges.map (({node}) => (
						<TagPreview
							tag={node}
							onNavigate={onItemNavigate}
							key={node.id}/>
					))}

				</ScrollView>
			</View>
		);
	}
}

const TagsList = withRouter ((props) =>
	<TagsListComponent {...props}/>
);

export default createRenderer (TagsList, {

	queries: ViewerQuery,

	initialVariables: {
		first: ScrollableList.limit
	},

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {
				tags (first: $first){
					edges {
						node {
							id,
							${TagPreview.getFragment ('tag')}
						}
					}
					total
					pageInfo {
						hasNextPage
					}
				}
			}
		`
	}
});

