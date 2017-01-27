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

import TagPreview from './preview';

const TagsList = withRouter ((props) => {
    const {viewer} = props;
    const {tags} = viewer;

    const onTagNavigate = (id) => {
    	props.router.push ('/tag/' + id);
    }

    return (
      	<View>
        	<ScrollView
          		automaticallyAdjustContentInsets={false}
          		scrollEventThrottle={200}
          		style={styles.scrollView}>

          		{tags.edges.map (({node}) =>(
          			<TagPreview
          				tag={node}
          				onNavigate={onTagNavigate}
          				key={node.id}/>
          		))}

        	</ScrollView>
       	</View>
    );
});

export default createRenderer (TagsList, {

	queries: ViewerQuery,

	initialVariables: {
		first: 10
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