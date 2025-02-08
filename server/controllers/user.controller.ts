import { Request as ExpressRequest, Response } from "express";
import { userService } from "../services/user.service";

const getAll = async (req: ExpressRequest, res: Response) => {
  const { page, limit } = req.query as { page?: string; limit?: string };
  const users = await userService.getAll({
    page: page ? parseInt(page) : undefined,
    limit: limit ? parseInt(limit) : undefined,
  });

  res.status(200).json({
    status: "success",
    ...users,
  });
};

const getById = async (req: ExpressRequest, res: Response) => {
  const user = await userService.getById(parseInt(req.params.id));

  res.status(200).json({
    status: "success",
    data: user,
  });
};

const create = async (req: ExpressRequest, res: Response) => {
  const user = await userService.create(req.body);

  res.status(201).json({
    status: "success",
    data: user,
  });
};

const update = async (req: ExpressRequest, res: Response) => {
  const user = await userService.update(parseInt(req.params.id), req.body);

  res.status(200).json({
    status: "success",
    data: user,
  });
};

const partialUpdate = async (req: ExpressRequest, res: Response) => {
  const user = await userService.update(parseInt(req.params.id), req.body);

  res.status(200).json({
    status: "success",
    data: user,
  });
};

const remove = async (req: ExpressRequest, res: Response) => {
  await userService.softDelete(parseInt(req.params.id));

  res.status(204).send();
};

const permanentlyDelete = async (req: ExpressRequest, res: Response) => {
  await userService.hardDelete(parseInt(req.params.id));

  res.status(204).send();
};

const recover = async (req: ExpressRequest, res: Response) => {
  const user = await userService.recover(parseInt(req.params.id));

  res.status(200).json({
    status: "success",
    data: user,
  });
};

const getDeleted = async (req: ExpressRequest, res: Response) => {
  const { page, limit } = req.query as { page?: string; limit?: string };
  const users = await userService.getDeleted({
    page: page ? parseInt(page) : undefined,
    limit: limit ? parseInt(limit) : undefined,
  });

  res.status(200).json({
    status: "success",
    ...users,
  });
};

export const userController = {
  getAll,
  getById,
  create,
  update,
  partialUpdate,
  remove,
  permanentlyDelete,
  recover,
  getDeleted,
};
