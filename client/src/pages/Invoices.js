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
    Collapse
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
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
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
    const [partners, setPartners] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [partnerName, setPartnerName] = useState('');
    const [businessNumber, setBusinessNumber] = useState('');
    const [fiscalNumber, setFiscalNumber] = useState('');
    const [commune, setCommune] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [idFilter, setIdFilter] = useState('desc');
    const [searchPartnerId, setSearchPartnerId] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [expandedInvoices, setExpandedInvoices] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedInvoice, setSelectedInvoice] = useState(null);


    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:6099/api/invoices`, {
                params: { page, limit },
                withCredentials: true,
            });

            console.log(response.data.data);
            setInvoices(response.data.data.invoices);
            setTotal(response.data.data.total);

            console.log("total invoices: ", response.data.data.total);

            const tp = Math.ceil(response.data.data.total / limit);
            setTotalPages(tp);

            console.log("total pages: ", tp);

            console.log("Object: ", response);

            setCurrentPage(response.data.data.page);


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

    const handleFetchInvoiceById = async (invoiceId) => {
        try {
            const response = await axios.get(`http://localhost:6099/api/invoices/${invoiceId}`);
            if (response.status === 200) {
                toast({
                    title: 'Printing...',
                    description: `Fatura ${invoiceId} u printua`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to print the invoice.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'There was an error printing the invoice.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [page, limit]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchInvoices();
    };

    const toggleInvoiceDetails = (invoiceId) => {
        setExpandedInvoices((prev) => ({
            ...prev,
            [invoiceId]: !prev[invoiceId],
        }));
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
                    Faturat
                </Text>

                <br /><br />
                {isLoading ? (
                    <Spinner />
                ) : (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Fatura ID</Th>
                                <Th>Porosia ID</Th>
                                <Th>Qmimi i takses</Th>
                                <Th>Qmimi total</Th>
                                <Th>Metoda e pageses</Th>
                                <Th>Krijuar me</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {invoices.map((invoice) => (
                                <React.Fragment key={invoice.id}>
                                    <Tr>
                                        <Td>{invoice.id}</Td>
                                        <Td>{invoice.order_id}</Td>
                                        <Td>{invoice.tax_amount}</Td>
                                        <Td>{invoice.total_amount}</Td>
                                        <Td>{invoice.payment_mode}</Td>
                                        <Td>{invoice.created_at}</Td>

                                        <Td>
                                            {/* <IconButton
                                                icon={expandedOrders[order.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                                onClick={() => toggleOrderDetails(order.id)}
                                                size="sm"
                                            /> */}
                                            <Button bg='black' color='white' _hover={{ bg: 'black' }} size='sm' ml={2}
                                                onClick={() => toggleInvoiceDetails(invoice.id)}
                                            >
                                                Detajet {expandedInvoices[invoice.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                            </Button>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td colSpan={6} p={0}>
                                            <Collapse in={expandedInvoices[invoice.id]} animateOpacity>
                                                <Box p={4} bg="#000" rounded='lg'>
                                                    <Text fontWeight="bold" mb={2} color='white'>Produktet e Porosisë:</Text>
                                                    <Table size="sm" variant="unstyled">
                                                        <Thead>
                                                            <Tr>
                                                                <Th color='white'>Product ID</Th>
                                                                <Th color='white'>Emri</Th>
                                                                <Th color='white'>Barkodi</Th>
                                                                <Th color='white'>Qmimi</Th>
                                                                <Th color='white'>Tax</Th>
                                                                <Th color='white'>Sasia</Th>
                                                                <Th color='white'>Qmimi per njesi</Th>
                                                                <Th color='white'>Discount %</Th>
                                                                <Th color='white'>Discount €</Th>
                                                                <Th color='white'>Totali</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {invoice.products && invoice.products.map((product) => (
                                                                <Tr key={product.id}>
                                                                    <Td color='white'>{product.id}</Td>
                                                                    <Td color='white'>{product.name}</Td>
                                                                    <Td color='white'>{product.barcode}</Td>
                                                                    <Td color='white'>{product.price}€</Td>
                                                                    <Td color='white'>{product.invoicesProduct.tax_rate}</Td>
                                                                    <Td color='white'>{product.invoicesProduct.quantity}</Td>
                                                                    <Td color='white'>{product.invoicesProduct.unit_price}</Td>
                                                                    <Td color='white'>{product.invoicesProduct.discount_percentage}</Td>
                                                                    <Td color='white'>{product.invoicesProduct.discount_price}€</Td>
                                                                    <Td color='white'>{product.invoicesProduct.total_value}</Td>
                                                                </Tr>
                                                            ))}
                                                        </Tbody>

                                                    </Table>

                                                    <Text fontWeight="bold" mb={2} color='white'>Faturimi</Text>

                                                    <Table size="sm" variant="unstyled">
                                                        <Thead>
                                                            <Tr>
                                                                <Th color='white'>Porosia ID</Th>
                                                                <Th color='white'>Fatura ID</Th>
                                                                <Th color='white'>Qmimi total</Th>
                                                                <Th color='white'>Taksa</Th>
                                                                <Th color='white'>Menyra e pageses</Th>
                                                                <Th color='white'>Data</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            <Tr>
                                                                <Th color='white'>{invoice.order_id}</Th>
                                                                <Th color='white'>{invoice.id}</Th>
                                                                <Th color='white'>{invoice.total_amount}</Th>
                                                                <Th color='white'>{invoice.tax_amount}</Th>
                                                                <Th color='white'>{invoice.payment_mode}</Th>
                                                                <Th color='white'>{invoice.created_at}</Th>
                                                            </Tr>
                                                        </Tbody>
                                                        <br />

                                                        <Button
                                                            bg='white'
                                                            color='black'
                                                            _hover={{ bg: 'gray.300' }}
                                                            size='sm'
                                                            onClick={() => handleFetchInvoiceById(invoice.id)}
                                                        >
                                                            Printo faturen me ID: {invoice.id}
                                                        </Button>

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