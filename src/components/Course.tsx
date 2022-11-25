import { createStyles, Container, Group, ActionIcon, Footer, Title, SimpleGrid, Input, Grid, CloseButton, AspectRatio, Textarea, Button, Switch } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconSearch } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import React from 'react';
import axios from 'axios';
import BadgeCard from './BadgeCard';
import CommentSimple from './CommentSimple';
import { showNotification } from '@mantine/notifications';

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


        const test = jwt_decode(localStorage.getItem("accessToken") as string) as UserData;
 
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
            userName: test.firstname + " " + test.lastname,
            date: new Date()
        }


        console.log(test.firstname);
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

    const getCourses = () => {

        const id = window.location.pathname.replace('/courses/', '');
        axios
            .get(`http://localhost:4000/api/courses/` + id)
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
    };

    React.useEffect(getCourses, []);
    React.useEffect(getComments, []);

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
                                <>
                                    <div className="App">
                                        <video controls={true}    autoPlay={false} height={450}>
                                            <source src={course.videoUrl} type="video/mp4" />
                                        </video>
                                    </div>
                                </>
                            </>)
                            }
                        </AspectRatio>
                        {/* <Switch checked={finished} label="Mark finished" onClick={() => courseFinished()} /> */}
                    </Grid.Col>
                    <Grid.Col>
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
                        {comments.length > 0 ? (<> <h4>Latest:</h4></>) : (<><p></p></>)}
                        {comments.map(function (comment: CommentData) {
                            return (<>
                                <br />
                                <CommentSimple key={comment._id} body={comment.text} postedAt={comment.createdAt} name={comment.userName} />
                            </>
                            )
                        })}
                    </Grid.Col>
                </Grid>
            </SimpleGrid>


        </Container>
    );
}



export default Course;