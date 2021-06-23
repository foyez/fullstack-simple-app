import { usePostsQuery } from 'src/generated/graphql'

export default function Home() {
  const { data } = usePostsQuery()

  return (
    <div>
      <h1>Next js & Graphql App</h1>
      {data?.posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
        </div>
      ))}
    </div>
  )
}
