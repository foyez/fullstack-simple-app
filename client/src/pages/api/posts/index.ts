import { NextApiRequest, NextApiResponse } from "next"

// http://localhost:3000/api/posts/abc
export default (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json([{id:1,title: 'First post'},{id: 2,title:'Second post'}])
}