import Relay from 'react-relay';

export default class RemoveItemMutation extends Relay.Mutation {

	getMutation () {
		return Relay.QL`
			mutation {
				removeItem
			}
		`;
	}

	getVariables () {
		const {id} = this.props.item;

		return {id};
	}

	getFatQuery () {

		return Relay.QL`
			fragment on removeItemPayload {

				removedItemID

				viewer {
					items (first: 5) {
						edges {
							node {
								id
								name
							}
						}
						total
					}
				}

			}
		`;
	}

	getConfigs () {
		const {id} = this.props.viewer;

		return [{
			type: 'NODE_DELETE',
			parentName: 'viewer',
			parentID: id,
			connectionName: 'items',
			deletedIDFieldName: 'removedItemID'
		}, {
			type: 'FIELDS_CHANGE',
			fieldIDs: {
				viewer: id
			}
		}];
	}
}
