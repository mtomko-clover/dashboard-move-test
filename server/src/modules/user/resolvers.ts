import axios from 'axios'


const internal = async (postData: any, env: any) => {
  try {
    const response = await axios({
      method: 'post',
      url: `https://${env}/cos/v1/dashboard/internal/login`,
      headers: { 'Preferred-Auth': 'internal' },
      data: postData,
      withCredentials: true,
    })
    if (response.headers['set-cookie']) {
      const cookies = response.headers['set-cookie'][0]
      const [internalSessionId] = cookies.split(';')
      return internalSessionId.substring(16, internalSessionId.length)
    }
    return false
  } catch (err) {
    return err.response.data
  }
}

const setCookie = (res: any, key: any, id: any) => {
  res.cookie(key, id, { maxAge: 3600000 });
  // res.set('cookie', cookieValue);
}

const login = async (_: any, args: any, ctx: any) => {
  const { username, password, environment } = args
  const data = { username, password }
  if (username && password) {
      const sessionId = await internal(data, environment.environment)
      if (sessionId instanceof Object) {
          console.log(sessionId)
          return { sessionId: sessionId.message }
      } else if (sessionId) {
          setCookie(ctx.res, "sessionId", sessionId)
          return { sessionId }
      }
  }
  return { sessionId: 'Missing params' }
}

export default {
  Mutation: {
    login
  }
}
