import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`yazilar\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`baslik\` text,
  	\`ozet\` text,
  	\`kapak_gorseli_id\` integer,
  	\`icerik\` text,
  	\`slug\` text,
  	\`kategori\` text,
  	\`yazar\` text,
  	\`yayin_tarihi\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`kapak_gorseli_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`yazilar_kapak_gorseli_idx\` ON \`yazilar\` (\`kapak_gorseli_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`yazilar_slug_idx\` ON \`yazilar\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`yazilar_updated_at_idx\` ON \`yazilar\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`yazilar_created_at_idx\` ON \`yazilar\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`yazilar__status_idx\` ON \`yazilar\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_yazilar_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_baslik\` text,
  	\`version_ozet\` text,
  	\`version_kapak_gorseli_id\` integer,
  	\`version_icerik\` text,
  	\`version_slug\` text,
  	\`version_kategori\` text,
  	\`version_yazar\` text,
  	\`version_yayin_tarihi\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`yazilar\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_kapak_gorseli_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_yazilar_v_parent_idx\` ON \`_yazilar_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_yazilar_v_version_version_kapak_gorseli_idx\` ON \`_yazilar_v\` (\`version_kapak_gorseli_id\`);`)
  await db.run(sql`CREATE INDEX \`_yazilar_v_version_version_slug_idx\` ON \`_yazilar_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_yazilar_v_version_version_updated_at_idx\` ON \`_yazilar_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_yazilar_v_version_version_created_at_idx\` ON \`_yazilar_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_yazilar_v_version_version__status_idx\` ON \`_yazilar_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_yazilar_v_created_at_idx\` ON \`_yazilar_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_yazilar_v_updated_at_idx\` ON \`_yazilar_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_yazilar_v_latest_idx\` ON \`_yazilar_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`ilanlar\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`baslik\` text,
  	\`kurum\` text,
  	\`calisma_sekli\` text,
  	\`sehir\` text,
  	\`ilce\` text,
  	\`aciklama\` text,
  	\`iletisim_telefon\` text,
  	\`iletisim_eposta\` text,
  	\`iletisim_basvuru_linki\` text,
  	\`slug\` text,
  	\`bitis_tarihi\` text,
  	\`durum\` text DEFAULT 'aktif',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`ilanlar_slug_idx\` ON \`ilanlar\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`ilanlar_durum_idx\` ON \`ilanlar\` (\`durum\`);`)
  await db.run(sql`CREATE INDEX \`ilanlar_updated_at_idx\` ON \`ilanlar\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`ilanlar_created_at_idx\` ON \`ilanlar\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`ilanlar__status_idx\` ON \`ilanlar\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_ilanlar_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_baslik\` text,
  	\`version_kurum\` text,
  	\`version_calisma_sekli\` text,
  	\`version_sehir\` text,
  	\`version_ilce\` text,
  	\`version_aciklama\` text,
  	\`version_iletisim_telefon\` text,
  	\`version_iletisim_eposta\` text,
  	\`version_iletisim_basvuru_linki\` text,
  	\`version_slug\` text,
  	\`version_bitis_tarihi\` text,
  	\`version_durum\` text DEFAULT 'aktif',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`ilanlar\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_ilanlar_v_parent_idx\` ON \`_ilanlar_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_ilanlar_v_version_version_slug_idx\` ON \`_ilanlar_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_ilanlar_v_version_version_durum_idx\` ON \`_ilanlar_v\` (\`version_durum\`);`)
  await db.run(sql`CREATE INDEX \`_ilanlar_v_version_version_updated_at_idx\` ON \`_ilanlar_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_ilanlar_v_version_version_created_at_idx\` ON \`_ilanlar_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_ilanlar_v_version_version__status_idx\` ON \`_ilanlar_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_ilanlar_v_created_at_idx\` ON \`_ilanlar_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_ilanlar_v_updated_at_idx\` ON \`_ilanlar_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_ilanlar_v_latest_idx\` ON \`_ilanlar_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_kart_url\` text,
  	\`sizes_kart_width\` numeric,
  	\`sizes_kart_height\` numeric,
  	\`sizes_kart_mime_type\` text,
  	\`sizes_kart_filesize\` numeric,
  	\`sizes_kart_filename\` text,
  	\`sizes_genis_url\` text,
  	\`sizes_genis_width\` numeric,
  	\`sizes_genis_height\` numeric,
  	\`sizes_genis_mime_type\` text,
  	\`sizes_genis_filesize\` numeric,
  	\`sizes_genis_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_kart_sizes_kart_filename_idx\` ON \`media\` (\`sizes_kart_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_genis_sizes_genis_filename_idx\` ON \`media\` (\`sizes_genis_filename\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`ad\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`yazilar_id\` integer,
  	\`ilanlar_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`yazilar_id\`) REFERENCES \`yazilar\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`ilanlar_id\`) REFERENCES \`ilanlar\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_yazilar_id_idx\` ON \`payload_locked_documents_rels\` (\`yazilar_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_ilanlar_id_idx\` ON \`payload_locked_documents_rels\` (\`ilanlar_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`yazilar\`;`)
  await db.run(sql`DROP TABLE \`_yazilar_v\`;`)
  await db.run(sql`DROP TABLE \`ilanlar\`;`)
  await db.run(sql`DROP TABLE \`_ilanlar_v\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
}
