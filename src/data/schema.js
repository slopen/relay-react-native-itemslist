/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
	// GraphQLBoolean,
	// GraphQLFloat,
	GraphQLID,
	GraphQLInt,
	// GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString
} from 'graphql';

import {
	connectionArgs,
	connectionDefinitions,
	connectionFromArray,
	toGlobalId,
	fromGlobalId,
	globalIdField,
	mutationWithClientMutationId,
	nodeDefinitions,
	cursorForObjectInConnection
	// cursorToOffset
} from 'graphql-relay';

import {
	// Import methods that your schema can use to interact with your database
	User,
	Item,
	Tag,

	getViewer,

	getItem,
	updateItem,
	createItem,
	removeItem,

	getItems,

	getTag,
	getTags,

	link,
	unlink

} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const {nodeInterface, nodeField} = nodeDefinitions (
	(globalId) => {
		var {type, id} = fromGlobalId (globalId);

		if (type === 'User') {
			return getViewer();
		}
		if (type === 'Item') {
			return getItem(id);
		}
		if (type === 'Tag') {
			return getTag(id);
		}

		return null;
	},
	(obj) => {
		if (obj instanceof User) {
			return userType;
		}
		if (obj instanceof Item) {
			return itemType;
		}
		if (obj instanceof Tag)  {
			return tagType;
		}

		return null;
	}
);

/**
 * Define your own types here
 */

const itemType = new GraphQLObjectType ({
	name: 'Item',
	description: 'An item of something',

	fields: () => ({

		id: globalIdField('Item'),

		name: {
			type: GraphQLString,
			description: 'An item name'
		},

		content: {
			type: GraphQLString,
			description: 'An item content'
		},

		tags: {
			type: tagConnection,
			description: 'An item tags',
			args: connectionArgs,
			resolve: (item, args) => connectionFromArray (getTags (item), args)
		}

	}),

	interfaces: [nodeInterface]
});

const tagType = new GraphQLObjectType({
	name: 'Tag',
	description: 'Tag for items',

	fields: () => ({

		id: globalIdField ('Tag'),

		name: {
			type: GraphQLString,
			description: 'The name of the tag'
		},

		items: {
			type: itemConnection,
			description: 'An tag items',
			args: connectionArgs,
			resolve: (tag, args) => connectionFromArray (getItems (tag), args)
		}

	}),

	interfaces: [nodeInterface]
});


const userType = new GraphQLObjectType ({
	name: 'User',
	description: 'View of the app',

	fields: () => ({

		id: globalIdField('User'),

		name: {
			type: GraphQLString,
			description: 'Name of the user'
		},

		item: {
			type: itemType,
			description: 'user item by id',
			args: {
				id: globalIdField ('Item')
			},
			resolve: (_, args) => getItem (fromGlobalId (args.id).id)
		},

		items: {
			type: itemConnection,
			description: 'user items',
			args: connectionArgs,
			resolve: (_, args) => connectionFromArray (getItems (), args)
		},

		tag: {
			type: tagType,
			description: 'user tag by id',
			args: {
				id: globalIdField('Tag')
			},
			resolve: (_, args) => getTag (fromGlobalId (args.id).id)
		},

		tags: {
			type: tagConnection,
			description: 'user tags',
			args: connectionArgs,
			resolve: (_, args) => connectionFromArray (getTags (), args)
		}

	}),

	interfaces: [nodeInterface]
});



/**
 * Define your own connection types here
 */
const {
	connectionType: itemConnection,
	edgeType: itemEdge
} =
	connectionDefinitions ({
		name: 'Item',
		nodeType: itemType,
		connectionFields: () => ({
			total: {
				type: GraphQLInt,
				resolve: () => {
					return getItems ().length;
				}
			}
		})
	});

const {
	connectionType: tagConnection,
	edgeType: tagEdge
} =
	connectionDefinitions({
		name: 'Tag',
		nodeType: tagType,
		connectionFields: () => ({
			total: {
				type: GraphQLInt,
				resolve: () => {
					return getTags ().length;
				}
			}
		})

	});


const GraphQLCreateItemMutation = mutationWithClientMutationId ({
	name: 'createItem',
	inputFields: {
		name: {
			type: new GraphQLNonNull (GraphQLString)
		},
		content: {
			type: new GraphQLNonNull (GraphQLString)
		}
	},
	outputFields: {
		viewer: {
			type: userType,
			resolve: () => getViewer ()
		},
		itemEdge: {
			type: itemEdge,
			resolve: ({id}) => {
				const item = getItem (id);
				const items = getItems ();

				return {
					node: item,
					cursor: cursorForObjectInConnection (items, item)
				};
			}
		}
	},
	mutateAndGetPayload: ({name, content}) => {
		const {id} = createItem ({name, content});

		return {id};
	}
});

