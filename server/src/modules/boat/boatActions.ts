import type { RequestHandler } from "express";
import boatRepository from "./boatRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const boats = await boatRepository.readAll(req.query);
    res.json(boats);
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const category = {
      id: Number(req.params.id),
      coord_x: req.body.coord_x,
      coord_y: req.body.coord_y,
    };

    const affectedBoats = await boatRepository.update(category);

    if (affectedBoats === undefined) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  edit,
};
