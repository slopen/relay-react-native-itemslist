import React, {Component} from 'react';
import Relay from 'react-relay';

import {
    Header,
    withRouter
} from 'react-router-native';


import {
  	TouchableOpacity,
  	ScrollView,
	Text,
  	View,
	StyleSheet
} from 'react-native';

import ViewerQuery from '../../../queries/viewer-query';
import {createRenderer} from '../../../lib/relay-utils';

import ItemPreview from './preview';

import RelayStore from '../../../store';
import ItemRemoveMutation from '../../../mutations/item/remove';
import ItemCreateMutation from '../../../mutations/item/create';

const styles = StyleSheet.create({
	container: {
		padding: 3
	}
});

class ItemsListComponent extends Component {

	onItemNavigate = (id) => {
    	this.props.router.push ('/item/' + id);
    }

	onItemRemove = (item) => {
		const {viewer} = this.props;

    	RelayStore.commitUpdate (
    		new ItemRemoveMutation ({
    			item: item,
    			viewer: viewer
    		})
    	);

    }

	onItemAdd = () => {
		const {viewer} = this.props;

    	RelayStore.commitUpdate (
    		new ItemCreateMutation ({
    			name: 'new item',
    			content: 'new item content',
    			viewer: viewer
    		})
    	);

    }

	render () {
		const {items} = this.props.viewer;
		const {onItemNavigate, onItemRemove, onItemAdd} = this;


		return (
	      	<View>
	        	<ScrollView
	          		automaticallyAdjustContentInsets={false}
	          		scrollEventThrottle={200}
	          		style={styles.container}>

	          		<TouchableOpacity
	          			onPress={onItemAdd}
	          			style={{
	          				alignItems: 'center',
	          				backgroundColor: '#337ab7',
	          				borderColor: '#337ab7',
	          				padding: 20,
	          			}}>
	          			<Text style={{
	          				fontSize: 20,
	          				color: '#FFF'
	          			}}>ADD</Text>
	          		</TouchableOpacity>

	          		{items.edges.map (({node}) =>(
	          			<ItemPreview
	          				item={node}
	          				onNavigate={onItemNavigate}
	          				onRemove={onItemRemove}
	          				key={node.id}/>
	          		))}

	        	</ScrollView>
	       	</View>
		);
	}
}

const ItemsList = withRouter ((props) =>
	<ItemsListComponent {...props}/>
);

export default createRenderer (ItemsList, {

	queries: ViewerQuery,

	initialVariables: {
		first: 10
	},

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {
				id,
				items (first: $first){
					edges {
						node {
							id,
							${ItemPreview.getFragment ('item')}
						}
					}
					total
					pageInfo {
						hasNextPage
					}
				}
			}
		`,
	},
});
