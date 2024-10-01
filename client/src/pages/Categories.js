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
                    Kategoritë
                </Text>

                <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={() => setIsAddModalOpen(true)} mt={4}>Shto një kategori</Button>



                {isLoading ? (
                    <Spinner />
                ) : (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Kategoria ID</Th>
                                <Th>Emri kategorisë</Th>
                                <Th>Operacione</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {categories.map((category) => (
                                <Tr key={category.id}>
                                    <Td>{category.id}</Td>
                                    <Td>{category.name}</Td>
                                    <Td>
                                        <Button
                                            bg='black' color='white' _hover={{ bg: 'black' }}
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

            {/* Add Category Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Shto një kategori të re</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Emri i kategorisë</FormLabel>
                            <Input
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Shkruaj emrin e kategorisë"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={addCategory}>
                            Shto
                        </Button>
                        <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={() => setIsAddModalOpen(false)} ml={3}>
                            Anulo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Fshij kategorinë</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        A jeni të sigurtë që dëshironi ta fshini këtë kategori{' '}
                        <strong>{selectedCategory?.name}</strong>?
                    </ModalBody>
                    <ModalFooter>
                        <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={deleteCategory}>
                            Fshij
                        </Button>
                        <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={() => setIsDeleteModalOpen(false)} ml={3}>
                            Anulo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

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