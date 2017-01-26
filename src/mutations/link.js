import Relay from 'react-relay';

export default class UnlinkItemMutation extends Relay.Mutation {

	getMutation () {
		return Relay.QL`
			mutation {
				link
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
			fragment on linkPayload {

				tagEdge
				itemEdge

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
					tags (first: 20) {
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
            type: 'RANGE_ADD',
            parentName: 'item',
            parentID: itemId,
            connectionName: 'tags',
            edgeName: 'tagEdge',
            rangeBehaviors: {
                '': 'prepend'
            }
		}, {
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                item: itemId
            }
        }, {
            type: 'RANGE_ADD',
            parentName: 'tag',
            parentID: tagId,
            connectionName: 'items',
            edgeName: 'itemEdge',
            rangeBehaviors: {
                '': 'prepend'
            }
		}, {
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                tag: tagId
            }
        }];
	}
}
