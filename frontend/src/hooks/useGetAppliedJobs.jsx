import { setAllAppliedJobs } from "@/redux/jobSlice";
//import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/application/appliedJobs`,
          { withCredentials: true }
        );
        console.log("value of all applied jobs are :", res);
        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.application));
        }
      } catch (error) {
        console.log("some error in fetching applied jobs");
        console.log(error);
      }
    };
    fetchAppliedJobs();
  }, []);
};
export default useGetAppliedJobs;
