import { query } from '../../db/fns'


const news = async () => {
  const response = await query(['SELECT * FROM news;'])
  console.log('fetchNewsItems: ', response[0])
  return response[0]
};

const addNews = async (_: any, args: any) => {
  try {
    const { date, title, description, type, username } = args
    console.log('updateNewsItem: ', date, title, description, type, username)

    const fields = [`"${date}"`, `"${title}"`, `"${description}"`, `"${type}"`, `"${username}"`]  
    const response = await query([
      `INSERT INTO news (created_at, title, description, type, author) VALUES (${fields.join(',')});`,
      'COMMIT;',
    ]);
    console.log('updateNewsItem response: ', response)
    // TO-DO: add to user_news table too
    return { message: 'success!' }
  } catch ({ message }) {
    console.error(message)
    return { message }
  }
};




export default {
  Query: {
    news
  },
  Mutation: {
    addNews
  }
}
