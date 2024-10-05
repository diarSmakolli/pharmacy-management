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
    TableContainer,
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
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { useEffect } from 'react';
import { useAuth } from '../auth/authContext';
import axios from 'axios';
import emonalogo from '../images/emona.png';

export default function SidebarWithHeader({ children }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, loading, logout, isAdmin } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [barcode, setBarcode] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [partnerId, setPartnerId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [taxId, setTaxId] = useState('');
    const [partners, setPartners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [initialStock, setInitialStock] = useState('');
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [idFilter, setIdFilter] = useState('desc');
    const [priceFilter, setPriceFilter] = useState('');

    // fetch products as list
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:6099/api/products', {
                params: { search, page, limit, categoryId, partnerId, taxId, idFilter, priceFilter },
                withCredentials: true,
            });
            console.log(response.data);
            setProducts(response.data.data.products);
            setTotal(response.data.data.total);

            console.log("Total products: ", response.data.data.total);

            // Calculate total pages
            const tp = Math.ceil(response.data.data.total / limit);
            setTotalPages(tp);

            console.log('Total pages:', tp);

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

    // add a product
    const addProduct = async () => {
        if (!name || !barcode || !price || !description || !partnerId || !taxId || !categoryId) {
            toast({
                title: 'Të gjitha fushat janë të detyrueshme',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:6099/api/products',
                { name: name, barcode, description, price, partnerId, taxId, categoryId, initialStock: initialStock },);
            setProducts([...products, response.data]);
            toast({
                title: 'Produkti u shtua me sukses',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setName('');
            setBarcode('');
            setDescription('');
            setPrice('');
            setPartnerId('');
            setTaxId('');
            setCategoryId('');
            setInitialStock('');
            setIsAddModalOpen(false);
            fetchProducts();
        } catch (error) {
            toast({
                title: 'Error në shtimin e produktit',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // fetch partners
    const fetchPartners = async () => {
        try {
            const response = await axios.get(`
                http://localhost:6099/api/partners`, {
                withCredentials: true,
            });

            setPartners(response.data.partners);

            // toast({
            //     title: 'Partneret u morën me sukses',
            //     status: 'success',
            //     duration: 3000,
            //     isClosable: true,
            // });
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error në marrjen e partnereve',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`
                http://localhost:6099/api/categories`, {
                withCredentials: true,
            });

            setCategories(response.data.data);

            // toast({
            //     title: 'Kategorite u morën me sukses',
            //     status: 'success',
            //     duration: 3000,
            //     isClosable: true,
            // });

            console.log("Categories: ", response.data.data);
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error në marrjen e Kategorive',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // fetch taxes
    const fetchTaxes = async () => {
        try {
            const response = await axios.get(`
                http://localhost:6099/api/taxes`, {
                withCredentials: true,
            });

            setTaxes(response.data.data);

            // toast({
            //     title: 'Taksat u morën me sukses',
            //     status: 'success',
            //     duration: 3000,
            //     isClosable: true,
            // });

            console.log("Taxes: ", response.data.data);
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error në marrjen e Taksave',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // delete a product
    const deleteProduct = async () => {
        try {
            await axios.delete(`http://localhost:6099/api/products/${selectedProduct.id}`);
            setProducts(products.filter((product) => product.id !== selectedProduct.id));
            toast({
                title: 'Produkti u fshi',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error në marrjen e Taksave',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // update a product
    const updateProduct = async () => {
        try {
            await axios.put(`http://localhost:6099/api/products/${selectedProduct.id}`, {
                name: selectedProduct.name,
                barcode: selectedProduct.barcode,
                description: selectedProduct.description,
                price: selectedProduct.price,
                partnerId: selectedProduct.partnerId,
                categoryId: selectedProduct.categoryId,
                taxId: selectedProduct.taxId,
            });
            toast({
                title: 'Produkti u perditesua',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error në perditesimin e produktit',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchPartners();
        fetchCategories();
        fetchTaxes();
    }, [page, limit]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePriceChange = (e) => {
        setPriceFilter(e.target.value);
        setPage(1);
    };

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
                    Produktet
                </Text>

                <Button
                    size='sm'
                    bg='#579DFF'
                    color='black'
                    _hover={{ bg: '#579DFF' }}
                    onClick={() => setIsAddModalOpen(true)}
                    mt={4}>
                    Shto një produkt
                </Button>
                <br />

                <SimpleGrid columns={4} spacing={5} direction='row'>
                    <Box>
                        <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Kërko përmes search të avansuar</FormLabel>
                        <Input
                            placeholder='Kërko permes search te avansuar'
                            value={search}
                            onChange={handleSearchChange}
                            mt={0}
                            maxW='400px'
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
                        <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Selekto kategorinë</FormLabel>
                        <Stack direction='row'>
                            <Select
                                placeholder="Selekto një kategori"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)} // Update the selected category
                                bg='transparent'
                                size='sm'
                                border='1px solid #7A869A'
                                rounded={'md'}
                                color='white'
                                _hover={{ border: '1px solid #7A869A' }}
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>


                        </Stack>
                    </Box>

                    <Box>
                        <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Kërko përmes partnerit</FormLabel>
                        <Select
                            placeholder="Selekto një partner"
                            value={partnerId}
                            onChange={(e) => setPartnerId(e.target.value)} // Update the selected category
                            size='sm'
                            border='1px solid #7A869A'
                            rounded={'md'}
                            color='white'
                            _hover={{ border: '1px solid #7A869A' }}
                        >
                            {partners.map((partner) => (
                                <option key={partner.id} value={partner.id}>
                                    {partner.name}
                                </option>
                            ))}
                        </Select>
                    </Box>

                    <Box>
                        <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Filtrime tjera</FormLabel>
                        <Stack direction='row'>
                            <Select
                                placeholder="Selekto njërën"
                                value={priceFilter}
                                onChange={handlePriceChange}
                                size='sm'
                                border='1px solid #7A869A'
                                rounded={'md'}
                                color='white'
                                _hover={{ border: '1px solid #7A869A' }}
                            >
                                <option value="asc">Cmimi: I ulët tek i lartë</option>
                                <option value="desc">Cmimi: I lartë tek i ulët</option>
                            </Select>

                            <Button
                                bg='#A1BDD914'
                                color='gray.300'
                                _hover={{ bg: '#A1BDD914' }}
                                onClick={fetchProducts}
                                direction='row'
                                size='sm'
                            >
                                Kerko
                            </Button>
                        </Stack>
                    </Box>


                </SimpleGrid>



                {isLoading ? (
                    <Spinner />
                ) : (
                    <Box border={'1px solid #A1BDD914'} rounded='lg' mt={6}>
                        <Table variant="simple" size="sm" pt={2} >
                            <Thead>
                                <Tr borderBottom="1px" borderColor={'#A1BDD914'}>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Id</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Emri</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Barkodi</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Detajet</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Cmimi</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Partner</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Statusi</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Tax</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Kategori</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Stock</Th>
                                    <Th borderBottom='1px' borderRight={'0px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Operacione</Th>
                                </Tr>
                            </Thead>
                            <Tbody >
                                {products.map((product) => (
                                    <Tr key={product.id}>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{product.id}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{product.name}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{product.barcode}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{product.description}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{product && typeof product.price === 'number' && product.price != null ?
                                            product.price.toFixed(2) : 'N/A'}€</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{product.partner ? product.partner.name : 'N/A'}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{product.status}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{product.tax ? product.tax.rate + "%" : 'N/A'}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{product.category ? product.category.name : 'N/A'}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{product.stock ? product.stock.quantity : 'N/A'}</Td>
                                        <Td borderRight={'0px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>

                                            <Stack direction='row'>
                                                <Button
                                                    bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }}
                                                    size='sm'
                                                    onClick={() => {
                                                        setSelectedProduct(product);  // Set the selected category
                                                        setIsUpdateModalOpen(true);     // Open the delete modal
                                                    }}
                                                >
                                                    <EditIcon />
                                                </Button>
                                                <Button
                                                    bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }}
                                                    size='sm'
                                                    onClick={() => {
                                                        setSelectedProduct(product);  // Set the selected category
                                                        setIsDeleteModalOpen(true);     // Open the delete modal
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </Stack>

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

            {/* Add Product Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size='4xl'>
                <ModalOverlay />
                <ModalContent bg='#282E33'>
                    <ModalHeader color='gray.300'>Shto një produkt të ri</ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody>

                        <SimpleGrid columns={2} spacing='2'>
                            <FormControl>
                                <FormLabel color='gray.300'>Emri i produktit</FormLabel>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Shkruaj emrin e produktit"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color='gray.300'>Barkodi</FormLabel>
                                <Input
                                    value={barcode}
                                    onChange={(e) => setBarcode(e.target.value)}
                                    placeholder="Shkruaj barkodin e produktit"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel color='gray.300'>Detaje</FormLabel>
                                <Input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Shkruaj detajet e produktit"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel color='gray.300'>Qmimi</FormLabel>
                                <Input
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Shkruaj qmimin e produktit"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel color='gray.300'>Zgjedh partnerin</FormLabel>
                                <Select placeholder='Zgjedh partnerin' name="partnerId" value={partnerId} onChange={(e) => setPartnerId(e.target.value)}
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'>
                                    {partners.map((partner) => (
                                        <option key={partner.id} value={partner.id}>
                                            ID: {partner.id} - {partner.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel color='gray.300'>Zgjedh kategorine</FormLabel>
                                <Select placeholder='Zgjedh kategorine' name="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            ID: {category.id} - {category.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel color='gray.300'>Zgjedh taksen</FormLabel>
                                <Select placeholder='Zgjedh taksen' name="taxId" value={taxId} onChange={(e) => setTaxId(e.target.value)}
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'>
                                    {taxes.map((tax) => (
                                        <option key={tax.id} value={tax.id}>
                                            ID: {tax.id} - {tax.rate}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel color='gray.300'>Shkruaj sasine e produkteve</FormLabel>
                                <Input
                                    value={initialStock}
                                    onChange={(e) => setInitialStock(e.target.value)}
                                    placeholder="Shkruaj sasine e produktit"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                        </SimpleGrid>

                    </ModalBody>
                    <ModalFooter>
                        <Button bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} onClick={addProduct}>
                            Shto
                        </Button>
                        <Button bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} onClick={() => setIsAddModalOpen(false)} ml={3}>
                            Anulo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Product Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size='2xl'>
                <ModalOverlay />
                <ModalContent bg='#282E33'>
                    <ModalHeader color='gray.300'>Fshij produktin</ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody color='gray.300'>
                        A jeni të sigurtë që dëshironi ta fshini këtë produkt{' '}
                        <strong>{selectedProduct?.name} me Barcode: {selectedProduct?.barcode}</strong>?
                    </ModalBody>
                    <ModalFooter>
                        <Button bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} onClick={deleteProduct}>
                            Fshij
                        </Button>
                        <Button bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} onClick={() => setIsDeleteModalOpen(false)} ml={3}>
                            Anulo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Update modal */}
            <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} size='4xl'>
                <ModalOverlay />
                <ModalContent bg='#282E33'>
                    <ModalHeader color='gray.300'>Perditeso Produktin</ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody>
                        <SimpleGrid columns={2} spacing='2'>
                            <FormControl>
                                <FormLabel color='gray.300'>Emri i produktit</FormLabel>
                                <Input
                                    value={selectedProduct?.name || ''}
                                    onChange={(e) => setSelectedProduct({
                                        ...selectedProduct,
                                        name: e.target.value
                                    })}
                                    placeholder="Shkruaj emrin e produktit"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color='gray.300'>Barkodi</FormLabel>
                                <Input
                                    value={selectedProduct?.barcode || ''}
                                    onChange={(e) => setSelectedProduct({
                                        ...selectedProduct,
                                        barcode: e.target.value
                                    })}
                                    placeholder="Shkruaj barkodin e produktit"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color='gray.300'>Detaje</FormLabel>
                                <Input
                                    value={selectedProduct?.description || ''}
                                    onChange={(e) => setSelectedProduct({
                                        ...selectedProduct,
                                        description: e.target.value
                                    })}
                                    placeholder="Shkruaj detajet e produktit"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color='gray.300'>Cmimi</FormLabel>
                                <Input
                                    value={selectedProduct?.price || ''}
                                    onChange={(e) => setSelectedProduct({
                                        ...selectedProduct,
                                        price: e.target.value
                                    })}
                                    placeholder="Shkruaj cmimin e produktit"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color='gray.300'>Partneri</FormLabel>
                                <Select
                                    value={selectedProduct?.partnerId || ''}
                                    onChange={(e) => setSelectedProduct({
                                        ...selectedProduct,
                                        partnerId: e.target.value
                                    })}
                                    placeholder="Zgjedh partnerin"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                >
                                    {partners.map(partner => (
                                        <option key={partner.id} value={partner.id}>
                                            {partner.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel color='gray.300'>Kategoria</FormLabel>
                                <Select
                                    value={selectedProduct?.categoryId || ''}
                                    onChange={(e) => setSelectedProduct({
                                        ...selectedProduct,
                                        categoryId: e.target.value
                                    })}
                                    placeholder="Zgjedh kategorinë"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                >
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel color='gray.300'>Tax</FormLabel>
                                <Select
                                    value={selectedProduct?.taxId || ''}
                                    onChange={(e) => setSelectedProduct({
                                        ...selectedProduct,
                                        taxId: e.target.value
                                    })}
                                    placeholder="Zgjedh taksën"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                >
                                    {taxes.map(tax => (
                                        <option key={tax.id} value={tax.id}>
                                            {tax.rate}%
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </SimpleGrid>
                    </ModalBody>

                    <ModalFooter>
                        <Button bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} mr={3} onClick={updateProduct}>
                            Perditeso Produktin
                        </Button>
                        <Button bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} onClick={() => setIsUpdateModalOpen(false)}>
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