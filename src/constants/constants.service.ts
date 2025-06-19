import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Constant } from './entities/constant.entity';

@Injectable()
export class ConstantsService {
  constructor(
    @InjectRepository(Constant)
    private readonly constantRepo: Repository<Constant>,
  ) { }

  async findAllGrouped(): Promise<Record<string, { id: number; value: string }[]>> {
    const all = await this.constantRepo.find({
      order: { key: 'ASC', id: 'ASC' },
    });
    const grouped: Record<string, { id: number; value: string }[]> = {};
    for (const item of all) {
      if (!grouped[item.key]) {
        grouped[item.key] = [];
      }
      grouped[item.key].push({
        id: item.id,
        value: item.value,
      });
    }
    return grouped;
  }


  async addConstants(key: string, values: { id: number; value: string }[]) {
    const existing = await this.constantRepo.findBy({ key });
    const existingIds = new Set(existing.map(c => c.id));
    const existingValues = new Set(existing.map(c => c.value));
    const newValues = values.filter(
      ({ id, value }) => !existingIds.has(id) && !existingValues.has(value),
    );
    if (newValues.length === 0) {
      return { message: 'Todas las constantes ya existen' };
    }
    const entities = newValues.map(({ id, value }) =>
      this.constantRepo.create({ key, id, value }),
    );
    return this.constantRepo.save(entities);
  }

}
