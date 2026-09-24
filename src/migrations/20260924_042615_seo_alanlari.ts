import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`yazilar\` ADD \`seo_baslik\` text;`)
  await db.run(sql`ALTER TABLE \`yazilar\` ADD \`seo_aciklama\` text;`)
  await db.run(sql`ALTER TABLE \`_yazilar_v\` ADD \`version_seo_baslik\` text;`)
  await db.run(sql`ALTER TABLE \`_yazilar_v\` ADD \`version_seo_aciklama\` text;`)
  await db.run(sql`ALTER TABLE \`ilanlar\` ADD \`seo_baslik\` text;`)
  await db.run(sql`ALTER TABLE \`ilanlar\` ADD \`seo_aciklama\` text;`)
  await db.run(sql`ALTER TABLE \`_ilanlar_v\` ADD \`version_seo_baslik\` text;`)
  await db.run(sql`ALTER TABLE \`_ilanlar_v\` ADD \`version_seo_aciklama\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`yazilar\` DROP COLUMN \`seo_baslik\`;`)
  await db.run(sql`ALTER TABLE \`yazilar\` DROP COLUMN \`seo_aciklama\`;`)
  await db.run(sql`ALTER TABLE \`_yazilar_v\` DROP COLUMN \`version_seo_baslik\`;`)
  await db.run(sql`ALTER TABLE \`_yazilar_v\` DROP COLUMN \`version_seo_aciklama\`;`)
  await db.run(sql`ALTER TABLE \`ilanlar\` DROP COLUMN \`seo_baslik\`;`)
  await db.run(sql`ALTER TABLE \`ilanlar\` DROP COLUMN \`seo_aciklama\`;`)
  await db.run(sql`ALTER TABLE \`_ilanlar_v\` DROP COLUMN \`version_seo_baslik\`;`)
  await db.run(sql`ALTER TABLE \`_ilanlar_v\` DROP COLUMN \`version_seo_aciklama\`;`)
}
