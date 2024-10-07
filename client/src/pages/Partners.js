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
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

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
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);


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
    };

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
    };

    const updatePartner = async () => {
        try {
            await axios.put(`http://localhost:6099/api/partners/${selectedPartner.id}`, {
                name: selectedPartner.name,
                businessNumber: selectedPartner.businessNumber,
                fiscalNumber: selectedPartner.fiscalNumber,
                commune: selectedPartner.commune,
                address: selectedPartner.address,
                phoneNumber: selectedPartner.phoneNumber,
                email: selectedPartner.email,
            });
            toast({
                title: 'Partneri u përditësua me sukses',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
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
    };


    useEffect(() => {
        fetchPartners();
    }, [page, limit]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchPartners();
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
                    Partnerët
                </Text>

                <Button size='sm'
                    bg='#579DFF'
                    color='black'
                    _hover={{ bg: '#579DFF' }}
                    onClick={() => setIsAddModalOpen(true)} mt={4}>
                    Shto një partner
                </Button>

                <SimpleGrid columns={4} spacing={5} direction='row'>
                    <Box>
                        <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Kërko përmes search të avansuar</FormLabel>
                        <Input
                            placeholder='Kërko përmes search të avansuar'
                            // value={search}
                            // onChange={handleSearchChange}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            mt={0}
                            bg='transparent'
                            size='sm'
                            border='1px solid #7A869A'
                            rounded={'md'}
                            color='white'
                            _hover={{ border: '1px solid #7A869A' }}
                        />
                    </Box>

                    <Box>
                        <FormLabel mt={4} color='gray.300' fontSize={'sm'}>Kërko përmes ID</FormLabel>
                        <Input
                            placeholder='Kërko përmes ID'
                            // value={search}
                            // onChange={handleSearchChange}
                            value={searchPartnerId}
                            onChange={(e) => setSearchPartnerId(e.target.value)}
                            mt={0}
                            maxW='400px'
                            bg='transparent'
                            size='sm'
                            border='1px solid #7A869A'
                            rounded={'md'}
                            color='white'
                            _hover={{ border: '1px solid #7A869A' }}
                        />
                    </Box>

                    <Box mt={1}>
                        <Button
                            mt={10}
                            bg='#A1BDD914'
                            color='gray.300'
                            _hover={{ bg: '#A1BDD914' }}
                            onClick={fetchPartners}
                            direction='row'
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
                            <Thead >
                                <Tr borderBottom="1px" borderColor={'#A1BDD914'}>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Partner ID</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Numri i biznesit</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Numri fiskal</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Komuna</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Adresa</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Numri i telefonit</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Email</Th>
                                    <Th borderBottom='1px' borderRight={'1px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Status</Th>
                                    <Th borderBottom='1px' borderRight={'0px'} borderColor={'#A1BDD914'} color='gray.400' textTransform={'none'} py={5}>Operacione</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {partners.map((partner) => (
                                    <Tr key={partner.id}>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{partner.id}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{partner.name}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{partner.fiscalNumber}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{partner.commune}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{partner.address}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{partner.phoneNumber}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{partner.email}</Td>
                                        <Td borderRight={'1px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>{partner.status}</Td>
                                        <Td borderRight={'0px'} borderTop='1px' borderBottom={'0px'} borderColor={'#A1BDD914'} color='gray.400' fontWeight={'500'}>
                                            <Stack direction='row'>
                                                <Button
                                                    bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }}
                                                    size='sm'
                                                    onClick={() => {
                                                        setSelectedPartner(partner);  // Set the selected category
                                                        setIsUpdateModalOpen(true);     // Open the delete modal
                                                    }}
                                                >
                                                    <EditIcon />
                                                </Button>
                                                <Button
                                                    bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }}
                                                    size='sm'
                                                    onClick={() => {
                                                        setSelectedPartner(partner);  // Set the selected category
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

            {/* Add Partner Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size='4xl'>
                <ModalOverlay />
                <ModalContent bg='#282E33'>
                    <ModalHeader color='gray.300'>Shto një partner të ri</ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={'2'}>
                            <FormControl>
                                <FormLabel color='gray.300'>Emri i partnerit</FormLabel>
                                <Input
                                    value={partnerName}
                                    onChange={(e) => setPartnerName(e.target.value)}
                                    placeholder="Shkruaj emrin e partnerit"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color='gray.300'>Numri i biznesit</FormLabel>
                                <Input
                                    value={businessNumber}
                                    onChange={(e) => setBusinessNumber(e.target.value)}
                                    placeholder="Shkruaj numrin e biznesit"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel color='gray.300'>Numri fiskal</FormLabel>
                                <Input
                                    value={fiscalNumber}
                                    onChange={(e) => setFiscalNumber(e.target.value)}
                                    placeholder="Shkruaj numrin fiskal"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel color='gray.300'>Komuna</FormLabel>
                                <Input
                                    value={commune}
                                    onChange={(e) => setCommune(e.target.value)}
                                    placeholder="Shkruaj komunën"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel color='gray.300'>Adresa</FormLabel>
                                <Input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Shkruaj adresën"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel color='gray.300'>Numri i telefonit</FormLabel>
                                <Input
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Shkruaj numrin e telefonit"
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel color='gray.300'>Email</FormLabel>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Shkruaj emailin"
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
                        <Button bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} onClick={addPartner}>
                            Shto
                        </Button>
                        <Button bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} onClick={() => setIsAddModalOpen(false)} ml={3}>
                            Anulo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* Delete modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <ModalOverlay />
                <ModalContent bg='#282E33'>
                    <ModalHeader color='gray.300'>Fshij partnerin</ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody color='gray.300'>
                        A jeni të sigurtë që dëshironi ta fshini këtë partner{' '}
                        <strong>{selectedPartner?.partnerName}</strong>?
                    </ModalBody>
                    <ModalFooter>
                        <Button bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} onClick={deletePartner}>
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
                    <ModalHeader color='gray.300'>Perditeso Partnerin</ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody>
                        <SimpleGrid columns={2} spacing='2'>

                            <FormControl>
                                <FormLabel color='gray.300'>Emri i partnerit</FormLabel>
                                <Input
                                    value={selectedPartner?.name || ''}
                                    onChange={(e) => setSelectedPartner({
                                        ...selectedPartner,
                                        partnerName: e.target.value
                                    })}
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel color='gray.300'>Numri i biznesit</FormLabel>
                                <Input
                                    value={selectedPartner?.businessNumber || ''}
                                    onChange={(e) => setSelectedPartner({
                                        ...selectedPartner,
                                        businessNumber: e.target.value
                                    })}
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel color='gray.300'>Numri fiskal</FormLabel>
                                <Input
                                    value={selectedPartner?.fiscalNumber || ''}
                                    onChange={(e) => setSelectedPartner({
                                        ...selectedPartner,
                                        fiscalNumber: e.target.value
                                    })}
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel color='gray.300'>Komuna</FormLabel>
                                <Input
                                    value={selectedPartner?.commune || ''}
                                    onChange={(e) => setSelectedPartner({
                                        ...selectedPartner,
                                        commune: e.target.value
                                    })}
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel color='gray.300'>Adresa</FormLabel>
                                <Input
                                    value={selectedPartner?.address || ''}
                                    onChange={(e) => setSelectedPartner({
                                        ...selectedPartner,
                                        address: e.target.value
                                    })}
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel color='gray.300'>Numri i telefonit</FormLabel>
                                <Input
                                    value={selectedPartner?.phoneNumber || ''}
                                    onChange={(e) => setSelectedPartner({
                                        ...selectedPartner,
                                        phoneNumber: e.target.value
                                    })}
                                    bg='#22272B'
                                    border='1px solid #7A869A'
                                    rounded='3px'
                                    _hover={{ border: '1px solid #7A869A' }}
                                    color='gray.300'
                                    w='100%'
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel color='gray.300'>Email</FormLabel>
                                <Input
                                    value={selectedPartner?.email || ''}
                                    onChange={(e) => setSelectedPartner({
                                        ...selectedPartner,
                                        email: e.target.value
                                    })}
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
                        <Button bg='#A1BDD914' color='white' _hover={{ bg: '#A1BDD914' }} mr={3} onClick={updatePartner}>
                            Perditeso Partnerin
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