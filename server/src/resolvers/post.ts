import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql'
import { Post } from '../entities/Post'

@Resolver()
export class PostResolver {
  @Query(() => [Post]) // query for getting data
  posts(): Promise<Post[]> {
    return Post.find()
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id)
  }

  @Mutation(() => Post) // mutation for inserting, updating & deleting data
  createPost(@Arg('title', () => String) title: string): Promise<Post> {
    return Post.create({ title }).save()
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
  ): Promise<Post | undefined> {
    await Post.createQueryBuilder()
      .update(Post)
      .set({ title })
      .where('id = :id', { id })
      .execute()

    return Post.findOne(id)
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id', () => Int) id: number): Promise<boolean> {
    await Post.delete(id)
    return true
  }
}
