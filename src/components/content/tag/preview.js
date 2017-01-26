import React, {Component} from 'react'
import Relay from 'react-relay';

import Link from 'react-router/lib/Link';

export class TagPreview extends Component {

	render () {
		const {tag} = this.props;

		return (
			<div className="tag">
				<Link to={'/tag/' + tag.id}>
					{tag.name}
				</Link>
			</div>
		);
	}

}

export default Relay.createContainer (TagPreview, {

	fragments: {
		tag: () => Relay.QL`
			fragment on Node {
				... on Tag {
					id,
					name
				}
			}
		`
	}
});