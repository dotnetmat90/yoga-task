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
import { useForm } from '@mantine/form';
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


export function MyCourses() {
    const [updated, setUpdated] = useState<false>(false);
    let [name, setName] = useState('');
    let [description, setDescription] = useState('');

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

    let editForm = useForm({
        initialValues: { name: localStorage.getItem("courseName"), description: '' },

        validate: {
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            description: (value) => (value.length < 10 ? 'Description must have at least 10 letters' : null)
        },
    });

    let editedName = ''
    let editedDescription = '';


    
    const updateCourseDetails = (courseId: string) => {
        console.log(editedName);
        console.log(editedDescription);

        const data = {
            name : editedName,
            description: editedDescription
        };

        axios
        .put("http://localhost:4000/api/courses/" + courseId, data)
        .then((response) => {
            window.location.reload();
        })
        .catch((error) => {
            console.log(error);
        });

    }

    const openEditModal = (courseId: string) => {
        var selected = courses.find(course => course._id === courseId);

        localStorage.setItem("courseName", selected.name);


        openModal({
            title: 'Edit course details',
            children: (
                <>
                    <TextInput required label="Course name"   data-autofocus  onChange={(event) => editedName = event.currentTarget.value}  defaultValue={selected.name} />
                    <Textarea required label="Course description" onChange={(event) => editedDescription =event.currentTarget.value} defaultValue={selected.description} data-autofocus />

                    <Button fullWidth type='submit' onClick={() => updateCourseDetails(courseId)} mt="md">
                        Submit
                    </Button>
                </>
            )
        })

        setName(selected.name);
        setDescription(selected.description);
    }

    const deleteCourse = (courseId: string) => {
        axios
            .delete("http://localhost:4000/api/courses/" + courseId)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
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
            onConfirm: () => deleteCourse(courseId)
        })
    };



    const getCourses = () => {
        axios
            .get("http://localhost:4000/api/courses")
            .then((response) => {
                if (response.data) {
                    response.data.forEach((item: any) => {
                        if (item.link)
                            item.image = grabLink(item.link, 'max');
                        item.viewUrl = "/courses/" + item._id;
                    });

                    var user = jwt_decode(localStorage.getItem("accessToken") as string) as any;

                    const userCourses = response.data.filter(course => course.createdBy == user._id)
                    setCourses(userCourses);
                    setSearchedCourses(userCourses);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    let link = '';
    let file = {} as any;
    let filename = "";

    let onFileChange = (event: any) => {

        // Update the state
        file = event.target.files[0];
        filename = file.name;
    }

    const addCourseForm = useForm({
        initialValues: { name, description },

        validate: {
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            description: (value) => (value.length < 10 ? 'Description must have at least 10 letters' : null)
        },
    });




    const setupFile = (data: File[]) => {
        file = data[0];
    }

    var theme = useMantineTheme();

    var addName = '';
    var addDesc = '';
    const setAddModalName = (value: string) => {
        addName = value;
    }

    const setAddModalDesc = (value: string) => {
        addDesc = value;
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



        formData.append('description', addName);
        formData.append('name', addDesc);
        formData.append('link', link);
        formData.append('createdBy', user._id);
        axios
            .post("http://localhost:4000/api/courses", formData)
            .then((response) => {
                setDescription('');
                link = '';
                setName('')
                file = {} as any;
                if (user.type === "creator") {
                    window.location.reload();
                    return;
                }
                navigate("/courses");
            }).catch((error) => {

                showNotification({
                    title: 'Could not add course',
                    color: 'red',
                    message: error.code === "ERR_BAD_REQUEST" ? `Course with name ${addName} already exists!` : "Error. Could not add course. Contact admin!"
                })
            });



        closeAllModals();
    }

    let addModal = ({

        title: 'Create new course!',
        children: (
            <>

                <TextInput required={true} label="Course name" placeholder="Course name" onChange={(event) => setAddModalName(event.target.value)} data-autofocus />
                <Textarea required={true} label="Description" onChange={(event) => setAddModalDesc(event.target.value)} />
                <p>Paste youtube link. If you add youtube link and video file. Youtube link will be set as default</p>
                <TextInput label="Youtube link" disabled={filename.length > 0} onChange={(event) => link = event.target.value} />
                <>
                    <p>Or use file upload</p>

                    <Dropzone accept={[MIME_TYPES.mp4, MIME_TYPES.webp, "video/webm", "video/ogg"]}
                        onDrop={(file) => setupFile(file)}>
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

                        <Button color="red" radius="xs" size="md" onClick={() => openModal(addModal)} uppercase>
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