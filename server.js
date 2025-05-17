import express from 'express';

import {
  getGroceryLists,
  getGroceryList,
  addGroceryList,
  deleteGroceryList,
  addItem,
  updateItem,
  deleteItem
} from './handlers.js';


const PORT = 3000;

const app = express();
app.use(express.json());

app.get('/grocery-lists', getGroceryLists);
app.get('/grocery-lists/:list_id', getGroceryList);
app.post('/grocery-lists', addGroceryList);
app.delete('/grocery-lists/:list_id', deleteGroceryList);
app.post('/grocery-lists/:list_id/items', addItem);
app.put('/grocery-lists/:list_id/items/:item_id/', updateItem);
app.delete('/grocery-lists/:list_id/items/:item_id', deleteItem);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));