import { query } from '../../db/fns'

const announcements =  async () => {
        const response = await query(['SELECT * FROM announcements;']);
        console.log('fetchAnnouncementItems: ', response[0]);
        return response[0]
};

const createAnnouncement = async (_: any, args: any) => {
    try {
        // date: String, text: String, is_urgent: Boolean, username: String
        const { text, is_urgent, username } = args;
        console.log('createAnnouncement: ', text, is_urgent, username);

        const fields = [`"${text}"`, `${is_urgent}`, `"${username}"`];
        const response = await query([
            `INSERT INTO announcements (text, is_urgent, author) VALUES (${fields.join(',')});`,
            'COMMIT;',
        ]);
        console.log('createAnnouncement response: ', response);
        // TO-DO: add to user_news table too
        return { message: 'success!' }
    } catch ({ message }) {
        console.error(message);
        return { message }
    }
};

export default {
  Query: {
    announcements
  },
  Mutation: {
    createAnnouncement
  }
}
