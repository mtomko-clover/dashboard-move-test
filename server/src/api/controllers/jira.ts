import axios from 'axios'
import { Request, Response } from 'express'
import moment from 'moment'


const instance = axios.create({
  baseURL: process.env.JIRA_URL,
  headers: {
    Authorization: `Basic ${process.env.JIRA_TOKEN}`
  }
})

function getPriorWeekDates(start: string, end: 'string') {
  const dateFormat = 'YYYY-MM-DD'
  return {
    startPriorWeek: moment(start).subtract(1, 'week').format(dateFormat),
    endPriorWeek: moment(end).subtract(1, 'week').format(dateFormat)
  }
}

/**
 * GET /api/apps_approved
 * Gets the specified week's number of apps approved.
 */
export const getAppsApproved = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query
    const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end)

    const jql_1 = `project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Resolved%2CClose)%20AND%20resolution%20in%20(Approved%2CFixed%2CDone)%20AND%20resolutiondate%20>%3D%20${start}%20AND%20resolutiondate%20<%20${end}`
    const jql_2 = `project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Resolved%2CClose)%20AND%20resolution%20in%20(Approved%2CFixed%2CDone)%20AND%20resolutiondate%20>%3D%20${startPriorWeek}%20AND%20resolutiondate%20<%20${endPriorWeek}`
    const thisWeek = await instance.get(`/search?jql=${jql_1}`)
    const priorWeek = await instance.get(`/search?jql=${jql_2}`)

    console.log(start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
    res.json({ thisWeek: thisWeek.data.total, priorWeek: priorWeek.data.total })
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

/**
 * GET /api/apps_submitted
 * Gets the specified week's number of apps submitted.
 */
export const getAppsSubmitted = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query
    const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end)

    const jql_1 = `project%3DDAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Open%2C"In%20Progress"%2CWaiting-For-Info%2CIn-Progress%2C"Needs%20Approval"%2C"In%20Review"%2C"In%20QA")%20AND%20created%20>%3D%20${start}%20AND%20created%20<%3D%20${end}`
    const jql_2 = `project%3DDAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Open%2C"In%20Progress"%2CWaiting-For-Info%2CIn-Progress%2C"Needs%20Approval"%2C"In%20Review"%2C"In%20QA")%20AND%20created%20>%3D%20${startPriorWeek}%20AND%20created%20<%3D%20${endPriorWeek}`
    const thisWeek = await instance.get(`/search?jql=${jql_1}`)
    const priorWeek = await instance.get(`/search?jql=${jql_2}`)

    console.log(start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
    res.json({ thisWeek: thisWeek.data.total, priorWeek: priorWeek.data.total })
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

/**
 * GET /api/apps_rejected
 * Gets the specified week's number of rejected apps.
 */
export const getAppsRejected = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query
    const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end)

    const jql_1 = `project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Resolved%2CClose)%20AND%20resolution%20%3D%20Denied%20AND%20resolutiondate%20>%3D%20${start}%20AND%20resolutiondate%20<%20${end}`
    const jql_2 = `project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Resolved%2CClose)%20AND%20resolution%20%3D%20Denied%20AND%20resolutiondate%20>%3D%20${startPriorWeek}%20AND%20resolutiondate%20<%20${endPriorWeek}`
    const thisWeek = await instance.get(`/search?jql=${jql_1}`)
    const priorWeek = await instance.get(`/search?jql=${jql_2}`)

    console.log(start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
    res.json({ thisWeek: thisWeek.data.total, priorWeek: priorWeek.data.total })
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

/**
 * GET /api/apps_pending
 * Gets the total number of apps pending approval.
 */
export const getAppsPending = async (_: Request, res: Response) => {
  try {
    const jql = 'project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Open%2C"In%20Progress"%2CWaiting-For-Info%2CIn-Progress%2C"Needs%20Approval"%2C"In%20Review"%2C"In%20QA")'
    const response = await instance.get(`/search?jql=${jql}`)
    const { total } = response.data
    res.json({ total })
 } catch (error) {
    console.log(error)
    res.json(error)
  }
}

/**
 * GET /api/devs_approved
 * Gets the total number of apps pending approval.
 */
export const getDevsApproved = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query
    const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end)

    const jql_1 = `project%20%3D%20DAV%20AND%20status%20in%20("Approved"%2C"Done")%20AND%20updatedDate%20>%3D%20${start}%20AND%20updatedDate%20<%3D%20%20${end}`
    const thisWeek = await instance.get(`/search?jql=${jql_1}`)
    const jql_2 = `project%20%3D%20DAV%20AND%20status%20in%20("Approved"%2C"Done")%20AND%20updatedDate%20>%3D%20${startPriorWeek}%20AND%20updatedDate%20<%3D%20%20${endPriorWeek}`
    const priorWeek = await instance.get(`/search?jql=${jql_2}`)

    console.log(start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
    res.json({ thisWeek: thisWeek.data.total, priorWeek: priorWeek.data.total })
 } catch (error) {
    console.log(error)
    res.json(error)
  }
}
 