import { Job } from "../models/job.model";

export const postJob = (req,res)=>{
    try{
        const {title,description,requirements,salary,location,jobType,exprerienceLevel,position,companyId}=req.body;
        const userId=req.id;
        if(!title || !description || !requirements || !salary || !location || !jobType || !exprerienceLevel || !position || !companyId){
            return res.status(400).json({
                message:"All fields are required",
                success:false,
            });
        }
        const job = Job.create({
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            exprerienceLevel,
            position,
            company:companyId,
            created_by:userId,
        })
    } catch(err){

    }
}