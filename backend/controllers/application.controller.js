import {Application} from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req,res)=>{
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:"Job Id is required.",
                success:false
            })
        };
        // check if the user has already applied for the job    
        const existingApplication = await Application.findOne({job:jobId, applicant:userId});
        if(existingApplication){
            return res.status(400).json({
                message:"You have already applied for this Job.",
                success:false,
            })
        };

        //chech the job exist
        const job = await Job.findById(jobId)
        if(!job){
            return res.status(404).json({
                message:"Job not found.",
                success:false
            })
        };

        //create new application
        const newApplication = await Application.create({
            job:jobId,
            applicant: userId
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

export const getAppliedJob = async(req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        // let ans = await Application.find({applicant:userId});
        // console.log(ans);
        // console.log("application :" , application);
        if(!application){
            return res.status(404).json({
                messaage:"No Application",
                success: false
            })
        };

        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getApplicants = async(req,res)=>{
    try {
        const jobId = req.params.id; // can be written as "const {id} = req.params;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });

        if(!job){
            return res.status(404).json({
                messaage:"Job not found.",
                success:false
            })
        };

        return res.status(200).json({
            job,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateStatus = async(req,res) =>{
    try {
        const {status} = req.body;
        const applicantionId = req.params.id;

        if(!status){
            return res.status(400).json({
                messaage:"status is required",
                success: false
            })
        }

        const application = await Application.findOne({_id:applicantionId});
        if(!application){
            return res.status(404).json({
                message:"Application not found",
                success:false
            })
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            messaage:"Status updated successfully",
            success:true
        });
    } catch (error) {
        console.log(error)
    }
}