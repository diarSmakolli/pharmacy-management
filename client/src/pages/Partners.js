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

    const fetchPartners = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:6099/api/partners', {
                params: { search, page, limit, idFilter, search, partnerId: searchPartnerId },
                withCredentials: true,
            });
            console.log(response.data);
            setPartners(response.data.partners);
            setTotal(response.data.total);

            console.log("Total Partners: ", response.data.total);

            const tp = Math.ceil(response.data.total / limit);
            setTotalPages(tp);

            console.log("Total Pages: ", tp);

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

    const addPartner = async () => {
        if (!partnerName || !businessNumber || !fiscalNumber || !commune || !address || !phoneNumber || !email) {
            toast({
                title: 'Ju lutem plotësoni të gjitha fushat',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:6099/api/partners',
                { name: partnerName, businessNumber, fiscalNumber, commune, address, phoneNumber, email },);
            setPartners([...partners, response.data]);
            toast({
                title: 'Partneri u shtua me sukses',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setPartnerName('');
            setBusinessNumber('');
            setFiscalNumber('');
            setCommune('');
            setAddress('');
            setPhoneNumber('');
            setEmail('');
            setStatus('');
            setIsAddModalOpen(false);
        } catch (error) {
            toast({
                title: 'Error në shtimin e partnerit',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.log("err: ", error);
        }
    };

    // const deleteCategory = async () => {
    //     try {
    //         await axios.delete(`http://localhost:6099/api/categories/${selectedCategory.id}`);
    //         setCategories(categories.filter((category) => category.id !== selectedCategory.id));
    //         toast({
    //             title: 'Kategoria u fshi',
    //             status: 'success',
    //             duration: 3000,
    //             isClosable: true,
    //         });
    //         setIsDeleteModalOpen(false);
    //     } catch (error) {
    //         toast({
    //             title: 'Error në fshirjen e kategorisë',
    //             status: 'error',
    //             duration: 3000,
    //             isClosable: true,
    //         });
    //     }
    // };

    const deletePartner = async () => {
        try {
            await axios.delete(`http://localhost:6099/api/partners/${selectedPartner.id}`);
            setPartners(partners.filter((partner) => partner.id !== selectedPartner.id));
            toast({
                title: 'Partneri u fshi',
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
    }


    useEffect(() => {
        fetchPartners();
    }, [page, limit]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchPartners();
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
                    Partnerët
                </Text>

                <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={() => setIsAddModalOpen(true)} mt={4}>
                    Shto një partner
                </Button>

                <SimpleGrid columns={4} spacing={5} direction='row'>
                    <Box>
                        <FormLabel mt={4}>Kërko përmes search të avansuar</FormLabel>
                        <Input
                            placeholder='Kërko përmes search të avansuar'
                            // value={search}
                            // onChange={handleSearchChange}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            mt={0}
                            maxW='400px'
                            bg='#fff'
                        />
                    </Box>

                    <Box>
                        <FormLabel mt={4}>Kërko përmes ID</FormLabel>
                        <Input
                            placeholder='Kërko përmes ID'
                            // value={search}
                            // onChange={handleSearchChange}
                            value={searchPartnerId} 
                            onChange={(e) => setSearchPartnerId(e.target.value)}
                            mt={0}
                            maxW='400px'
                            bg='#fff'
                        />
                    </Box>

                    <Button
                        mt={12}
                        bg='black'
                        color='white'
                        _hover={{ bg: 'black' }}
                        onClick={fetchPartners}
                        direction='row'
                    >
                        Kërko
                    </Button>
                </SimpleGrid>

                {isLoading ? (
                    <Spinner />
                ) : (
                    <Table variant="striped" minW={'100%'} size={'sm'} mt={5} p={5}>
                        <Thead>
                            <Tr>
                                <Th>Partner ID</Th>
                                <Th>Numri i biznesit</Th>
                                <Th>Numri fiskal</Th>
                                <Th>Komuna</Th>
                                <Th>Adresa</Th>
                                <Th>Numri i telefonit</Th>
                                <Th>Email</Th>
                                <Th>Status</Th>
                                <Th>Operacione</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {partners.map((partner) => (
                                <Tr key={partner.id}>
                                    <Td>{partner.id}</Td>
                                    <Td>{partner.name}</Td>
                                    <Td>{partner.fiscalNumber}</Td>
                                    <Td>{partner.commune}</Td>
                                    <Td>{partner.address}</Td>
                                    <Td>{partner.phoneNumber}</Td>
                                    <Td>{partner.email}</Td>
                                    <Td>{partner.status}</Td>
                                    <Td>
                                        <Button
                                            bg='black' color='white' _hover={{ bg: 'black' }}
                                            size='sm'
                                            onClick={() => {
                                                setSelectedPartner(partner);  // Set the selected category
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

            {/* Add Partner Modal */}
             <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Shto një partner të ri</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Emri i partnerit</FormLabel>
                            <Input
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                placeholder="Shkruaj emrin e partnerit"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Numri i biznesit</FormLabel>
                            <Input
                                value={businessNumber}
                                onChange={(e) => setBusinessNumber(e.target.value)}
                                placeholder="Shkruaj numrin e biznesit"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Numri fiskal</FormLabel>
                            <Input
                                value={fiscalNumber}
                                onChange={(e) => setFiscalNumber(e.target.value)}
                                placeholder="Shkruaj numrin fiskal"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Komuna</FormLabel>
                            <Input
                                value={commune}
                                onChange={(e) => setCommune(e.target.value)}
                                placeholder="Shkruaj komunën"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Adresa</FormLabel>
                            <Input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Shkruaj adresën"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Numri i telefonit</FormLabel>
                            <Input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Shkruaj numrin e telefonit"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Shkruaj emailin"
                            />
                        </FormControl>
                        
                    
                    </ModalBody>
                    <ModalFooter>
                        <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={addPartner}>
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
                    <ModalHeader>Fshij partnerin</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        A jeni të sigurtë që dëshironi ta fshini këtë partner{' '}
                        <strong>{selectedPartner?.partnerName}</strong>?
                    </ModalBody>
                    <ModalFooter>
                        <Button bg='black' color='white' _hover={{ bg: 'black' }} onClick={deletePartner}>
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