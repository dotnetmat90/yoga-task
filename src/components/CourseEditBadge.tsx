import { IconEdit, IconHeart, IconRecycle, IconTrash } from '@tabler/icons';
import { Card, Image, Text, Group, Badge, Button, ActionIcon, createStyles, Center } from '@mantine/core';
import ReactPlayer from 'react-player'
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },

    like: {
        color: theme.colors.red[6],
    },

    label: {
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.xs,
        fontWeight: 700,
    },
}));

interface BadgeCardProps {
    id: string;
    image: string;
    title: string;
    deleteAction;
    editAction;
    video: string;
    country: string;
    description: string;
    badges: {
        emoji: string;
        label: string;
    }[];
}


export function CourseEditBadge({ id, image, video, title, deleteAction, editAction, description, country, badges }: BadgeCardProps) {

    const navigate = useNavigate();


    const { classes, theme } = useStyles();
    const features = badges.map((badge) => (
        <Badge
            color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
            key={badge.label}
            leftSection={badge.emoji}
        >
            {badge.label}
        </Badge>
    ));

    const runDeleteAction = (event) => {
        console.log(event);
    };
    return (
        <Card withBorder radius="md" p="lg" className={classes.card}>
            <Card.Section>

                {video ? (<>
                    <Center>
                        <video className='center' height={180} controls={false} autoPlay={false} muted playsInline >
                            <source src={video} type="video/mp4" />
                        </video>
                    </Center>
                </>) :
                    (<>
                        <Center>
                            <Image src={image} alt={title} height={180} />
                        </Center>
                    </>)}

            </Card.Section>

            <Card.Section className={classes.section} mt="md">
                <Group position="apart">
                    <Text size="lg" weight={500}>
                        {title}
                    </Text>
                 </Group>
                <Text size="sm" mt="xs">

                </Text>
            </Card.Section>

            <Card.Section className={classes.section}>
                <Text mt="md" className={classes.label} color="dimmed">
                    {description}
                </Text>
                <Group spacing={7} mt={5}>
                    {features}
                </Group>
            </Card.Section>

            <Group mt="xs">
                <Button radius="md" style={{ flex: 1 }} onClick={(e: any) => navigate('/courses/' + id)}>
                    Watch
                </Button>
                <ActionIcon variant="default" radius="md" onClick={() => editAction(id)} size={36}>
                    <IconEdit size={18} className={classes.like} stroke={1.5} />
                </ActionIcon>
                <ActionIcon variant="default" radius="md" onClick={() => deleteAction(id)} size={36}>
                    <IconTrash size={18} className={classes.like} stroke={1.5} />
                </ActionIcon>
            </Group>
        </Card>
    );
}

export default CourseEditBadge;