import {
    Paper,
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
    Switch,
    Select,
} from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';

const useStyles = createStyles((theme) => ({
    wrapper: {
        minHeight: 900,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage:
            'url(https://unsplash.com/photos/Dqx4XWuXu7w/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjY4NzA3NDU0&force=true&w=1920&fit=crop&w=1280&q=80)',
    },

    form: {
        borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
            }`,
        minHeight: 900,
        maxWidth: 450,
        paddingTop: 80,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            maxWidth: '100%',
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    logo: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        width: 120,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
}));

export function Register() {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [checked, setChecked] = React.useState(false);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLasttName] = React.useState("");
    const [subType, setSubType] = React.useState("");





    const handleSubmit = (event: any) => {
        event.preventDefault();

        // if (email == "") setEmailErr(true);
        // if (password == "") setPasswordErr(true);

        var object = {
            firstname: "",
            email: "",
            password: "",
            lastname: "",
            type: "",
            subscriptionType: ""
        };

        if (email && password) {
            object.firstname = firstName;
            object.lastname = lastName;
            object.email = email;
            object.password = password;
            object.type = checked ? 'creator' : 'student';
            object.subscriptionType = 'new';

            console.log(object);

            axios
                .post("http://localhost:4000/api/users", object)
                .then((response) => {
                    console.log(response);
                    if (object.type == 'creator') {

                    }
                    else {
                    navigate('/courses')
                    }
                })
                .catch((message: any) => {
                    console.log(message);
                    showNotification({
                        title: 'Could not login',
                        color: 'red',
                        message: 'Incorrect email address or password.',
                    })
                });
        }
    };

    const navigate = useNavigate();

    const { classes } = useStyles();
    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form} radius={0} p={30}>
                <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
                    Join Suffice community!
                </Title>
                <TextInput label="First name" placeholder="John" size="md" onChange={(e) => setFirstName(e.target.value)} />

                <TextInput label="Last name" placeholder="Doe" size="md" onChange={(e) => setLasttName(e.target.value)} />
                <TextInput label="Email address" placeholder="hello@gmail.com" size="md" onChange={(e) => setEmail(e.target.value)} />
                <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" onChange={(e) => setPassword(e.target.value)} />

                <Switch checked={checked} label={checked ? 'I am creator' : 'I am student '} onChange={(event) => setChecked(event.currentTarget.checked)} />

                {checked ? (<>
                </>) : <><p><Select
                    label="Choose subscription type"
                    placeholder="Pick one"
                    onChange={(selected: string) => setSubType(selected)}
                    data={[
                        { value: 'year', label: 'Yearly ' },
                        { value: 'month', label: 'Monthly' },

                    ]}
                /></p></>}


                <Button fullWidth mt="xl" size="md" onClick={(e) => handleSubmit(e)}>
                    Register
                </Button>
                <Text align="center" mt="md">
                    Already have account?{' '}
                    <Anchor<'a'> href="#" weight={700} onClick={(event) => navigate("/login")}>
                        Login
                    </Anchor>
                </Text>
            </Paper>
        </div>
    );
}

export default Register;