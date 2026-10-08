import React, {useState} from "react"
import { Link } from "react-router-dom"
import {useLocation, useNavigate } from "react-router-dom";

const Search = () =>{
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const isSearchPage = location.pathname.toLowerCase() === "/Search";
    const handleSearch = () => {
        navigate(`/Search?query=${encodeURIComponent(searchTerm)}`);
    };

    window.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && searchTerm.trim() !== "") {
            handleSearch();
        }
    });
    return(
        <div className={`Search p-0 ${isSearchPage ? "Search--results" : ""}`}>
            <img src={`search1.png`} alt="Search-icon" className="h-[20px] w-[20px] mr-[10px]"/>
            <input value={searchTerm || ""} onChange={(e)=>{setSearchTerm(e.target.value)}} type="text" className="input search-input text-white text-lg sm:w-[100px] md:w-[200px] lg:w-[300px] "  placeholder="Search..."/>
            <button onClick={handleSearch} className="search-button text-lg font-serif pl-[10px] ">Search</button>
      
    </div>
    )
}

export default Search;