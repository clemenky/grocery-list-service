import { loadGroceryListsData, saveGroceryListsData, sortArray, getDate } from './utils.js'
import { v4 as uuidv4 } from 'uuid';


let groceryListsData = loadGroceryListsData();

function getGroceryLists(req, res) {
  const sortBy = req.query.sort_by || 'date_created';
  const sortOrder = req.query.sort_order || 'desc';

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

function getGroceryList(req, res) {
  const { list_id } = req.params;
  const includeChecked = req.query.include_checked !== 'false';
  const sortItemsBy = req.query.sort_items_by || 'position';

  const list = groceryListsData.lists.find((list) => list.id === list_id);
  if (!list) return res.status(404).json({ error: 'List not found' });

  let items = list.items;
  if (!includeChecked) {
    items = items.filter((item) => !item.checked);
  }

  items = sortArray(items, sortItemsBy, 'asc');
  res.json({ ...list, items });
}

function addGroceryList(req, res) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

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

function deleteGroceryList(req, res) {
  const { list_id } = req.params;
  const listIndex = groceryListsData.lists.findIndex((list) => list.id === list_id);
  if (listIndex === -1) return res.status(404).json({ error: 'List not found' });

  const [deletedList] = groceryListsData.lists.splice(listIndex, 1);
  saveGroceryListsData(groceryListsData);
  res.status(200).send(deletedList);
}

function addItem(req, res) {
  const { list_id } = req.params;
  const { name, quantity, category } = req.body;

  if (!name) return res.status(400).json({ error: 'Item name is required' });

  const list = groceryListsData.lists.find((list) => list.id === list_id);
  if (!list) return res.status(404).json({ error: 'List not found' });

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

function updateItem(req, res) {
  const { list_id, item_id } = req.params;
  const updates = req.body;

  const list = groceryListsData.lists.find((list) => list.id === list_id);
  if (!list) return res.status(404).json({ error: 'List not found' });

  const item = list.items.find((item) => item.id === item_id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  if (updates.name !== undefined && list.items.some(i => i.name === updates.name && i.id !== item_id)) {
    return res.status(409).json({ error: `Item with name '${updates.name}' already exists in the list` });
  }

  const itemProperties = ['name', 'quantity', 'category', 'position', 'checked'];
  Object.keys(updates).forEach((key) => {
    if (itemProperties.includes(key)) {
      item[key] = updates[key];
    }
  });

  if (updates.position !== undefined) {
    list.items = list.items
      .filter(item => item.id !== item_id)
      .sort((a, b) => (a.position || 0) - (b.position || 0));
    list.items.splice(updates.position - 1, 0, item);
    list.items.forEach((item, itemIndex) => item.position = itemIndex + 1);
  }

  list.date_updated = getDate();
  saveGroceryListsData(groceryListsData);
  res.json(item);
}

function deleteItem(req, res) {
  const { list_id, item_id } = req.params;

  const list = groceryListsData.lists.find((list) => list.id === list_id);
  if (!list) return res.status(404).json({ error: 'List not found' });

  const itemIndex = list.items.findIndex((item) => item.id === item_id);
  if (itemIndex === -1) return res.status(404).json({ error: 'Item not found' });

  const [deletedItem] = list.items.splice(itemIndex, 1);

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