import React, {Component} from 'react'
import Relay from 'react-relay';

import Link from 'react-router/lib/Link';

import UnlinkMutation from '../../../mutations/unlink';

class LinkedTag extends Component {
	removeItem = (e) => {
		const {item, tag} = this.props;

		Relay.Store.commitUpdate (
			new UnlinkMutation ({
				tag: tag,
				item: item
			})
		);

		e.preventDefault ();
	}

	render () {
		const {tag} = this.props;

		return (
			<div className="tag">
				<Link to={'/tag/' + tag.id}>
					{tag.name}
				</Link>

				<a
					href="#"
					className="remove pull-right"
					onClick={this.removeItem}>&times;</a>
			</div>
		);
	}
}

export default Relay.createContainer (LinkedTag, {

	fragments: {
		tag: () => Relay.QL`
			fragment on Tag {
				id
				name
			}
		`
	}
});