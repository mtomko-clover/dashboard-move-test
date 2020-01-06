import axios from 'axios'
import * as dotenv from 'dotenv'
// import * as cors from 'cors'
// import * as express from 'express'
import { ApolloServer, gql } from 'apollo-server'
import * as moment from 'moment'

dotenv.config({ path: './.env' })

// import { handleError } from './lib/utils'

// type AnswerHubState = {
// 	AcceptNodeAction?: number;
// 	AnswerAction?: number;
// 	AskAction?: number;
// 	CloseNodeAction?: number;
// 	CommentAction?: number;
// 	DeleteAction?: number;
// }

type AnswerHubResponse = {
	type: string;
	verb?: string;
	count?: number;
}

const typeDefs = gql`
  type Metrics {
    value: Int
    previous: Int
  }

  type Query {
    appsApproved(start: String, end: String): Metrics
    appsPending: Metrics
    appsRejected(start: String, end: String): Metrics
    appsSubmitted(start: String, end: String): Metrics
    devsApproved(start: String, end: String): Metrics
    devsPending: Metrics
    devsRejected(start: String, end: String): Metrics
    devsSubmitted(start: String, end: String): Metrics
    communityQuestions(start: String, end: String): Metrics
    communityAnswers(start: String, end: String): Metrics
  }
`

const jira = axios.create({
  baseURL: process.env.JIRA_URL,
  headers: {
    Authorization: `Basic ${process.env.JIRA_TOKEN}`
  }
})

const answerHub = axios.create({
  baseURL: process.env.ANSWERHUB_URL,
  headers: {
    Authorization: `Basic ${process.env.ANSWERHUB_TOKEN}`
  }
})

function getPriorWeekDates(start: string, end: string, dateFormat: string) {
  return {
    startPriorWeek: moment(start).subtract(1, 'week').format(dateFormat),
    endPriorWeek: moment(end).subtract(1, 'week').format(dateFormat)
  }
}

