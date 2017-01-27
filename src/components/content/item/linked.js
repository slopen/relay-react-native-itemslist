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

import {createRenderer} from '../../../lib/relay-utils';

const styles = StyleSheet.create({
	item: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 0.5,
    	borderColor: '#d6d7da',
    	padding: 20,
    	backgroundColor: '#FFF',
    	position: 'relative'
	},
	close: {
		flex: 1,
		justifyContent: 'center',
		position: 'absolute',
		right: 0,
		top: 0,
		padding: 20,
		paddingLeft: 30,
		paddingRight: 30,
		backgroundColor: '#F7F7F7'
	}
})


const ItemPreview =  ((props) => {
    const {item} = props;

    return (
    	<TouchableOpacity
    		underlayColor='transparent'
    		onPress={() => props.onNavigate (item.id)}>

    		<View style={styles.item}>

	        	<Text style={{
	        		fontSize: 20
	        	}}>{item.name}</Text>

	        	<TouchableOpacity
	        		style={styles.close}
	        		onPress={() => props.onRemove (item)}>
	        		<Text style={{
	        			color: 'red',
	        			fontSize: 20
	        		}}>&times;</Text>
	        	</TouchableOpacity>
	        </View>

    	</TouchableOpacity>
    );
});

export default Relay.createContainer (ItemPreview, {

	fragments: {
		item: () => Relay.QL`
			fragment on Item {
				id
				name
			}
		`
	}
});