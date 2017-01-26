/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */


// Model types
class User {}
class Item {}
class Tag {}


// Mock data
const viewer = new User();

viewer.id = '1';
viewer.name = 'Anonymous';


const tagsPerItem = 3;

const tags = [...Array (10)].map (
	(_, i) => Object.assign (new Tag (), {
		id: `${i}`,
		name: `tag ${i + 1}`
	})
);

let tagsCounter = 0;
let items = [...Array (20)].map (
	(_, i) => Object.assign (new Item (), {
		id: `${i}`,
		name: `item ${i + 1}`,
		content: `content ${i}`,
		tags: [...Array (tagsPerItem)].map (
			() => {
				if (!tags [tagsCounter]) {
					tagsCounter = 0;
				}

				return tags [tagsCounter++].id;
			}
		)
	})
);


const getNewId = () =>
	String (items.length ? Number (items [items.length - 1].id) + 1 : 0);

const getItem = (id) =>
	items.find ((item) => item.id === id);


module.exports = {

	User,
	Item,
	Tag,


	// viewer

	getViewer: () => viewer,


	// items

	getItem: getItem,

	getItems: (tag) => {
		if (tag) {

			return items.filter (
				(item) => {
					return (item.tags || []).indexOf (tag.id) !== -1
				}
			);
		}

		return items;
	},

	updateItem: (payload) => {
		const item = getItem (payload.id);

		Object.assign (item, payload);
	},

	createItem: (payload) => {
		const id = getNewId (payload);

		items.unshift (
			Object.assign (new Item (), {id}, payload)
		);

		return {id};
	},

	removeItem (id) {
		const index = items.findIndex (
			(item) => item.id === id
		);

		if (index !== -1) {
			items = items
				.slice (0, index)
				.concat (items.slice (index + 1));
		}
	},


	// tags

	getTag: (id) => tags.find ((tag) => tag.id === id),

	getTags: (item) => {
		if (item) {
			return tags.filter(
				(tag) => (item.tags || []).indexOf (tag.id) !== -1
			);
		}

		return tags;
	},


	// remove relation item/tag

	unlink ({itemId, tagId}) {
		const item = getItem (itemId);
		const tags = item.tags;

		const index = tags.findIndex (
			(id) => id === tagId
		);

		if (index !== -1) {
			item.tags = tags
				.slice (0, index)
				.concat (tags.slice (index + 1));
		}
	},

	// add relation item/tag

	link ({itemId, tagId}) {
		const item = getItem (itemId);

		if (!item.tags) {
			item.tags = [];
		}

		item.tags.push (tagId);
	}

};