import React, { ReactNode, useState } from 'react';
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    SimpleGrid,
    useToast,
    Spinner,
    Table,
    Button,
    TableCaption,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Input,
    Select,
} from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useEffect } from 'react';
import { useAuth } from '../auth/authContext';
import axios from 'axios';

// const LinkItems = [
//     { name: 'Shtepi', icon: FiHome, href: '/dashboard' },
//     { name: 'Pajisjet', icon: FiCompass, href: '/devices' },
//     { name: 'Statistika', icon: FiCompass, href: '/statistics' },
//     { name: 'Shto punetor', icon: FiCompass, href: '/add-employer'},
//     { name: 'Shto pajisje', icon: FiCompass, href: '/add-device'},
//     { name: 'Perditeso passwordin', icon: FiCompass, href: '/dashboard' },
// ];

export default function SidebarWithHeader({ children }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, loading, logout, isAdmin } = useAuth();
    const [countryCode, setCountryCode] = useState('');
    const [count, setCount] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [callCenter, setCallCenter] = useState(null);
    const [administration, setAdministration] = useState(null);
    const [employers, setEmployers] = useState([]);
    const [devicesNumber, setDevicesNumber] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [employeersNumber, setEmployeersNumber] = useState(null);
    const [agentId, setAgentId] = useState('');
    const [department, setDepartment] = useState('');



    useEffect(() => {
        const fetchEmployers = async () => {
            try {
                const response = await axios.get(
                    `https://cm-dp-backend.onrender.com/api/employeers`, {
                    withCredentials: true
                });

                console.log('Response employeers: ', response);
                setEmployers(response.data);
            } catch (error) {
                console.log('error employers: ', error);
            }
        };

        const fetchCountDevices = async () => {
            try {
                const response = await axios.get(
                    `https://cm-dp-backend.onrender.com/api/devices/count`, {
                    withCredentials: true
                }
                );

                console.log(response.data);
                setDevicesNumber(response.data.countDevices);
            } catch (error) {
                console.log('error devices: ', error);
            }
        };

        const fetchNumberofEmployeers = async () => {
            try {
                const response = await axios.get(
                    `https://cm-dp-backend.onrender.com/api/employeers/countEmployers`, {
                    withCredentials: true
                }
                );

                console.log(response.data);
                setEmployeersNumber(response.data.countEmployers);
            } catch (error) {
                console.log('error: ', error);
            }
        }

        fetchEmployers();
        fetchCountDevices();
        fetchNumberofEmployeers();
    }, []);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            if (keyword) {
                // Search by name
                const response = await axios.get(
                    `https://cm-dp-backend.onrender.com/api/employeers/search?keyword=${keyword}`,
                    { withCredentials: true }
                );
                setSearchResults(response.data.rows);
                if (response.data.rows.length === 0) {
                    toast({
                        title: "No results found",
                        status: "warning",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } else if (agentId) {
                // Search by agent ID
                const response = await axios.get(
                    `https://cm-dp-backend.onrender.com/api/employeers/agent/${agentId}`,
                    { withCredentials: true }
                );
                if (response.data) {
                    setSearchResults([response.data]);
                } else {
                    setSearchResults([]);
                    toast({
                        title: "Employer not found",
                        status: "warning",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            }
            else if (department) {
                const response = await axios.get(
                    `https://cm-dp-backend.onrender.com/api/employeers/department/${department}`,
                    { withCredentials: true }
                );
                console.log(department);
                setSearchResults(response.data.employeers);
                if (response.data.rows.length === 0) {
                    toast({
                        title: "No results found",
                        status: "warning",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            }
            else {
                const response = await axios.get(
                    `https://cm-dp-backend.onrender.com/api/employeers`,
                    { withCredentials: true }
                );
                setSearchResults(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const retrieveEmployers = async () => {
            try {
                const response = await axios.get(
                    `https://cm-dp-backend.onrender.com/api/employeers`, {
                    withCredentials: true
                });

                console.log('Response employeers: ', response);
                setSearchResults(response.data);
            } catch (error) {
                console.log('error employers: ', error);
            }
        };

        retrieveEmployers();
    }, []);



    return (
        <Box minH="100vh" bg='gray.100'>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>

            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {children}

                <Text color='black' fontSize={'3xl'} fontFamily={'Bricolage Grotesque'}>
                    Mire se erdhet, {user && user.name} {user && user.surname}
                </Text>


                <Box mt={5}>
                    <SimpleGrid columns={3} spacing='30px'>


                        {/* <Box bg='#000' p={5} rounded='2xl'>
                            <Text fontFamily={'Bricolage Grotesque'} color='white' fontSize={'xl'}>
                                Numri total i punetoreve te regjistruar
                            </Text>

                            {isLoading ? (
                                <Spinner />
                            ) : (
                                <Text fontFamily={'Bricolage Grotesque'} color='white' fontSize={'2xl'}>
                                    {employeersNumber ? employeersNumber : 0}
                                </Text>
                            )}
                        </Box>

                        <Box bg='#000' p={5} rounded='2xl'>
                            <Text fontFamily={'Bricolage Grotesque'} color='white' fontSize={'xl'}>
                                Numri i pajisjeve te regjistruara
                            </Text>

                            {isLoading ? (
                                <Spinner />
                            ) : (
                                <Text fontFamily={'Bricolage Grotesque'} color='white' fontSize={'2xl'}>
                                    {devicesNumber ? devicesNumber : 0}
                                </Text>
                            )}
                        </Box>

                        <Box bg='#000' p={5} rounded='2xl'>
                            <Text fontFamily={'Bricolage Grotesque'} color='white' fontSize={'xl'}>
                                Numri i punetoreve ne Administrate
                            </Text>

                            {isLoading ? (
                                <Spinner />
                            ) : (
                                <Text fontFamily={'Bricolage Grotesque'} color='white' fontSize={'2xl'}>
                                    {administration ? administration : 0}
                                </Text>
                            )}
                        </Box> */}

                    </SimpleGrid>

                    <SimpleGrid columns={4} spacing={'15px'}>
                        <Input
                            type="text"
                            placeholder="Kerko me Emer dhe Mbiemer"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            mt={4}
                            bg='#fff'
                        // border='1.5px solid red'
                        />

                        <Input
                            type="text"
                            placeholder="Kerko me Agent ID"
                            value={agentId}
                            onChange={(e) => setAgentId(e.target.value)}
                            mt={4}
                            // border='1.5px solid red'
                            bg='#fff'
                        />


                        <Select
                            placeholder='Kerko sipas departamentit'
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            mt={4}
                            // border='1.5px solid red'
                            bg='#fff'
                        >
                            <option value='INB'>Inbound (INB)</option>
                            <option value='TM'>Telemarketing (TM)</option>
                            <option value='AD'>Administration (AD)</option>
                            <option value='CCD'>CCD (CCD)</option>
                            <option value='IT'>IT (IT)</option>
                            <option value='SH'>Shop</option>
                        </Select>

                        <Button onClick={handleSearch} mt={4} bg='black'
                            color='white' _hover={{ bg: 'black' }}>
                            Kerko
                        </Button>



                    </SimpleGrid>




                    <Table size='lg' mt={8}>
                        <Thead>
                            <Tr>
                                <Th>
                                    Id
                                </Th>
                                <Th>Emri</Th>
                                <Th>Mbiemri</Th>
                                <Th>Agent Id</Th>
                                <Th>Pozita</Th>
                                <Th>Shteti</Th>
                                <Th>Kompania</Th>
                                <Th>Departamenti</Th>
                                <Th>Veprime</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {searchResults.length > 0 ? (
                                searchResults.map((employer) => (
                                    <Tr key={employer.id}>
                                        <Td>{employer.id}</Td>
                                        <Td>{employer.name}</Td>
                                        <Td>{employer.surname}</Td>
                                        <Td>{employer.agentId}</Td>
                                        <Td>{employer.position}</Td>
                                        <Td>{employer.countryCode}</Td>
                                        <Td>{employer.company}</Td>
                                        <Td>{employer.department}</Td>
                                        <Button as='a' href={`/employeer-details/${employer.id}`}
                                            bg='black' size='sm' color={'white'} _hover={{ bg: 'black' }}>
                                            Detajet
                                        </Button>

                                        <Button as='a' mt={1} size='sm' href={`/employeers/update/${employer.id}`}
                                            bg='black' color='white' _hover={{ bg: 'black' }}>
                                            Perditeso
                                        </Button>
                                    </Tr>
                                ))
                            ) : searchResults.length === 0 ? (
                                <Tr>
                                    <Td colSpan="9" textAlign="center">
                                        Nuk u gjet asnje rezultat.
                                    </Td>
                                </Tr>
                            ) : (
                                <Tr>
                                    <Td colSpan="9" textAlign="center">
                                        Duke ngarkuar...
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>




                </Box>



            </Box>
        </Box>
    );
}


const SidebarContent = ({ onClose, ...rest }) => {
    const { user, loading, logout, isAdmin } = useAuth();
    const LinkItems = [
        { name: 'Shtepi', icon: FiHome, href: '/dashboard' },
        { name: 'Kategoritë', icon: FiCompass, href: '/categories' },
        { name: 'Porositë / Shitjet', icon: FiCompass, href: '/orders' },
        { name: 'Partnerat', icon: FiCompass, href: '/partners' },
        { name: 'Produktet', icon: FiCompass, href: '/products' },
        { name: 'Stock', icon: FiCompass, href: '/stocks' },
        { name: 'Taksat', icon: FiCompass, href: '/taxes' },
    ];

    // if(user && isAdmin()) {
    //     LinkItems.push({name: 'Shto punetor', icon: FiCompass, href: '/add-employer'});
    //     LinkItems.push({ name: 'Shto pajisje', icon: FiCompass, href: '/add-device'});
    // }
    return (
        <Box
            transition="3s ease"
            bg={'transparent'}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="Bricolage Grotesque" fontWeight="bold">
                    Emona 2024
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} href={link.href}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};


const NavItem = ({ icon, href, children, ...rest }) => {
    const { user, loading, logout } = useAuth();
    return (
        <Link href={href} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                fontFamily={'Bricolage Grotesque'}
                fontSize={'xl'}
                _hover={{
                    bg: 'black',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};


const MobileNav = ({ onOpen, ...rest }) => {
    const { user, loading, logout } = useAuth();
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={'transparent'}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                CM-DP
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://www.studio-moderna.com/img/logos/studio_moderna_logo.png'
                                    }
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{user && user.name}</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        {user && user.role}
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem>Profile</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={logout}>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};