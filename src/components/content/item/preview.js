import React, {Component} from 'react'
import Relay from 'react-relay';

import Link from 'react-router/lib/Link';

import RemoveItemMutation from '../../../mutations/item/remove';

export class ItemPreview extends Component {

	removeItem = (e) => {
		const {item, viewer} = this.props;

		Relay.Store.commitUpdate (
			new RemoveItemMutation({item, viewer})
		);

		e.preventDefault ();
	}

	render () {
		const {item} = this.props;

		return (
			<div className="item">
				<Link to={'/item/' + item.id}>{item.name}</Link>

				<a
					href="#"
					className="remove pull-right"
					onClick={this.removeItem}>&times;</a>
			</div>
		);
	}

}

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