import { Button, Center, Grid, Group, Text, TextInput, } from "@mantine/core";
import { useForm } from '@mantine/form';
import jwt_decode from "jwt-decode";

export function Settings() {
 

   let user = jwt_decode(localStorage.getItem("accessToken")) as any;


   const form = useForm({
      initialValues: { firstName: user.firstname, lastName: user.lastname, email: user.email, age: 0 },

      validate: {
         firstName: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
         lastName: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),

         email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
         age: (value) => (value < 18 ? 'You must be at least 18 to register' : null),
      },
   });

   return (<>
      <Grid>
         <Grid.Col span={2} offset={1}></Grid.Col>

         <Grid.Col span={8}>
            <Center style={{ width: 150, height: 150 }}>
               <Text fz="xl" fw={700} ta="center">Your settings</Text>
            </Center>
            <Group>
               <form onSubmit={form.onSubmit(console.log)}>
                  <TextInput label="First name" placeholder="Name" {...form.getInputProps('firstName')} />
                  <TextInput label="Last name" placeholder="Name" {...form.getInputProps('lastName')} />

                  <TextInput mt="sm" label="Email" placeholder="Email" {...form.getInputProps('email')} />
     
                  <Button type="submit" mt="sm">
                     Submit
                  </Button>
               </form>

            </Group>
         </Grid.Col>
         <Grid.Col span={1} offset={3}></Grid.Col>
      </Grid></>)
}

export default Settings;


