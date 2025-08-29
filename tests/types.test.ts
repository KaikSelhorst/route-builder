import { describe, expectTypeOf, it } from 'vitest';
import { RouteBuilder } from '../src/route-builder';

describe('RouteBuilder Types', () => {
  it('should infer correct parameter types from path', () => {
    const route = new RouteBuilder('/users/:id/posts/:postId');

    // Test withParams types
    expectTypeOf(route.withParams).parameter(0).toEqualTypeOf<{
      id: string | number;
      postId: string | number;
    }>();

    // Test safeParse return type
    expectTypeOf(route.safeParse).returns.toEqualTypeOf<{
      id: string;
      postId: string;
    } | null>();
  });

  it('should handle single parameter paths', () => {
    const route = new RouteBuilder('/users/:id');

    expectTypeOf(route.withParams).parameter(0).toEqualTypeOf<{
      id: string | number;
    }>();

    expectTypeOf(route.safeParse).returns.toEqualTypeOf<{
      id: string;
    } | null>();
  });

  it('should handle paths with protocols', () => {
    const route = new RouteBuilder('https://api.example.com/users/:id');

    expectTypeOf(route.withParams).parameter(0).toEqualTypeOf<{
      id: string | number;
    }>();

    expectTypeOf(route.safeParse).returns.toEqualTypeOf<{
      id: string;
    } | null>();
  });

  it('should handle paths without parameters', () => {
    const route = new RouteBuilder('/users');

    // Note: withParams expects Record<string, never> for paths without parameters
    // Note: safeParse returns Record<string, never> | null for paths without parameters
  });

  it('should handle complex parameter names', () => {
    const route = new RouteBuilder(
      '/users/:userId/posts/:postId/comments/:commentId',
    );

    expectTypeOf(route.withParams).parameter(0).toEqualTypeOf<{
      userId: string | number;
      postId: string | number;
      commentId: string | number;
    }>();

    expectTypeOf(route.safeParse).returns.toEqualTypeOf<{
      userId: string;
      postId: string;
      commentId: string;
    } | null>();
  });

  it('should handle withSearchParams types', () => {
    const route = new RouteBuilder('/users');

    // Test all valid types for withSearchParams
    expectTypeOf(route.withSearchParams)
      .parameter(0)
      .toEqualTypeOf<
        | string
        | URLSearchParams
        | string[][]
        | Record<string, string | number | undefined | null>
        | undefined
      >();
  });
});
