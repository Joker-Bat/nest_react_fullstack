import React, { useState, useMemo } from "react";
import classes from "../../styles/Form.module.scss";
import classes2 from "./GetEstimate.module.scss";

import { Form, useFetcher } from "react-router-dom";

import API from "../../services/api";
import {
  currencyFormatter,
  isValidLocation,
  isValidMileageOrPrice,
  isValidYear,
} from "../../utils/helper";
import { toast } from "react-toastify";

// export const action = async ({ request, params }: any) => {
//   const url = new URL(request.url);

//   if (url.search) {
//     const searchParams = new URLSearchParams(url.search);

//     const { data } = await API.get(`/reports/`, {
//       params: searchParams,
//     });
//     console.log("🚀 ~ data", data);

//     if (data.length > 0) {
//       console.log("called");

//       return data[0];
//     }
//   }

//   console.log("called");

//   return "Hello";
// };

const GetEstimate = () => {
  const fetcher = useFetcher();
  // const loaderData = useLoaderData();
  // console.log("🚀 ~ loaderData", loaderData);

  const [estimateDetails, setEstimateDetails] = useState({
    make: "",
    model: "",
    lng: "",
    lat: "",
    mileage: "",
    year: "",
  });
  const [estimatePrice, setEstimatePrice] = useState("");
  const [submitButtonClass, setSubmitButtonClass] = useState("");
  const [showEstimatePopup, setShowEstimatePopup] = useState(false);

  const isFormValid = useMemo(() => {
    const { make, model, year, mileage, lng, lat } = estimateDetails;

    if (
      make.length > 0 &&
      model.length > 0 &&
      isValidYear(year) &&
      isValidMileageOrPrice(mileage) &&
      isValidLocation(lng) &&
      isValidLocation(lat)
    ) {
      setSubmitButtonClass("");
      return true;
    }

    setSubmitButtonClass;
  }, [estimateDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEstimateDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleMouseOver = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isFormValid) return setSubmitButtonClass("");

    if (!isFormValid) {
      setSubmitButtonClass((prev) =>
        prev === classes.MoveRight ? classes.MoveLeft : classes.MoveRight
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return toast("Fill all required fields");

    const searchParams = new URLSearchParams(estimateDetails);

    const { data } = await API.get("/reports", {
      params: searchParams,
    });

    if (data.length > 0 && data[0].price) {
      setEstimatePrice(data[0].price);
      setShowEstimatePopup(true);
    } else {
      toast("Sorry we don't have any records with provided details");
    }

    // fetcher.submit(e.currentTarget, {
    //   action: "/get-estimate",
    //   method: "get",
    // });
  };

  return (
    <>
      {showEstimatePopup && (
        <div className={classes2.PopupContainer}>
          <div className={classes2.Popup}>
            <span
              className={classes2.CloseIcon}
              onClick={() => setShowEstimatePopup(false)}
            >
              X
            </span>
            <p className={classes2.Info}>
              Your <span>{estimateDetails.make}</span>, based on records the we
              have would worth
            </p>
            <h2 className={classes2.Price}>
              {currencyFormatter(estimatePrice)}
            </h2>
          </div>
        </div>
      )}

      <div className={classes.Container}>
        <Form className={classes.Form} onSubmit={handleSubmit}>
          <div className={classes.Title}>
            <h2>Get estimated value</h2>
          </div>

          <div className={classes.Field}>
            <label htmlFor="make">
              Make <span title="Required">&#9432;</span>
            </label>
            <input
              type="text"
              id="make"
              name="make"
              value={estimateDetails.make}
              onChange={handleChange}
            />
          </div>

          <div className={classes.Field}>
            <label htmlFor="model">
              Model <span title="Required">&#9432;</span>
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={estimateDetails.model}
              onChange={handleChange}
            />
          </div>

          <div className={classes.Field}>
            <label htmlFor="year">
              Year{" "}
              <span title={`Valid b/w 1930 to ${new Date().getFullYear()}`}>
                &#9432;
              </span>
            </label>
            <input
              type="number"
              id="year"
              min={1930}
              max={new Date().getFullYear()}
              step={1}
              name="year"
              value={estimateDetails.year}
              onChange={handleChange}
            />
          </div>

          <div className={classes.Field}>
            <label htmlFor="mileage">
              Mileage <span title="Valid b/w 1 - 1000000">&#9432;</span>
            </label>
            <input
              type="number"
              id="mileage"
              min={1}
              max={1000000}
              step={1}
              name="mileage"
              value={estimateDetails.mileage}
              onChange={handleChange}
            />
          </div>

          <div className={classes.Field}>
            <label htmlFor="longitude">
              Longitude <span title="Required">&#9432;</span>
            </label>
            <input
              type="number"
              id="longitude"
              name="lng"
              value={estimateDetails.lng}
              onChange={handleChange}
            />
          </div>

          <div className={classes.Field}>
            <label htmlFor="latitude">
              Latitude <span title="Required">&#9432;</span>
            </label>
            <input
              type="number"
              id="latitude"
              name="lat"
              value={estimateDetails.lat}
              onChange={handleChange}
            />
          </div>

          <div className={classes.Button}>
            <button
              type="submit"
              className={submitButtonClass}
              onMouseOver={handleMouseOver}
            >
              What's price ?
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default GetEstimate;
