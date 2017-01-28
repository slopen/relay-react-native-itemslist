import React, {Component} from 'react'
import Relay from 'react-relay';

import {
	withRouter
} from 'react-router-native';

import {
	View,
	Text,
	StyleSheet,
	ScrollView
} from 'react-native';


import ViewerQuery from '../../../queries/viewer-query';
import {createRenderer} from '../../../lib/relay-utils';

import ItemPreview from '../item/linked';

import RelayStore from '../../../store';
import UnlinkMutation from '../../../mutations/unlink';


const styles = StyleSheet.create ({
	container: {
		padding: 3
	},
	header: {
		paddingTop: 40,
		paddingLeft: 10,
		paddingBottom: 40,
		fontSize: 30,
		fontWeight: 'bold',
		backgroundColor: '#FFF'
	}
})

const limit = 20;


class TagPreview extends Component {

	onNavigate = (id) => {
		this.props.router.push ('/item/' + id);
	}

	onRemove = (item) => {
		const {tag} = this.props.viewer;

		RelayStore.commitUpdate (
			new UnlinkMutation ({
				tag,
				item: item
			})
		);
	}

	render () {
		const {tag} = this.props.viewer;
		const {items: tagsItems} = tag;

		const {onNavigate, onRemove} = this;

		return (
			<View style={styles.container}>

				<Text style={styles.header}>{tag.name}</Text>

				<View>
					{tagsItems.edges.map (({node}) =>
						<ItemPreview
							onNavigate={onNavigate}
							onRemove={onRemove}
							item={node}
							key={node.id}/>
					)}
				</View>

			</View>
		);
	}

}

const TagView = createRenderer (TagPreview, {

	queries: ViewerQuery,

	initialVariables: {
		id: null,
		limit: limit
	},

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {

				tag (id: $id) {
					id,
					name

					items (first: $limit){
						edges {
							node {
								id
								${ItemPreview.getFragment ('item')}
							}
						}
					}

				}
			}
		`
	}
});

export default withRouter ((props) =>
	<ScrollView
		automaticallyAdjustContentInsets={false}
		scrollEventThrottle={200}>

		<TagView {...props}/>

	</ScrollView>
);