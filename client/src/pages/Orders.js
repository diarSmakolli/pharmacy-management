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
    Divider,
    Stack,
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
import { ChevronDownIcon, ChevronUpIcon, EditIcon } from '@chakra-ui/icons';


// v2 
export default function SidebarWithHeader({ children }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, loading, logout, isAdmin } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [orders, setOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [products, setProducts] = useState([{ productId: '', quantity: '', discount: '' }]);
    const [overallDiscount, setOverallDiscount] = useState(0);
    const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalBeforeDiscount, setTotalBeforeDiscount] = useState(0);  
    const [totalDiscountSaved, setTotalDiscountSaved] = useState(0);    
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortByDate, setSortByDate] = useState('desc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchProductId, setSearchProductId] = useState('');
    const [searchOrderId, setSearchOrderId] = useState('');
    const [searchMinTotal, setSearchMinTotal] = useState('');
    const [searchMaxTotal, setSearchMaxTotal] = useState('');
    const [activeSearchIndex, setActiveSearchIndex] = useState(null);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:6099/api/orders', {
                params: { page, limit, sortByDate, startDate, endDate, productId: searchProductId, orderId: searchOrderId, minTotalAmount: searchMinTotal, maxTotalAmount: searchMaxTotal },
                withCredentials: true, // if you're using cookies or auth tokens
            });
            console.log(response.data);
            setOrders(response.data.data.orders);
            setTotal(response.data.data.total);

            console.log("total orders: ", response.data.data.total);

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
    }

    const fetchProducts = async (keyword) => {
        if (keyword) {
            try {
                const response = await axios.get(`http://localhost:6099/api/products/search?keyword=${keyword}`, {
                    withCredentials: true,
                });
                setSearchedProducts(response.data.rows);
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
        } else {
            setSearchedProducts([]);
        }
    };

    const handleSearchChange = (index, e) => {
        const value = e.target.value;
        setSearchKeyword(value);
        setActiveSearchIndex(index);
        fetchProducts(value);
    };

    const validateProducts = (products) => {
        for (const product of products) {
            // Check if productId is valid (not empty and is a number)
            if (!product.productId || isNaN(product.productId)) {
                return { valid: false, message: "Product ID must be a valid number." };
            }
    
            // Check if quantity is valid (not empty and is a positive number)
            if (!product.quantity || isNaN(product.quantity) || product.quantity <= 0) {
                return { valid: false, message: "Quantity must be a positive number." };
            }
    
            // Check if discount is valid (must be a number, can be zero)
            if (product.discount !== undefined && isNaN(product.discount)) {
                return { valid: false, message: "Discount must be a valid number." };
            }
        }
        return { valid: true };
    };
    
    const addProductField = () => {
        setProducts([...products, { productId: '', quantity: '', discount: '' }]);
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...products];
        newProducts[index][field] = value;
        setProducts(newProducts);

        console.log(products);


    };

    const calculateTotalPrice = () => {
        let totalBeforeDiscount = 0;
        let totalAfterDiscount = 0;
        let totalDiscountSaved = 0;
        products.forEach((product) => {
            const price = parseFloat(product.price) || 0;  // Get the price from the product
            const quantity = parseFloat(product.quantity) || 0;
            const discount = parseFloat(product.discount) || 0;

            const productTotalBeforeDiscount = price * quantity;

            const productTotalAfterDiscount = price * quantity * (1 - discount / 100);

            const productDiscountSaved = productTotalBeforeDiscount - productTotalAfterDiscount;

            totalBeforeDiscount += productTotalBeforeDiscount;
            totalAfterDiscount += productTotalAfterDiscount;
            totalDiscountSaved += productDiscountSaved;
            // Apply discount and calculate the total price for the product
            // const productTotal = price * quantity * (1 - discount / 100);
            // total += productTotal;
        });


        const finalTotalAfterOverallDiscount = totalAfterDiscount * (1 - overallDiscount / 100);

        // Calculate how much the overall discount saved
        const overallDiscountSaved = totalAfterDiscount - finalTotalAfterOverallDiscount;

        // Update the state values
        setTotalPrice(finalTotalAfterOverallDiscount);          // Total price after all discounts
        setTotalBeforeDiscount(totalBeforeDiscount);            // Total price before any discount
        setTotalDiscountSaved(totalDiscountSaved + overallDiscountSaved);


        // Apply overall discount if any
        // const finalTotal = total * (1 - overallDiscount / 100);
        // setTotalPrice(finalTotal);
        // console.log("total price: ", totalPrice);
    };

    // const handleSelectProduct = (index, product) => {
    //     const newProducts = [...products];

    //     // Store productId and price when selecting a product
    //     newProducts[index] = {
    //         ...newProducts[index],
    //         productId: product.id,
    //         price: product.price,
    //         quantity: '',
    //         discount: '',
    //     };

    //     setProducts(newProducts);
    //     setSearchedProducts([]); // Clear search results after selection
    //     setSearchKeyword(''); // Clear search input
    // };

    const handleSelectProduct = (index, product) => {
        const newProducts = [...products];
    
        newProducts[index] = {
            ...newProducts[index],
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: '',
            discount: '',
        };
    
        setProducts(newProducts);
        setSearchedProducts([]); 
        setSearchKeyword('');
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const createOrder = async () => {
        setIsLoading(true);
        console.log("products: ", products);

        const validation = validateProducts(products);
        if (!validation.valid) {
            toast({
                title: 'Validation Error',
                description: validation.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
            return; // Stop execution if validation fails
        }

        try {
            
            const response = await axios.post('http://localhost:6099/api/orders', {
                products,
                overallDiscount
            }, { withCredentials: true });

            console.log("body: ", products);


            toast({
                title: 'Order created successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setIsAddOrderModalOpen(false);
            // Reset fields or perform any additional actions after creating an order
        } catch (error) {
            // })
            console.log("error: ", error.response);

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

    useEffect(() => {
        fetchOrders();
    }, [page, limit]);

    useEffect(() => {
        calculateTotalPrice();
    }, [products, overallDiscount]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchProducts();
    };

    return (
        <Box minH="100vh" bg='#1c2124'>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                border='0'
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
                    Shitjet
                </Text>

                <Button
                    size='sm'
                    bg='#579DFF'
                    color='black'
                    _hover={{ bg: '#579DFF' }} onClick={() => setIsAddOrderModalOpen(true)} mt={4}>
                    Shto një porosi
                </Button>



                <SimpleGrid columns={6} spacing='5' direction='row'>
                    <Box>
                        <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Kerko me produkt ID</FormLabel>
                        <Input
                            placeholder='Kerko sipas produktit Idse'
                            value={searchProductId}
                            onChange={(e) => setSearchProductId(e.target.value)}
                            bg='transparent'
                            size='sm'
                            border='1px solid #7A869A'
                            rounded={'md'}
                            p={4}
                            _hover={{ border: '1px solid #7A869A' }}
                            color='white'
                        />
                    </Box>

                    <Box>
                        <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Kerko me order ID</FormLabel>
                        <Input
                            placeholder='Kerko sipas order Idse'
                            value={searchOrderId}
                            onChange={(e) => setSearchOrderId(e.target.value)}
                            bg='transparent'
                            size='sm'
                            border='1px solid #7A869A'
                            rounded={'md'}
                            color='white'
                            _hover={{ border: '1px solid #7A869A' }}
                        />
                    </Box>
                </SimpleGrid>

                <SimpleGrid columns={3} spacing='1' direction='row'>
                    <Box>
                        <Stack direction='row'>
                            <Box w='50%'>
                                <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Minimumi totalit</FormLabel>
                                <Input
                                    placeholder='Shkruaj minimumin'
                                    value={searchMinTotal}
                                    onChange={(e) => setSearchMinTotal(e.target.value)}
                                    bg='transparent'
                                    size='sm'
                                    border='1px solid #7A869A'
                                    rounded={'md'}
                                    color='white'
                                    _hover={{ border: '1px solid #7A869A' }}
                                />
                            </Box>
                            <Box w='50%'>
                                <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Maksimumi totalit</FormLabel>
                                <Input
                                    placeholder='Shkruaj maksimumin'
                                    value={searchMaxTotal}
                                    onChange={(e) => setSearchMaxTotal(e.target.value)}
                                    bg='transparent'
                                    size='sm'
                                    border='1px solid #7A869A'
                                    rounded={'md'}
                                    color='white'
                                    _hover={{ border: '1px solid #7A869A' }}
                                />
                            </Box>

                        </Stack>
                    </Box>

                    <Box>
                        <Stack direction='row'>
                            <Box w='50%'>
                                <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Nga data</FormLabel>
                                <Input
                                    placeholder='Nga data'
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    type='date'
                                    bg='transparent'
                                    size='sm'
                                    border='1px solid #7A869A'
                                    rounded={'md'}
                                    color='white'
                                    _hover={{ border: '1px solid #7A869A' }}
                                />
                            </Box>
                            <Box w='50%'>
                                <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Deri me daten</FormLabel>
                                <Input
                                    placeholder='Deri me daten'
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    type='date'
                                    bg='transparent'
                                    size='sm'
                                    border='1px solid #7A869A'
                                    rounded={'md'}
                                    color='white'
                                    _hover={{ border: '1px solid #7A869A' }}
                                />
                            </Box>


                        </Stack>
                    </Box>

                    <Box mt={1}>
                        <Button
                            bg='#A1BDD914'
                            color='gray.300'
                            _hover={{ bg: '#A1BDD914' }}
                            onClick={fetchOrders}
                            direction='row'
                            mt={10}
                            size='sm'
                        >
                            Kërko
                        </Button>
                    </Box>
                </SimpleGrid>

                <br /><br />
                {isLoading ? (
                    <Spinner />
                ) : (
                    <Box border={'1px solid #A1BDD914'} rounded='lg' mt={6}>
                        <Table variant="simple" size="sm" pt={2}>
                            <Thead>
                                <Tr borderBottom="1px" borderColor={'#A1BDD914'}>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Porosia ID</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Krijuar më</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Qmimi total</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Nr. Produkteve</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Fatura ID</Th>
                                    <Th borderBottom='1px' borderRight={'0px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5} >Detajet e porosise</Th>
                                </Tr>
                            </Thead>
                            <Tbody border='0'>
                                {orders.map((order) => (
                                    <React.Fragment key={order.id}>
                                        <Tr>
                                            <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{order.id}</Td>
                                            <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{new Date(order.created_at).toLocaleDateString()}</Td>
                                            <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{order && typeof order.total_amount === 'number' && order.total_amount != null
                                                ? order.total_amount.toFixed(2) : '0.00'}€</Td>
                                            <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{order.products ? order.products.length : 0}</Td>
                                            <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{order.invoice ? order.invoice.id : 'N/A'}</Td>
                                            <Td borderRight={'0px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>
                                                {/* <IconButton
                                                icon={expandedOrders[order.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                                onClick={() => toggleOrderDetails(order.id)}
                                                size="sm"
                                            /> */}
                                                <Button bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }}
                                                    size='sm' ml={2}
                                                    onClick={() => toggleOrderDetails(order.id)}
                                                >
                                                    Details {expandedOrders[order.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                                </Button>
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td colSpan={6} p={0} border='0'>
                                                <Collapse in={expandedOrders[order.id]} animateOpacity>
                                                    <Box p={4} bg='transparent' rounded='lg'>
                                                        <Text fontWeight="bold" mb={2} color='gray.300'>Produktet e Porosisë:</Text>
                                                        <Table size="sm" variant="unstyled" border='0'>
                                                            <Thead border='0'>
                                                                <Tr border='0'>
                                                                    <Th color='gray.300' border='0'>Product ID</Th>
                                                                    <Th color='gray.300' border='0'>Emri</Th>
                                                                    <Th color='gray.300' border='0'>Barkodi</Th>
                                                                    <Th color='gray.300' border='0'>Qmimi</Th>
                                                                    <Th color='gray.300' border='0'>Partner</Th>
                                                                    <Th color='gray.300' border='0'>Category</Th>
                                                                    <Th color='gray.300' border='0'>Tax</Th>
                                                                    <Th color='gray.300' border='0'>Sasia</Th>
                                                                    <Th color='gray.300' border='0'>Qmimi për Njësi</Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody border='0'>
                                                                {order.products && order.products.map((product) => (
                                                                    <Tr key={product.id}>
                                                                        <Td color='gray.300' border='0'>{product.id}</Td>
                                                                        <Td color='gray.300' border='0'>{product.name}</Td>
                                                                        <Td color='gray.300' border='0'>{product.barcode}</Td>
                                                                        <Td color='gray.300' border='0'>{product && typeof product.price === 'number' && product.price != null
                                                                            ? product.price.toFixed(2) : '0.00'}€</Td>
                                                                        <Td color='gray.300' border='0'>{product.partner ? product.partner.name : 'N/A'}</Td>
                                                                        <Td color='gray.300' border='0'>{product.category ? product.category.name : 'N/A'}</Td>
                                                                        <Td color='gray.300' border='0'>{product.tax ? product.tax.name : 'N/A'}</Td>
                                                                        <Td color='gray.300' border='0'>{product.order_details ? product.order_details.quantity : 'N/A'}</Td>
                                                                        {/* <Td color='white'>{product.order_details ? product.order_details.unitPrice.toFixed(2) : 'N/A'}</Td> */}
                                                                        <Td color='gray.300' border='0'>{product.order_details && typeof product.order_details.unitPrice === 'number' && product.order_details.unitPrice != null
                                                                            ? product.order_details.unitPrice.toFixed(2) : '0.00'}€</Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>

                                                        </Table>


                                                        <Text fontWeight="bold" mb={2} color='white'>Faturimi</Text>

                                                        <Table size="sm" variant="unstyled">
                                                            <Thead>
                                                                <Tr>
                                                                    <Th color='gray.300' border='0'>Porosia ID</Th>
                                                                    <Th color='gray.300' border='0'>Data</Th>
                                                                    <Th color='gray.300' border='0'>Qmimi total</Th>
                                                                    <Th color='gray.300' border='0'>Qmimi TVSH</Th>
                                                                    <Th color='gray.300' border='0'>Fatura ID</Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                <Tr>
                                                                    <Th color='gray.300' border='0'>{order.id}</Th>
                                                                    <Th color='gray.300' border='0'>{order.created_at}</Th>
                                                                    <Td color='gray.300' border='0'>{order && typeof order.total_amount === 'number' && order.total_amount != null
                                                                        ? order.total_amount.toFixed(2) : '0.00'}€</Td>
                                                                    <Td color='gray.300' border='0'>{order.invoice && typeof order.invoice.tax_amount === 'number' && order.invoice.tax_amount != null
                                                                        ? order.invoice.tax_amount.toFixed(2) : '0.00'}€</Td>
                                                                    <Th color='gray.300' border='0'>{order.invoice ? order.invoice.id : 'N/A'}</Th>
                                                                </Tr>
                                                            </Tbody>
                                                            <br />
                                                            <Text fontWeight="bold" mb={2} color='gray.300'>
                                                                Per detaje me te plota mund ta gjeni faturen e gjeneruar me ID: {order.invoice ? order.invoice.id : 'N/A'}
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



            {/* v3 */}
            <Modal isOpen={isAddOrderModalOpen} onClose={() => setIsAddOrderModalOpen(false)} size='4xl'>
                <ModalOverlay backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent bg='#282E33'>
                    <ModalHeader color='gray.300'>Shto një porosi të re</ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody>
                        {products.map((product, index) => (
                            <Box key={index} mb={4}>
                                <SimpleGrid columns={2} spacing='2' borderTop={'2px'} borderColor={'bisque'} borderRadius={'2px'}>
                                    <FormControl>
                                        <FormLabel color='gray.300'>Kerko produktin</FormLabel>
                                        <Input
                                            value={searchKeyword}
                                            onChange={(e) => handleSearchChange(index, e)}
                                            placeholder="Kërko produktin..."
                                            bg='#22272B'
                                            border='1px solid #7A869A'
                                            rounded='3px'
                                            _hover={{ border: '1px solid #7A869A' }}
                                            color='gray.300'
                                            w='100%'
                                        />
                                        {/* {searchedProducts.length > 0 && (
                                            <Box border="1px solid gray" bg="transparent" mt={1} color='gray.300'>
                                                {searchedProducts.map((searchedProduct) => (
                                                    <Box key={searchedProduct.id} p={2} cursor="pointer" onClick={() => handleSelectProduct(index, searchedProduct)}>
                                                        {searchedProduct.name} (ID: {searchedProduct.id}) Qmimi: {searchedProduct.price}
                                                    </Box>
                                                ))}
                                            </Box>
                                        )} */}
                                        {activeSearchIndex === index && searchedProducts.length > 0 && (
                                            <Box border="1px solid gray" bg="transparent" mt={1} color='gray.300'>
                                                {searchedProducts.map((searchedProduct) => (
                                                    <Box
                                                        key={searchedProduct.id}
                                                        p={2}
                                                        cursor="pointer"
                                                        onClick={() => handleSelectProduct(index, searchedProduct)}
                                                    >
                                                        {searchedProduct.name} (ID: {searchedProduct.id}) Qmimi: {searchedProduct.price}
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel color='gray.300'>Produkti</FormLabel>
                                        <Input
                                            value={product.productName || ''} // Use productId for the input
                                            // onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                                            readOnly
                                            placeholder="Shkruaj ID-në e produktit"
                                            bg='#22272B'
                                            border='1px solid #7A869A'
                                            rounded='3px'
                                            _hover={{ border: '1px solid #7A869A' }}
                                            color='gray.300'
                                            w='100%'
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel color='gray.300'>Sasia</FormLabel>
                                        <Input
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                            placeholder="Shkruaj sasinë"
                                            bg='#22272B'
                                            border='1px solid #7A869A'
                                            rounded='3px'
                                            _hover={{ border: '1px solid #7A869A' }}
                                            color='gray.300'
                                            w='100%'
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel color='gray.300'>Discount</FormLabel>
                                        <Input
                                            type="number"
                                            value={product.discount}
                                            onChange={(e) => handleProductChange(index, 'discount', e.target.value)}
                                            placeholder="Shkruaj discount-in"
                                            bg='#22272B'
                                            border='1px solid #7A869A'
                                            rounded='3px'
                                            _hover={{ border: '1px solid #7A869A' }}
                                            color='gray.300'
                                            w='100%'
                                        />
                                    </FormControl>
                                </SimpleGrid>
                            </Box>
                        ))}
                        <Button onClick={addProductField} bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} mb={4}>Shto produkt tjetër</Button>

                        <FormControl>
                            <FormLabel color='gray.300'>Discount i përgjithshëm</FormLabel>
                            <Input
                                type="number"
                                value={overallDiscount}
                                onChange={(e) => setOverallDiscount(e.target.value)}
                                placeholder="Shkruaj discount-in e përgjithshëm"
                                bg='#22272B'
                                border='1px solid #7A869A'
                                rounded='3px'
                                _hover={{ border: '1px solid #7A869A' }}
                                color='gray.300'
                                w='50%'
                            />
                        </FormControl>


                        <Text mt={5} fontWeight={'bold'} color='gray.300'>
                            Çmimi total pa zbritje: {' '}
                            {totalBeforeDiscount && typeof totalBeforeDiscount == 'number' && totalBeforeDiscount != null
                                ? totalBeforeDiscount.toFixed(2) : '0.00'} EUR
                            EUR
                        </Text>

                        <Text mt={5} fontWeight={'bold'} color='gray.300'>
                            Çmimi total me zbritje: {' '}
                            {totalPrice && typeof totalPrice == 'number' && totalPrice != null
                                ? totalPrice.toFixed(2) : '0.00'} EUR 🎉

                        </Text>

                        <Text mt={5} fontWeight={'bold'} color='gray.300'>
                            Shuma e kursyer nga zbritjet: {' '}
                            {totalDiscountSaved && typeof totalDiscountSaved == 'number' && totalDiscountSaved != null
                                ? totalDiscountSaved.toFixed(2) : '0.00'}
                            EUR 🎉
                        </Text>

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={createOrder} bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} isLoading={isLoading}>Shto</Button>
                        <Button onClick={() => setIsAddOrderModalOpen(false)} bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} ml={3}>Anulo</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* v4 */}
            {/* <Drawer
                placement='right'
                isOpen={isAddOrderModalOpen} onClose={() => setIsAddOrderModalOpen(false)}
                size='xl'
            >
                <DrawerOverlay backdropFilter='blur(10px) hue-rotate(90deg)' />
                <DrawerContent bg={'#242731'} rounded='2xl'>
                    <DrawerCloseButton bg='transparent' color='white' />
                    <DrawerHeader color='gray.200'>Shto një porosi të re</DrawerHeader>

                    <DrawerBody color='gray.200'>

                        {products.map((product, index) => (
                            <Box key={index} mb={4}>
                                <FormControl>
                                    <FormLabel>Kerko produktin</FormLabel>
                                    <Input
                                        value={searchKeyword}
                                        onChange={handleSearchChange}
                                        placeholder="Kërko produktin..."
                                        mt={2}
                                        bg='#17191e'
                                        rounded='md'
                                        color='white'
                                        border='0'
                                        w='50%'
                                    />
                                    {searchedProducts.length > 0 && (
                                        <Box bg='#242731'
                                        border='1px solid #30393d'
                                        color='white'
                                        w='50%'
                                        _hover={{ bg: '#242731' }} mt={1}>
                                            {searchedProducts.map((searchedProduct) => (
                                                <Box key={searchedProduct.id} p={2} cursor="pointer" onClick={() => handleSelectProduct(index, searchedProduct)}>
                                                    {searchedProduct.name} (ID: {searchedProduct.id}) Qmimi: {searchedProduct.price}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Produkti</FormLabel>
                                    <Input
                                        value={product.productId} // Use productId for the input
                                        onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                                        placeholder="Shkruaj ID-në e produktit"
                                        bg='#17191e'
                                        rounded='md'
                                        color='white'
                                        border='0'
                                        w='50%'
                                    />

                                </FormControl>
                                <FormControl>
                                    <FormLabel>Sasia</FormLabel>
                                    <Input
                                        type="number"
                                        value={product.quantity}
                                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                        placeholder="Shkruaj sasinë"
                                        bg='#17191e'
                                        rounded='md'
                                        color='white'
                                        border='0'
                                        w='50%'
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Discount %</FormLabel>
                                    <Input
                                        type="number"
                                        value={product.discount}
                                        onChange={(e) => handleProductChange(index, 'discount', e.target.value)}
                                        placeholder="Shkruaj discount-in"
                                        bg='#17191e'
                                        rounded='md'
                                        color='white'
                                        border='0'
                                        w='50%'
                                    />
                                </FormControl>
                            </Box>
                        ))}
                        <Button onClick={addProductField}  bg='#17191e' border='2px solid #21272a' rounded='xl' color='white' _hover={{ bg: 'black' }} mb={4}>Shto produkt tjetër</Button>


                        <FormControl>
                            <FormLabel>Discount i përgjithshëm</FormLabel>
                            <Input
                                type="number"
                                value={overallDiscount}
                                onChange={(e) => setOverallDiscount(e.target.value)}
                                placeholder="Shkruaj discount-in e përgjithshëm"
                                bg='#17191e'
                                        rounded='md'
                                        color='white'
                                        border='0'
                                        w='50%'
                            />
                        </FormControl>

                        <Text mt={5} fontWeight={'bold'} color='white'>
                            Çmimi total pa zbritje: {' '}
                            {totalBeforeDiscount && typeof totalBeforeDiscount == 'number' && totalBeforeDiscount != null
                                ? totalBeforeDiscount.toFixed(2) : '0.00'} EUR
                            EUR
                        </Text>

                        <Text mt={5} fontWeight={'bold'} color='white'>
                            Çmimi total me zbritje: {' '}
                            {totalPrice && typeof totalPrice == 'number' && totalPrice != null
                                ? totalPrice.toFixed(2) : '0.00'} EUR

                        </Text>

                        <Text mt={5} fontWeight={'bold'} color='white'>
                            Shuma e kursyer nga zbritjet: {' '}
                            {totalDiscountSaved && typeof totalDiscountSaved == 'number' && totalDiscountSaved != null
                                ? totalDiscountSaved.toFixed(2) : '0.00'}
                            EUR
                        </Text>
                    </DrawerBody>

                    

                    <DrawerFooter>
                        <Button w='50%'onClick={createOrder}  bg='#17191e' border='2px solid #21272a' rounded='xl' color='white' _hover={{ bg: 'black' }} isLoading={isLoading}>Shto</Button>
                        <Button w='50%'onClick={() => setIsAddOrderModalOpen(false)}  bg='#17191e' border='2px solid #21272a' rounded='xl' color='white' _hover={{ bg: 'black' }} ml={3}>Anulo</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer> */}


        </Box >
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