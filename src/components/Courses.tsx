import { createStyles, Container, Group, ActionIcon, Footer, Title, SimpleGrid, Input, Grid, CloseButton, ScrollArea, Select } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconSearch } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import React from 'react';
import axios from 'axios';
import BadgeCard from './BadgeCard';
import { useState, useEffect } from 'react';
import ContinueToWatchData, { CardsCarousel } from './ContinueWatch';

const useStyles = createStyles((theme) => ({
    footer: {
        marginTop: 120,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
            }`,
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    },

    links: {
        [theme.fn.smallerThan('xs')]: {
            marginTop: theme.spacing.md,
        },
    },
}));


export function Courses() {
    const [updated, setUpdated] = useState<false>(false);


    const { classes } = useStyles();
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [courses, setCourses] = React.useState([]);
    const [favcourses, setFavCourses] = React.useState([]);

    const [searchedCourses, setSearchedCourses] = React.useState([]);
    const [searched, setSearched] = React.useState("");

    React.useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setUser(jwt_decode(localStorage.getItem("accessToken") as string));
            console.log("_____________dsfsd______000000");
            console.log(user);
        }
    }, []);
    const grabLink = require('youtube-thumbnail-grabber');

    const search = (value: any) => {
        var searchedCourses = courses.filter((obj: any) => {

            return obj.name.includes(value);
        });

        setSearchedCourses(searchedCourses);
    }


    const getCourses = () => {
        axios
            .get("http://localhost:4000/api/courses")
            .then((response) => {
                response.data.forEach((item: any) => {
                    if (item.link)
                        item.image = grabLink(item.link, 'max');
                    item.viewUrl = "/courses/" + item._id;
                });
                setCourses(response.data);
                setSearchedCourses(response.data);
                return response.data
            }).then((courses)=> getFavoruies(courses))
            .catch((error) => {
                console.log(error);
            });
    };

    const getFavoruies = (data) => {
        let user = jwt_decode(localStorage.getItem("accessToken") as string) as any;
        axios
            .get("http://localhost:4000/api/courses//userlikes/" + user._id)
            .then((response) => {

                let fav = response.data.map(item => item.likedCourses);
                 
                const favcours = [];
                data.forEach(item => {
                   if(fav.find(f => f === item._id)) {
                       favcours.push(item);
                   }
                })
                setFavCourses(favcours);

            })
            .catch((error) => {
                console.log(error);
            });
    }
    React.useEffect(getCourses, []);

 
 

    function likeCourse(courseId: string) {
        const course = courses.find(item => item._id === courseId);
        if (!course.likes) course.likes = 0;
        const data = {
            likes: course.likes + 1
        }
        axios
            .put("http://localhost:4000/api/courses/likes/" + courseId, data)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
                
            });


        const userData = {
            courseId
        }
        axios
            .put("http://localhost:4000/api/courses/likes/user/" + user._id, userData)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });


    };

    const getRating =() => {
        return Math.floor(Math.random() * 5);

    }
    const continueToWatch = courses.map((course) => ({ image: course.image, video: course.videoUrl, title: course.name, id: course._id }));

    return (
        <div >

            <Container className={classes.footer} style={{ marginTop: 0, marginBottom: 20, borderBottom: "1px solid" }}>
                <h4>Favourite courses</h4>

                <CardsCarousel data={favcourses} />
                <br />
            </Container>
            <Grid>
                <Grid.Col span={2} offset={1}></Grid.Col>

                <Grid.Col span={8}>
                    <Group>
                        <Input onChange={(e: any) => search(e.target.value)}

                            icon={<IconSearch />}
                            placeholder="Search courses">


                        </Input>
                        {/* <Select
                            placeholder="Select filter"
                            clearable
                            clearButtonLabel='Clear'
                            data={[
                                { value: 'latest', label: 'Latest' },
                                { value: 'highest', label: 'Highest ranking' },
                                { value: 'notfinished', label: 'Not finished' },
                                { value: 'notfinished', label: 'Finished' },

                            ]}
                        /> */}
                        <Group>
                        </Group>

                    </Group>
                </Grid.Col>
                <Grid.Col span={1} offset={3}></Grid.Col>
            </Grid>

            <Container className={classes.inner}>

                <SimpleGrid cols={3}>

                    {searchedCourses.map(function (course: any) {
                        return (<BadgeCard onLike={likeCourse} likes={course.likes} rating={course.rating} id={course._id} key={course._id} image={course.image} title={course.name} video={course.videoUrl} country={''} description={course.description} badges={[]}></BadgeCard>)
                    })}
                </SimpleGrid>
            </Container>

        </div>
    );
}



export default Courses;