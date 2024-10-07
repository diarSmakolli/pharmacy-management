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
    Stack,
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
    const [stocks, setStocks] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [quantityToAdd, setQuantityToAdd] = useState(null);
    const [sortById, setSortById] = useState('desc');
    const [searchStockId, setSearchStockId] = useState('');
    const [searchProductId, setSearchProductId] = useState('');
    const [searchMinQuantity, setSearchMinQuantity] = useState('');
    const [searchMaxQuantity, setSearchMaxQuantity] = useState('');


    const fetchStocks = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:6099/api/stocks', {
                params: { page, limit, sortById, stockId: searchStockId, productId: searchProductId, minQuantity: searchMinQuantity, maxQuantity: searchMaxQuantity },
                withCredentials: true,
            });

            console.log(response.data);
            setStocks(response.data.data.stocks);

            console.log("Total stocks: ", response.data.data.total);
            const tp = Math.ceil(response.data.data.total / limit);
            setTotalPages(tp);

            console.log("Total pages: ", tp);

            console.log("Object: ", response);

        } catch (error) {
            const { response } = error;

            switch (response.data.statusCode) {
                case 403:
                    toast({
                        title: 'Forbidden',
                        description: response.data.message,
                        status: 'warning',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
                case 400:
                    toast({
                        title: 'Bad request',
                        description: response.data.message,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
                case 401:
                    toast({
                        title: 'Unauthorized',
                        description: response.data.message,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
                case 404:
                    toast({
                        title: 'Not found',
                        description: response.data.message,
                        status: 'warning',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
                default:
                    toast({
                        title: 'Internal Server Error',
                        description:
                            "An Error has occurred and we're working to fix the problem!",
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
            }

        } finally {
            setIsLoading(false);
        }
    };

    const updateStock = async () => {
        try {

            if(!quantityToAdd) {
                toast({
                    title: 'Gabim',
                    description: 'Ju lutem shkruani sasin qe doni te shtoni',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            await axios.put(`http://localhost:6099/api/stocks/add-stock/${selectedStock.id}`, {
                quantityToAdd
            }, { withCredentials: true });

            toast({
                title: 'Sasia u shtua me sukses',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            setQuantityToAdd('');
            fetchStocks();
            setIsUpdateModalOpen(false);
        } catch (error) {
            const { response } = error;

            switch (response.data.statusCode) {
                case 403:
                    toast({
                        title: 'Forbidden',
                        description: response.data.message,
                        status: 'warning',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
                case 400:
                    toast({
                        title: 'Bad request',
                        description: response.data.message,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
                case 401:
                    toast({
                        title: 'Unauthorized',
                        description: response.data.message,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
                case 404:
                    toast({
                        title: 'Not found',
                        description: response.data.message,
                        status: 'warning',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
                default:
                    toast({
                        title: 'Internal Server Error',
                        description:
                            "An Error has occurred and we're working to fix the problem!",
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;
            }

        }
    }

    useEffect(() => {
        fetchStocks();
    }, [page, limit]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchStocks();
    };
    return (
        <Box minH="100vh" bg='#1c2124'>
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

                <Text color='gray.300' fontSize={'3xl'}>
                    Gjendja e stokut
                </Text>

                <SimpleGrid columns={4} spacing={1} direction='row'>

                    <Box>
                        <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Kerko sipas Stock Idse</FormLabel>
                        <Input
                            value={searchStockId}
                            onChange={(e) => setSearchStockId(e.target.value)}
                            placeholder="Shkruaj Stock Id"
                            bg='transparent'
                            size='sm'
                            border='1px solid #7A869A'
                            rounded={'md'}
                            color='white'
                            _hover={{ border: '1px solid #7A869A' }}
                        />
                    </Box>


                    <Box>
                        <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Kerko sipas produktit Idse</FormLabel>
                        <Input
                            bg='transparent'
                            size='sm'
                            border='1px solid #7A869A'
                            rounded={'md'}
                            color='white'
                            _hover={{ border: '1px solid #7A869A' }}
                            value={searchProductId}
                            onChange={(e) => setSearchProductId(e.target.value)}
                            placeholder="Shkruaj produkt Id"
                        />
                    </Box>

                    <Box>
                        <Stack direction='row'>
                            <Box>
                                <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Sasia minimale</FormLabel>
                                <Input
                                    bg='transparent'
                                    size='sm'
                                    border='1px solid #7A869A'
                                    rounded={'md'}
                                    color='white'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    value={searchMinQuantity}
                                    onChange={(e) => setSearchMinQuantity(e.target.value)}
                                    placeholder="Shkruaj sasin minimale"
                                />
                            </Box>

                            <Box>
                                <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Sasia maksimale</FormLabel>
                                <Input
                                    bg='transparent'
                                    size='sm'
                                    border='1px solid #7A869A'
                                    rounded={'md'}
                                    color='white'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    value={searchMaxQuantity}
                                    onChange={(e) => setSearchMaxQuantity(e.target.value)}
                                    placeholder="Shkruaj sasin maksimale"
                                />
                            </Box>
                        </Stack>
                    </Box>

                    <Box mt='1'>
                        <Button
                            bg='#A1BDD914'
                            color='gray.300'
                            _hover={{ bg: '#A1BDD914' }}
                            onClick={fetchStocks}
                            direction='row'
                            mt={10}
                            size='sm'
                            w='40%'
                        >
                            Kërko
                        </Button>
                    </Box>


                </SimpleGrid>


                {isLoading ? (
                    <Spinner />
                ) : (
                    <Box border={'1px solid #A1BDD914'} rounded='lg' mt={6}>
                        <Table variant="simple" size="sm" pt={2}>
                            <Thead>
                                <Tr borderBottom="1px" borderColor={'#A1BDD914'}>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>ID</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Sasia</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Produkt ID</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Emri i produktit</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Barkodi</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Detaje</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Cmimi</Th>
                                    <Th borderBottom='1px' borderRight={'0px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody >
                                {stocks.map((stock) => (
                                    <Tr key={stock.id}>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{stock.id}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{stock.quantity}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{stock.productId}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{stock.product ? stock.product.name : 'N/A'}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{stock.product ? stock.product.barcode : 'N/A'}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{stock.product ? stock.product.description : 'N/A'}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{stock.product ? stock.product.price : 'N/A'}</Td>
                                        <Td borderRight={'0px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>
                                            <Button
                                                bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }}
                                                size='sm'
                                                onClick={() => {
                                                    setSelectedStock(stock);
                                                    setIsUpdateModalOpen(true);
                                                }}
                                            >
                                                Shto sasi
                                            </Button>
                                        </Td>

                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                )}

                <Stack direction='row' spacing={4} mt={4}>
                    <Button
                        onClick={() => handlePageChange(page - 1)}
                        isDisabled={page === 1}
                        bg='black' _hover={{ bg: 'black' }} color='white'
                        size='sm'
                    >
                        {'<'}
                    </Button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            bg={index + 1 === page ? 'black' : 'white'}
                            color={index + 1 === page ? 'white' : 'black'}
                            _hover={index + 1 === page ? { bg: 'black' } : { bg: 'white' }}
                            size='sm'
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                        // variant={index + 1 === page ? 'solid' : 'outline'}
                        >
                            {index + 1}
                        </Button>
                    ))}
                    <Button
                        bg='black' _hover={{ bg: 'black' }} color='white'
                        size='sm'
                        onClick={() => handlePageChange(page + 1)}
                        isDisabled={page === totalPages}
                    >
                        {'>'}
                    </Button>
                </Stack>

            </Box>

            <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
                <ModalOverlay />
                <ModalContent bg='#282E33'>
                    <ModalHeader color='gray.300'>Shto sasi per kete stock</ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody>
                        <FormControl>
                            <FormLabel color='gray.300'>Sasia aktuale plus sasia e shkruar</FormLabel>
                            <Input
                                value={quantityToAdd}
                                onChange={(e) => setQuantityToAdd(e.target.value)}
                                placeholder="Shkruaj numrin e sasise"
                                bg='#22272B'
                                border='1px solid #7A869A'
                                rounded='3px'
                                _hover={{ border: '1px solid #7A869A' }}
                                color='gray.300'
                                w='100%'
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button bg="#A1BDD914" color="white" _hover={{ bg: '#A1BDD914' }} onClick={updateStock}>
                            Shto
                        </Button>
                        <Button bg="#A1BDD914" color="white" _hover={{ bg: '#A1BDD914' }} onClick={onClose} ml={3}>
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