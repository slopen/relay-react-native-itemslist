import React from 'react';
import Relay from 'react-relay';

import Preview from './preview';
import List from '../list';
import ListMore from '../list/more';

const limit = 5;

class TagsList extends List {

	getEdges () {
		const {viewer} = this.props;
		const {tags: {edges}} = viewer;

		return edges;
	}

	render () {
		const {viewer} = this.props;
		const {tags: {edges}} = viewer;
		const {pageInfo} = viewer.tags;

		return (
			<div>
				<h1>Tags</h1>

				<hr/>

				<ul className="items-list list-unstyled">
					{edges.map (({node}) => (
						<li key={node.id}>
							<Preview tag={node}/>
						</li>
					))}
				</ul>

				<hr/>

				<ListMore
					next={this.requestNext}
					pageInfo={pageInfo}/>
			</div>
		);
	}
}


export default Relay.createContainer (TagsList, {

	initialVariables: {
		first: limit
	},

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {
				tags (first: $first){
					edges {
						node {
							id,
							${Preview.getFragment ('tag')}
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