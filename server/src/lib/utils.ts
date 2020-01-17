import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import moment from 'moment'


export const answerHubAPI = axios.create({
  baseURL: process.env.ANSWERHUB_URL,
  headers: {
    Authorization: `Basic ${process.env.ANSWERHUB_TOKEN}`
  }
})

export const jiraAPI = axios.create({
  baseURL: process.env.JIRA_URL,
  headers: {
    Authorization: `Basic ${process.env.JIRA_TOKEN}`
  }
})

export function getPriorWeekDates(start: string, end: string, dateFormat: string) {
  return {
    startPriorWeek: moment(start).subtract(1, 'week').format(dateFormat),
    endPriorWeek: moment(end).subtract(1, 'week').format(dateFormat)
  }
}

export function formatDate(epoch: number) {
  const date = new Date(epoch * 1000)

  function pad(number: number) {
    return number < 10 ? '0' + number : number
  }

  return `"${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}"`
}

export function catchError(fn?: any) {
  return (req?: Request, res?: Response, next?: NextFunction) => fn(req, res, next).catch(next)
}

interface IError extends Error {
  status: number
}

export function handleError(err: IError, _: Request, res: Response) {
  const errorDetails = {
    message: err.message,
    stack: err.stack || '',
    status: err.status
  }
  return res.status(err.status || 500).json(errorDetails)
}
