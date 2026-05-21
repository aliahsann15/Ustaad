import { Router } from 'express';
import { upload } from '../middleware/upload';
import { transcribeAudio } from '../controllers/transcribeController';

const router = Router();

router.post('/', upload.single('audio'), transcribeAudio);

export default router;
