import React, {useState} from "react"
import {useLocation, useNavigate } from "react-router-dom";

const Search = () =>{
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const isSearchPage = location.pathname.toLowerCase() === "/search";
    const handleSearch = (event) => {
        event.preventDefault();
        const query = searchTerm.trim();
        if (!query) return;

        navigate(`/Search?query=${encodeURIComponent(query)}`);
    };

    return(
        <form onSubmit={handleSearch} className={`Search p-0 ${isSearchPage ? "Search--results" : ""}`}>
            <img src="search1.png" alt="" aria-hidden="true" className="h-[20px] w-[20px] mr-[10px]"/>
            <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} type="text" className="input search-input text-white text-lg sm:w-[100px] md:w-[200px] lg:w-[300px] "  placeholder="Search..." aria-label="Search movies and TV shows"/>
            <button type="submit" className="search-button text-lg font-serif pl-[10px] ">Search</button>
      
        </form>
    )
}

export default Search;
