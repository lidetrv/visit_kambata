import { z } from 'zod';

export const CreatePostSchema = z.object({
    title: z
    .string()
    .min(5,{message: 'Title is Required.'})
    .max(150,{message: 'Title can not exceed 150 charachters'}),
    
    subTitle: z
    .string()
    .min(5,{message: 'Sub title is Required.'})
    .max(100,{message: 'Title can not exceed 100 charachters'}),
    
    miniSubTitle: z
    .string()
    .min(5,{message: 'mini subtitle is Required.'})
    .max(60,{message: 'Title can not exceed 60 charachters'}),

    // 🌟 ADDED LOCATION FIELD
    location: z
    .string()
    .min(1,{message: 'Location is required.'})
    .max(100,{message: 'Location can not exceed 100 characters.'}),

    content: z
    .string()
    .min(1,{message: 'Body is required'}),

    tags: z.array(
        z.string()
        .min(1,{message: 'Tag is required'})
        .max(30,{message: 'Tag can not exceed 30 characters.'})
    ).min(1,{message: 'At least one tag is required!'})
    .max(4,{message:'Cannot add more than 4 tags.'})
});