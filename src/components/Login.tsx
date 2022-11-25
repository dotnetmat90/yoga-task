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
} from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import jwt_decode from "jwt-decode";

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

export function Login() {

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();

    var object = {
      email: "",
      password: "",
    };

    if (email && password) {
      object.email = email;
      object.password = password;

      console.log(object);

      axios
        .post("http://localhost:4000/api/users/login", object)
        .then((token: any) => {
          console.log(token);
          localStorage.setItem("accessToken", token.data.accessToken);
          const object = jwt_decode(token.data.accessToken) as any;
           localStorage.type = object.type;

          if (object.type == "student")
            navigate("/courses");
          else
            navigate("/manage-panel");
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
          Welcome back!
        </Title>

        <TextInput label="Email address" placeholder="hello@gmail.com" size="md" onChange={(e) => setEmail(e.target.value)} />
        <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" onChange={(e) => setPassword(e.target.value)} />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md" onClick={(e) => handleSubmit(e)}>
          Login
        </Button>

        <Text align="center" mt="md">
          Don&apos;t have an account?{' '}
          <Anchor<'a'> href="#" weight={700} onClick={(event) => navigate("/register")}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}

export default Login;