"use client"

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

const isValidAmazonUrl = (url: string): boolean => {
  try{
    const parsedUrl = new URL(url);
    const hostName = parsedUrl.hostname;

    if(hostName.includes('amazon.com') ||
    hostName.includes('amazon.') ||
    hostName.endsWith('amazon')){
      return true;
    }
  }
  catch(err){
    return false;
  }

  return false
}

const Searchbar = () => {

  const [searchPrompt, setSearchPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const isValidLink = isValidAmazonUrl(searchPrompt);

      // alert(isValidLink ? 'Valid Link' : 'Invalid Link');

      if(!isValidLink){
        return alert('Please provide a valid amazon product link');
      }

      try{
        setIsLoading(true);

        //Scrape the product details
        const product = await scrapeAndStoreProduct(searchPrompt);
      }
      catch(err){
        console.log(err);
      }
      finally{
        setIsLoading(false);
      }

  }

  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSearch}>
        <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter a product link"
        className="searchbar-input"
        />
        <button 
          type="submit" 
          className="searchbar-btn"
          disabled={searchPrompt === ''}
          >
            {isLoading ? 'Searching...' : 'Search'}
        </button>
    </form>
  )
}

export default Searchbar