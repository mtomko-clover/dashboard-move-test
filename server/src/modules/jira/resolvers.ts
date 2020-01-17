import { getPriorWeekDates, jiraAPI } from '../../lib/utils'


export default {
  Query: {
    appsApproved: async (_: any, req: any) => {
      try {
        const { start, end } = req
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')

        const jql_1 = `project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Resolved%2CClose)%20AND%20resolution%20in%20(Approved%2CFixed%2CDone)%20AND%20resolutiondate%20>%3D%20${start}%20AND%20resolutiondate%20<%20${end}`
        const jql_2 = `project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Resolved%2CClose)%20AND%20resolution%20in%20(Approved%2CFixed%2CDone)%20AND%20resolutiondate%20>%3D%20${startPriorWeek}%20AND%20resolutiondate%20<%20${endPriorWeek}`
        const thisWeek = await jiraAPI.get(`/search?jql=${jql_1}`)
        const priorWeek = await jiraAPI.get(`/search?jql=${jql_2}`)

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
        const thisWeek = await jiraAPI.get(`/search?jql=${jql_1}`)
        const priorWeek = await jiraAPI.get(`/search?jql=${jql_2}`)

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
        const thisWeek = await jiraAPI.get(`/search?jql=${jql_1}`)
        const priorWeek = await jiraAPI.get(`/search?jql=${jql_2}`)

        console.log(start, end, startPriorWeek, endPriorWeek, thisWeek.data.total, priorWeek.data.total)
        return { value: thisWeek.data.total, previous: priorWeek.data.total }
      } catch (e) {
        console.error(e)
        return { value: null, previous: null }
      }
    },
    appsPending: async (_: any, { end }: any) => {
      try {
          console.log('appsPending: ', end)
        const jql = `project%20%3D%20DAA%20AND%20summary%20!~%20QA%20AND%20status%20in%20(Open%2C"In%20Progress"%2CWaiting-For-Info%2CIn-Progress%2C"Needs%20Approval"%2C"In%20Review"%2C"In%20QA")%20AND%20createdDate%20<%3D%20${end}`
        const response = await jiraAPI.get(`/search?jql=${jql}`)
        const { total } = response.data

        return { value: total }
      } catch (e) {
        console.error(e)
        return { value: null }
      }
    },
    devsApproved: async (_: any, req: any) => {
      try {
        const { start, end } = req
        const { startPriorWeek, endPriorWeek } = getPriorWeekDates(start, end, 'YYYY-MM-DD')

        // Uses 'updatedDate' instead of 'resolutiondate'
        const jql_1 = `project%20%3D%20DAV%20AND%20status%20in%20("Done"%2CApproved)%20AND%20updatedDate%20>%3D%20${start}%20AND%20updatedDate%20<%3D%20${end}`
        const jql_2 = `project%20%3D%20DAV%20AND%20status%20in%20("Done"%2CApproved)%20AND%20updatedDate%20>%3D%20${startPriorWeek}%20AND%20updatedDate%20<%3D%20${endPriorWeek}`
        const thisWeek = await jiraAPI.get(`/search?jql=${jql_1}`)
        const priorWeek = await jiraAPI.get(`/search?jql=${jql_2}`)
        
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
        const thisWeek = await jiraAPI.get(`/search?jql=${jql_1}`)
        const priorWeek = await jiraAPI.get(`/search?jql=${jql_2}`)

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
        const thisWeek = await jiraAPI.get(`/search?jql=${jql_1}`)
        const priorWeek = await jiraAPI.get(`/search?jql=${jql_2}`)

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
        const response = await jiraAPI.get(`/search?jql=${jql}`)
        const { total } = response.data

        return { value: total }
      } catch (e) {
        console.log('devsPending', e)
        return { value: null, previous: null }
      }
    },
  }
}