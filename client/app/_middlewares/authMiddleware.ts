import { NextApiRequest, NextApiResponse } from "next";

export const authMiddleware =
  () => async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.jwt;
    return res.redirect("/login");
  };
