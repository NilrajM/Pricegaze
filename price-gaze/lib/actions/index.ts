"use server"

import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl: string){
    if(!productUrl){
        return;
    }

    try{
        const scrapeProduct = await scrapeAmazonProduct(productUrl);

        if(!scrapeProduct){
            return;
        }


    }
    catch(err: any){
        throw new Error(`Failed to create/update the produt: ${err.message}`);
    }
}