import {
  Box,
  Container,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';
import { useAuth } from '../auth/authContext';
import SidebarWithHeader from './Sidebar';

function Home() {
  const { user, loading, logout } = useAuth();
  return (
    <Box bg='gray.100'>
            {/* <Container> */}
                
                <Box>
                    <SidebarWithHeader />
                </Box>

                {/* <Text color='black' fontSize={'5xl'}>
                    Hello {user && user.name}
                </Text>                 */}

            {/* </Container> */}
        </Box>
  )
}

export default Home