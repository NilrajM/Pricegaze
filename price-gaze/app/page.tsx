import HCarousel from '@/components/Carousel';
import Searchbar from '@/components/Searchbar';
import Image from 'next/image';
import React from 'react';
import { getAllProducts } from '@/lib/actions';
import ProdcutCard from '@/components/ProdcutCard';

const Home = async () => {
  const allProducts = await getAllProducts();

  return (
    <>
    <section className='px-6 md:px-20 py-24 border-2 border-red-500'>
      <div className='flex max-xl:flex-col gap-16'>
        <div className='flex flex-col justify-center'>
          <p className='small-text'>
            Smart Shopping Starts Here
            <Image
            src='assets/icons/arrow-right.svg'
            alt='rrow-right'
            width={16}
            height={16}
            />
          </p>
          <h1 className='head-text'>
            Unleash the Power of
            <span className='text-primary'> PriceGaze</span>
          </h1>

          <p className='mt-6'>
          Advanced, user-friendly analytics solutions empowering businesses to optimize conversion rates, enhance engagement, and boost customer retention effortlessly.
          </p>

          <Searchbar/>
        </div>

        <HCarousel/>
      </div>
    </section>

    <section className='trending-section'>
      <h2 className='section-text'>Trending</h2>

      <div className='flex flex-wrap gap-x-8 gap-y-16'>
        {allProducts?.map(
          (product) => (
           <ProdcutCard key={product._id} product={product} />
          )
        )}
      </div>
    </section>
    </>
  )
}

export default Home;