const GraphQLRemoveItemMutation = mutationWithClientMutationId ({
	name: 'removeItem',
	inputFields: {
		id: {
			type: new GraphQLNonNull (GraphQLID)
		}
	},
	outputFields: {
		removedItemID: {
			type: GraphQLID,
			resolve: ({id}) => toGlobalId ('Item', id)
		},
		viewer: {
			type: userType,
			resolve: () => getViewer ()
		}
	},
	mutateAndGetPayload: (args) => {
		const localItemId = fromGlobalId(args.id).id;

		removeItem (localItemId);

		return {id: localItemId};
	}
});

const GraphQLUpdateItemMutation = mutationWithClientMutationId ({
	name: 'updateItem',
	inputFields: {
		id: {
			type: new GraphQLNonNull (GraphQLID)
		},
		name: {
			type: GraphQLString
		},
		content: {
			type: GraphQLString
		}
	},
	outputFields: {
		item: {
			type: itemType,
			resolve: ({id}) => getItem(id)
		}
	},
	mutateAndGetPayload: ({id, name, content}) => {
		const localItemId = fromGlobalId (id).id;

		updateItem ({id: localItemId, name, content});

		return {id: localItemId};
	}
});

const GraphQLUnlinkMutation = mutationWithClientMutationId ({
	name: 'unlink',
	inputFields: {
		itemId: {
			type: new GraphQLNonNull (GraphQLID)
		},
		tagId: {
			type: new GraphQLNonNull (GraphQLID)
		}
	},
	outputFields: {
		unlinkedItemID: {
			type: GraphQLID,
			resolve: ({itemId}) => toGlobalId ('Item', itemId)
		},
		unlinkedTagID: {
			type: GraphQLID,
			resolve: ({tagId}) => toGlobalId ('Tag', tagId)
		},
		item: {
			type: itemType,
			resolve: ({itemId}) => getItem (itemId)
		},
		tag: {
			type: tagType,
			resolve: ({tagId}) => getTag (tagId)
		}
	},
	mutateAndGetPayload: ({itemId, tagId}) => {
		const localItemId = fromGlobalId (itemId).id;
		const localTagId = fromGlobalId (tagId).id;

		unlink ({itemId: localItemId, tagId: localTagId});

		return {itemId: localItemId, tagId: localTagId};
	}
});

const GraphQLLinkMutation = mutationWithClientMutationId ({
	name: 'link',
	inputFields: {
		itemId: {
			type: new GraphQLNonNull (GraphQLID)
		},
		tagId: {
			type: new GraphQLNonNull (GraphQLID)
		}
	},
	outputFields: {
		itemEdge: {
			type: itemEdge,
			resolve: ({itemId}) => {
				const item = getItem (itemId);
				const items = getItems ();

				return {
					node: item,
					cursor: cursorForObjectInConnection (items, item)
				};
			}
		},
		tagEdge: {
			type: tagEdge,
			resolve: ({tagId}) => {
				const tag = getTag (tagId);
				const tags = getTags ();

				return {
					node: tag,
					cursor: cursorForObjectInConnection (tags, tag)
				};
			}
		},
		item: {
			type: itemType,
			resolve: ({itemId}) => getItem (itemId)
		},
		tag: {
			type: tagType,
			resolve: ({tagId}) => getTag (tagId)
		}
	},
	mutateAndGetPayload: ({itemId, tagId}) => {
		const localItemId = fromGlobalId (itemId).id;
		const localTagId = fromGlobalId (tagId).id;

		link ({itemId: localItemId, tagId: localTagId});

		return {itemId: localItemId, tagId: localTagId};
	}
});


/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */

const queryType = new GraphQLObjectType ({
	name: 'Query',
	fields: () => ({
		node: nodeField,
		// Add your own root fields here
		viewer: {
			type: userType,
			resolve: () => getViewer ()
		}
	})
});


/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType ({
	name: 'Mutation',
	fields: () => ({
		// Add your own mutations here
		createItem: GraphQLCreateItemMutation,
		removeItem: GraphQLRemoveItemMutation,
		updateItem: GraphQLUpdateItemMutation,
		link: GraphQLLinkMutation,
		unlink: GraphQLUnlinkMutation
	})
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const schema = new GraphQLSchema ({
	query: queryType,
	mutation: mutationType
});
