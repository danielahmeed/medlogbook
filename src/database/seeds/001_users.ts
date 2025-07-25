import { Knex } from 'knex';
import { hashPassword } from '../../utils/auth';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('operations').del();
  await knex('cpd_entries').del();
  await knex('users').del();

  // Hash the default password
  const hashedPassword = await hashPassword('12345');

  // Insert default user (matching the frontend hardcoded credentials)
  await knex('users').insert([
    {
      id: knex.raw('(UUID())'),
      user_id: 'Yaser jabbar',
      password_hash: hashedPassword,
      full_name: 'Yaser Jabbar',
      email: 'yaser.jabbar@example.com',
      specialty: 'General Surgery',
      hospital_affiliation: 'General Hospital',
    },
  ]);
}