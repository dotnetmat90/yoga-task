import { createStyles, Container, Group, ActionIcon, Footer, Title, Text, SimpleGrid, Input, Grid, CloseButton, Select, TextInput, Button, Textarea, Card, Center, useMantineTheme } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconSearch, IconPlus, IconMovie, IconUpload, IconX } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import React from 'react';
import axios from 'axios';
import BadgeCard from './BadgeCard';
import { useState, useEffect } from 'react';
import CourseEditBadge from './CourseEditBadge';
import { closeAllModals, openConfirmModal, openModal } from '@mantine/modals';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';

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


export function MyCourses() {
    const [updated, setUpdated] = useState<false>(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

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
    const openEditModal = (courseId: string) => {
        var selected = courses.find(course => course._id === courseId);




        openModal({
            title: 'Edit course details',
            children: (
                <>
                    <TextInput label="Course name" onChange={(event) => setName(event.currentTarget.value)} data-autofocus />
                    <Textarea label="Course description" onChange={(event) => setDescription(event.currentTarget.value)} data-autofocus />

                    <Button fullWidth onClick={closeAllModals} mt="md">
                        Submit
                    </Button>
                </>
            )
        })

        setName(selected.name);
        setDescription(selected.description);
    }

    const openDeleteModal = (courseId: string) => {
        var selected = courses.find(course => course._id === courseId);

        openConfirmModal({
            title: `Delete course`,
            centered: true,
            children: (
                <>
                    <Text size="sm">
                        Are you sure you want to delete <strong> {selected.name} </strong> course? <br />
                        Users will lost access to this course permanently!
                    </Text>
                </>
            ),
            labels: { confirm: 'Delete', cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => console.log('Confirmed'),
        })
    };

    const getCourses = () => {
        axios
            .get("http://localhost:4000/api/courses")
            .then((response) => {
                response.data.forEach((item: any) => {
                    if (item.link)
                        item.image = grabLink(item.link, 'max');
                    item.viewUrl = "/courses/" + item._id;
                });

                var user = jwt_decode(localStorage.getItem("accessToken") as string) as any;

                const userCourses = response.data.filter(course => course.createdBy == user._id)
                setCourses(userCourses);
                setSearchedCourses(userCourses);
            })
            .catch((error) => {
                console.log(error);
            });
    };

     let link = '';
     let file = {} as any;

    let onFileChange = (event: any) => {

        // Update the state
        file = event.target.files[0];

    }


    const addCourse = () => {


        const formData = new FormData();

        if (link === '') {
            // Update the formData object
            formData.append(
                "myFile",
                file,
                file.name
            );
        }



        formData.append('description', description);
        formData.append('name', name);
        formData.append('link', link);
        formData.append('createdBy', user._id);
        axios
            .post("http://localhost:4000/api/courses", formData)
            .then((response) => {
                setDescription('');
                link = '';
                setName('')
                file = {} as any;
                navigate("/courses");
            }).catch((error) => {
                console.log(error);
            });



        closeAllModals();
    }

    const setupFile = (data: File[]) => {
        file = data[0];
    }

    var theme = useMantineTheme();

    let addModal = ({

        title: 'Create new course!',
        children: (
            <>
                <TextInput required={true} label="Course name" placeholder="Course name" onChange={(event) => setName(event.target.value)} data-autofocus />
                <Textarea required={true} label="Description" onChange={(event) => setDescription(event.target.value)} />
                <p>Paste youtube link</p>
                <TextInput label="Youtube link" onChange={(event) => link = event.target.value} />
                <>
                    <p>Or use file upload</p>

                    <Dropzone accept={[MIME_TYPES.mp4, MIME_TYPES.webp, "video/webm", "video/ogg"]}
                        onDrop={(file)=> setupFile(file)}>
                        <Group position="center" spacing="xl" style={{ minHeight: 100, pointerEvents: 'none' }}>
                            <Dropzone.Accept>
                                <IconUpload
                                    size={50}
                                    stroke={1.5}
                                    color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX
                                    size={50}
                                    stroke={1.5}
                                    color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                                />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconMovie size={50} stroke={1.5} />
                            </Dropzone.Idle>

                            <div>
                                <Text size="xl" inline>
                                    Drag video file of your course
                                </Text>

                            </div>
                        </Group>

                    </Dropzone>
                </>

                <Button fullWidth mt="md" onClick={() => addCourse()}>
                    Create course
                </Button>
            </>
        ),
    });


    React.useEffect(getCourses, []);

    return (
        <div  >

            <Grid>

                <Grid.Col span={2} offset={1}></Grid.Col>

                <Grid.Col span={8}>
                    <Center style={{ width: 150, height: 150 }}>
                        <Text fz="xl" fw={700} ta="center">Your courses</Text>
                    </Center>
                    <Group>

                        <Button color="red" radius="xs" size="md" onClick={()=>  openModal(addModal)} uppercase>
                            <IconPlus >Add</IconPlus>
                        </Button>
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
                        return (<CourseEditBadge id={course._id} editAction={openEditModal} deleteAction={openDeleteModal} key={course._id} image={course.image} title={course.name} video={course.videoUrl} country={''} description={course.description} badges={[]}></CourseEditBadge>)
                    })}
                </SimpleGrid>
            </Container>
        </div>
    );
}



export default MyCourses;