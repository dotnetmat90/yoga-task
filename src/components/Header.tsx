import { createStyles, Text, Header, Menu, Group, Center, Burger, Container, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons';
import { Navigate, useNavigate } from 'react-router';
import jwt_decode from "jwt-decode";
import { useEffect, useRef } from 'react';

const useStyles = createStyles((theme) => ({
  logo: {
    fontSize: 36,
    cursor: "pointer",
  }
  ,

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));

interface HeaderSearchProps {
  links: { link: string; label: string; links: { link: string; label: string, userType: string }[], userType: string }[];
}


export function HeaderMenu({ links }: HeaderSearchProps) {
  let items = [];
  const isInitialMount = useRef(true);

  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();
  const navigateTo = useNavigate();
  var token = localStorage.getItem("accessToken") as string;
  let user = null;
  if (token) {
    user = jwt_decode(token) as any;
  }

  const getUserName = () => {
    if (!user) return '';
    return user.firstname[0] + user.lastname[0];
  }
  const navigate = (event, link) => {
    event.preventDefault();

    if (link === "/signout") {
      window.localStorage.clear();
      navigateTo("");
    } else {
      navigateTo(link)
    }
  }

  let filterdLinks = links;

  if (!user) {
    links = filterdLinks.filter(link => link.userType === "none");
  } else {
    links = filterdLinks.filter(link => link.userType === user.type);

  }

  items = links.map((link) => {
    const menuItems = link.links?.filter(item => item.userType === user.type || item.userType === "none").map((item) => (
      <Menu.Item key={item.link} onClick={(event) => navigate(event, item.link)}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" exitTransitionDuration={0}>
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => navigate(event, link.link)}
            >
              <Center>
                {link.label === "User" ? <>
                <Avatar color="cyan" radius="xl">{getUserName()}</Avatar>
                </>
                  :
                  <> <span className={classes.linkLabel}>{link.label}</span>
                  </>}
                <IconChevronDown size={12} stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => navigate(event, link.link)}
      >
        {link.label}
      </a>
    );
  });

  return (
    <Header height={60}  >
      <Container>
        <div className={classes.inner}>
          <Text onClick={(event) => navigate(event, "/")} className={classes.logo} >Suffice </Text>
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
          <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
        </div>
      </Container>
    </Header>
  );
}

