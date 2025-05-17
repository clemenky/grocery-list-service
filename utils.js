import url from 'url';
import path from 'path';
import fs from 'fs';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'grocery-lists.json');

function loadGroceryListsData() {
  try {
    const groceryListsData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(groceryListsData);
  } catch {
    return { lists: [] };
  }
}

function saveGroceryListsData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

const sorters = {
  // For getGroceryLists()
  date_created: (a, b) => new Date(a.date_created) - new Date(b.date_created),
  name: (a, b) => a.name.localeCompare(b.name),
  item_count: (a, b) => a.items.length - b.items.length,
  // For getGroceryList()
  category: (a, b) => {
    const aEmpty = !a.category || a.category.trim() === '';
    const bEmpty = !b.category || b.category.trim() === '';

    if (aEmpty && !bEmpty) return 1;    // a is empty, b is not → a goes *after* b
    if (!aEmpty && bEmpty) return -1;   // a is not empty, b is empty → a goes *before* b

    // Both empty or both non-empty, sort alphabetically
    return (a.category || '').localeCompare(b.category || '');
  },
  position: (a, b) => (a.position || 0) - (b.position || 0)
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