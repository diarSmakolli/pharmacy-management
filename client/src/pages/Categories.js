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
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
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
import emonalogo from '../images/emona.png';

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
    const [categories, setCategories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:6099/api/categories', {
                withCredentials: true,
            });
            console.log(response.data);
            setCategories(response.data.data);
        } catch (error) {
            toast({
                title: 'Error në marrjen e kategorive',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const addCategory = async () => {
        if (!categoryName) {
            toast({
                title: 'Emri i kategorisë nuk mund të jetë bosh',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:6099/api/categories', { name: categoryName });
            setCategories([...categories, response.data]);
            toast({
                title: 'Kategoria u shtua me sukses',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setCategoryName('');
            setIsAddModalOpen(false);
        } catch (error) {
            toast({
                title: 'Error në shtimin e kategorisë',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const deleteCategory = async () => {
        try {
            await axios.delete(`http://localhost:6099/api/categories/${selectedCategory.id}`);
            setCategories(categories.filter((category) => category.id !== selectedCategory.id));
            toast({
                title: 'Kategoria u fshi',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast({
                title: 'Error në fshirjen e kategorisë',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);


    return (
        <Box minH="100vh" bg='#17191e'>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer border='0'
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
            <Box ml={{ base: 0, md: 60 }} p="4" >
                {children}

                <Text color='white' fontSize={'3xl'} fontFamily={'Bricolage Grotesque'}>
                    Kategoritë
                </Text>

                <Button
                    bg='#242731'
                    border='1px solid #30393d'
                    rounded='2xl'
                    color='white'
                    _hover={{ bg: '#242731' }}
                    onClick={() => setIsAddModalOpen(true)} mt={4}>
                    Shto një kategori
                </Button>



                {isLoading ? (
                    <Spinner />
                ) : (
                    <Table variant="simple" border='0'>
                        <Thead border='0'>
                            <Tr border='0'>
                                <Th color='gray.400' border='0'>Kategoria ID</Th>
                                <Th color='gray.400' border='0'>Emri kategorisë</Th>
                                <Th color='gray.400' border='0'>Operacione</Th>
                            </Tr>
                        </Thead>
                        <Tbody border='0'>
                            {categories.map((category) => (
                                <Tr key={category.id} border='0'>
                                    <Td color='gray.400' border='0'>{category.id}</Td>
                                    <Td color='gray.400' border='0'>{category.name}</Td>
                                    <Td color='gray.400' border='0'>
                                        <Button
                                            bg='#242731'
                                            border='1px solid #30393d'
                                            rounded='2xl'
                                            color='white'
                                            _hover={{ bg: '#242731' }}
                                            onClick={() => {
                                                setSelectedCategory(category);  // Set the selected category
                                                setIsDeleteModalOpen(true);     // Open the delete modal
                                            }}
                                        >
                                            Fshij
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}

            </Box>
            {/* bg={'#242731'} border='1px solid #30393d' */}

            {/* Add Category Modal */}
            <Modal
                bg={'#242731'}
                border='1px solid #30393d'
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                position='right'
            >
                <ModalOverlay backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent bg={'#242731'} rounded='2xl'  border='1px solid #30393d' >
                    <ModalHeader color='gray.200'>Shto një kategori të re</ModalHeader>
                    <ModalCloseButton bg='transparent' color='white' />
                    <ModalBody>
                        <FormControl>
                            <FormLabel color='gray.200'>Emri i kategorisë</FormLabel>
                            <Input
                                value={categoryName}
                                background='gray.900'
                                color='gray.50'
                                border='1px solid #30393d'
                                _hover={{ border: '1px solid #30393d' }}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Shkruaj emrin e kategorisë"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button bg='#17191e' border='2px solid #21272a' rounded='xl' color='white' _hover={{ bg: 'black' }} onClick={addCategory}>
                            Shto
                        </Button>
                        <Button bg='#17191e' border='2px solid #21272a' rounded='xl' color='white' _hover={{ bg: 'black' }} onClick={() => setIsAddModalOpen(false)} ml={3}>
                            Anulo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>




            <Modal bg={'#252529'} border='1px solid #30393d' isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <ModalOverlay  backdropFilter='blur(10px) hue-rotate(90deg)'/>
                <ModalContent bg={'#252529'} rounded='2xl'>
                    <ModalHeader color='gray.200'>Fshij kategorinë</ModalHeader>
                    <ModalCloseButton bg='transparent' color='white' />
                    <ModalBody color='gray.200'>
                        A jeni të sigurtë që dëshironi ta fshini këtë kategori{' '}
                        <strong>{selectedCategory?.name}</strong>?
                    </ModalBody>
                    <ModalFooter>
                        <Button bg='#17191e' border='2px solid #21272a' rounded='xl' color='white' _hover={{ bg: 'black' }} onClick={deleteCategory}>
                            Fshij
                        </Button>
                        <Button bg='#17191e' border='2px solid #21272a' rounded='xl' color='white' _hover={{ bg: 'black' }} onClick={() => setIsDeleteModalOpen(false)} ml={3}>
                            Anulo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* <Drawer
                placement='right'
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                size='xl'
            >
                <DrawerOverlay backdropFilter='blur(10px) hue-rotate(90deg)' />
                <DrawerContent bg={'#252529'} rounded='2xl'>
                    <DrawerCloseButton bg='transparent' color='white' />
                    <DrawerHeader color='gray.200'>Fshij kategorinë</DrawerHeader>

                    <DrawerBody color='gray.200'>
                        A jeni të sigurtë që dëshironi ta fshini këtë kategori{' '}
                        <strong>{selectedCategory?.name}</strong>?
                    </DrawerBody>

                    <DrawerFooter>
                        <Button bg='#17191e' border='2px solid #21272a' rounded='xl' color='white' _hover={{ bg: 'black' }} onClick={deleteCategory}>
                            Fshij
                        </Button>
                        <Button bg='#17191e' border='2px solid #21272a' rounded='xl' color='white' _hover={{ bg: 'black' }} onClick={() => setIsDeleteModalOpen(false)} ml={3}>
                            Anulo
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer> */}

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
        { name: 'Faturat', icon: FiCompass, href: '/invoices' },
    ];

    // if(user && isAdmin()) {
    //     LinkItems.push({name: 'Shto punetor', icon: FiCompass, href: '/add-employer'});
    //     LinkItems.push({ name: 'Shto pajisje', icon: FiCompass, href: '/add-device'});
    // }
    return (
        <Box
            transition="3s ease"
            bg={'transparent'}
            border='0'
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="Bricolage Grotesque" fontWeight="bold" color='gray.300'>
                    Emona 2024
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} href={link.href} color='gray.200'>
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
                    bg: '#242731',
                    color: 'white',
                    border: '1px solid #30393d'
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
            border='0'
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
                Emona 2024
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Image
                                    src={emonalogo}
                                    alt="logo"
                                    width="150px"
                                    height="auto"
                                    rounded='lg'
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm" color='gray.200'>{user && user.name}</Text>
                                    <Text fontSize="xs" color="gray.400">
                                        {user && user.role}
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={'#242731'}
                            border='1px solid #30393d'
                        >
                            <MenuItem bg='transparent' color='gray.300'>Profile</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={logout} bg='transparent' color='gray.300'>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};