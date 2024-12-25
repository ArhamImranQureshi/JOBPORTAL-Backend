import { Job } from "../models/job.model";

export const postJob =async (req,res)=>{
    try{
        const {title,description,requirements,salary,location,jobType,experience,position,companyId}=req.body;
        const userId=req.id;
        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({
                message:"All fields are required",
                success:false,
            });
        }
        const job = Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            exprerienceLevel: experience,
            position,
            company:companyId,
            created_by:userId,
        })
       return res.status(201).json({
            message:"New Job Created",
            job,
            success:true
        })
    } catch(err){

    }
}
//admin 
export const getAllJobs = async( req,res)=>{
    try{
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                {title:{ $regex:keyword,$options:"i"}},
                {description:{ $regex:keyword,$options:"i"}}          
            ]
        };
        const jobs= await Job.find(query);
        if(!jobs){
            return res.status(404).json({
                message:"Jobs not Found",
                success:false
            })
        }
        return res.status(200).json({
            jobs,
            success:true
        })
    }catch(err){
        console.log(err)
    }
}

/// students, applicants, candidates
export const getJobById = async(req,res)=>{
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:true
            })
        }
        return res.status(200).json({
            job,success:true
        })
    }catch(err){
        console.log(err)
    }
}
// how much admin has created the jobs
export const getAdminJobs = async(req,res)=>{
    try{
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId});
        if(!jobs){
            return res.status(404).json({
                message:"Jobs not found",
                success: true
            })
        }
        return res.status(200).json({
            jobs,
            success:true
        })
    }catch(err){
        console.log(err);
    }
}