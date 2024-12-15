# Flatten Object Utility

A TypeScript utility function that flattens nested objects into a single-level object with dot notation keys.

## Installation

```bash
npm install flattener
```

## Usage

The `flattenObject` function takes a nested object and converts it into a flat object where nested keys are represented using dot notation.

```typescript
import { flattenObject } from "flattener";

// Example usage
const nestedObject = {
  name: "John",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York",
    country: {
      code: "US",
      name: "United States",
    },
  },
  hobbies: ["reading", "gaming"],
};

const flattenedObject = flattenObject(nestedObject);

console.log(flattenedObject);
// Output:
// {
//   'name': 'John',
//   'age': 30,
//   'address.street': '123 Main St',
//   'address.city': 'New York',
//   'address.country.code': 'US',
//   'address.country.name': 'United States',
//   'hobbies': ['reading', 'gaming']
// }
```

## API

### `flattenObject<T>(obj: T, parentKey?: string, result?: Record<string, any>): Record<string, any>`

Flattens a nested object into a single-level object.

#### Parameters

- `obj` (required): The nested object to flatten
- `parentKey` (optional): Used internally for recursive calls to track the current key path
- `result` (optional): Used internally to accumulate the flattened key-value pairs

#### Returns

Returns a new object with flattened keys in dot notation.

## Features

- Written in TypeScript with full type support
- Preserves arrays (does not flatten array elements)
- Handles nested objects of any depth
- Maintains the original values of primitive types
- Uses dot notation for nested keys

## License

MIT

## Common Use Cases

### Working with MongoDB and HTTP Requests

This utility is particularly useful when handling partial updates from HTTP requests to MongoDB documents. It helps you:

1. Flatten nested JSON request bodies into MongoDB-compatible update formats
2. Create update queries that only modify specific nested fields
3. Preserve other document fields that weren't included in the update

```typescript
import express from "express";
import { flattenObject } from "flattener";

// Example Express route handler
app.patch("/users/:id", async (req, res) => {
  const updates = flattenObject(req.body);

  // Creates an update query that only modifies the specified fields
  const updateQuery = {
    $set: updates,
  };

  // Example: If req.body is:
  // {
  //   "profile": {
  //     "address": {
  //       "city": "New York"
  //     }
  //   }
  // }

  // updateQuery becomes:
  // {
  //   $set: {
  //     "profile.address.city": "New York"
  //   }
  // }

  await User.updateOne({ _id: req.params.id }, updateQuery);

  res.json({ success: true });
});
```

#### Benefits:

1. **Partial Updates**: Only update the fields that were actually sent in the request
2. **Nested Object Support**: Easily update deeply nested fields without affecting siblings
3. **Data Integrity**: Other fields in the document remain untouched
4. **Clean Code**: Avoid manually constructing dot notation paths for nested updates

#### Example Scenarios:

```typescript
// Original MongoDB document
const user = {
  name: "John",
  profile: {
    address: {
      street: "123 Main St",
      city: "Boston",
      country: "USA",
    },
    preferences: {
      theme: "dark",
      notifications: true,
    },
  },
};

// HTTP PATCH request body
const requestBody = {
  profile: {
    address: {
      city: "New York",
    },
    preferences: {
      theme: "light",
    },
  },
};

// Using flattenObject
const updates = flattenObject(requestBody);
// Result:
// {
//   "profile.address.city": "New York",
//   "profile.preferences.theme": "light"
// }

// MongoDB update query
await User.updateOne({ _id: userId }, { $set: updates });

// Final document (notice other fields remain unchanged):
// {
//   name: "John",
//   profile: {
//     address: {
//       street: "123 Main St",    // unchanged
//       city: "New York",         // updated
//       country: "USA"           // unchanged
//     },
//     preferences: {
//       theme: "light",          // updated
//       notifications: true      // unchanged
//     }
//   }
// }
```

This approach is especially valuable when building RESTful APIs where partial updates are common and you need to ensure that unspecified fields remain untouched.
