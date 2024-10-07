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
    Heading,
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
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function SidebarWithHeader({ children }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, loading, logout, isAdmin } = useAuth();
    const [data, setData] = useState({
        totalSales: 0,
        totalInvoices: 0,
        totalProductsSold: 0,
        totalTaxes: 0,
        totalProductsInStock: 0,
        totalProducts: 0,
        totalPartners: 0,
        totalOrders: 0,
        dailySales: [],
        monthlySalesGrowth: [],
        weeklyGrowthSales: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responses = await Promise.all([
                    await axios.get('http://localhost:6099/api/reports/totalsales', { withCredentials: true }),
                    await axios.get('http://localhost:6099/api/reports/totalinvoices', { withCredentials: true }),
                    await axios.get('http://localhost:6099/api/reports/totalproductsold', { withCredentials: true }),
                    await axios.get('http://localhost:6099/api/reports/totaltaxes', { withCredentials: true }),
                    await axios.get('http://localhost:6099/api/reports/totalproductsinstock', { withCredentials: true }),
                    await axios.get('http://localhost:6099/api/reports/total-products', { withCredentials: true }),
                    await axios.get('http://localhost:6099/api/reports/total-partners', { withCredentials: true }),
                    await axios.get('http://localhost:6099/api/reports/total-orders', { withCredentials: true }),
                    await axios.get('http://localhost:6099/api/reports/dailysales', { withCredentials: true }),
                    await axios.get('http://localhost:6099/api/reports/metrics/sales-monthly-growth', { withCredentials: true }),
                    await axios.get('http://localhost:6099/api/reports/metrics/sales-weekly-growth', { withCredentials: true }),

                ]);

                setData({
                    totalSales: responses[0].data.totalSales,
                    totalInvoices: responses[1].data.totalInvoices,
                    totalProductsSold: responses[2].data.totalProductsSold,
                    totalTaxes: responses[3].data.totalTaxes,
                    totalProductsInStock: responses[4].data.totalProductsInStock,
                    totalProducts: responses[5].data.totalProducts,
                    totalPartners: responses[6].data.totalPartners,
                    totalOrders: responses[7].data.totalOrders,
                    dailySales: responses[8].data.dailySales,
                    monthlySalesGrowth: responses[9].data.monthlySalesGrowth,
                    weeklyGrowthSales: responses[10].data.weeklyGrowthSales,
                });

                console.log("data: ", data.totalSales);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const chartOptions = {
        scales: {
            x: {
                ticks: {
                    maxRotation: 0,  // Prevent label rotation
                    minRotation: 0   // Ensure labels are horizontal
                }
            }
        }
    };

    const barData = {
        labels: ['Total Sales'],
        datasets: [{
            label: 'Total Sales',
            data: [data.totalSales],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const invoicesBarData = {
        labels: ['Total Invoices'],
        datasets: [{
            label: 'Total Invoices',
            data: [data.totalInvoices],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const productsSoldData = {
        labels: ['Total Products sold'],
        datasets: [{
            label: 'Total Products sold',
            data: [data.totalProductsSold],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const totalTaxesData = {
        labels: ['Total Taxes'],
        datasets: [{
            label: 'Total taxes',
            data: [data.totalTaxes],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    }; 

    const totalProductsInStock = {
        labels: ['Total Products in Stock'],
        datasets: [{
            label: 'Total Products in Stock',
            data: [data.totalProductsInStock],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const totalProductsData = {
        labels: ['Total Products'],
        datasets: [{
            label: 'Total Products',
            data: [data.totalProducts],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const totalPartnersData = {
        labels: ['Total Partners'],
        datasets: [{
            label: 'Total Partners',
            data: [data.totalPartners],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const totalOrdersData = {
        labels: ['Total Orders'],
        datasets: [{
            label: 'Total Orders',
            data: [data.totalOrders],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const todaySalesLineData = {
        labels: data.dailySales.map(day => day.day),
        datasets: [{
            label: 'Daily Sales',
            data: data.dailySales.map(day => day.totalSales),
            borderColor: '#F6E05E',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };

    const monthlyGrowthSalesLineData = {
        labels: data.monthlySalesGrowth.map(entry => {
            const month = new Date(`${entry.year}-${entry.month}`).toLocaleString('default', { month: 'long' });
            return month;
        }),
        datasets: [{
            label: 'Monthly Sales Growth',
            data: data.monthlySalesGrowth.map(entry => entry.totalSales),
            borderColor: '#F6E05E',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };

    const weeklyGrowthSalesLineData = {
        labels: data.weeklyGrowthSales.map(entry => entry.date),
        datasets: [{
            label: 'Weekly Sales Growth',
            data: data.weeklyGrowthSales.map(entry => entry.totalSales),
            borderColor: '#F6E05E',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };

    console.log("bar data: ", barData);
    console.log(data.totalInvoices);
    
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

                <Text color='gray.400' fontSize={'3xl'} mt={5}>
                    Raporte themelore
                </Text>

                <Button
                    size='sm'
                    bg='#579DFF'
                    color='black'
                    _hover={{ bg: '#579DFF' }}
                    as='a'
                    href='/most-sold'
                    mt={4}>
                    Produktet me te shitura
                </Button>


                <SimpleGrid columns={4} spacing={5}>

                    <Box mt='5' p='5' bg='gray.900' rounded='xl'>
                        <Heading size='md' color='gray.300'>Total Sales</Heading>
                        <Bar data={barData} color='white' />
                    </Box>

                    <Box mt='5' p='5' bg='gray.900' rounded='xl'>
                        <Heading size='md' color='gray.300'>Total Invoices</Heading>
                        <Bar data={invoicesBarData} color='white' />
                    </Box>

                    <Box mt='5' p='5' bg='gray.900' rounded='xl'>
                        <Heading size='md' color='gray.300'>Total Products sold</Heading>
                        <Bar data={productsSoldData} color='white' />
                    </Box>

                    <Box mt='5' p='5' bg='gray.900' rounded='xl'>
                        <Heading size='md' color='gray.300'>Total Taxes</Heading>
                        <Bar data={totalTaxesData} color='white' />
                    </Box>

                    <Box mt='5' p='5' bg='gray.900' rounded='xl'>
                        <Heading size='md' color='gray.300'>Total Products in Stock</Heading>
                        <Bar data={totalProductsInStock} color='white' />
                    </Box>

                    <Box mt='5' p='5' bg='gray.900' rounded='xl'>
                        <Heading size='md' color='gray.300'>Total Products</Heading>
                        <Bar data={totalProductsData} color='white' />
                    </Box>

                    <Box mt='5' p='5' bg='gray.900' rounded='xl'>
                        <Heading size='md' color='gray.300'>Total Partners</Heading>
                        <Bar data={totalPartnersData} color='white' />
                    </Box>

                    <Box mt='5' p='5' bg='gray.900' rounded='xl'>
                        <Heading size='md' color='gray.300'>Total Orders</Heading>
                        <Bar data={totalOrdersData} color='white' />
                    </Box>

                </SimpleGrid>

                <SimpleGrid columns={2} spacing='5'>
                    <Box mt='5' p='5' bg='gray.900' rounded='xl'>
                        <Heading size='md' color='gray.300'>Daily sales</Heading>
                        <Line data={todaySalesLineData} color='white' options={chartOptions} />
                    </Box>

                    <Box mt='5' p='5' bg='gray.900' rounded='xl'>
                        <Heading size='md' color='gray.300'>Monthly sales</Heading>
                        <Line data={monthlyGrowthSalesLineData} color='white' options={chartOptions} />
                    </Box>

                    <Box mt='5' p='5' bg='gray.900' rounded='xl'>
                        <Heading size='md' color='gray.300'>Weekly sales</Heading>
                        <Line data={weeklyGrowthSalesLineData} color='white' options={chartOptions} />
                    </Box>
                </SimpleGrid>



            </Box>
        </Box>
    );
};


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