import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import classNames from 'classnames'
import _ from 'lodash';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Spinner from './Spinner';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: '10px'
    },
    form: {
        width: 800,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        minWidth: 120
    },
    type: {
        fontWeight: 600
    },
    formControl: {
        marginRight: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            minWidth: "100%",
            marginRight: theme.spacing(0),
            marginBottom: theme.spacing(1)
        }
    },
    input: {
        padding: "10px 14px"
    },
    select: {
        maxWidth: 300,
        width: 200
    },
    search: {
        maxWidth: 180
    },
    margin: {
        margin: "3px"
    },
    submitBtn: {
        [theme.breakpoints.down("xs")]: {
            width: "100%"
        }
    }
}));

const Content = (props) => {
    const [loading, setLoading] = useState(false);
    const [jobListings, setJobListing] = useState(null);
    const [filteredList, setFilteredList] = useState(null);
    const [locations, setLocations] = useState(["Select A Location"]);
    const classes = useStyles();
    const inputRef = useRef();
    const selectRef = useRef();
    const [searcBy, setSearchBy] = useState("Select A Location");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await axios.get('https://boards-api.greenhouse.io/v1/boards/unity3d/jobs');
                let tempLocationsArray = ["Select A Location"];
                _.map(res.data.jobs, (job) => {
                    tempLocationsArray.push(job.location.name);
                })
                setJobListing(res.data.jobs);
                setFilteredList(res.data.jobs);
                setLocations(_.uniq(tempLocationsArray));
            } catch (error) {
                setJobListing(null);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleSubmit = () => {
        setLoading(true);
        console.log(searcBy, searchText);
        let newList = [];
        //This Segment Filters By Location
        if (searcBy === 'Select A Location') {
            newList = _.cloneDeep(jobListings);
        } else {
            newList = _.filter(jobListings, (o)=>{
                return o.location.name === searcBy;
             })
        }
        //And now by Title
        if (!_.isEmpty(searchText)) {
            newList = _.filter(newList, (o)=> {
                 return o.title.indexOf(searchText)>-1;
            })
        }
        setFilteredList(newList);
        setLoading(false);
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="xl">
                {loading && <Spinner />}
                {!loading && <div className={classes.root}>
                    <form className={classes.form}>
                        <FormControl className={classNames(classes.formControl, classes.text)}>
                            <Typography variant="body1" className={classes.type}>Filter By Location/Title:</Typography>
                        </FormControl>
                        <FormControl className={classNames(classes.formControl, classes.search)}>
                            <TextField
                                label=""
                                variant="outlined"
                                size="small"
                                ref={inputRef}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                            />
                        </FormControl>
                        <FormControl
                            className={classNames(classes.formControl, classes.select)}
                        >
                            <Select
                                labelId="typesLabel"
                                label="Types"
                                ref={selectRef}
                                input={<OutlinedInput classes={{ input: classes.input }} />}
                                value={searcBy}
                                placeholder={"Select a Location"}
                                onChange={e => setSearchBy(e.target.value)}
                            >
                                {locations.map(location => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            className={classes.submitBtn}
                        >Search</Button>
                    </form>
                </div>}
                {!loading && <Typography component="div" style={{ backgroundColor: 'white' }} >
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {_.map(filteredList, (job) => {
                            return (
                                <Grid xs={2} sm={4} md={4} key={job.key}>
                                    <Card key={job.key} onClick={()=> {window.open(job.absolute_url)}} className={classes.margin} variant="outlined">
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography color="textSecondary" gutterBottom>
                                                {job.title}
                                            </Typography>
                                            <Typography variant="subtitle2" component="p">
                                                {job.location.name}
                                            </Typography>
                                            {false && <Button style={{ marginTop: '4vh' }} variant="outlined" size="medium" color="primary" className={classes.margin}>See More</Button>}
                                        </CardContent>
                                    </CardActionArea>
                                    </Card>
                                </Grid>

                            )
                        })}
                    </Grid>
                </Typography>}
            </Container>
        </React.Fragment>);
}

export default Content;
