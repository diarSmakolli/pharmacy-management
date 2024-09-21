import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
    useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';


export default function Login() {
    const toast = useToast();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        updatedAt: ''
    });

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name == 'email') setUsernameError('');
        if (name == 'password') setPasswordError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;

        if (!formData.username) {
            setUsernameError('Username is required!');
            hasError = true;
        }

        if (!formData.password) {
            setPasswordError('Password is required!');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:6099/api/users/login',
                {
                    ...formData,
                    updatedAt: new Date().toISOString(),
                },
                {
                    withCredentials: true,
                }
            );

            console.log('Response: ', response);
            console.log('Response Data: ', response.data);

            toast({
                title: 'Success',
                description: response.data.message,
                status: 'success',
                position: 'top-right',
                duration: 3000,
                isClosable: true,
            });

            localStorage.setItem('token', response.data.token);

            setTimeout(() => {
                window.location.href = '/dashboard'
            }, 2000);
        } catch (error) {
            console.log('Error response: ', error.response);
            console.error('Error response: ', error.response);

            const { response } = error;

            switch (response.data.statusCode) {
                case 400:
                    toast({
                        title: 'Bad request',
                        description: response.data.message,
                        status: 'error',
                        position: 'top-right',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
                case 404:
                    toast({
                        title: 'Not found',
                        description: response.data.message,
                        status: 'warning',
                        position: 'top-right',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
                case 401:
                    toast({
                        title: 'Unauthorized',
                        description: response.data.message,
                        status: 'error',
                        position: 'top-right',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
                default:
                    toast({
                        title: 'Internal Server Error',
                        description: response.data.message,
                        status: 'error',
                        position: 'top-right',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
            }

        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.100', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>

                    <Heading fontSize={'4xl'}>Emona 2024</Heading>

                    <Heading fontSize={'2xl'}>Kycu ne llogarine tende</Heading>

                </Stack>
                <form onSubmit={handleSubmit}>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="username">
                                <FormLabel>Username</FormLabel>
                                <Input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            {usernameError && (
                                <Text py={0} color='red.500' fontSize={'md'}>
                                    {usernameError}
                                </Text>
                            )}

                            <FormControl id="password">
                                <FormLabel>Password</FormLabel>
                                <Input type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            {passwordError && (
                                <Text py={0} color='red.500' fontSize={'md'}>
                                    {passwordError}
                                </Text>
                            )}

                            <Stack spacing={10}>

                                <Button
                                    bg={'red.500'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'red.700',
                                    }}
                                    type='submit'
                                >
                                    Kycu
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </form>

            </Stack>

        </Flex>
    );
}