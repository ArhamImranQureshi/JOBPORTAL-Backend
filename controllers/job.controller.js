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
       return res.status(201).json({
            message:"New Job Created",
            job,
            success:true
        })
    } catch(err){

    }
}
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
