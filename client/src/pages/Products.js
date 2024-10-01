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
                    Produktet
                </Text>

                <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={() => setIsAddModalOpen(true)} mt={4}>Shto një produkt</Button>
                <br />

                <SimpleGrid columns={4} spacing={5} direction='row'>
                    <Box>
                        <FormLabel mt={4}>Kërko përmes search të avansuar</FormLabel>
                        <Input
                            placeholder='Kërko produkte permes search te avansuar'
                            value={search}
                            onChange={handleSearchChange}
                            mt={0}
                            maxW='400px'
                            bg='#fff'
                        />
                    </Box>

                    <Box>
                        <FormLabel mt={4}>Selekto kategorinë</FormLabel>
                        <Stack direction='row'>
                            <Select
                                placeholder="Selekto një kategori"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)} // Update the selected category
                                bg='#fff'
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
                        <FormLabel mt={4}>Kërko përmes partnerit</FormLabel>
                        <Select
                            placeholder="Selekto një partner"
                            value={partnerId}
                            onChange={(e) => setPartnerId(e.target.value)} // Update the selected category
                            bg='#fff'
                        >
                            {partners.map((partner) => (
                                <option key={partner.id} value={partner.id}>
                                    {partner.name}
                                </option>
                            ))}
                        </Select>
                    </Box>

                    <Box>
                        <FormLabel mt={4}>Filtrime tjera</FormLabel>
                        <Stack direction='row'>
                            <Select
                                placeholder="Selekto njërën"
                                value={priceFilter}
                                onChange={handlePriceChange}
                                bg='#fff'
                            >
                                <option value="asc">Cmimi: I ulët tek i lartë</option>
                                <option value="desc">Cmimi: I lartë tek i ulët</option>
                            </Select>

                            <Button
                                bg='black'
                                color='white'
                                _hover={{ bg: 'black' }}
                                onClick={fetchProducts}
                                direction='row'
                            >
                                Kërko
                            </Button>
                        </Stack>
                    </Box>


                </SimpleGrid>



                {isLoading ? (
                    <Spinner />
                ) : (
                    <Table variant="striped" minW={'100%'} size={'sm'} mt={5} p={5}>
                        <Thead>
                            <Tr>
                                <Th>Produkt ID</Th>
                                <Th>Emri</Th>
                                <Th>Barkodi</Th>
                                <Th>Detajet</Th>
                                <Th>Cmimi</Th>
                                <Th>Partner</Th>
                                <Th>Statusi</Th>
                                <Th>Tax</Th>
                                <Th>Kategori</Th>
                                <Th>Stock / sasi</Th>
                                <Th>Operacione</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {products.map((product) => (
                                <Tr key={product.id}>
                                    <Td>{product.id}</Td>
                                    <Td>{product.name}</Td>
                                    <Td>{product.barcode}</Td>
                                    <Td>{product.description}</Td>
                                    <Td>{product && typeof product.price === 'number' && product.price != null ?
                                    product.price.toFixed(2) : 'N/A'}€</Td>
                                    <Td>{product.partner ? product.partner.name : 'N/A'}</Td>
                                    <Td>{product.status}</Td>
                                    <Td>{product.tax ? product.tax.rate + "%" : 'N/A'}</Td>
                                    <Td>{product.category ? product.category.name : 'N/A'}</Td>
                                    <Td>{product.stock ? product.stock.quantity : 'N/A'}</Td>
                                    <Td>

                                        <Stack direction='row'>
                                            <Button
                                                bg='black' color='white' _hover={{ bg: 'black' }}
                                                size='sm'
                                                onClick={() => {
                                                    setSelectedProduct(product);  // Set the selected category
                                                    setIsUpdateModalOpen(true);     // Open the delete modal
                                                }}
                                            >
                                                Përditëso
                                            </Button>
                                            <Button
                                                bg='black' color='white' _hover={{ bg: 'black' }}
                                                size='sm'
                                                onClick={() => {
                                                    setSelectedProduct(product);  // Set the selected category
                                                    setIsDeleteModalOpen(true);     // Open the delete modal
                                                }}
                                            >
                                                Fshij
                                            </Button>
                                        </Stack>

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

            {/* Add Product Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Shto një produkt të ri</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Emri i produktit</FormLabel>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Shkruaj emrin e produktit"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Barkodi</FormLabel>
                            <Input
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                placeholder="Shkruaj barkodin e produktit"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Detaje</FormLabel>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Shkruaj detajet e produktit"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Qmimi</FormLabel>
                            <Input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Shkruaj qmimin e produktit"
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <Select placeholder='Zgjedh partnerin' name="partnerId" value={partnerId} onChange={(e) => setPartnerId(e.target.value)}>
                                {partners.map((partner) => (
                                    <option key={partner.id} value={partner.id}>
                                        ID: {partner.id} - {partner.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl mt={4}>
                            <Select placeholder='Zgjedh kategorine' name="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        ID: {category.id} - {category.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl mt={4}>
                            <Select placeholder='Zgjedh taksen' name="taxId" value={taxId} onChange={(e) => setTaxId(e.target.value)}>
                                {taxes.map((tax) => (
                                    <option key={tax.id} value={tax.id}>
                                        ID: {tax.id} - {tax.rate}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Shkruaj sasine e produkteve</FormLabel>
                            <Input
                                value={initialStock}
                                onChange={(e) => setInitialStock(e.target.value)}
                                placeholder="Shkruaj sasine e produktit"
                            />
                        </FormControl>

                    </ModalBody>
                    <ModalFooter>
                        <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={addProduct}>
                            Shto
                        </Button>
                        <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={() => setIsAddModalOpen(false)} ml={3}>
                            Anulo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Product Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Fshij produktin</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        A jeni të sigurtë që dëshironi ta fshini këtë produkt{' '}
                        <strong>{selectedProduct?.name} me Barcode: {selectedProduct?.barcode}</strong>?
                    </ModalBody>
                    <ModalFooter>
                        <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={deleteProduct}>
                            Fshij
                        </Button>
                        <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={() => setIsDeleteModalOpen(false)} ml={3}>
                            Anulo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Update modal */}
            <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Perditeso Produktin</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Emri i produktit</FormLabel>
                            <Input
                                value={selectedProduct?.name || ''}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    name: e.target.value
                                })}
                                placeholder="Shkruaj emrin e produktit"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Barkodi</FormLabel>
                            <Input
                                value={selectedProduct?.barcode || ''}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    barcode: e.target.value
                                })}
                                placeholder="Shkruaj barkodin e produktit"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Detaje</FormLabel>
                            <Input
                                value={selectedProduct?.description || ''}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    description: e.target.value
                                })}
                                placeholder="Shkruaj detajet e produktit"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Cmimi</FormLabel>
                            <Input
                                value={selectedProduct?.price || ''}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    price: e.target.value
                                })}
                                placeholder="Shkruaj cmimin e produktit"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Partneri</FormLabel>
                            <Select
                                value={selectedProduct?.partnerId || ''}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    partnerId: e.target.value
                                })}
                                placeholder="Zgjedh partnerin"
                            >
                                {partners.map(partner => (
                                    <option key={partner.id} value={partner.id}>
                                        {partner.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Kategoria</FormLabel>
                            <Select
                                value={selectedProduct?.categoryId || ''}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    categoryId: e.target.value
                                })}
                                placeholder="Zgjedh kategorinë"
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Tax</FormLabel>
                            <Select
                                value={selectedProduct?.taxId || ''}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    taxId: e.target.value
                                })}
                                placeholder="Zgjedh taksën"
                            >
                                {taxes.map(tax => (
                                    <option key={tax.id} value={tax.id}>
                                        {tax.rate}%
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button bg='black' color='white' _hover={{ bg: 'black' }} mr={3} onClick={updateProduct}>
                            Perditeso Produktin
                        </Button>
                        <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={() => setIsUpdateModalOpen(false)}>
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