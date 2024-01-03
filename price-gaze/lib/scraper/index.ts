import axios from "axios";
import * as cheerio from 'cheerio';
import { extractPrice } from "../util";

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
        const currPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
        );

        const ogPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('.a-price'),
            $('priceblock_dealprice'),
            $('.a-size-base.a-color-price')

        )
        // console.log(response.data); For testing purpose
        console.log({title, currPrice, ogPrice});

    }
    catch(err: any){
        throw new Error(`Failed tp scrape product: ${err.message}`);
    }
}