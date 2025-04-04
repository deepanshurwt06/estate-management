import { useEffect, useState } from 'react';

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');


 const handleSubmit = (e) => {
    e.preventDefault();
    const urlparams = new URLSearchParams(window.location.search);
    urlparams.set("searchTerm", searchTerm);
    const searchQuery = urlparams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(()=>{
    const urlparams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlparams.get("searchTerm");
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <div className="bg-slate-400">
      <div className=" flex justify-between items-center max-w-7xl mx-auto py-3 px-5">
        <Link to={"/"}>
          <h1 className="text-3xl font-bold ">Auth App</h1>
        </Link>
        
        <form onSubmit={handleSubmit} className="bg-zinc-300 border border-zinc-400 p-3 rounded-full flex items-center">
          <input type="text" 
          placeholder="Search... "
          className="bg-transparent focus:outline-none w-24 sm:w-64" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
         />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        <ul className="flex gap-7">
          <Link to={"/"}>
            <li className="font-medium">Home</li>
          </Link>

          <Link to={"/about"}>
            {" "}
            <li className="font-medium">About</li>
          </Link>

          <Link to={"/profile"}>
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <li className="font-medium">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
