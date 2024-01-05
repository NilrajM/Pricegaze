import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from "../util";

export async function scrapeAmazonProduct(url: string){
    if(!url){
        return;
    }

    //Brightdata proxy configuration
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }

    try{
        const response = await axios.get(url, options);
        const $  = cheerio.load(response.data);

        //Extract the product title
        const title = $('#productTitle').text().trim();

        //Extract the current price of the product
        const currPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
        );

        //Extract the original price of the product
        const ogPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('.a-price'),
            $('priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        );

        //Extrack whether in stock or not
        const outOfStock = $('availability span').text().trim().toLowerCase() === 'currently unavailable';

        //Extract image of the product
        const prdImages = $('#imgBlkFront').attr('data-a-dynamic-image') ||
        $('#landingImage').attr('data-a-dynamic-image') || '{}';

        //Store the image urls keys in an array
        const imageUrls = Object.keys(JSON.parse(prdImages));
        
        //Extract the currency
        const currency = extractCurrency(
            $('.a-price-symbol')
        );

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g,"");

        const description = extractDescription($);
        // console.log(response.data); For testing purpose
        // console.log({title, currPrice, ogPrice, outOfStock, prdImages,imageUrls, currency, discountRate});

        const data = {
            url,
            currency: currency || "$",
            prdImage: imageUrls[0],
            title,
            currPrice: Number(currPrice) || Number(ogPrice),
            ogPrice: Number(ogPrice) || Number(currPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: 'category',
            reviewsCount: 100,
            stars:4.5,
            isOutOfStock: outOfStock,
            description,
            lowestPrice: Number(currPrice) || Number(ogPrice),
            highestPrice: Number(ogPrice) || Number(currPrice),
            averagePrice: Number(currPrice) || Number(ogPrice),
        }
        console.log(data)

        return data;

    }
    catch(err: any){
        throw new Error(`Failed tp scrape product: ${err.message}`);
    }
}