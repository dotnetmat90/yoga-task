import { useState } from 'react';
import { Navbar, Text, Center, Tooltip, UnstyledButton, createStyles, Stack, Container, Group, SimpleGrid, Flex, TextInput, Button, Textarea, useMantineTheme, Box } from '@mantine/core';
import {
    TablerIcon,
    IconSettings,
    IconLogout,
    IconPlus,
    IconX,
    IconUpload,
    IconMovie,
} from '@tabler/icons';
import { Route, useNavigate } from "react-router-dom";
import StatsRing, { StatsRingProps } from './StatsRing';
import StatsGroup, { StatsGroupProps } from './GroupedStats';
import { openModal, closeAllModals } from '@mantine/modals';
import axios from 'axios';
import React from 'react';
import jwt_decode from "jwt-decode";
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import MyCourses from './MyCourses';

const useStyles2 = createStyles((theme) => ({
    root: {
        padding: theme.spacing.xl * 1.5,
    },

    value: {
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1,
    },

    diff: {
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
    },

    icon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
    },

    title: {
        fontWeight: 700,
        textTransform: 'uppercase',
    },

}));


const useStyles = createStyles((theme) => ({
    link: {
        width: 50,
        height: 50,
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },

    active: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}));



interface NavbarLinkProps {
    icon: TablerIcon;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    const { classes, cx } = useStyles();
    return (
        <Tooltip label={label} position="right" transitionDuration={0}>
            <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
                <Icon stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconPlus, label: 'Add' },
    { icon: IconSettings, label: 'Settings' },
];


export function NavbarMinimal() {
    const [user, setUser] = React.useState({} as any);
    const [numberOfCourses, setNumberOfCourses] = React.useState(0);
    React.useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setUser(jwt_decode(localStorage.getItem("accessToken") as string));
            console.log("_____________dsfsd______000000");
            console.log(user);
        }
    }, []);


    const getCourses = () => {
        axios
            .get("http://localhost:4000/api/courses")
            .then((response) => {
                let number = 0;
                const userToken = jwt_decode(localStorage.getItem("accessToken") as string) as any;

                response.data.forEach((item: any) => {
                    if (item.createdBy) {
                        if (item.createdBy === userToken._id)
                            number++;
                    }
                })
                setNumberOfCourses(number);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    React.useEffect(getCourses, []);

    let [checked, setChecked] = useState<boolean>();

    let description = '';
    let link = '';
    let name = '';
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
                description = '';
                link = '';
                name = '';
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
                <TextInput required={true} label="Course name" placeholder="Course name" onChange={(event) => name = event.target.value} data-autofocus />
                <Textarea required={true} label="Description" onChange={(event) => description = event.target.value} />
                <p>Paste youtube link</p>
                <TextInput label="Youtube link" onChange={(event) => link = event.target.value} />
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


    const [active, setActive] = useState(2);
    const navigate = useNavigate();

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => {
                setActive(index); if (link.label == 'Add') {
                    openModal(addModal)
                }
            }}
        />
    ));
    const { classes } = useStyles2();
    const stats = {
        data: [
            {
                label: 'A %',
                color: 'red',
                icon: 'down',
                progress: 20,
                stats: 'Time spend'

            },
            {
                label: 'l %',
                color: 'blue',
                icon: 'up',
                progress: 10,
                stats: 'Total Views '

            },
            {
                label: 'Incrase %',
                color: 'blue',
                icon: 'down',
                progress: 50,
                stats: 'Rejection'

            },

        ]
    } as StatsRingProps;

    const groupedStats = {
        data: [{
            description: 'Added courses',
            stats: numberOfCourses.toString(),
            title: 'Current'
        }]
    } as StatsGroupProps;

    return (
        <>
            <Flex
                mih={80}
                bg="rgba(0, 0, 0, .1)"
                gap="lg"
                justify="flex-start"
                align="top"
                direction="row"
                wrap="nowrap"
            >

                <div  >
                    <Center mt={0} mr={800} style={{  width: '100%', height: 500 }}>
                        <Box> 
                            <h2>Course statistics</h2>


                            <>
                                <StatsGroup data={groupedStats.data}></StatsGroup>
                                <br />
                                <SimpleGrid cols={1} spacing="lg" verticalSpacing="xs">
                                    <StatsRing data={stats.data}></StatsRing>
                                </SimpleGrid>
                            </>
                        </Box>
                    </Center>

                </div>

            </Flex>


        </>
    );
}

export default NavbarMinimal