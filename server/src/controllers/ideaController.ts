import { Request, Response } from "express";

export const createIdea = async (req: Request, res: Response) => {
  const { title, problem, solution, market, monetization, industry } = req.body;

};
