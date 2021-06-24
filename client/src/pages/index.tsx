import { useState } from 'react'
import { useCreatePostMutation, usePostsQuery } from 'src/generated/graphql'

export default function Home() {
  const { data } = usePostsQuery()
  const [createPost] = useCreatePostMutation()
  const [title, setTitle] = useState('')

  const handleChangePostTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleCreatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    createPost({ variables: { title } })
  }

  return (
    <div>
      <h1>Next js & Graphql App</h1>

      <form onSubmit={handleCreatePost}>
        Title:
        <input onChange={handleChangePostTitle} type="text" />
        <button>create post</button>
      </form>

      {data?.posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
        </div>
      ))}
    </div>
  )
}
