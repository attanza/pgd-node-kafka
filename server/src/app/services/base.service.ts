import { Request } from 'express';
import { FilterQuery } from 'mongoose';
import { Pagination, PaginationOptions } from 'mongoose-paginate-ts';
import mqttUtils from '../../utils/mqtt-utils';
import { HttpException } from '../exceptions/http.exception';

export abstract class BaseService<T> {
  private model: Pagination<T>;
  constructor(model: Pagination<T>) {
    this.model = model;
  }

  /**
   *
   * READ
   */

  async find(req: Request) {
    const { page, limit, select, populate, sortField, sortDirection } = req.query;
    let sort = undefined;
    if (sortField && sortDirection) {
      sort = { [sortField as string]: sortDirection };
    }
    const options: PaginationOptions = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      select: select || undefined,
      sort,
      populate: populate || undefined,
    };

    return this.model.paginate(options);
  }
  async findOne(filter?: FilterQuery<T>) {
    return this.model.findOne(filter).exec();
  }

  async show(id: string) {
    const found = await this.model.findById(id);
    if (!found) {
      throw new HttpException(404, `${this.model.modelName} not found`);
    }
    return found;
  }

  /**
   *
   * CREATE UPDATE DELETE
   */
  async create<X>(data: X, duplicates?: string[]) {
    if (duplicates && duplicates.length > 0) {
      const promises: any[] = [];
      duplicates.forEach((d) =>
        // @ts-ignore
        promises.push(this.checkDuplicates(d, data[d]))
      );
      await Promise.all(promises);
    }
    const created = await this.model.create(data);
    mqttUtils.sendMessage(`node-kafka/${this.model.modelName}/create`, JSON.stringify(created));
    return created;
  }

  async update<X>(id: string, data: X, duplicates?: string[]) {
    const found = await this.model.findById(id);
    if (!found) {
      throw new HttpException(404, `${this.model.modelName} not found`);
    }
    if (duplicates && duplicates.length > 0) {
      const promises: any[] = [];
      duplicates.forEach((d) =>
        // @ts-ignore
        promises.push(this.checkDuplicates(d, data[d], id))
      );
      await Promise.all(promises);
    }

    Object.assign(found, data);
    await found.save();
    mqttUtils.sendMessage(
      `node-kafka/${this.model.modelName}/update/${found._id}`,
      JSON.stringify(found)
    );
    return found;
  }

  async delete(id: string) {
    const found = await this.model.findById(id);
    if (!found) {
      throw new HttpException(404, `${this.model.modelName} not found`);
    }
    await found.remove();
  }

  /**
   * UTILS
   */

  async checkDuplicates(key: string, value: any, id?: string) {
    const options: any = { [key]: value };
    if (id) {
      options['_id'] = { $ne: id };
    }
    const found = await this.model.findOne(options);
    if (found) {
      throw new HttpException(422, `${key} already register`);
    }
  }
}
