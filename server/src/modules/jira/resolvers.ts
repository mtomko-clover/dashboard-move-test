import { getPriorWeekDates, jiraAPI } from '../../lib/utils'
import { query } from '../../db/fns'


export default {
  Query: {
    appsApproved: async (_: any, { start, end }: any) => {
      try {
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')

        const [current] = await query([`SELECT SUM(approved) FROM app_approvals WHERE date >= "${start}" AND date <= "${end}";`])
        const [prior] = await query([`SELECT SUM(approved) FROM app_approvals WHERE date >= "${startPriorWeek}" AND date <= "${endPriorWeek}";`])
        console.log(start, end, current[0]['SUM(approved)'], prior[0]['SUM(approved)'])

        return { value: current[0]['SUM(approved)'], previous: prior[0]['SUM(approved)'] }
      } catch (e) {
        console.log('appsApproved: ', e)
        return { value: null, previous: null }
      }
    },
    appsSubmitted: async (_: any, { start, end }: any) => {
      try {
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')

        const [current] = await query([`SELECT SUM(submitted) FROM app_approvals WHERE date >= "${start}" AND date <= "${end}";`])
        const [prior] = await query([`SELECT SUM(submitted) FROM app_approvals WHERE date >= "${startPriorWeek}" AND date <= "${endPriorWeek}";`])
        console.log(start, end, current[0]['SUM(submitted)'], prior[0]['SUM(submitted)'])

        return { value: current[0]['SUM(submitted)'], previous: prior[0]['SUM(submitted)'] }
      } catch (e) {
        console.log('appsSubmitted: ', e)
        return { value: null, previous: null }
      }
    },
    appsRejected: async (_: any, { start, end }: any) => {
      try {
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')

        const [current] = await query([`SELECT SUM(rejected) FROM app_approvals WHERE date >= "${start}" AND date <= "${end}";`])
        const [prior] = await query([`SELECT SUM(rejected) FROM app_approvals WHERE date >= "${startPriorWeek}" AND date <= "${endPriorWeek}";`])
        console.log(start, end, current[0]['SUM(rejected)'], prior[0]['SUM(rejected)'])

        return { value: current[0]['SUM(rejected)'], previous: prior[0]['SUM(rejected)'] }
      } catch (e) {
        console.error('appsRejected', e)
        return { value: null, previous: null }
      }
    },
    appsPending: async (_: any, { start }: any) => {
      try {

        const [current] = await query([`SELECT pending FROM app_approvals WHERE date = "${start}";`])
        console.log(start, current[0]['pending'])

        return { value: current[0]['pending'] }
      } catch (e) {
        console.error(e)
        return { value: null }
      }
    },
    devsApproved: async (_: any, { start, end }: any) => {
      try {
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')

        // Uses 'updatedDate' instead of 'resolutiondate'
        const jql_1 = `project%20%3D%20DAV%20AND%20status%20in%20("Done"%2CApproved)%20AND%20updatedDate%20>%3D%20${start}%20AND%20updatedDate%20<%3D%20${end}`
        const jql_2 = `project%20%3D%20DAV%20AND%20status%20in%20("Done"%2CApproved)%20AND%20updatedDate%20>%3D%20${startPriorWeek}%20AND%20updatedDate%20<%3D%20${endPriorWeek}`
        const thisWeek = await jiraAPI.get(`/search?jql=${jql_1}`)
        const priorWeek = await jiraAPI.get(`/search?jql=${jql_2}`)
        
        console.log('devsApproved', start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
        return { value: thisWeek.data.total, previous: priorWeek.data.total }
      } catch (e) {
        console.error('devsApproved: ', e)
        return { value: null, previous: null }
      }
    },
    devsSubmitted: async (_: any, { start, end }: any) => {
      try {
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')

        const jql_1 = `project%3DDAV%20AND%20createdDate%20>%3D%20${start}%20AND%20createdDate%20<%3D%20${end}`
        const jql_2 = `project%3DDAV%20AND%20createdDate%20>%3D%20${startPriorWeek}%20AND%20createdDate%20<%3D%20${endPriorWeek}`
        const thisWeek = await jiraAPI.get(`/search?jql=${jql_1}`)
        const priorWeek = await jiraAPI.get(`/search?jql=${jql_2}`)

        console.log('devsSubmitted', start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
        return { value: thisWeek.data.total, previous: priorWeek.data.total }
      } catch (e) {
        console.error('devsSubmitted:', e)
        return { value: null, previous: null }
      }
    },
    devsRejected: async (_: any, { start, end }: any) => {
      try {
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')

        const jql_1 = `project%20%3D%20DAV%20AND%20status%20in%20(Denied)%20AND%20updatedDate%20>%3D%20${start}%20AND%20updatedDate%20<%3D%20${end}`
        const jql_2 = `project%20%3D%20DAV%20AND%20status%20in%20(Denied)%20AND%20updatedDate%20>%3D%20${startPriorWeek}%20AND%20updatedDate%20<%3D%20${endPriorWeek}`
        const thisWeek = await jiraAPI.get(`/search?jql=${jql_1}`)
        const priorWeek = await jiraAPI.get(`/search?jql=${jql_2}`)

        console.log('devsRejected', start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
        return { value: thisWeek.data.total, previous: priorWeek.data.total }
      } catch (e) {
        console.error('devsRejected:', e)
        return { value: null, previous: null }
      }
    },
    devsPending: async () => {
      try {
        const jql = 'project%20%3D%20DAV%20AND%20status%20in%20("Open"%2C"Credit"%2C"OFAC"%2C"To%20Do"%2C"In%20Progress")'
        const response = await jiraAPI.get(`/search?jql=${jql}`)
        const { total } = response.data

        return { value: total }
      } catch (e) {
        console.error('devsPending: ', e)
        return { value: null, previous: null }
      }
    },
    jiraStats: async (_: any, { start, end }: any) => {
        try {
            const [current] = await query([`SELECT * FROM app_approvals WHERE date >= "${start}" AND date <= "${end}";`])
            console.log('jiraStats: ', start, end, current)

            return current
        } catch (e) {
            console.error('jiraStats: ', e)
            return { value: null, previous: null }
        }
    }
  }
}