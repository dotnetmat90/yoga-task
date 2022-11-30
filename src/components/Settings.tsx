import { Button, Center, Grid, Group, Text, TextInput, } from "@mantine/core";
import { useForm } from '@mantine/form';
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router";

export function Settings() {


   let user = jwt_decode(localStorage.getItem("accessToken")) as any;
   const navigate = useNavigate();



   const form = useForm({
      initialValues: { firstName: user.firstname, lastName: user.lastname, email: user.email, age: 0 },

      validate: {
         firstName: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
         lastName: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),

         email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
         age: (value) => (value < 18 ? 'You must be at least 18 to register' : null),
      },
   });

   const updateUser = ( ) => {
      
      const data = {
         firstname: form.values.firstName,
         lastname: form.values.lastName,
         email: form.values.email
      }
      console.log(data)
      axios
         .put("http://localhost:4000/api/users/" + user._id, data)
         .then((response) => {
            localStorage.clear();
            navigate('/');
            return;
         })
         .catch((error) => {
            console.log(error);
         });
   }

   return (<>
      <Grid>
         <Grid.Col span={2} offset={1}></Grid.Col>

         <Grid.Col span={8}>
            <Center style={{ width: 150, height: 150 }}>
               <Text fz="xl" fw={700} ta="center">Your settings</Text>
            </Center>
             <Group>
               <form onSubmit={form.onSubmit((values) => console.log(values))}>
                  <TextInput label="First name" placeholder="Name" {...form.getInputProps('firstName')} />
                  <TextInput label="Last name" placeholder="Name" {...form.getInputProps('lastName')} />
                  <TextInput mt="sm" label="Email" placeholder="Email" {...form.getInputProps('email')} />
                  <Button type="submit" mt="sm" onClick={()=> updateUser()}>
                     Submit
                  </Button>
               </form>

            </Group>
            <br/>
            <strong style={{color:"red"}}>You will be sign out after updating your settings!</strong>

         </Grid.Col>
         <Grid.Col span={1} offset={3}></Grid.Col>
      </Grid></>)
}

export default Settings;


