import { useState, useMemo, useContext } from 'react';
import classes from '../../styles/Form.module.scss';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import API from '../../services/api';
import {
    isValidLocation,
    isValidMileageOrPrice,
    isValidYear,
} from '../../utils/helper';
import { UserContext, UserContextType } from '../../HOC/ContextProvider';

const Create = () => {
    const navigate = useNavigate();
    const { clearUser } = useContext(UserContext) as UserContextType;

    const [reportDetails, setReportDetails] = useState({
        make: '',
        model: '',
        year: '',
        mileage: '',
        lng: '',
        lat: '',
        price: '',
    });
    const [submitButtonClass, setSubmitButtonClass] = useState('');

    const isFormValid = useMemo(() => {
        const { make, model, year, mileage, lng, lat, price } = reportDetails;

        if (
            make.length > 0 &&
            model.length > 0 &&
            isValidYear(year) &&
            isValidMileageOrPrice(mileage) &&
            isValidLocation(lng) &&
            isValidLocation(lat) &&
            isValidMileageOrPrice(price)
        ) {
            setSubmitButtonClass('');
            return true;
        }

        setSubmitButtonClass;
    }, [reportDetails]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReportDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMouseOver = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        if (isFormValid) return setSubmitButtonClass('');

        if (!isFormValid) {
            setSubmitButtonClass((prev) =>
                prev === classes.MoveRight
                    ? classes.MoveLeft
                    : classes.MoveRight,
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await API.post('/reports', {
                ...reportDetails,
                lat: +reportDetails.lat,
                lng: +reportDetails.lng,
                year: +reportDetails.year,
                mileage: +reportDetails.mileage,
                price: +reportDetails.price,
            });
            navigate('/list');
        } catch (err: any) {
            console.log('🚀 ~ err', err);
            if (err.response) {
                if (err.response.status === 401) {
                    toast('Session timeout, login again');
                    clearUser();
                    return navigate('/auth');
                }
                return toast(err.response.data.message[0]);
            }
            return toast('Something went wrong');
        }
    };

    return (
        <div className={classes.Container}>
            <form className={classes.Form} onSubmit={handleSubmit}>
                <div className={classes.Title}>
                    <h2>Create report</h2>
                </div>

                <div className={classes.Field}>
                    <label htmlFor="make">
                        Make <span title="Required">&#9432;</span>
                    </label>
                    <input
                        type="text"
                        id="make"
                        name="make"
                        value={reportDetails.make}
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
                        value={reportDetails.model}
                        onChange={handleChange}
                    />
                </div>

                <div className={classes.Field}>
                    <label htmlFor="year">
                        Year{' '}
                        <span
                            title={`Valid b/w 1930 to ${new Date().getFullYear()}`}
                        >
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
                        value={reportDetails.year}
                        onChange={handleChange}
                    />
                </div>

                <div className={classes.Field}>
                    <label htmlFor="mileage">
                        Mileage{' '}
                        <span title="Valid b/w 1 - 1000000">&#9432;</span>
                    </label>
                    <input
                        type="number"
                        id="mileage"
                        min={1}
                        max={1000000}
                        step={1}
                        name="mileage"
                        value={reportDetails.mileage}
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
                        value={reportDetails.lng}
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
                        value={reportDetails.lat}
                        onChange={handleChange}
                    />
                </div>

                <div className={classes.Field}>
                    <label htmlFor="price">
                        Price <span title="Required">&#9432;</span>
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={reportDetails.price}
                        onChange={handleChange}
                    />
                </div>

                <div className={classes.Button}>
                    <button
                        type="submit"
                        className={submitButtonClass}
                        onMouseOver={handleMouseOver}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Create;
