import { loadGroceryListsData, saveGroceryListsData, sortArray, getDate } from './utils.js'
import { v4 as uuidv4 } from 'uuid';


let groceryListsData = loadGroceryListsData();


// GET /grocery-lists  ?sort_by=<sort_by> & sort_order=<sort_order>
function getGroceryLists(req, res) {
  const sortBy = req.query.sort_by || 'date_created';
  const sortOrder = req.query.sort_order || 'desc';

  console.log(`[GET] /grocery-lists - Sorting by: ${sortBy} in ${sortOrder} order`);

  // Validate the sortBy parameter
  const validSortFields = ['name', 'date_created', 'item_count'];
  if (!validSortFields.includes(sortBy)) {
    return res.status(400).json({ error: `Invalid sort_by parameter. Valid options are: ${validSortFields.join(', ')}` });
  }

  const lists = groceryListsData.lists.map(list => ({
    id: list.id,
    name: list.name,
    date_created: list.date_created,
    date_updated: list.date_updated,
    items: list.items
  }));

  const sortedLists = sortArray(lists, sortBy, sortOrder);
  res.json(sortedLists);
}


// GET /grocery-lists/<list_id>  ?include_checked=<include_checked> & sort_items_by=<sort_items_by>
function getGroceryList(req, res) {
  const { list_id } = req.params;
  const includeChecked = req.query.include_checked !== 'false';
  const sortItemsBy = req.query.sort_items_by || 'position';

  console.log(`[GET] /grocery-lists/${list_id} - Include checked: ${includeChecked}, Sorting items by: ${sortItemsBy}`);

  // Validate the sortItemsBy parameter
  const validItemSortFields = ['name', 'category', 'position'];
  if (!validItemSortFields.includes(sortItemsBy)) {
    return res.status(400).json({ error: `Invalid sort_items_by parameter. Valid options are: ${validItemSortFields.join(', ')}` });
  }

  const list = groceryListsData.lists.find((list) => list.id === list_id);
  if (!list) return res.status(404).json({ error: 'List not found' });

  let items = list.items;
  if (!includeChecked) {
    items = items.filter((item) => !item.checked);
  }

  items = sortArray(items, sortItemsBy, 'asc');
  res.json({ ...list, items });
}


// POST /grocery-lists   body: { name }
function addGroceryList(req, res) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  console.log(`[POST] /grocery-lists - Adding new list with name: ${name}`);

  const currentDate = getDate();

  const newList = {
    id: uuidv4(),
    name,
    date_created: currentDate,
    date_updated: currentDate,
    items: []
  };

  groceryListsData.lists.push(newList);
  saveGroceryListsData(groceryListsData);
  res.status(201).json(newList);
}


// DELETE /grocery-lists/<list_id>
function deleteGroceryList(req, res) {
  const { list_id } = req.params;
  console.log(`[DELETE] /grocery-lists/${list_id} - Deleting list`);

  const listIndex = groceryListsData.lists.findIndex((list) => list.id === list_id);
  if (listIndex === -1) return res.status(404).json({ error: 'List not found' });

  const [deletedList] = groceryListsData.lists.splice(listIndex, 1);
  saveGroceryListsData(groceryListsData);
  res.status(200).send(deletedList);
}


// POST /grocery-lists/<list_id>/items   body: { name, quantity, category }
function addItem(req, res) {
  const { list_id } = req.params;
  const { name, quantity, category } = req.body;

  if (!name) return res.status(400).json({ error: 'Item name is required' });

  console.log(`[POST] /grocery-lists/${list_id}/items - Adding item: ${name} (quantity: ${quantity}, category: ${category})`);

  const list = groceryListsData.lists.find((list) => list.id === list_id);
  if (!list) return res.status(404).json({ error: 'List not found' });

  // Check for name conflict before adding the item
  if (list.items.some(item => item.name === name)) {
    return res.status(409).json({ error: `Item with name '${name}' already exists in the list` });
  }

  const newItem = {
    id: uuidv4(),
    name,
    quantity: quantity || 1,
    category: category || '',
    position: list.items.length + 1,
    checked: false
  };

  list.items.push(newItem);
  list.date_updated = getDate();
  saveGroceryListsData(groceryListsData);
  res.status(201).json(newItem);
}


// PUT /grocery-lists/<list_id>/items/<item_id>   body: { name, quantity, category, position, checked }
function updateItem(req, res) {
  const { list_id, item_id } = req.params;
  const updates = req.body;

  console.log(`[PUT] /grocery-lists/${list_id}/items/${item_id} - Updating item with ID: ${item_id}`, updates);

  const list = groceryListsData.lists.find((list) => list.id === list_id);
  if (!list) return res.status(404).json({ error: 'List not found' });

  const item = list.items.find((item) => item.id === item_id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  // Check for name conflict if updating the name
  if (updates.name !== undefined && list.items.some(i => i.name === updates.name && i.id !== item_id)) {
    return res.status(409).json({ error: `Item with name '${updates.name}' already exists in the list` });
  }

  // Update item fields included in body
  const itemProperties = ['name', 'quantity', 'category', 'position', 'checked'];
  Object.keys(updates).forEach((key) => {
    if (itemProperties.includes(key)) {
      item[key] = updates[key];
    }
  });

  // Handle position adjustment if changed
  if (updates.position !== undefined) {
    list.items = list.items
      .filter(item => item.id !== item_id)
      .sort((a, b) => (a.position || 0) - (b.position || 0));
    list.items.splice(updates.position - 1, 0, item);
    // Recalculate all positions
    list.items.forEach((item, itemIndex) => item.position = itemIndex + 1);
  }

  list.date_updated = getDate();
  saveGroceryListsData(groceryListsData);
  res.json(item);
}


// DELETE /grocery-lists/<list_id>/items/<item_id>
function deleteItem(req, res) {
  const { list_id, item_id } = req.params;

  console.log(`[DELETE] /grocery-lists/${list_id}/items/${item_id} - Deleting item`);

  const list = groceryListsData.lists.find((list) => list.id === list_id);
  if (!list) return res.status(404).json({ error: 'List not found' });

  const itemIndex = list.items.findIndex((item) => item.id === item_id);
  if (itemIndex === -1) return res.status(404).json({ error: 'Item not found' });

  const [deletedItem] = list.items.splice(itemIndex, 1);

  // Recalculate positions after deletion
  list.items.forEach((item, itemIndex) => item.position = itemIndex + 1);

  list.date_updated = getDate();
  saveGroceryListsData(groceryListsData);
  res.status(200).send(deletedItem);
}

export {
  getGroceryLists,
  getGroceryList,
  addGroceryList,
  deleteGroceryList,
  addItem,
  updateItem,
  deleteItem
};