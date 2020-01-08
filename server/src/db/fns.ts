import db from '.'
import { PoolConnection } from 'mariadb'


// TO-DO: replace any
export async function query(queries: Array<string>): Promise<any> {
  let conn: PoolConnection | undefined
  try {
    conn = await db.getConnection()
    if (conn && 'query' in conn) {
      return Promise.all(queries.map(async queryStr => await conn!.query(queryStr)))
    }
  } catch (e) {
    console.log(e)
    return Promise.reject(e)
  } finally {
    if (conn) conn.end()
  }
}

export async function queryDevrelIds() {
  const listOfObjs = await query(['SELECT id FROM persona WHERE is_devrelian=TRUE;'])
  // console.log('queryDevrelIds: ', listOfObjs[0])
  return listOfObjs[0].map(({ id }: any) => id)
}

export async function queryPersona(id: any) {
  const persona = await query([`SELECT * FROM persona WHERE id=${id};`])
  // console.log('queryPersona: ', persona)
  return persona[0][0]
}

export async function showTables(): Promise<Array<string>> {
  const result = await query(['SHOW TABLES;'])
  return result[0] && Array.isArray(result[0]) ? result[0].map((obj: { Tables_in_intercom: string }) => obj['Tables_in_intercom']) : []
}

export async function createTable(tableName: string, columns: Array<string>) {
  try {
    console.log(`✍️  Creating ${tableName} table...`)
    const queryList = [`DROP TABLE IF EXISTS ${tableName};`, `CREATE TABLE ${tableName} (${columns}) CHARACTER SET "utf8mb4" ;`, 'SHOW TABLES;']
    const tables = await query(queryList)
    return tables
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function setUpTables() {
  const tables = await showTables()
  console.log(tables)

  if (!tables.includes('user')) {
    const fields = [
      'id VARCHAR(255) PRIMARY KEY',
      'name NVARCHAR(255)',
      'username NVARCHAR(255)',
      'email NVARCHAR(255)',
      'token NVARCHAR(255)',
      'session_count INT',
    ]
    await createTable('user', fields)
  }
  if (!tables.includes('user_news')) {
    await createTable('user_news', [
      'user_id VARCHAR(255) NOT NULL',
      'news_id VARCHAR(255) PRIMARY KEY'
    ])
  }
  if (!tables.includes('news')) {
    const fields = [
      'id VARCHAR(255) PRIMARY KEY',
      'author_id VARCHAR(255)',
      'author NVARCHAR(255)',
      'created_at DATETIME',
      'updated_at DATETIME',
      'title NVARCHAR(255)',
      'link VARCHAR(255)',
      'type VARCHAR(255)'
    ]
    await createTable('news', fields)
    // await query(['ALTER TABLE conversation CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'])
  }
  return 'Finished setting up tables'
}
