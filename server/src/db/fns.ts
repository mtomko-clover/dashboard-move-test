import db from '.'
import { PoolConnection } from 'mariadb'


// TO-DO: replace any
export async function query(queries: Array<string>): Promise<any> {
  let conn: PoolConnection | undefined
  try {
    conn = await db.getConnection()
    if (conn && 'query' in conn) {
      await conn.query('use dashboard;')
      return Promise.all(queries.map(async queryStr => await conn!.query(queryStr)))
    }
  } catch (e) {
    console.error(e)
    return Promise.reject(e)
  } finally {
    if (conn) conn.end()
  }
}

export async function showTables(): Promise<Array<string>> {
  const result = await query(['SHOW TABLES;'])
  console.log('showTables: ', result)
  return result[0] && Array.isArray(result[0]) ? result[0].map((obj: { Tables_in_dashboard: string }) => obj['Tables_in_dashboard']) : []
}

export async function createTable(tableName: string, columns: Array<string>) {
  try {
    console.log(`✍️  Creating ${tableName} table...`)
    const queryList = [`DROP TABLE IF EXISTS ${tableName};`, `CREATE TABLE ${tableName} (${columns}) CHARACTER SET "utf8mb4" ;`, 'SHOW TABLES;']
    const tables = await query(queryList)
    return tables
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function setUpTables() {
  const tables = await showTables()
  console.log('setUpTables: ', tables)

  if (!tables.includes('user')) {
    const fields = [
      'id INT NOT NULL AUTO_INCREMENT PRIMARY KEY',
      'name NVARCHAR(255)',
      'username NVARCHAR(255)',
      'email NVARCHAR(255)',
      'token NVARCHAR(255)',
      'session_count INT',
      'photo BLOB'
    ]
    await createTable('user', fields)
  }
  if (!tables.includes('user_news')) {
    await createTable('user_news', [
      'user_id INT NOT NULL',
      'news_id INT PRIMARY KEY'
    ])
  }
  if (!tables.includes('news')) {
    const fields = [
      'id INT NOT NULL AUTO_INCREMENT PRIMARY KEY',
      'author_id INT',
      'author NVARCHAR(255)',
      'created_at DATETIME',
      'updated_at DATETIME',
      'title NVARCHAR(255)',
      'description NVARCHAR(4000)',
      'link VARCHAR(255)',
      'type VARCHAR(255)'
    ]
    await createTable('news', fields)
  }
  if (!tables.includes('announcements')) {
    const fields = [
      'id INT NOT NULL AUTO_INCREMENT PRIMARY KEY',
      'author_id INT',
      'author NVARCHAR(255)',
      'created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
      'text NVARCHAR(255)',
      'is_urgent BOOLEAN'
    ]
    await createTable('announcements', fields)
  }
  if (!tables.includes('user_announcement')) {
    await createTable('user_announcement', [
      'user_id INT NOT NULL',
      'announcement_id INT PRIMARY KEY'
    ])
  }

  return 'Finished setting up tables'
}
