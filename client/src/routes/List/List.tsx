import { useContext, useEffect, useRef, useState } from "react";
import classes from "./List.module.scss";

import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext, UserContextType } from "../../HOC/ContextProvider";

const List = () => {
  const navigate = useNavigate();
  const { clearUser } = useContext(UserContext) as UserContextType;

  const [reports, setReports] = useState<Report[]>([]);
  const controller = useRef(new AbortController());

  useEffect(() => {
    fetchReports();

    return () => controller.current.abort();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await API.get<Report[]>("/reports/list", {
        signal: controller.current.signal,
      });
      setReports(data);
    } catch (err: any) {
      if (err.message !== "canceled") {
        console.log("🚀 ~ err", err);
        if (err.response) {
          if (err.response.status === 401) {
            toast("Session timeout, login again");
            clearUser();
            return navigate("/auth");
          }
        }
        toast("Something went wrong");
      }
    }
  };

  const handleApprove = async (id: number, status: boolean) => {
    try {
      await API.patch(`/reports/${id}`, {
        approved: !status,
      });
      await fetchReports();
    } catch (err: any) {
      console.log("🚀 ~ err", err);
      if (err.response) {
        if (err.response.status === 401) {
          toast("Session timeout, login again");
          clearUser();
          return navigate("/auth");
        }
        return toast(err.response.data.message);
      }
      toast("Something went wrong");
    }
  };

  return (
    <div className={classes.Container}>
      <div className={classes.Top}>
        <Link className={classes.CreateButton} to="/get-estimate">
          Get Estimate
        </Link>

        <Link className={classes.CreateButton} to="/create">
          Create New
        </Link>
      </div>

      <div className={classes.List}>
        {reports.map((report) => {
          return (
            <div key={report.id} className={classes.Report}>
              <div className={classes.Field}>
                <span className={classes.Label}>Make: </span>
                <span className={classes.Value}>{report.make}</span>
              </div>
              <div className={classes.Field}>
                <span className={classes.Label}>Model: </span>
                <span className={classes.Value}>{report.model}</span>
              </div>
              <div className={classes.Field}>
                <span className={classes.Label}>Year: </span>
                <span className={classes.Value}>{report.year}</span>
              </div>
              <div className={classes.Field}>
                <span className={classes.Label}>Mileage: </span>
                <span className={classes.Value}>{report.mileage}</span>
              </div>
              <div className={classes.Field}>
                <span className={classes.Label}>Longitude: </span>
                <span className={classes.Value}>{report.lng}</span>
              </div>
              <div className={classes.Field}>
                <span className={classes.Label}>Latitude: </span>
                <span className={classes.Value}>{report.lat}</span>
              </div>
              <div className={classes.Field}>
                <span className={classes.Label}>Price: </span>
                <span className={classes.Value}>{report.price}</span>
              </div>
              <button
                // disabled={report.approved}
                onClick={() => handleApprove(report.id, report.approved)}
                className={`${classes.ApproveButton} ${
                  report.approved ? classes.Active : ""
                }`}
              >
                {report.approved ? "Approved" : "Approve"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
