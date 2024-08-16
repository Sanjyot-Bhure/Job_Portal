import { Job } from "../models/job.model.js";
import {Company} from "../models/company.model.js"

//Job post by admin
export const postJob = async (req,res) =>{
    try {
        const {title, description, requirements, salary, location, jobType, experience, position, companyId} = req.body;
        const userId = req.id;
        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            })
        }
        // const company1 = await Company.findOne({_id:companyId});//company chi userId;
        // const userId = company1.userId;
        // console.log(userId);
        const job = await Job.create({
            title,
            description, 
            requirements: requirements.split(","), 
            salary: Number(salary), 
            location, 
            jobType, 
            experienceLevel: experience, 
            position,
            company:companyId,
            created_By:userId
        })

        return res.status(201).json({
            message:"New job created successfully",
            job,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}

//Find job for students
export const getAllJobs = async(req,res)=>{
    try {
        const keyword = req.query.keyword || ""; //query for filtering?
        const query = {
            $or: [
                {title:{$regex:keyword, $options:"i"}}, //make the keyword to search case insensitive
                {description:{$regex:keyword, $options:"i"}},
            ]
        };
        const jobs = await Job.find(query).populate({
            path:"company"
        }); // by just using query u can't get data. It'll be just id. So to get the data in of company, you need to use populate for companyId and userId   
        if(!jobs){
            return res.status(404).json({
                message:"Jobs not found.",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}   

//Find job for students
export const getJobById = async(req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message:"Job not found.",
                success:false
            })
        };

        return res.status(200).json({
            job,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

//total jobs created by admin till now
export const getAdminJobs = async (req,res)=>{
    try {
        const adminId= req.id;
        console.log(adminId);
        const jobs = await Job.find({created_by:adminId});
        if(!jobs){
            res.status(404).json({
                message:"Job not found.",
                success:false
            })
        }
        res.status(200).json({
            jobs,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}