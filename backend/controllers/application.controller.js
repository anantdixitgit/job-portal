import { application } from "express";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const applicantId = req._id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: "false",
      });
    }
    // console.log("applicantId:", applicantId);
    // console.log("jobId:", jobId);
    //check if the user already applied for the job
    const isApplicantPresent = await Application.findOne({
      job: jobId,
      applicant: applicantId,
    });
    console.log(isApplicantPresent);

    if (isApplicantPresent) {
      return res.status(400).json({
        message: "you already applied for this jobs",
        success: false,
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({
        message: "job not found",
        success: false,
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: applicantId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "job applied successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const applicantId = req._id;

    const application = await Application.find({ applicant: applicantId })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });

    if (!application) {
      return res.status(404).json({
        message: "no applied job",
        success: false,
      });
    }

    return res.status(200).json({
      message: "applied job are",
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//for admin to see how many user applied the jobs
export const getAllApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
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
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    //find application by application id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "status updated successfully",
      success: "true",
    });
  } catch (error) {
    console.log(error);
  }
};
