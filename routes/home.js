import { Router } from 'express'
const router = Router()
import { indexPage, docsPage } from '../controller/home.js'

router.get('/',indexPage)
router.get('/docs',docsPage)

export default router;