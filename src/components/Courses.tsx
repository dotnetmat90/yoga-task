import { createStyles, Container, Group, ActionIcon, Footer, Title, SimpleGrid, Input, Grid, CloseButton } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconSearch } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import React from 'react';
import axios from 'axios';
import BadgeCard from './BadgeCard';
import { useState, useEffect } from 'react';

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
            })
            .catch((error) => {
                console.log(error);
            });
    };
    React.useEffect(getCourses, []);

    return (
        <div  >
            <Grid>
                <Grid.Col span={3} offset={1}></Grid.Col>

                <Grid.Col span={8}>
                    <Group>
                        <Input onChange={(e: any) => search(e.target.value)}

                            icon={<IconSearch />}
                            placeholder="Search courses"
                        >

                        </Input>
                    </Group>
                </Grid.Col>
                <Grid.Col span={1} offset={3}></Grid.Col>
            </Grid>

            <Container className={classes.inner}>
                <SimpleGrid cols={3}>

                    {searchedCourses.map(function (course: any) {
                        return (<BadgeCard id={course._id} key={course._id} image={course.image} title={course.name} video={course.videoUrl} country={''} description={course.description} badges={[]}></BadgeCard>)
                    })}
                </SimpleGrid>
            </Container>
        </div>
    );
}



export default Courses;