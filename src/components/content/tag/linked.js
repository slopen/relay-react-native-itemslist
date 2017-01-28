import React from 'react';
import Relay from 'react-relay';

import {
	TouchableOpacity,
	Text,
	View,
	StyleSheet
} from 'react-native';


const styles = StyleSheet.create({
	tag: {
		borderWidth: 0.5,
		borderColor: '#d6d7da',
		padding: 20,
		backgroundColor: '#FFF',
		position: 'relative'
	},
	close: {
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


const TagPreview =  ((props) => {
	const {tag} = props;

	return (
		<TouchableOpacity
			underlayColor="transparent"
			onPress={() => props.onNavigate (tag.id)}>

			<View style={styles.tag}>

				<Text style={{
					fontSize: 20
				}}>{tag.name}</Text>

				<TouchableOpacity
					style={styles.close}
					onPress={() => props.onRemove (tag)}>
					<Text style={{
						color: 'red',
						fontSize: 20
					}}>&times;</Text>
				</TouchableOpacity>
			</View>

		</TouchableOpacity>
	);
});

export default Relay.createContainer (TagPreview, {

	fragments: {
		tag: () => Relay.QL`
			fragment on Tag {
				id
				name
			}
		`
	}
});
