import { Request as ExpressRequest, Response } from "express";
import { healthService } from "../services/health.service";

const getAll = async (req: ExpressRequest, res: Response) => {
  const { page, limit } = req.query as { page?: string; limit?: string };
  const healths = await healthService.getAll({
    page: page ? parseInt(page) : undefined,
    limit: limit ? parseInt(limit) : undefined,
  });

  res.status(200).json({
    status: "success",
    ...healths,
  });
};

const getById = async (req: ExpressRequest, res: Response) => {
  const health = await healthService.getById(parseInt(req.params.id));

  res.status(200).json({
    status: "success",
    data: health,
  });
};

const create = async (req: ExpressRequest, res: Response) => {
  const health = await healthService.create(req.body);

  res.status(201).json({
    status: "success",
    data: health,
  });
};
const update = async (req: ExpressRequest, res: Response) => {
  const health = await healthService.update(parseInt(req.params.id), req.body);

  res.status(200).json({
    status: "success",
    data: health,
  });
};

const partialUpdate = async (req: ExpressRequest, res: Response) => {
  const health = await healthService.update(parseInt(req.params.id), req.body);

  res.status(200).json({
    status: "success",
    data: health,
  });
};

const remove = async (req: ExpressRequest, res: Response) => {
  await healthService.softDelete(parseInt(req.params.id));

  res.status(204).send();
};

const permanentlyDelete = async (req: ExpressRequest, res: Response) => {
  await healthService.hardDelete(parseInt(req.params.id));

  res.status(204).send();
};

const recover = async (req: ExpressRequest, res: Response) => {
  const health = await healthService.recover(parseInt(req.params.id));

  res.status(200).json({
    status: "success",
    data: health,
  });
};

const getDeleted = async (req: ExpressRequest, res: Response) => {
  const { page, limit } = req.query as { page?: string; limit?: string };
  const healths = await healthService.getDeleted({
    page: page ? parseInt(page) : undefined,
    limit: limit ? parseInt(limit) : undefined,
  });

  res.status(200).json({
    status: "success",
    ...healths,
  });
};

export const healthController = {
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
