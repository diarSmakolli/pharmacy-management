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
    Stack
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
    const [totalBeforeDiscount, setTotalBeforeDiscount] = useState(0);  // Total price before discount
    const [totalDiscountSaved, setTotalDiscountSaved] = useState(0);    // Amount saved from discounts
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
                toast({
                    title: 'Error fetching products',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } else {
            setSearchedProducts([]);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchKeyword(value);
        fetchProducts(value);
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
    //     newProducts[index].productId = product.id; // Assuming product has an `id` field
    //     setProducts(newProducts);
    //     setSearchedProducts([]); // Clear search results after selection
    //     setSearchKeyword(''); // Clear search input
    // };

    const handleSelectProduct = (index, product) => {
        const newProducts = [...products];

        // Store productId and price when selecting a product
        newProducts[index] = {
            ...newProducts[index],
            productId: product.id,
            price: product.price,
            quantity: '',
            discount: '',
        };

        setProducts(newProducts);
        setSearchedProducts([]); // Clear search results after selection
        setSearchKeyword(''); // Clear search input
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const createOrder = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:6099/api/orders', {
                products,
                overallDiscount
            }, { withCredentials: true });

            toast({
                title: 'Order created successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setIsAddOrderModalOpen(false);
            // Reset fields or perform any additional actions after creating an order
        } catch (error) {
            // toast({
            //     title: 'Error!',
            //     description: errorData.message,
            //     status: errorData.status == 400 ? 'warning' : 'error',
            //     duration: 3000,
            //     isClosable: true,
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

                <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={() => setIsAddOrderModalOpen(true)} mt={4}>
                    Shto një porosi
                </Button>

                <SimpleGrid columns={3} spacing={1} direction='row'>

                    <Box>
                        <FormLabel mt={4}>Kerko sipas produktit Idse</FormLabel>
                        <Input
                            placeholder='Kerko sipas produktit Idse'
                            value={searchProductId}
                            onChange={(e) => setSearchProductId(e.target.value)}
                            bg='#fff'
                        />
                    </Box>

                    <Box>
                        <FormLabel mt={4}>Kerko sipas Order ID</FormLabel>
                        <Input
                            placeholder='Kerko sipas order Idse'
                            value={searchOrderId}
                            onChange={(e) => setSearchOrderId(e.target.value)}
                            bg='#fff'
                        />
                    </Box>

                    <Box>
                        <Stack direction='row'>
                            <Box>
                                <FormLabel mt={4}>Minimumi totalit</FormLabel>
                                <Input
                                    placeholder='Minimumit te shumes totale'
                                    value={searchMinTotal}
                                    onChange={(e) => setSearchMinTotal(e.target.value)}
                                    bg='#fff'
                                />
                            </Box>
                            <Box>
                                <FormLabel mt={4}>Maksimumi totalit</FormLabel>
                                <Input
                                    placeholder='Maksimumit te shumes totale'
                                    value={searchMaxTotal}
                                    onChange={(e) => setSearchMaxTotal(e.target.value)}

                                    bg='#fff'
                                />
                            </Box>

                        </Stack>
                    </Box>

                    <Box>
                        <Stack direction='row'>
                            <Box w='50%'>
                                <FormLabel mt={4}>Nga data</FormLabel>
                                <Input
                                    placeholder='Nga data'
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    type='date'
                                    bg='#fff'
                                />
                            </Box>
                            <Box w='50%'>
                                <FormLabel mt={4}>Deri me daten</FormLabel>
                                <Input
                                    placeholder='Deri me daten'
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    type='date'
                                    bg='#fff'
                                />
                            </Box>


                        </Stack>
                    </Box>

                    <Box>
                        <Button
                            bg='black'
                            color='white'
                            _hover={{ bg: 'black' }}
                            onClick={fetchOrders}
                            direction='row'
                            mt={12}
                        >
                            Kërko
                        </Button>
                    </Box>



                </SimpleGrid>

                <br /><br />
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
                                        <Td>{order.total_amount.toFixed(2)}€</Td>
                                        <Td>{order.products ? order.products.length : 0}</Td>
                                        <Td>{order.invoice ? order.invoice.id : 'N/A'}</Td>
                                        <Td>
                                            {/* <IconButton
                                                icon={expandedOrders[order.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                                onClick={() => toggleOrderDetails(order.id)}
                                                size="sm"
                                            /> */}
                                            <Button bg='black' color='white' _hover={{ bg: 'black' }} size='sm' ml={2}
                                                onClick={() => toggleOrderDetails(order.id)}
                                            >
                                                Detajet {expandedOrders[order.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                            </Button>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td colSpan={6} p={0}>
                                            <Collapse in={expandedOrders[order.id]} animateOpacity>
                                                <Box p={4} bg="#000" rounded='lg'>
                                                    <Text fontWeight="bold" mb={2} color='white'>Produktet e Porosisë:</Text>
                                                    <Table size="sm" variant="unstyled">
                                                        <Thead>
                                                            <Tr>
                                                                <Th color='white'>Product ID</Th>
                                                                <Th color='white'>Emri</Th>
                                                                <Th color='white'>Barkodi</Th>
                                                                <Th color='white'>Qmimi</Th>
                                                                <Th color='white'>Partner</Th>
                                                                <Th color='white'>Category</Th>
                                                                <Th color='white'>Tax</Th>
                                                                <Th color='white'>Sasia</Th>
                                                                <Th color='white'>Qmimi për Njësi</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {order.products && order.products.map((product) => (
                                                                <Tr key={product.id}>
                                                                    <Td color='white'>{product.id}</Td>
                                                                    <Td color='white'>{product.name}</Td>
                                                                    <Td color='white'>{product.barcode}</Td>
                                                                    <Td color='white'>{product.price.toFixed(2)}€</Td>
                                                                    <Td color='white'>{product.partner ? product.partner.name : 'N/A'}</Td>
                                                                    <Td color='white'>{product.category ? product.category.name : 'N/A'}</Td>
                                                                    <Td color='white'>{product.tax ? product.tax.name : 'N/A'}</Td>
                                                                    <Td color='white'>{product.order_details ? product.order_details.quantity : 'N/A'}</Td>
                                                                    <Td color='white'>{product.order_details ? product.order_details.unitPrice.toFixed(2) : 'N/A'}</Td>
                                                                </Tr>
                                                            ))}
                                                        </Tbody>

                                                    </Table>


                                                    <Text fontWeight="bold" mb={2} color='white'>Faturimi</Text>

                                                    <Table size="sm" variant="unstyled">
                                                        <Thead>
                                                            <Tr>
                                                                <Th color='white'>Porosia ID</Th>
                                                                <Th color='white'>Data</Th>
                                                                <Th color='white'>Qmimi total</Th>
                                                                <Th color='white'>Qmimi TVSH</Th>
                                                                <Th color='white'>Fatura ID</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            <Tr>
                                                                <Th color='white'>{order.id}</Th>
                                                                <Th color='white'>{order.created_at}</Th>
                                                                <Th color='white'>{order.total_amount.toFixed(2)}</Th>
                                                                <Th color='white'>{order.invoice ? order.invoice.tax_amount.toFixed(2) : 'N/A'}</Th>
                                                                <Th color='white'>{order.invoice ? order.invoice.id : 'N/A'}</Th>
                                                            </Tr>
                                                        </Tbody>
                                                        <br />
                                                        <Text fontWeight="bold" mb={2} color='white'>
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
            <Modal isOpen={isAddOrderModalOpen} onClose={() => setIsAddOrderModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Shto një porosi të re</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {products.map((product, index) => (
                            <Box key={index} mb={4}>
                                <FormControl>
                                    <FormLabel>Kerko produktin</FormLabel>
                                    <Input
                                        value={searchKeyword}
                                        onChange={handleSearchChange}
                                        placeholder="Kërko produktin..."
                                        mt={2}
                                    />
                                    {searchedProducts.length > 0 && (
                                        <Box border="1px solid gray" bg="white" mt={1}>
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
                                    />

                                </FormControl>
                                <FormControl>
                                    <FormLabel>Sasia</FormLabel>
                                    <Input
                                        type="number"
                                        value={product.quantity}
                                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                        placeholder="Shkruaj sasinë"
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Discount</FormLabel>
                                    <Input
                                        type="number"
                                        value={product.discount}
                                        onChange={(e) => handleProductChange(index, 'discount', e.target.value)}
                                        placeholder="Shkruaj discount-in"
                                    />
                                </FormControl>
                            </Box>
                        ))}
                        <Button onClick={addProductField} bg='black' color='white' _hover={{ bg: 'black' }} mb={4}>Shto produkt tjetër</Button>

                        <FormControl>
                            <FormLabel>Discount i përgjithshëm</FormLabel>
                            <Input
                                type="number"
                                value={overallDiscount}
                                onChange={(e) => setOverallDiscount(e.target.value)}
                                placeholder="Shkruaj discount-in e përgjithshëm"
                            />
                        </FormControl>


                        <Text mt={5} fontWeight={'bold'}>
                            Çmimi total pa zbritje: {totalBeforeDiscount.toFixed(2)} EUR
                        </Text>

                        <Text mt={5} fontWeight={'bold'}>
                            Çmimi total me zbritje: {totalPrice.toFixed(2)} EUR
                        </Text>

                        <Text mt={5} fontWeight={'bold'}>
                            Shuma e kursyer nga zbritjet: {totalDiscountSaved.toFixed(2)} EUR
                        </Text>

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={createOrder} bg='black' color='white' _hover={{ bg: 'black' }} isLoading={isLoading}>Shto</Button>
                        <Button onClick={() => setIsAddOrderModalOpen(false)} bg='black' color='white' _hover={{ bg: 'black' }} ml={3}>Anulo</Button>
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