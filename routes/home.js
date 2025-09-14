import { Router } from 'express'
const router = Router()
import { indexPage, docsPage } from '../controller/home'

router.get('/',indexPage)
router.get('/docs',docsPage)

export default router;