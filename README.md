# Route Builder

A simple and type-safe TypeScript library for building and manipulating routes with dynamic parameters.

[![Release](https://github.com/kaikselhorst/route-builder/workflows/Publish%20Node.js%20Package%20on%20NPM/badge.svg)](https://github.com/kaikselhorst/route-builder/actions/workflows/release.yml)

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

## 🚀 Development

### Running Tests

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Run full CI pipeline locally
npm run ci
```

### CI/CD

This project uses GitHub Actions for continuous integration and deployment. See [CI/CD Documentation](docs/CI-CD.md) for detailed information.

- **Automated Testing**: Runs on every push and pull request
- **Code Coverage**: Monitored with Codecov
- **Dependency Updates**: Automated with Dependabot
- **NPM Publishing**: Automatic on release creation

## 👨‍💻 Author

Kaik Selhorst
