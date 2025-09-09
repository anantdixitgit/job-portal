import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="text-center bg-gradient-to-r from-cyan-50 via-teal-50 to-blue-50 min-h-[60vh]">
      <div className="flex flex-col gap-5 my-10">
        <span className="mx-auto px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 font-medium shadow">
          No. 1 Job Hunt Website
        </span>
        <h1 className="text-5xl font-bold text-teal-700 drop-shadow-lg">
          Search, Apply & <br /> Get Your{" "}
          <span className="text-cyan-600">Dream Jobs</span>
        </h1>
        <p className="text-gray-500 italic">
          Best platform to find your dream job and boost your career. Explore
        </p>
        <div className="flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto bg-white/80">
          <input
            type="text"
            placeholder="Find your dream jobs"
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full"
          />
          <Button
            onClick={searchJobHandler}
            className="rounded-r-full bg-teal-600 hover:bg-teal-700"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
