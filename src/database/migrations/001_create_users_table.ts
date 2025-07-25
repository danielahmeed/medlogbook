import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('user_id', 100).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('full_name', 200).nullable();
    table.string('email', 255).nullable().unique();
    table.string('specialty', 100).nullable();
    table.string('hospital_affiliation', 200).nullable();
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['email']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}