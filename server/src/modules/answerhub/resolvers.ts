import moment from 'moment'

import { AnswerHubResponse } from './types'
import { answerHubAPI, getPriorWeekDates } from '../../lib/utils'


export default {
  Query: {
    communityQuestions: async (_: any, { start, end }: any) => {
      try {
        const dateFormat = 'MM/DD/YY'
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, dateFormat)
        const startDate = moment(start).format(dateFormat)
        const endDate = moment(end).format(dateFormat)
        const thisWeek = await answerHubAPI.get(`/analytics/content.json?fromDate=${startDate}&toDate=${endDate}`)
        const priorWeek = await answerHubAPI.get(`/analytics/content.json?fromDate=${startPriorWeek}&toDate=${endPriorWeek}`)
        const value = thisWeek.data.actionsAnalytics.actions.reduce((acc: number | undefined, { count, type }: AnswerHubResponse) => (type === 'AskAction') ? (acc = count) : acc, null)
        const previous = priorWeek.data.actionsAnalytics.actions.reduce((acc: number | undefined, { count, type }: AnswerHubResponse) => (type === 'AskAction') ? (acc = count) : acc, null)
        console.log(value, previous)
        return { value, previous }
      } catch (e) {
        console.error(e)
        return { value: null, previous: null }
      }
    },
    communityAnswers: async (_: any, { start, end }: any) => {
      try {
        const dateFormat = 'MM/DD/YY'
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, dateFormat)
        const startDate = moment(start).format(dateFormat)
        const endDate = moment(end).format(dateFormat)
        const thisWeek = await answerHubAPI.get(`/analytics/content.json?fromDate=${startDate}&toDate=${endDate}`)
        const priorWeek = await answerHubAPI.get(`/analytics/content.json?fromDate=${startPriorWeek}&toDate=${endPriorWeek}`)
        const value = thisWeek.data.actionsAnalytics.actions.reduce((acc: number | undefined, { count, type }: AnswerHubResponse) => (type === 'AcceptNodeAction') ? (acc = count) : acc, null)
        const previous = priorWeek.data.actionsAnalytics.actions.reduce((acc: number | undefined, { count, type }: AnswerHubResponse) => (type === 'AcceptNodeAction') ? (acc = count) : acc, null)
        console.log(value, previous)
        return { value, previous }
      } catch (e) {
        console.error(e)
        return { value: null, previous: null }
      }
    }
  }
}