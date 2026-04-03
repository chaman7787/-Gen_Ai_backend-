const express = require('express');
const authMiddleware = require('../middleware/user.middleware.js');
const { generateInterviewReportController,getReportByIdController ,getAllReportsController,generateResumePdfController} = require('../Controllers/interview.controller.js');
const upload = require('../middleware/file.middleware.js');
const interviewRouter = express.Router();


/**
 * 2
    * @route POST /api/interview/generate
    * @desc Generate interview report
    * @access Private
 */

interviewRouter.post('/generate', authMiddleware, upload.single('resume'), generateInterviewReportController);

interviewRouter.get('/:interviewId', authMiddleware, getReportByIdController);

interviewRouter.get('/', authMiddleware, getAllReportsController);

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware, generateResumePdfController)

module.exports = interviewRouter;
