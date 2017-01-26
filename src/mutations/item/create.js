import Relay from 'react-relay';

export default class CreateItemMutation extends Relay.Mutation {

    getMutation () {
        return Relay.QL`
            mutation {
                createItem
            }
        `;
    }

    getVariables () {
        const {name, content} = this.props;

        return {name, content};
    }

    getFatQuery () {
        return Relay.QL`
            fragment on createItemPayload {

                itemEdge

                viewer {
                    id
                    items{
                        total
                    }
                }

            }
        `;
    }

    getConfigs () {
        const {id} = this.props.viewer;

        return [{
            type: 'RANGE_ADD',
            parentName: 'viewer',
            parentID: id,
            connectionName: 'items',
            edgeName: 'itemEdge',
            rangeBehaviors: {
                '': 'prepend'
            }
        }, {
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                viewer: id
            }
        }];
    }
}
