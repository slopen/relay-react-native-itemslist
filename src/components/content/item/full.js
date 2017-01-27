import React, {Component} from 'react'
import Relay from 'react-relay';

import {
    withRouter
} from 'react-router-native';

import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Picker,
	ScrollView,
	TouchableHighlight
} from 'react-native';

import Hr from 'react-native-hr';

import ViewerQuery from '../../../queries/viewer-query';
import {createRenderer} from '../../../lib/relay-utils';

import RelayStore from '../../../store';

import TagPreview from '../tag/linked';

import UpdateItemMutation from '../../../mutations/item/update';
import LinkMutation from '../../../mutations/link';
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
		backgroundColor: '#FFF',
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	input: {
		height: 70,
		fontSize: 20,
		color: '#777',
		padding: 20,
		backgroundColor: '#FFF',
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
    },
    picker: {
		height: 70,
		padding: 20,
		backgroundColor: '#FFF',
		borderColor: '#DDD',
		borderWidth: 1
    }
})

const limit = 20;

const Item = Picker.Item;


class ItemPreview extends Component {

	constructor (props) {
		const {name, content, tags} = props.viewer.item;

		super (props);

		this.state = {name, content, tags};
		this.done = true;
	}

	onTagAdd = (id) => {
		const {item, tags} = this.props.viewer;
		const {node} = tags.edges.find (
			({node}) => node.id === id
		);

		this.setState ({selected: id});

		RelayStore.commitUpdate (
			new LinkMutation ({
				tag: node,
				item: item
			})
		);
	}

	onSave = () => {
		const {item} = this.props.viewer;
		const {name, content} = this.state;

		RelayStore.commitUpdate (
			new UpdateItemMutation ({item, name, content})
		);
	}

	onNavigate = (id) => {
		this.props.router.push ('/tag/' + id);
	}

	onTagRemove = (tag) => {
		const {item} = this.props.viewer;

		RelayStore.commitUpdate (
			new UnlinkMutation ({
				tag,
				item: item
			})
		);
	}

	render () {
		const {item, tags} = this.props.viewer;
		const {tags: itemTags} = item;

		const {content, name, selected} = this.state;

		const {onNavigate, onTagRemove, onSave, onTagAdd} = this;

		const availableTags = tags.edges.filter (
			({node: tag}) => tag.id === selected || !itemTags.edges.find (
				({node}) => node.id === tag.id
			)
		);


		return (
			<View style={styles.container}>

				<Text style={styles.header}>{name}</Text>

				<TextInput
					underlineColorAndroid='transparent'
          			style={styles.input}
          			placeholder="item name"
          			value={name}
          			onChangeText={(name) => this.setState ({name})}/>

				<TextInput
					underlineColorAndroid='transparent'
          			style={styles.input}
          			multiline={true}
          			numberOfLines={4}
          			placeholder="item content"
          			value={content}
          			onChangeText={(content) => this.setState ({content})}/>

          		<View>
          			{itemTags.edges.map (({node}) =>
          				<TagPreview
          					onNavigate={onNavigate}
          					onRemove={onTagRemove}
          					tag={node}
          					key={node.id}/>
          			)}
          		</View>

				<Picker
					style={styles.picker}
					selectedValue={selected}
					multiple={true}
					onValueChange={(selected) => {
						this.onTagAdd (selected);
					}}>

					{tags.edges.map (({node}) => (
		        		<Item
		        			key={node.id}
		        			label={node.name || ''}
		        			value={node.id} />
					))}

				</Picker>


          		<TouchableHighlight
          			onPress={onSave}
          			style={{
          				alignItems: 'center',
          				backgroundColor: '#337ab7',
          				borderColor: '#337ab7',
          				padding: 20,
          			}}>
          			<Text style={{
          				fontSize: 20,
          				color: '#FFF'
          			}}>SAVE</Text>
          		</TouchableHighlight>

			</View>
		);
	}

}

const ItemView = createRenderer (ItemPreview, {

	queries: ViewerQuery,

	initialVariables: {
		id: null,
		limit: limit
	},

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {

				item (id: $id) {
					id,
					name,
					content,

					tags (first: $limit){
						edges {
							node {
								id
								${TagPreview.getFragment ('tag')}
							}
						}
					}

				}

				tags (first: 20) {
					edges {
						node {
							id
							name
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

		<ItemView {...props}/>

	</ScrollView>
);