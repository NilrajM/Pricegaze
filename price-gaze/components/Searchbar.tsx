"use client"

const Searchbar = () => {

    const handleSearch = () => {

    }

  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSearch}>
        <input
        type="text"
        placeholder="Enter a product link"
        className="searchbar-input"
        />
        <button type="submit" className="searchbar-btn">
            Search
        </button>
    </form>
  )
}

export default Searchbar