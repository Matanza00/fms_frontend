import { Heading } from '@chakra-ui/react';
const DashboardHeading = ({ children }) => {
  return (
    <Heading as="h1" fontSize={28} color="brand.secondary">
      {children}
    </Heading>
  );
};

export default DashboardHeading;
