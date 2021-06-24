import { NextApiRequest, NextApiResponse } from "next"

// http://localhost:3000/api/posts/abc
export default (req: NextApiRequest, res: NextApiResponse) => {
  const {pid}=req.query

  res.end(`Post: ${pid}`)
}