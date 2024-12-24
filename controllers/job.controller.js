import { Job } from "../models/job.model";

export const postJob = (req,res)=>{
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
    } catch(err){

    }
}