# Route Builder

A simple and type-safe TypeScript library for building and manipulating routes with dynamic parameters.

## 🚀 Installation

```bash
npm install @kaikselhorst/route-builder
```

## 📖 How to use

### Creating a route

```typescript
import { RouteBuilder } from '@kaikselhorst/route-builder';

const route = new RouteBuilder('/users/:id/posts/:postId');
```

### Adding parameters

```typescript
// Replace parameters in the route
const userRoute = route.withParams({
  id: '123',
  postId: '456'
});

console.log(userRoute.toString());
// Output: /users/123/posts/456
```

### Adding query parameters

```typescript
// Add query parameters
const routeWithQuery = route
  .withParams({ id: '123', postId: '456' })
  .withSearchParams({ page: 1, limit: 10 });

console.log(routeWithQuery.toString());
// Output: /users/123/posts/456?page=1&limit=10
```

### Parsing URLs

```typescript
// Extract parameters from a URL
const params = route.safeParse('/users/123/posts/456');

if (params) {
  console.log(params.id);      // "123"
  console.log(params.postId);  // "456"
}
```

## ✨ Features

- **Type-safe**: Automatic type inference for parameters
- **Flexible**: Support for different query parameter formats
- **Simple**: Intuitive and easy-to-use API
- **Robust**: Validation and error handling

## 🔧 Examples

### Routes with protocol

```typescript
const apiRoute = new RouteBuilder('https://api.example.com/users/:id');
const finalRoute = apiRoute.withParams({ id: '123' });
// Output: https://api.example.com/users/123
```

### Complex query parameters

```typescript
const route = new RouteBuilder('/search');

// Different ways to add query parameters
route.withSearchParams('q=typescript&lang=en');
route.withSearchParams({ q: 'typescript', lang: 'en' });
route.withSearchParams([['q', 'typescript'], ['lang', 'en']]);
```

## 📝 License

MIT - see the [LICENSE](LICENSE) file for more details.

## 👨‍💻 Author

Kaik Selhorst
