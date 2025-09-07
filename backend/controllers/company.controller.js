import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "you cant register company with same name",
        success: false,
      });
    }

    company = await Company.create({
      name: companyName,
      userId: req._id,
    });

    return res.status(201).json({
      message: "company registed successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req._id;
    const companies = await Company.find({ userId });
    if (!companies.length) {
      return res.status(404).json({
        message: "No company registerd by you",
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompanyId = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const file = req.file;

    let cloudResponse;
    if (file) {
      cloudResponse = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: "company",
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
      });
      fs.unlinkSync(file.path);
    }

    //cloudinay

    const updateData = {
      name,
      description,
      website,
      location,
      logo: cloudResponse?.secure_url,
    };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(400).json({
        messagae: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "company information updated",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
