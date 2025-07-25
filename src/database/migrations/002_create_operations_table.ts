import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('operations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('patient_id', 50).notNullable();
    table.integer('patient_age').notNullable();
    table.date('date_of_birth').nullable();
    table.date('operation_date').notNullable();
    table.string('operator_name', 200).notNullable();
    table.enum('operator_level', [
      'Consultant',
      'Specialist Registrar',
      'Core Trainee',
      'Foundation Doctor',
      'Medical Student',
      'Other'
    ]).notNullable();
    table.enum('urgency', [
      'Elective',
      'Urgent',
      'Emergency',
      'Immediate'
    ]).nullable();
    table.enum('asa_grade', [
      'ASA I',
      'ASA II',
      'ASA III',
      'ASA IV',
      'ASA V',
      'ASA VI'
    ]).nullable();
    table.string('operation_name', 500).notNullable();
    table.string('hospital', 200).notNullable();
    table.text('notes').nullable();
    table.text('complications').nullable();
    table.boolean('is_private').defaultTo(false);
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['operation_date']);
    table.index(['hospital']);
    table.index(['operator_level']);
    table.index(['is_private']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('operations');
}