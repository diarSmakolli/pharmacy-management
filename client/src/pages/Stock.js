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
            toast({
                title: 'Error në marrjen e taksave',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStock = async () => {
        try {
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
            console.log("err: ", error);
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
                    Gjendja e stokut
                </Text>

                <SimpleGrid columns={4} spacing={1} direction='row'>

                    <Box>
                        <FormLabel mt={4}>Kerko sipas Stock Idse</FormLabel>
                        <Input
                            bg='#fff'
                            value={searchStockId}
                            onChange={(e) => setSearchStockId(e.target.value)}
                            placeholder="Shkruaj Stock Id"
                        />
                    </Box>


                    <Box>
                        <FormLabel mt={4}>Kerko sipas produktit Idse</FormLabel>
                        <Input
                            bg='#fff'
                            value={searchProductId}
                            onChange={(e) => setSearchProductId(e.target.value)}
                            placeholder="Shkruaj produkt Id"
                        />
                    </Box>

                    <Box>
                        <Stack direction='row'>
                            <Box>
                                <FormLabel mt={4}>Sasia minimale</FormLabel>
                                <Input
                                    bg='#fff'
                                    value={searchMinQuantity}
                                    onChange={(e) => setSearchMinQuantity(e.target.value)}
                                    placeholder="Shkruaj sasin minimale"
                                />
                            </Box>

                            <Box>
                                <FormLabel mt={4}>Sasia maksimale</FormLabel>
                                <Input
                                    bg='#fff'
                                    value={searchMaxQuantity}
                                    onChange={(e) => setSearchMaxQuantity(e.target.value)}
                                    placeholder="Shkruaj sasin maksimale"
                                />
                            </Box>
                        </Stack>
                    </Box>

                    <Box>
                        <Button
                            bg='black'
                            color='white'
                            _hover={{ bg: 'black' }}
                            onClick={fetchStocks}
                            direction='row'
                            mt={12}
                            w='100%'
                        >
                            Kërko
                        </Button>
                    </Box>


                </SimpleGrid>


                {isLoading ? (
                    <Spinner />
                ) : (
                    <Table variant="striped" minW={'100%'} size={'sm'} mt={5} p={5}>
                        <Thead>
                            <Tr>
                                <Th>Stock ID</Th>
                                <Th>Sasia</Th>
                                <Th>Produkt ID</Th>
                                <Th>Emri i produktit</Th>
                                <Th>Barkodi</Th>
                                <Th>Description</Th>
                                <Th>Qmimi</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {stocks.map((stock) => (
                                <Tr key={stock.id}>
                                    <Td>{stock.id}</Td>
                                    <Td>{stock.quantity}</Td>
                                    <Td>{stock.productId}</Td>
                                    <Td>{stock.product ? stock.product.name : 'N/A'}</Td>
                                    <Td>{stock.product ? stock.product.barcode : 'N/A'}</Td>
                                    <Td>{stock.product ? stock.product.description : 'N/A'}</Td>
                                    <Td>{stock.product ? stock.product.price : 'N/A'}</Td>
                                    <Td>
                                        <Button
                                            bg='black' color='white' _hover={{ bg: 'black' }}
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
                <ModalContent>
                    <ModalHeader>Shto sasi per kete stock</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Sasia aktuale plus sasia e shkruar</FormLabel>
                            <Input
                                value={quantityToAdd}
                                onChange={(e) => setQuantityToAdd(e.target.value)}
                                placeholder="Shkruaj numrin e sasise"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button bg="black" color="white" _hover={{ bg: 'black' }} onClick={updateStock}>
                            Shto
                        </Button>
                        <Button bg="black" color="white" _hover={{ bg: 'black' }} onClick={onClose} ml={3}>
                            Anulo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Add Category Modal */}
            {/* <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
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
            </Modal> */}

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