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
    Collapse,
    Divider
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
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';


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
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [orders, setOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState({});

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:6099/api/orders', {
                withCredentials: true, // if you're using cookies or auth tokens
            });
            console.log(response.data);
            setOrders(response.data.data); // assuming `data` is the orders array
        } catch (error) {
            toast({
                title: 'Error fetching orders',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    // i have in products taxId categoryId and partnerId, how to get those id and fetch the data from the database\


    const toggleOrderDetails = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    useEffect(() => {
        fetchOrders();
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
                    Porositë / Shitjet
                </Text>

                <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={() => setIsAddModalOpen(true)} mt={4}>Shto një kategori</Button>


                {/*
                {isLoading ? (
                    <Spinner />
                ) : (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Porosia ID</Th>
                                <Th>Krijuar më</Th>
                                <Th>Qmimi total</Th>
                                <Th>Product ID</Th>
                                <Th>Emri produktit</Th>
                                <Th>Barkodi produktit</Th>
                                <Th>Qmimi produktit</Th>
                                <Th>Sasia</Th>
                                <Th>Qmimi per njesi</Th>
                                <Th>Fatura ID</Th>
                                <Th>Qmimi total i fatures</Th>
                                <Th>Taksa</Th>
                                <Th>Metoda e pageses</Th>
                                <Th>Krijuar më</Th> 
                            </Tr>
                        </Thead>
                        <Tbody>
                                {orders.map((order) => (
                                    <Tr key={order.id}>
                                        <Td>{order.id}</Td>
                                        <Td>{new Date(order.created_at).toLocaleDateString()}</Td>
                                        <Td>{order.total_amount}</Td>
                                        {order.products && order.products.map(product => (
                                            <Td key={product.id}>
                                                <Td>{product.id}</Td>
                                                <Td>{product.name}</Td>
                                                <Td>{product.barcode}</Td>
                                                <Td>{product.price}</Td>
                                                <Td>{product.order_details ? product.order_details.quantity : 'N/A'}</Td>
                                                <Td>{product.order_details ? product.order_details.unitPrice : 'N/A'}</Td>
                                            </Td>
                                        ))}
                                        <Td>{order.invoice ? order.invoice.id : 'N/A'}</Td>
                                        <Td>{order.invoice ? order.invoice.total_amount : 'N/A'}</Td>
                                        <Td>{order.invoice ? order.tax_amount : 'N/A'}</Td>
                                        <Td>{order.invoice ? order.payment_mode : 'N/A'}</Td>
                                        <Td>{order.invoice ? order.created_at : 'N/A'}</Td>



                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                )}
                */}

                {isLoading ? (
                    <Spinner />
                ) : (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Porosia ID</Th>
                                <Th>Krijuar më</Th>
                                <Th>Qmimi total</Th>
                                <Th>Nr. Produkteve</Th>
                                <Th>Fatura ID</Th>
                                <Th>Detajet e Produkteve</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {orders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <Tr>
                                        <Td>{order.id}</Td>
                                        <Td>{new Date(order.created_at).toLocaleDateString()}</Td>
                                        <Td>{order.total_amount}</Td>
                                        <Td>{order.products ? order.products.length : 0}</Td>
                                        <Td>{order.invoice ? order.invoice.id : 'N/A'}</Td>
                                        <Td>
                                            <IconButton
                                                icon={expandedOrders[order.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                                onClick={() => toggleOrderDetails(order.id)}
                                                size="sm"
                                            />
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td colSpan={6} p={0}>
                                            <Collapse in={expandedOrders[order.id]} animateOpacity>
                                                <Box p={4} bg="gray.50">
                                                    <Text fontWeight="bold" mb={2}>Produktet e Porosisë:</Text>
                                                    <Table size="sm" variant="unstyled">
                                                        <Thead>
                                                            <Tr>
                                                                <Th>Product ID</Th>
                                                                <Th>Emri</Th>
                                                                <Th>Barkodi</Th>
                                                                <Th>Qmimi</Th>
                                                                <Th>Partner</Th>
                                                                <Th>Category</Th>
                                                                <Th>Tax</Th>
                                                                <Th>Sasia</Th>
                                                                <Th>Qmimi për Njësi</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {order.products && order.products.map((product) => (
                                                                <Tr key={product.id}>
                                                                    <Td>{product.id}</Td>
                                                                    <Td>{product.name}</Td>
                                                                    <Td>{product.barcode}</Td>
                                                                    <Td>{product.price}</Td>
                                                                    <Td>{product.partner ? product.partner.name : 'N/A'}</Td>
                                                                    <Td>{product.category ? product.category.name : 'N/A'}</Td>
                                                                    <Td>{product.tax ? product.tax.name : 'N/A'}</Td>
                                                                    <Td>{product.order_details ? product.order_details.quantity : 'N/A'}</Td>
                                                                    <Td>{product.order_details ? product.order_details.unitPrice : 'N/A'}</Td>
                                                                </Tr>
                                                            ))}
                                                        </Tbody>






                                                    </Table>
                                                    {/* <Text>Krijuar me: {order.created_at}</Text>
                                                        <Text>Total: {order.total_amount.toFixed(2)} $</Text>
                                                        <Text>Tax amount: {order.invoice ? order.tax_amount : 'N/A'}</Text> */}

                                                    <Text fontWeight="bold" mb={2}>Faturimi</Text>

                                                    <Table size="sm" variant="unstyled">
                                                        <Thead>
                                                            <Tr>
                                                                <Th>Porosia ID</Th>
                                                                <Th>Data</Th>
                                                                <Th>Qmimi total</Th>
                                                                <Th>Qmimi TVSH</Th>
                                                                <Th>Fatura ID</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            <Tr>
                                                                <Th>{order.id}</Th>
                                                                <Th>{order.created_at}</Th>
                                                                <Th>{order.total_amount}</Th>
                                                                <Th>{order.invoice ? order.invoice.tax_amount : 'N/A'}</Th>
                                                                <Th>{order.invoice ? order.invoice.id : 'N/A'}</Th>
                                                            </Tr>
                                                        </Tbody>
                                                        <br />
                                                        <Text fontWeight="bold" mb={2}>
                                                            Per detaje me te plota mund ta gjeni faturen e gjeneruar me ID: {order.invoice ? order.invoice.id : 'N/A' }
                                                        </Text>




                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </Td>
                                    </Tr>
                                </React.Fragment>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </Box>
        </Box>
    );
}

// export default function SidebarWithHeader({ children }) {
//     const toast = useToast();
//     const [isLoading, setIsLoading] = useState(false);
//     const [orders, setOrders] = useState([]);
//     const [expandedOrders, setExpandedOrders] = useState({});

//     const fetchOrders = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get('http://localhost:6099/api/orders', { withCredentials: true });
//             setOrders(response.data.data);
//         } catch (error) {
//             toast({
//                 title: 'Error fetching orders',
//                 status: 'error',
//                 duration: 3000,
//                 isClosable: true,
//             });
//             console.log(error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchOrders();
//     }, []);

//     const toggleOrderDetails = (orderId) => {
//         setExpandedOrders((prev) => ({
//             ...prev,
//             [orderId]: !prev[orderId],
//         }));
//     };

//     return (
//         <Box minH="100vh" bg='gray.100'>
//             <Box ml={{ base: 0, md: 60 }} p="4">
//                 {children}

//                 <Text color='black' fontSize={'3xl'} fontFamily={'Bricolage Grotesque'}>
//                     Porositë / Shitjet
//                 </Text>

//                 {isLoading ? (
//                     <Spinner />
//                 ) : (
//                     <Table variant="simple">
//                         <Thead>
//                             <Tr>
//                                 <Th>Porosia ID</Th>
//                                 <Th>Krijuar më</Th>
//                                 <Th>Qmimi total</Th>
//                                 <Th>Nr. Produkteve</Th>
//                                 <Th>Fatura ID</Th>
//                                 <Th>Detajet e Produkteve</Th>
//                             </Tr>
//                         </Thead>
//                         <Tbody>
//                             {orders.map((order) => (
//                                 <React.Fragment key={order.id}>
//                                     <Tr>
//                                         <Td>{order.id}</Td>
//                                         <Td>{new Date(order.created_at).toLocaleDateString()}</Td>
//                                         <Td>{order.total_amount}</Td>
//                                         <Td>{order.products ? order.products.length : 0}</Td>
//                                         <Td>{order.invoice ? order.invoice.id : 'N/A'}</Td>
//                                         <Td>
//                                             <IconButton
//                                                 icon={expandedOrders[order.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
//                                                 onClick={() => toggleOrderDetails(order.id)}
//                                                 size="sm"
//                                             />
//                                         </Td>
//                                     </Tr>
//                                     <Tr>
//                                         <Td colSpan={6} p={0}>
//                                             <Collapse in={expandedOrders[order.id]} animateOpacity>
//                                                 <Box p={4} bg="gray.50">
//                                                     <Text fontWeight="bold" mb={2}>Produktet e Porosisë:</Text>
//                                                     <Table size="sm" variant="unstyled">
//                                                         <Thead>
//                                                             <Tr>
//                                                                 <Th>Product ID</Th>
//                                                                 <Th>Emri</Th>
//                                                                 <Th>Barkodi</Th>
//                                                                 <Th>Qmimi</Th>
//                                                                 <Th>Sasia</Th>
//                                                                 <Th>Qmimi për Njësi</Th>
//                                                             </Tr>
//                                                         </Thead>
//                                                         <Tbody>
//                                                             {order.products && order.products.map((product) => (
//                                                                 <Tr key={product.id}>
//                                                                     <Td>{product.id}</Td>
//                                                                     <Td>{product.name}</Td>
//                                                                     <Td>{product.barcode}</Td>
//                                                                     <Td>{product.price}</Td>
//                                                                     <Td>{product.order_details ? product.order_details.quantity : 'N/A'}</Td>
//                                                                     <Td>{product.order_details ? product.order_details.unitPrice : 'N/A'}</Td>
//                                                                 </Tr>
//                                                             ))}
//                                                         </Tbody>
//                                                     </Table>
//                                                 </Box>
//                                             </Collapse>
//                                         </Td>
//                                     </Tr>
//                                 </React.Fragment>
//                             ))}
//                         </Tbody>
//                     </Table>
//                 )}
//             </Box>
//         </Box>
//     );
// }


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
        { name: 'Faturat', icon: FiCompass, href: '/dashboard' },
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