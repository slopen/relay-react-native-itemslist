import Relay from 'react-relay';

import {ItemPreview} from './preview';
import UnlinkMutation from '../../../mutations/unlink';

class LinkedItem extends ItemPreview {
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
}

export default Relay.createContainer (LinkedItem, {

	fragments: {
		item: () => Relay.QL`
			fragment on Item {
				id
				name
			}
		`
	}
});