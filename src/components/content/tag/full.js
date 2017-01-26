import React, {Component} from 'react'
import Relay from 'react-relay';

import Item from '../item/linked';


class Tag extends Component {

	render () {
		const {viewer} = this.props;
		const {tag} = viewer;
		const {items: {edges}} = tag;

		return (
			<div>
				<h1>{tag.name}</h1>

				<hr/>

				<ul className="items-list list-unstyled">
					{edges.map (({node}) => (
						<li key={node.id}>
							<Item item={node} tag={tag}/>
						</li>
					))}
				</ul>

			</div>
		);
	}

}

export default Relay.createContainer (Tag, {

	initialVariables: {
		id: null,
		limit: 20
	},

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {
				tag (id: $id) {
					id,
					name,

					items (first: $limit) {
						edges {
							node {
								id,
								${Item.getFragment ('item')}
							}
						}
					}

				}
			}
		`
	}
});