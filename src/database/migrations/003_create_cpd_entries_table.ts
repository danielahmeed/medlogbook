import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cpd_entries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title', 200).notNullable();
    table.text('description').nullable();
    table.string('category', 100).notNullable();
    table.decimal('hours', 8, 2).notNullable();
    table.date('date_completed').notNullable();
    table.string('provider', 200).nullable();
    table.string('certificate_url', 500).nullable();
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['category']);
    table.index(['date_completed']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('cpd_entries');
}