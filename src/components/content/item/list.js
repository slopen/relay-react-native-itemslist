import React, {Component} from 'react';
import Relay from 'react-relay';

import {
    Header,
    withRouter
} from 'react-router-native';


import {
  	TouchableOpacity,
  	ActivityIndicator,
  	ScrollView,
	Text,
  	View,
	StyleSheet
} from 'react-native';


import ViewerQuery from '../../../queries/viewer-query';
import {createRenderer} from '../../../lib/relay-utils';

import ScrollableList  from '../list';
import ItemPreview from './preview';

import RelayStore from '../../../store';
import ItemRemoveMutation from '../../../mutations/item/remove';
import ItemCreateMutation from '../../../mutations/item/create';


const styles = StyleSheet.create({
	container: {
		padding: 3
	},
	loader: {
    	flex: 1,
    	height: 40,
    	justifyContent: 'center',
    	alignItems: 'center'
	}
});


class ItemsListComponent extends ScrollableList {

    getItems = () => this.props.viewer.items

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
		const {
			onItemNavigate,
			onItemRemove,
			onItemAdd,
			onScroll
		} = this;


		return (
	      	<View>
	        	<ScrollView
	        		onScroll={onScroll}
	          		automaticallyAdjustContentInsets={false}
	          		scrollEventThrottle={250}
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

	          		{this.state.loading ? (
	          			<View style={styles.loader}>
	          				<ActivityIndicator/>
	          			</View>
	          		) : null}

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
		first: ScrollableList.limit
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
