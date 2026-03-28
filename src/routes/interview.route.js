const express = require('express');
const authMiddleware = require('../middleware/user.middleware.js');
const { generateInterviewReportController,getReportByIdController } = require('../Controllers/interview.controller.js');
const upload = require('../middleware/file.middleware.js');

const interviewRouter = express.Router();


/**
 * 
    * @route POST /api/interview/generate
    * @desc Generate interview report
    * @access Private
 */

interviewRouter.post('/generate', authMiddleware, upload.single('resume'), generateInterviewReportController);

interviewRouter.get('/:interviewId', authMiddleware, getReportByIdController);

module.exports = interviewRouter;
