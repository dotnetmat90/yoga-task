import { createStyles, Container, Text, ScrollArea, Code, Group, ActionIcon, Footer, Title, SimpleGrid, Input, Grid, CloseButton, Textarea, Button, Switch, Checkbox, Rating, Flex } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconSearch } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import React, { useState } from 'react';
import axios from 'axios';
import BadgeCard from './BadgeCard';
import CommentSimple from './CommentSimple';
import { showNotification } from '@mantine/notifications';
import Plyr from "plyr-react"
import "plyr-react/plyr.css"
import { type } from 'os';
import Video from './Video';
import { AspectRatio } from '@mantine/core';

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
export interface CourseData {
    link: string,
    name: string,
    videoUrl: string;
    _id: string,
    createdBy: string;
    rating: number;
    views: number;
    totalVotes: number;
}

export interface UserData {
    _id: string;
    name: string;
    firstname: string;
    lastname: string;
    type: string;
}

export interface CommentData {
    _id: string;
    courseId: string;
    userId: string;
    text: string;
    userName: string;
    createdAt: string;
}

export function Course() {

    const { classes } = useStyles();
    const navigate = useNavigate();
    const [user, setUser] = React.useState({} as UserData);
    const [course, setCourse] = React.useState({} as CourseData);
    const [comment, setComment] = React.useState('');
    const [comments, setComments] = React.useState([] as CommentData[]);
    const [finished, setFinished] = React.useState(false);

    React.useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            const test = jwt_decode(localStorage.getItem("accessToken") as string) as UserData;
            setUser(test);
            console.log("_____________dsfsd______000000");
            console.log(user);
        }
    }, []);

    const courseComments = [];

    const addComment = () => {


        const currentUser = jwt_decode(localStorage.getItem("accessToken") as string) as UserData;

        if (!comment) {
            showNotification({
                title: 'Comment cannot be empty!',
                color: 'red',
                message: 'Empty field.',
            });
            return;
        }

        const commentData = {
            text: comment,
            courseId: course._id,
            userId: user._id,
            userName: currentUser.firstname + " " + currentUser.lastname,
            date: new Date()
        }

        if (currentUser.type == 'creator' && currentUser._id == course.createdBy) {
            commentData.userName += " (Trainer)";
        }


        console.log(currentUser.firstname);
        axios
            .post(`http://localhost:4000/api/comments`, commentData)
            .then((response) => {
                const all = comments;
                all.push(response.data as CommentData);
                setComments(all);
                navigate(0);
            }).catch((error) => {
                console.log(error)
            })
    };


    const getComments = () => {

        axios
            .get('http://localhost:4000/api/comments')
            .then((response) => {
                console.log(response)
                const data = response.data as CommentData[];
                const courseId = window.location.pathname.replace('/courses/', '');

                setComments(data.filter(comment => comment.courseId == courseId));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const courseFinished = () => {

    }

    const getCourse = () => {

        const id = window.location.pathname.replace('/courses/', '');




        axios
            .get(`http://localhost:4000/api/courses/` + id)
            .then((response) => {
                if (response.data.link) {
                    const val = response.data.link.split('?v=')[1].split('&')[0];
                    response.data.link = "https://www.youtube.com/embed/" + val;
                }
                response.data.views ++;
                setCourse(response.data as CourseData);
                response.data.views --;

                if (!response.data.views) {
                    response.data.views = 0;
                }

                const data = {
                    views: response.data.views + 1
                }
                axios.put(`http://localhost:4000/api/courses/` + id, data)
                    .then((response) => {
                        console.log(response)
                    })
                    .catch((error) => {

                    });
            })
            .catch((error) => {
                console.log(error);
            });

    };


    React.useEffect(getCourse, []);
    React.useEffect(getComments, []);
    const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });

    const updatedRating = (value) => {
        if (!course.totalVotes) {
            course.totalVotes = 1;
        } else {
            course.totalVotes++;
        }
        if (!course.rating) {
            course.rating = 1;
        }
        let newRating = (course.rating * 5) / course.totalVotes;
        if (newRating > 5) newRating = 5;
        const data = {
            rating: newRating,
            totalVotes: course.totalVotes
        }

        axios
            .put(`http://localhost:4000/api/courses/` + course._id, data)
            .then((response) => {
                if (response.data.link) {
                    const val = response.data.link.split('?v=')[1].split('&')[0];
                    response.data.link = "https://www.youtube.com/embed/" + val;
                }
                setCourse(response.data as CourseData);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return (

        <Container my="md">
            <SimpleGrid cols={1} spacing="md" breakpoints={[{ maxWidth: 'lg', cols: 1 }]}>
                <Grid gutter="md">
                    <Grid.Col>
                        <h1>{course.name}</h1>


                        <AspectRatio ratio={16 / 9}>
                            {course.link ? (<>
                                <iframe
                                    src={course.link}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </>) : (<>


                                <Video url={course.videoUrl} key={course.videoUrl}  >{course.videoUrl}</Video>

                            </>)
                            }
                        </AspectRatio>
                        {/* <Switch checked={finished} label="Mark finished" onClick={() => courseFinished()} /> */}
                    </Grid.Col>
                    <Grid.Col>
                        <Rating defaultValue={course.rating} onChange={(val) => updatedRating(val)} style={{ float: "right" }} />
                        <br />

                        <hr />
                        <h4>Comments</h4>
                        <SimpleGrid cols={1} spacing="md" breakpoints={[{ maxWidth: 'lg', cols: 1 }]}>
                            <Grid gutter="md">
                                <Grid.Col span={11}>
                                    <Textarea
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Your comment"
                                        label="Your comment"
                                        withAsterisk
                                    />
                                </Grid.Col>
                                <Grid.Col span={2}>
                                    <Button className='right' onClick={() => addComment()} >Submit</Button>
                                </Grid.Col>
                            </Grid>
                        </SimpleGrid>
                    </Grid.Col>
                    <Grid.Col>

                        {comments.length > 0 ? (<> <h4>Latest comments:</h4></>) : (<><p></p></>)}
                        <ScrollArea
                            style={{ height: 200, scrollbarColor: "red" }}
                            onScrollPositionChange={onScrollPositionChange}
                            type="hover"


                            styles={(theme) => ({
                                scrollbar: {
                                    '&, &:hover': {
                                        background:
                                            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                                    },

                                    '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                                        backgroundColor: theme.colors.red[6],
                                    },

                                    '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb': {
                                        backgroundColor: theme.colors.blue[6],
                                    },
                                },

                                corner: {
                                    opacity: 1,
                                    background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                                },
                            })}
                        >
                            {comments.map(function (comment: CommentData) {
                                return (<>
                                    <br />
                                    <CommentSimple key={comment._id} body={comment.text} postedAt={comment.createdAt} name={comment.userName} />
                                </>
                                )
                            })}
                        </ScrollArea>
                    </Grid.Col>
                </Grid>
            </SimpleGrid>
            <br/>
           <Text style={{float:"right"}}>  Views {course.views}</Text>

        </Container>
    );
}



export default Course;