# Grocery List Service

**Base URL:** `http://localhost:3000`

*Note: This can be modified in `server.js` on line 14*

## Programmatically Requesting and Receiving Data

To interact with the Grocery List Microservice, you will need to make HTTP requests to the specified endpoints. The service expects and returns data in JSON format.

### Index

  * [Get All Grocery Lists](#get-all-grocery-lists)
  * [Get a Specific Grocery List](#get-a-specific-grocery-list)
  * [Add a New Grocery List](#add-a-new-grocery-list)
  * [Delete a Grocery List](#delete-a-grocery-list)
  * [Add an Item to a Grocery List](#add-an-item-to-a-grocery-list)
  * [Update an Item in a Grocery List](#update-an-item-in-a-grocery-list)
  * [Delete an Item from a Grocery List](#delete-an-item-from-a-grocery-list)

### <a name="get-all-grocery-lists"></a>Get All Grocery Lists

  * **HTTP Method:** `GET`
  * **Endpoint:** `/grocery-lists`
  * **Description:** Retrieves a list of all grocery lists.
  * **Optional Query Parameters:**
      * `sort_by`: Specifies the field to sort the lists by. Allowed values: `date_created`, `name`, `item_count`. Default: `date_created`.
      * `sort_order`: Specifies the sort order. Allowed values: `asc` (ascending), `desc` (descending). Default: `desc`.
  * **Example Call (using `fetch` in JavaScript):**
    ```javascript
    fetch('http://localhost:3000/grocery-lists?sort_by=item_count&sort_order=desc');
    ```
  * **Example Response (JSON):**
    ```json
    [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "name": "Weekly Groceries",
        "date_created": "2025-05-17T10:30:06.394Z",
        "date_updated": "2025-05-17T17:33:33.753Z",
        "items": [ /* ... */ ]
      },
      {
        "id": "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
        "name": "Party Snacks",
        "date_created": "2025-05-16T15:00:00.000Z",
        "date_updated": "2025-05-16T15:15:15.000Z",
        "items": [ /* ... */ ]
      }
    ]
    ```

### <a name="get-a-specific-grocery-list"></a>Get a Specific Grocery List

  * **HTTP Method:** `GET`
  * **Endpoint:** `/grocery-lists/:list_id`
  * **Description:** Retrieves details for a specific grocery list.
  * **Path Parameter:**
      * `list_id`: The unique identifier of the grocery list.
  * **Optional Query Parameters:**
      * `include_checked`: If set to `false`, excludes items that are marked as checked. Default: `true`.
      * `sort_items_by`: Specifies the field to sort the items within the list by. Allowed values: `position`, `name`, `category`. Default: `position`.
  * **Example Call (using `fetch` in JavaScript):**
    ```javascript
    const listId = "your_list_id";
    fetch(`http://localhost:3000/grocery-lists/${listId}?include_checked=true&sort_items_by=category`);
    ```
  * **Example Response (JSON):**
    ```json
    {
      "id": "your_list_id",
      "name": "Weekend Shopping",
      "date_created": "2025-05-17T11:00:00.000Z",
      "date_updated": "2025-05-17T11:15:00.000Z",
      "items": [
        {
          "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
          "name": "Baguette",
          "quantity": 1,
          "category": "Bakery",
          "position": 2,
          "checked": false
        },
        {
          "id": "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
          "name": "Soy Milk",
          "quantity": 1,
          "category": "Dairy & Alternatives",
          "position": 3,
          "checked": false
        },
        {
          "id": "c7a2b8d9-e6f0-1234-5678-90abcdef1234",
          "name": "Apples",
          "quantity": 3,
          "category": "Produce",
          "position": 1,
          "checked": false
        }
      ]
    }
    ```

### <a name="add-a-new-grocery-list"></a>Add a New Grocery List

  * **HTTP Method:** `POST`
  * **Endpoint:** `/grocery-lists`
  * **Description:** Creates a new grocery list.
  * **Request Body (JSON):**
    ```json
    {
      "name": "My New List"
    }
    ```
  * **Example Call (using `fetch` in JavaScript):**
    ```javascript
    fetch('http://localhost:3000/grocery-lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Pantry Restock' }),
    });
    ```
  * **Example Response (JSON):**
    ```json
    {
      "id": "e7b39a2c-1d8f-4a5e-9b07-f6c8d4a3b210",
      "name": "Pantry Restock",
      "date_created": "2025-05-17T19:56:41.069Z",
      "date_updated": "2025-05-17T19:56:41.069Z",
      "items": []
    }
    ```

### <a name="delete-a-grocery-list"></a>Delete a Grocery List

  * **HTTP Method:** `DELETE`
  * **Endpoint:** `/grocery-lists/:list_id`
  * **Description:** Deletes a specific grocery list.
  * **Path Parameter:**
      * `list_id`: The unique identifier of the grocery list to delete.
  * **Example Call (using `fetch` in JavaScript):**
    ```javascript
    const listIdToDelete = "your_list_id_here";
    fetch(`http://localhost:3000/grocery-lists/${listIdToDelete}`, {
      method: 'DELETE',
    });
    ```
  * **Example Response (JSON):**
    ```json
    {
      "id": "7bf1a180-8bf5-4667-a4e9-d123bf87160f",
      "name": "Sunday Shopping",
      "date_created": "2025-05-17T19:56:41.069Z",
      "date_updated": "2025-05-17T19:56:41.069Z",
      "items": []
    }
    ```

### <a name="add-an-item-to-a-grocery-list"></a>Add an Item to a Grocery List

  * **HTTP Method:** `POST`
  * **Endpoint:** `/grocery-lists/:list_id/items`
  * **Description:** Adds a new item to a specific grocery list.
  * **Path Parameter:**
      * `list_id`: The unique identifier of the grocery list.
  * **Request Body (JSON):**
    ```json
    {
      "name": "Broccoli",
      "quantity": 2,
      "category": "Vegetables"
    }
    ```
      * `quantity` and `category` are optional. `quantity` defaults to 1, and `category` defaults to an empty string.
  * **Example Call (using `fetch` in JavaScript):**
    ```javascript
    const listId = "your_list_id";
    fetch(`http://localhost:3000/grocery-lists/${listId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Bread', quantity: 1, category: 'Grains' }),
    });
    ```
  * **Example Response (JSON):**
    ```json
    {
      "id": "0a0e0eac-672a-42a3-b6ab-1d7ac3454cea",
      "name": "Strawberries",
      "quantity": 1,
      "category": "Fruit",
      "position": 3,
      "checked": false
    }
    ```

### <a name="update-an-item-in-a-grocery-list"></a>Update an Item in a Grocery List

  * **HTTP Method:** `PUT`
  * **Endpoint:** `/grocery-lists/:list_id/items/:item_id`
  * **Description:** Updates an existing item in a specific grocery list.
  * **Path Parameters:**
      * `list_id`: The unique identifier of the grocery list.
      * `item_id`: The unique identifier of the item to update.
  * **Request Body (JSON):** You can include any of the following fields to update:
    ```json
    {
      "name": "Broccoli",
      "quantity": 3,
      "category": "Vegetables",
      "position": 1,
      "checked": true
    }
    ```
      * All fields are optional.
      * Updating `position` will automatically reorder the other items in the list.
  * **Example Call (using `fetch` in JavaScript):**
    ```javascript
    const listIdToUpdate = "your_list_id";
    const itemIdToUpdate = "your_item_id";
    fetch(`http://localhost:3000/grocery-lists/${listIdToUpdate}/items/${itemIdToUpdate}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: 2, checked: true }),
    });
    ```
  * **Example Response (JSON):**
    ```json
    {
      "id": "072d3f25-4e7c-4cae-9658-55f2c3b66e97",
      "name": "Cashews",
      "quantity": 2,
      "category": "Nuts",
      "position": 1,
      "checked": true
    }
    ```

### <a name="delete-an-item-from-a-grocery-list"></a>Delete an Item from a Grocery List

  * **HTTP Method:** `DELETE`
  * **Endpoint:** `/grocery-lists/:list_id/items/:item_id`
  * **Description:** Deletes a specific item from a grocery list.
  * **Path Parameters:**
      * `list_id`: The unique identifier of the grocery list.
      * `item_id`: The unique identifier of the item to delete.
  * **Example Call (using `fetch` in JavaScript):**
    ```javascript
    const listIdToDeleteFrom = "your_list_id";
    const itemIdToDelete = "your_item_id";
    fetch(`http://localhost:3000/grocery-lists/${listIdToDeleteFrom}/items/${itemIdToDelete}`, {
      method: 'DELETE',
    });
    ```
  * **Example Response (JSON):**
    ```json
    {
      "id": "6f01601d-069d-496a-bcd6-9b41bdee71e5",
      "name": "Quinoa",
      "quantity": 5,
      "category": "",
      "position": 5,
      "checked": false
    }
    ```