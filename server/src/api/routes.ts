import { Router } from 'express'

import { getAppsApproved, getAppsPending, getAppsRejected, getAppsSubmitted, getDevsApproved, welcome } from './controllers'
// import { catchError } from '../lib/utils'

const router: Router = Router()

// Internal routes
router.get('/', welcome)

// App Approval routes
router.get('/apps_approved', getAppsApproved)
router.get('/apps_pending', getAppsPending)
router.get('/apps_rejected', getAppsRejected)
router.get('/apps_submitted', getAppsSubmitted)

// Developer Account Approval routes
router.get('/devs_approved', getDevsApproved)
// router.get('/apps_pending', getAppsPending)
// router.get('/apps_rejected', getAppsRejected)
// router.get('/apps_submitted', getAppsSubmitted)

export default router