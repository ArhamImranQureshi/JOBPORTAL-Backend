import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: true,
      });
    }
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id);
    await job.save();
    return res.status(201).json({
      message: "Applied successfully",
      sucess: true,
    });
  } catch (err) {}
};

//// kitni job mein apply kiya hai user ne
export const getAppliedJob = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        job: {
          path: "job",
          options: {
            sort: { createdAt: -1 },
          },
          populate: {
            path: "company",
            options: {
              sort: { createdAt: -1 },
            },
          },
        },
      });
    if (!application) {
      return res.status(404).json({
        message: "No applications found",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      sucess: true,
    });
  } catch (err) {
    console.log(err);
  }
};

////// kitne bndo mein apply kiya wa hai job ke lie
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: {
        sort: { cretedAt: -1 },
      },
      populate: {
        path: "applicant",
        options: {
          sort: { createdAt: -1 },
        },
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      sucess: true,
    });
  } catch (err) {
    console.log(err);
  }
};
export const updateStatus = async (req, res) => {
  const { status } = req.body;
  const applicationId = req.params.id;
  if (!status) {
    return res.status(400).json({
      message: "Status is required",
      sucess: false,
    });
  }

  const application = await Application.findOne({_id:applicationId});
  if (!application) {
    return res.status(404).json({
      message: "Application not found",
      sucess: false,
    });
  }
  application.status = status.toLowerCase();
  await application.save();

  return res.status(200).json({
    message: "Status updated successfully",
    sucess: true,
  });
};
