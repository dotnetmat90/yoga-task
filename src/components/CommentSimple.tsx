import { createStyles, Text, Avatar, Group } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    body: {
        paddingLeft: 54,
        paddingTop: theme.spacing.sm,
    },
}));

interface CommentSimpleProps {
    postedAt: string;
    body: string;
    name: string;
}

export function CommentSimple({ postedAt, body, name }: CommentSimpleProps) {
    const { classes } = useStyles();
    return (
        <div>
            <Group>
                <Avatar src={null} alt="no image here" color="indigo" />
                <div>
                    <Text size="sm">{name}</Text>
                    <Text size="xs" color="dimmed">
                        {postedAt}
                    </Text>
                </div>
            </Group>
            <Text className={classes.body} size="sm">
                {body}
            </Text>
        </div>
    );
}
export default CommentSimple;