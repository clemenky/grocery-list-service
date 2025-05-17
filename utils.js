import url from 'url';
import path from 'path';
import fs from 'fs';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'grocery-lists.json');


// Load data from JSON file on startup
function loadGroceryListsData() {
  try {
    const groceryListsData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(groceryListsData);
  } catch {
    return { lists: [] };
  }
}


// Save data to JSON file
function saveGroceryListsData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}


// Utilities for sorting
const sorters = {
  name: (a, b) => a.name.localeCompare(b.name),                                // for getGroceryLists and getGroceryList
  date_created: (a, b) => new Date(a.date_created) - new Date(b.date_created), // for getGroceryLists
  item_count: (a, b) => a.items.length - b.items.length,                       // for getGroceryLists
  category: (a, b) => {                                                        // for getGroceryList
    const aEmpty = !a.category || a.category.trim() === '';
    const bEmpty = !b.category || b.category.trim() === '';

    // Empty category goes after non-empty category
    if (aEmpty && !bEmpty) return 1;
    if (!aEmpty && bEmpty) return -1;

    // Both empty or both non-empty, sort alphabetically
    return (a.category || '').localeCompare(b.category || '');
  },
  position: (a, b) => (a.position || 0) - (b.position || 0)                    // for getGroceryList
};


function sortArray(arr, sortBy, sortOrder = 'desc') {
  if (!sorters[sortBy]) return arr;
  arr.sort(sorters[sortBy]);
  if (sortOrder === 'desc') arr.reverse();
  return arr;
}


function getDate() {
  return new Date().toISOString();
}


export { loadGroceryListsData, saveGroceryListsData, sortArray, getDate };