import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Boat = {
  id: number;
  name: string;
  coord_x: number;
  coord_y: number;
  type: string;
  has_treasure: number;
};

class BoatRepository {
  async readAll(where?: { name?: string }) {
    where = where || {};
    let sql = `
                    SELECT
                      boat.id AS id,
                      boat.name,
                      boat.coord_x,
                      boat.coord_y,
                      tile.type,
                      tile.has_treasure
                    FROM boat
                    JOIN tile ON boat.coord_x = tile.coord_x AND boat.coord_y = tile.coord_y
                  `;
    const params: unknown[] = [];

    if (where.name) {
      sql += " WHERE boat.name = ?";
      params.push(where.name);
    }

    sql += " ORDER BY boat.coord_y, boat.coord_x";

    const [rows] = await databaseClient.query<Rows>(sql, params);

    return rows as Boat[];
  }

  async update(boatToUpdate: Partial<Boat>) {
    const [Result] = await databaseClient.query<Result>(
      "update boat set coord_x=?, coord_y=? where id=?",
      [boatToUpdate.coord_x, boatToUpdate.coord_y, boatToUpdate.id],
    );
    return Result.affectedRows;
  }
}

export default new BoatRepository();
