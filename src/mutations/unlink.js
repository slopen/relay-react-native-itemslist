import Relay from 'react-relay';

export default class UnlinkItemMutation extends Relay.Mutation {

	getMutation () {
		return Relay.QL`
			mutation {
				unlink
			}
		`;
	}

	getVariables () {
		const {id: itemId} = this.props.item;
		const {id: tagId} = this.props.tag;

		return {itemId, tagId};
	}

	getFatQuery () {

		return Relay.QL`
			fragment on unlinkPayload {

				unlinkedItemID
				unlinkedTagID

				tag {
					items (first: 20){
						edges {
							node {
								id
								name
							}
						}
					}
				}

				item {
					tags (first: 3) {
						edges {
							node {
								id
								name
							}
						}
					}
				}

			}
		`;
	}

	getConfigs () {
		const {id: itemId} = this.props.item;
		const {id: tagId} = this.props.tag;

		return [{
			type: 'RANGE_DELETE',
			parentName: 'tag',
			parentID: tagId,
			connectionName: 'items',
			deletedIDFieldName: 'unlinkedItemID',
			pathToConnection: ['tags', 'items']
		}, {
			type: 'RANGE_DELETE',
			parentName: 'item',
			parentID: itemId,
			connectionName: 'tags',
			deletedIDFieldName: 'unlinkedTagID',
			pathToConnection: ['items', 'tags']
		}];
	}
}
