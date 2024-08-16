import {Company} from "../models/company.model.js"
export const registerCompany = async (req,res) =>{
    try {
        const {companyName} = req.body;
        if(!companyName){
            return res.status(400).jsom({
                message:"Company name is required",
                success:false
            });
        }
        let company = await Company.findOne({name:companyName});
        if(company){ // If company value is true, it means company already exist
            return res.status(400).json({
                message:"Company already exist, can't register same Company",
                success:false
            })
        }
        company = await Company.create({
            name: companyName,
            userId: req.id
        });
        
        return res.status(201).json({
            message:"Company is registered successfully",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCompany = async (req,res)=>{
    try {
        const userId = req.id; //logged in user
        const companies = await Company.find({userId}); //Give all the companies registered by the user
        if(!companies){
            return res.status(404).json({
                message:"Companies not found",
                success:false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCompanyById = async (req,res) =>{
    try {
        const companyId = req.params.id; //this will give company id
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(404).json({
                message:"Company not found",
                success:false
            })
        }
        return res.status(200).json({
            company,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateCompany = async (req,res) =>{
    try {
        const {name, description, website, location} = req.body;
        const file = req.file; // File will be requested from Cloudinary

        const updateData = {name, description, website, location};
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, {new:true});
        if(!company){
            res.status(404).json({
                message:"Company not found",
                success:false
            })
        }

        return res.status(200).json({
            messgae: "Company information updated",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}