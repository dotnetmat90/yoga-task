import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { createStyles, Image, Paper, Text, Title, Button, useMantineTheme, Center } from '@mantine/core';
import { useNavigate } from 'react-router';

const useStyles = createStyles((theme) => ({
  card: {
    height: 200,
    maxHeight: 200,
    maxWidth: 150,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
 
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 500,
    color: theme.black,
    lineHeight: 1.2,
    fontSize: 15,
    marginTop: theme.spacing.xs,
  },
  backgroundVideo : {
      width: '100wh',
      height: '100wh',
      objectFit: 'cover',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: -1
      
  },
  category: {
    color: theme.white,
    opacity: 0.7,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
}));

interface CardProps {
  image: string;
  title: string;
  video: string;
  _id: string;
}

function Card({ image, title, video, _id }: CardProps) {
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <Paper
      shadow="md"
      p="xs"
       className={classes.card}
    >
      <div>
      {video ? (<>
          <Center>
            <video style={{maxWidth: 100}}   height={100} controls={false} autoPlay={false} muted playsInline >
              <source src={video} type="video/mp4" />
            </video>
          </Center>
        </>) :
          (<>
            <Center>
            <Image src={image}  fit="contain" alt={title} style={{maxWidth: 180, marginLeft: 'auto', marginRight: 'auto'}}  height={100} />

            </Center>
          </>)}
        
        <Title order={3} className={classes.title}>
          {title}
        </Title>
      </div>
      <br/>
      <Button variant="filled" onClick={()=>  navigate('/courses/' + _id)} size={"xs"} color="blue">
        Watch
      </Button>
    </Paper>
  );
}

export default interface ContinueToWatch {
  image: string;
  video: string;
  title: string;
  _id: string;
}



export function CardsCarousel(props: {data: ContinueToWatch[]}) {
  const { data } = props;
  console.log(data);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const slides = data.map((item) => (
    <Carousel.Slide key={item.title}>
      <Card {...item} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      slideSize="20%"
      breakpoints={[{ maxWidth: 'sm', slideSize: '100%', slideGap: 1 }]}
      slideGap="xs"
      align="start"
      slidesToScroll={mobile ? 1 : 2}
    >
      {slides}
    </Carousel>
  );
}