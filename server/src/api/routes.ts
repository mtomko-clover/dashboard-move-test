import { Router } from 'express'

import { welcome } from './controllers'
// import { catchError } from '../lib/utils'

const router: Router = Router()

// Internal routes
router.get('/', welcome)


export default router