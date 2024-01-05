"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDb } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../util";

export async function scrapeAndStoreProduct(productUrl: string){
    if(!productUrl){
        return;
    }

    try{
        connectToDb();

        const scrapeProduct = await scrapeAmazonProduct(productUrl);

        if(!scrapeProduct){
            return;
        }

        let product = scrapeProduct;

        const existingProduct = await Product.findOne({url: scrapeProduct.url});

        if(existingProduct){
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                {price: scrapeProduct.currPrice}
            ]

            product = {
                ...scrapeProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory)
            }
        }

        const newProduct = await Product.findOneAndUpdate(
            {url: scrapeProduct.url},
            product,
            {upsert: true, new: true} 
        );
        console.log(newProduct);
        revalidatePath(`/products/${newProduct._id}`);
    }
    catch(err: any){
        throw new Error(`Failed to create/update the produt: ${err.message}`);
    }
}

export async function getProductById(productId: string){
    try{
        connectToDb();

        const product = await Product.findOne({_id: productId})

        if(!product){
            return null;
        }

        return product;
    }
    catch(err){

    }
}

export async function getAllProducts(){
    try{
        connectToDb();
        const products = Product.find();
        return products;
    }
    catch(err){
        console.log(err);
    }
}