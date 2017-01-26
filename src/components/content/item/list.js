import React from 'react';
import Relay from 'react-relay';

import Button from 'react-bootstrap/lib/Button';

import Preview from './preview';
import List from '../list';
import ListMore from '../list/more';
import CreateItemMutation from '../../../mutations/item/create';


const limit = 5;

const Controls = ({add}) =>
	<Button
		bsSize="large"
		className="btn-default"
		onClick={add}>ADD</Button>

class ItemsList extends List {

	getEdges () {
		const {viewer} = this.props;
		const {items: {edges}} = viewer;

		return edges;
	}

	addItem = (e) => {
		Relay.Store.commitUpdate (
			new CreateItemMutation ({
				name: 'new item',
				content: 'new item content',
				viewer: this.props.viewer
			})
		);

		e.preventDefault();
	}

	render () {
		const {viewer} = this.props;
		const {items: {edges}} = viewer;
		const {pageInfo} = viewer.items;

		return (
			<div>
				<h1>Items</h1>

				<hr/>

				<ul className="items-list list-unstyled">
					{edges.map (({node}) => (
						<li key={node.id}>
							<Preview item={node} viewer={viewer}/>
						</li>
					))}
				</ul>

				<hr/>

				<ListMore
					next={this.requestNext}
					pageInfo={pageInfo}/>

				<Controls
					add={this.addItem}/>

			</div>
		);
	}
}

export default Relay.createContainer(ItemsList, {

	initialVariables: {
		first: limit
	},

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {
				id,
				items (first: $first){
					edges {
						node {
							id,
							${Preview.getFragment ('item')}
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