import Relay from 'react-relay';

export default class UpdateItemMutation extends Relay.Mutation {

    static fragments = {
        item: () => Relay.QL`
            fragment on Item {
                id,
                name,
                content
            }
        `
    }

    getMutation () {
        return Relay.QL`
            mutation {
                updateItem
            }
        `;
    }

    getFatQuery () {
        return Relay.QL`
            fragment on updateItemPayload {
                item {
                    id,
                    name,
                    content
                }
            }
        `;
    }

    getConfigs () {
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                item: this.props.item.id
            }
        }];
    }

    getVariables () {
        const {item, name, content} = this.props;

        return {
            id: item.id,
            name: name,
            content: content
        };
    }

    getOptimisticResponse () {
        const {item, name, content} = this.props;

        return {
            item: {
                id: item.id,
                name: name,
                content: content
            }
        };
    }
}
