import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req._id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        messgage: "something is missing",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experience,
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//vvip
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query).populate("company");
    if (!jobs) {
      return res.status(404).json({
        message: "jobs not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "job found successfully",
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({
        message: "jobs not found",
        success: false,
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
  }
};

//NOW Router for admin no of jobs created

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req._id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
    });

    if (!jobs) {
      return res.status(404).json({
        message: "jobs not found",
        success: false,
      });
    }

    res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);

    if (!job) {
      res.status(404).json({
        success: false,
        message: " job not found",
      });
    }

    await Application.deleteMany({ job: jobId });
    await Job.findByIdAndDelete(jobId);
    res.status(200).json({
      success: true,
      message: "job deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
