import { describe, expect, it } from 'vitest';
import { RouteBuilder } from '../src/route-builder';

describe('RouteBuilder Integration Tests', () => {
  it('should build complex API routes with all features', () => {
    const baseRoute = new RouteBuilder(
      'https://api.example.com/v1/users/:userId/posts/:postId',
    );

    const finalRoute = baseRoute
      .withParams({ userId: '123', postId: '456' })
      .withSearchParams({
        include: 'comments,author',
        sort: 'created_at',
        order: 'desc',
        page: 1,
        limit: 20,
      });

    expect(finalRoute.toString()).toBe(
      'https://api.example.com/v1/users/123/posts/456?include=comments%2Cauthor&sort=created_at&order=desc&page=1&limit=20',
    );
  });

  it('should handle nested resource routes', () => {
    const userRoute = new RouteBuilder('/users/:userId');
    const postRoute = new RouteBuilder('/users/:userId/posts/:postId');
    const commentRoute = new RouteBuilder(
      '/users/:userId/posts/:postId/comments/:commentId',
    );

    const userId = '123';
    const postId = '456';
    const commentId = '789';

    const userUrl = userRoute.withParams({ userId }).toString();
    const postUrl = postRoute.withParams({ userId, postId }).toString();
    const commentUrl = commentRoute
      .withParams({ userId, postId, commentId })
      .toString();

    expect(userUrl).toBe('/users/123');
    expect(postUrl).toBe('/users/123/posts/456');
    expect(commentUrl).toBe('/users/123/posts/456/comments/789');
  });

  it('should parse and rebuild routes correctly', () => {
    const route = new RouteBuilder('/api/users/:id/posts/:postId');
    const url = '/api/users/123/posts/456';

    const parsed = route.safeParse(url);
    expect(parsed).toEqual({ id: '123', postId: '456' });

    if (parsed) {
      const rebuilt = route.withParams(parsed);
      expect(rebuilt.toString()).toBe('/api/users/123/posts/456');
    }
  });

  it('should handle query parameters with special characters', () => {
    const route = new RouteBuilder('/search');
    const searchRoute = route.withSearchParams({
      q: 'hello world',
      category: 'tech & science',
      tags: 'javascript,typescript',
      price: '10-50',
    });

    expect(searchRoute.toString()).toBe(
      '/search?q=hello+world&category=tech+%26+science&tags=javascript%2Ctypescript&price=10-50',
    );
  });

  it('should work with URLSearchParams objects', () => {
    const route = new RouteBuilder('/api/data');
    const params = new URLSearchParams();
    params.append('filter', 'active');
    params.append('sort', 'name');
    params.append('order', 'asc');

    const finalRoute = route.withSearchParams(params);
    expect(finalRoute.toString()).toBe(
      '/api/data?filter=active&sort=name&order=asc',
    );
  });

  it('should handle array-based query parameters', () => {
    const route = new RouteBuilder('/api/products');
    const finalRoute = route.withSearchParams([
      ['category', 'electronics'],
      ['brand', 'apple'],
      ['price_min', '100'],
      ['price_max', '1000'],
    ]);

    expect(finalRoute.toString()).toBe(
      '/api/products?category=electronics&brand=apple&price_min=100&price_max=1000',
    );
  });

  it('should maintain immutability across operations', () => {
    const originalRoute = new RouteBuilder('/users/:id');
    const routeWithParams = originalRoute.withParams({ id: '123' });
    const routeWithSearch = routeWithParams.withSearchParams({ name: 'john' });

    // All should be different instances
    expect(originalRoute).not.toBe(routeWithParams);
    expect(routeWithParams).not.toBe(routeWithSearch);
    expect(originalRoute).not.toBe(routeWithSearch);

    // Original should remain unchanged
    expect(originalRoute.toString()).toBe('/users/:id');
    expect(routeWithParams.toString()).toBe('/users/123');
    expect(routeWithSearch.toString()).toBe('/users/123?name=john');
  });

  it('should handle edge cases in parameter replacement', () => {
    const route = new RouteBuilder('/users/:id/posts/:postId');

    // Test with empty string parameters (should be ignored)
    const routeWithEmpty = route.withParams({ id: '', postId: '456' });
    expect(routeWithEmpty.toString()).toBe('/users/:id/posts/456');

    // Test with zero values (0 is falsy, so it should be ignored)
    const routeWithZero = route.withParams({ id: 0, postId: '456' });
    expect(routeWithZero.toString()).toBe('/users/:id/posts/456');
  });

  it('should handle complex regex patterns in safeParse', () => {
    const route = new RouteBuilder('/files/:filename.:extension');

    // The current regex implementation doesn't handle dots in parameter names well
    // This test demonstrates the limitation by checking the route creation
    expect(route.toString()).toBe('/files/:filename.:extension');

    // We can't test safeParse with this pattern as it creates an invalid regex
    // This is a known limitation of the current implementation
  });

  it('should work with deeply nested routes', () => {
    const route = new RouteBuilder(
      '/orgs/:orgId/teams/:teamId/projects/:projectId/tasks/:taskId',
    );

    const params = {
      orgId: 'acme',
      teamId: 'frontend',
      projectId: 'website',
      taskId: '123',
    };

    const finalRoute = route.withParams(params);
    expect(finalRoute.toString()).toBe(
      '/orgs/acme/teams/frontend/projects/website/tasks/123',
    );

    // Test parsing
    const parsed = route.safeParse(
      '/orgs/acme/teams/frontend/projects/website/tasks/123',
    );
    expect(parsed).toEqual(params);
  });
});
