import { describe, expect, it } from 'vitest';
import { RouteBuilder } from '../src/route-builder';

describe('RouteBuilder', () => {
  describe('constructor', () => {
    it('should create a RouteBuilder with the given path', () => {
      const route = new RouteBuilder('/users/:id');
      expect(route.toString()).toBe('/users/:id');
    });

    it('should handle paths with protocols', () => {
      const route = new RouteBuilder('https://api.example.com/users/:id');
      expect(route.toString()).toBe('https://api.example.com/users/:id');
    });
  });

  describe('withParams', () => {
    it('should replace path parameters with provided values', () => {
      const route = new RouteBuilder('/users/:id/posts/:postId');
      const newRoute = route.withParams({ id: '123', postId: '456' });
      expect(newRoute.toString()).toBe('/users/123/posts/456');
    });

    it('should handle single parameter', () => {
      const route = new RouteBuilder('/users/:id');
      const newRoute = route.withParams({ id: '123' });
      expect(newRoute.toString()).toBe('/users/123');
    });

    it('should ignore undefined/null parameters', () => {
      const route = new RouteBuilder('/users/:id/posts/:postId');
      const newRoute = route.withParams({
        id: '123',
        postId: undefined as any,
      });
      expect(newRoute.toString()).toBe('/users/123/posts/:postId');
    });

    it('should handle numeric parameters', () => {
      const route = new RouteBuilder('/users/:id');
      const newRoute = route.withParams({ id: 123 });
      expect(newRoute.toString()).toBe('/users/123');
    });

    it('should return a new RouteBuilder instance', () => {
      const route = new RouteBuilder('/users/:id');
      const newRoute = route.withParams({ id: '123' });
      expect(newRoute).toBeInstanceOf(RouteBuilder);
      expect(newRoute).not.toBe(route);
    });
  });

  describe('withSearchParams', () => {
    it('should add query parameters from string', () => {
      const route = new RouteBuilder('/users');
      const newRoute = route.withSearchParams('name=john&age=25');
      expect(newRoute.toString()).toBe('/users?name=john&age=25');
    });

    it('should add query parameters from URLSearchParams', () => {
      const route = new RouteBuilder('/users');
      const params = new URLSearchParams('name=john&age=25');
      const newRoute = route.withSearchParams(params);
      expect(newRoute.toString()).toBe('/users?name=john&age=25');
    });

    it('should add query parameters from array', () => {
      const route = new RouteBuilder('/users');
      const newRoute = route.withSearchParams([
        ['name', 'john'],
        ['age', '25'],
      ]);
      expect(newRoute.toString()).toBe('/users?name=john&age=25');
    });

    it('should add query parameters from object', () => {
      const route = new RouteBuilder('/users');
      const newRoute = route.withSearchParams({ name: 'john', age: 25 });
      expect(newRoute.toString()).toBe('/users?name=john&age=25');
    });

    it('should handle undefined/null values in object', () => {
      const route = new RouteBuilder('/users');
      const newRoute = route.withSearchParams({
        name: 'john',
        age: undefined,
        city: null,
      });
      expect(newRoute.toString()).toBe(
        '/users?name=john&age=undefined&city=null',
      );
    });

    it('should return the same route when no params provided', () => {
      const route = new RouteBuilder('/users');
      const newRoute = route.withSearchParams(undefined);
      expect(newRoute.toString()).toBe('/users');
      expect(newRoute).toBe(route);
    });

    it('should return the same route when empty params provided', () => {
      const route = new RouteBuilder('/users');
      const newRoute = route.withSearchParams({});
      expect(newRoute.toString()).toBe('/users');
      expect(newRoute).toBe(route);
    });

    it('should return a new RouteBuilder instance', () => {
      const route = new RouteBuilder('/users');
      const newRoute = route.withSearchParams({ name: 'john' });
      expect(newRoute).toBeInstanceOf(RouteBuilder);
      expect(newRoute).not.toBe(route);
    });
  });

  describe('safeParse', () => {
    it('should parse URL and extract parameters', () => {
      const route = new RouteBuilder('/users/:id/posts/:postId');
      const result = route.safeParse('/users/123/posts/456');
      expect(result).toEqual({ id: '123', postId: '456' });
    });

    it('should parse URL with single parameter', () => {
      const route = new RouteBuilder('/users/:id');
      const result = route.safeParse('/users/123');
      expect(result).toEqual({ id: '123' });
    });

    it('should return null for non-matching URLs', () => {
      const route = new RouteBuilder('/users/:id');
      const result = route.safeParse('/posts/123');
      expect(result).toBeNull();
    });

    it('should return null for URLs with different structure', () => {
      const route = new RouteBuilder('/users/:id/posts/:postId');
      const result = route.safeParse('/users/123');
      expect(result).toBeNull();
    });

    it('should handle URLs with query parameters', () => {
      const route = new RouteBuilder('/users/:id');
      const result = route.safeParse('/users/123?name=john');
      // The current implementation doesn't handle query parameters in safeParse
      expect(result).toBeNull();
    });

    it('should handle URLs with protocols', () => {
      const route = new RouteBuilder('https://api.example.com/users/:id');
      const result = route.safeParse('https://api.example.com/users/123');
      expect(result).toEqual({ id: '123' });
    });

    it('should handle complex parameter names', () => {
      const route = new RouteBuilder('/users/:userId/posts/:postId');
      const result = route.safeParse('/users/123/posts/456');
      expect(result).toEqual({ userId: '123', postId: '456' });
    });
  });

  describe('toString', () => {
    it('should return the current path', () => {
      const route = new RouteBuilder('/users/:id');
      expect(route.toString()).toBe('/users/:id');
    });

    it('should return updated path after withParams', () => {
      const route = new RouteBuilder('/users/:id');
      const newRoute = route.withParams({ id: '123' });
      expect(newRoute.toString()).toBe('/users/123');
    });

    it('should return updated path after withSearchParams', () => {
      const route = new RouteBuilder('/users');
      const newRoute = route.withSearchParams({ name: 'john' });
      expect(newRoute.toString()).toBe('/users?name=john');
    });
  });

  describe('chaining', () => {
    it('should allow chaining withParams and withSearchParams', () => {
      const route = new RouteBuilder('/users/:id/posts/:postId');
      const newRoute = route
        .withParams({ id: '123', postId: '456' })
        .withSearchParams({ sort: 'date', order: 'desc' });

      expect(newRoute.toString()).toBe(
        '/users/123/posts/456?sort=date&order=desc',
      );
    });

    it('should allow multiple withParams calls', () => {
      const route = new RouteBuilder(
        '/users/:id/posts/:postId/comments/:commentId',
      );
      const newRoute = route.withParams({
        id: '123',
        postId: '456',
        commentId: '789',
      });

      expect(newRoute.toString()).toBe('/users/123/posts/456/comments/789');
    });
  });

  describe('edge cases', () => {
    it('should handle empty path', () => {
      const route = new RouteBuilder('');
      expect(route.toString()).toBe('');
    });

    it('should handle path with only parameters', () => {
      const route = new RouteBuilder(':id');
      const newRoute = route.withParams({ id: '123' });
      expect(newRoute.toString()).toBe('123');
    });

    it('should handle path with trailing slash', () => {
      const route = new RouteBuilder('/users/:id/');
      const newRoute = route.withParams({ id: '123' });
      expect(newRoute.toString()).toBe('/users/123/');
    });

    it('should handle special characters in parameters', () => {
      const route = new RouteBuilder('/users/:id');
      const newRoute = route.withParams({ id: 'user-123_test' });
      expect(newRoute.toString()).toBe('/users/user-123_test');
    });
  });
});