const resolvers = {
  Query: {
    appsApproved: async (_: any, req: any) => {
      try {
        const { start, end } = req
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')
        
        const jql_1 = `project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Resolved%2CClose)%20AND%20resolution%20in%20(Approved%2CFixed%2CDone)%20AND%20resolutiondate%20>%3D%20${start}%20AND%20resolutiondate%20<%20${end}`
        const jql_2 = `project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Resolved%2CClose)%20AND%20resolution%20in%20(Approved%2CFixed%2CDone)%20AND%20resolutiondate%20>%3D%20${startPriorWeek}%20AND%20resolutiondate%20<%20${endPriorWeek}`
        const thisWeek = await jira.get(`/search?jql=${jql_1}`)
        const priorWeek = await jira.get(`/search?jql=${jql_2}`)
        
        console.log(start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
        return { value: thisWeek.data.total, previous: priorWeek.data.total }
      } catch (e) {
        console.log(e)
        return { value: null, previous: null }
      }
    },
    appsSubmitted: async (_: any, req: any) => {
      try {
        const { start, end } = req
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')
    
        const jql_1 = `project%3DDAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Open%2C"In%20Progress"%2CWaiting-For-Info%2CIn-Progress%2C"Needs%20Approval"%2C"In%20Review"%2C"In%20QA")%20AND%20created%20>%3D%20${start}%20AND%20created%20<%3D%20${end}`
        const jql_2 = `project%3DDAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Open%2C"In%20Progress"%2CWaiting-For-Info%2CIn-Progress%2C"Needs%20Approval"%2C"In%20Review"%2C"In%20QA")%20AND%20created%20>%3D%20${startPriorWeek}%20AND%20created%20<%3D%20${endPriorWeek}`
        const thisWeek = await jira.get(`/search?jql=${jql_1}`)
        const priorWeek = await jira.get(`/search?jql=${jql_2}`)
    
        console.log(start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
        return { value: thisWeek.data.total, previous: priorWeek.data.total }
      } catch (e) {
        console.log(e)
        return { value: null, previous: null }
      }
    },
    appsRejected: async (_: any, req: any) => {
      try {
        const { start, end } = req
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')
        
        
        const jql_1 = `project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Resolved%2CClose)%20AND%20resolution%20%3D%20Denied%20AND%20resolutiondate%20>%3D%20${start}%20AND%20resolutiondate%20<%20${end}`
        const jql_2 = `project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Resolved%2CClose)%20AND%20resolution%20%3D%20Denied%20AND%20resolutiondate%20>%3D%20${startPriorWeek}%20AND%20resolutiondate%20<%20${endPriorWeek}`
        const thisWeek = await jira.get(`/search?jql=${jql_1}`)
        const priorWeek = await jira.get(`/search?jql=${jql_2}`)
        
        console.log(start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
        return { value: thisWeek.data.total, previous: priorWeek.data.total }
      } catch (e) {
        console.log(e)
        return { value: null, previous: null }
      }
    },
    appsPending: async () => {
      try {
        const jql = 'project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Open%2C"In%20Progress"%2CWaiting-For-Info%2CIn-Progress%2C"Needs%20Approval"%2C"In%20Review"%2C"In%20QA")'
        const response = await jira.get(`/search?jql=${jql}`)
        const { total } = response.data
        
        return { value: total }
      } catch (e) {
        console.log(e)
        return { value: null, previous: null }
      }
    },
    devsApproved: async (_: any, req: any) => {
      try {
        const { start, end } = req
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')
        
        // Uses 'updatedDate' instead of 'resolutiondate'
        const jql_1 = `project%20%3D%20DAV%20AND%20status%20in%20("Done"%2CApproved)%20AND%20updatedDate%20>%3D%20${start}%20AND%20updatedDate%20<%3D%20${end}`
        const jql_2 = `project%20%3D%20DAV%20AND%20status%20in%20("Done"%2CApproved)%20AND%20updatedDate%20>%3D%20${startPriorWeek}%20AND%20updatedDate%20<%3D%20${endPriorWeek}`
        const thisWeek = await jira.get(`/search?jql=${jql_1}`)
        const priorWeek = await jira.get(`/search?jql=${jql_2}`)
        
        console.log('devsApproved', start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
        return { value: thisWeek.data.total, previous: priorWeek.data.total }
      } catch (e) {
        console.log(e)
        return { value: null, previous: null }
      }
    },
    devsSubmitted: async (_: any, req: any) => {
      try {
        const { start, end } = req
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')
    
        const jql_1 = `project%3DDAV%20AND%20createdDate%20>%3D%20${start}%20AND%20createdDate%20<%3D%20${end}`
        const jql_2 = `project%3DDAV%20AND%20createdDate%20>%3D%20${startPriorWeek}%20AND%20createdDate%20<%3D%20${endPriorWeek}`
        const thisWeek = await jira.get(`/search?jql=${jql_1}`)
        const priorWeek = await jira.get(`/search?jql=${jql_2}`)
    
        console.log('devsSubmitted', start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
        return { value: thisWeek.data.total, previous: priorWeek.data.total }
      } catch (e) {
        console.log(e)
        return { value: null, previous: null }
      }
    },
    devsRejected: async (_: any, req: any) => {
      try {
        const { start, end } = req
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')
        
        const jql_1 = `project%20%3D%20DAV%20AND%20status%20in%20(Denied)%20AND%20updatedDate%20>%3D%20${start}%20AND%20updatedDate%20<%3D%20${end}`
        const jql_2 = `project%20%3D%20DAV%20AND%20status%20in%20(Denied)%20AND%20updatedDate%20>%3D%20${startPriorWeek}%20AND%20updatedDate%20<%3D%20${endPriorWeek}`
        const thisWeek = await jira.get(`/search?jql=${jql_1}`)
        const priorWeek = await jira.get(`/search?jql=${jql_2}`)
        
        console.log('devsRejected', start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
        return { value: thisWeek.data.total, previous: priorWeek.data.total }
      } catch (e) {
        console.log(e)
        return { value: null, previous: null }
      }
    },
    devsPending: async () => {
      try {
        const jql = 'project%20%3D%20DAV%20AND%20status%20in%20("Open"%2C"Credit"%2C"OFAC"%2C"To%20Do"%2C"In%20Progress")'
        const response = await jira.get(`/search?jql=${jql}`)
        const { total } = response.data
        
        return { value: total }
      } catch (e) {
        console.log('devsPending', e)
        return { value: null, previous: null }
      }
    },
    communityQuestions: async (_: any, { start, end }: any) => {
      try {
        const dateFormat = 'MM/DD/YY'
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, dateFormat)
        const startDate = moment(start).format(dateFormat)
        const endDate = moment(end).format(dateFormat)
        const thisWeek = await answerHub.get(`/analytics/content.json?fromDate=${startDate}&toDate=${endDate}`)
        const priorWeek = await answerHub.get(`/analytics/content.json?fromDate=${startPriorWeek}&toDate=${endPriorWeek}`)
        const value = thisWeek.data.actionsAnalytics.actions.reduce((acc: number | undefined, { count, type }: AnswerHubResponse) => (type === 'AskAction') ? (acc = count) : acc, null)
        const previous = priorWeek.data.actionsAnalytics.actions.reduce((acc: number | undefined, { count, type }: AnswerHubResponse) => (type === 'AskAction') ? (acc = count) : acc, null)
        console.log(value, previous)
        return { value, previous }
      } catch (e) {
        console.log(e)
        return { value: null, previous: null }
      }
    },
    communityAnswers: async (_: any, { start, end }: any) => {
      try {
        const dateFormat = 'MM/DD/YY'
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, dateFormat)
        const startDate = moment(start).format(dateFormat)
        const endDate = moment(end).format(dateFormat)
        const thisWeek = await answerHub.get(`/analytics/content.json?fromDate=${startDate}&toDate=${endDate}`)
        const priorWeek = await answerHub.get(`/analytics/content.json?fromDate=${startPriorWeek}&toDate=${endPriorWeek}`)
        const value = thisWeek.data.actionsAnalytics.actions.reduce((acc: number | undefined, { count, type }: AnswerHubResponse) => (type === 'AcceptNodeAction') ? (acc = count) : acc, null)
        const previous = priorWeek.data.actionsAnalytics.actions.reduce((acc: number | undefined, { count, type }: AnswerHubResponse) => (type === 'AcceptNodeAction') ? (acc = count) : acc, null)
        console.log(value, previous)
        return { value, previous }
      } catch (e) {
        console.log(e)
        return { value: null, previous: null }
      }
    },
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => console.log(`🤖 Server ready at ${url}`))

// const { PORT } = process.env
// const app: express.Application = express()

// app
//   .use(cors())
//   .use('/api', require('./api'))
//   // .use(handleError)
//   .listen(PORT, () => console.log(`🤖 Server is listening on port ${PORT} in ${app.get('env')} mode`))