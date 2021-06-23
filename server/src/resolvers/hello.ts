import { Arg, Query, Resolver } from 'type-graphql'

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello(): string {
    return 'hello world'
  }

  @Query(() => String)
  greet(@Arg('name', () => String) name: string): string {
    return `hi, ${name}`
  }
}
