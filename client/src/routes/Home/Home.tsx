import classes from './Home.module.scss';

const Home = () => {
    return (
        <div className={classes.Container}>
            <ul>
                <li>Create and save record of your car</li>
                <li>View list of car records available</li>
                <li>
                    Approve a report to used for calculating estimate price
                    (Admins only)
                </li>
                <li>
                    Get estimated price of your car based on current records
                </li>
            </ul>
        </div>
    );
};

export default Home;
