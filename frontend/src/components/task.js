import React from 'react';
import { Flex, Box, chakra, Icon } from '@chakra-ui/react';
import { MdHeadset, BsFillBriefcaseFill, MdLocationOn, MdEmail } from 'react-icons/all';

const TaskCard = ({ taskId }) => {
    
    const task=taskId;
  
    return (
    <Flex
      bg="brand.50"
      p={8}
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w="sm"
        mx="auto"
        bg="white"
        shadow="lg"
        rounded="lg"
        overflow="hidden"
      >
        <Flex alignItems="center" px={6} py={3} bg="brand.900">
          <Icon as={MdHeadset} h={6} w={6} color="white" />

          <chakra.h1 mx={3} color="white" fontWeight="bold" fontSize="lg">
            Task Details
          </chakra.h1>
        </Flex>

        <Box py={4} px={6}>
          <chakra.h1
            fontSize="xl"
            fontWeight="bold"
            color="gray.800"
          >
            {task.title}
          </chakra.h1>

          <chakra.p py={2} color="gray.700">
            {task.description}
          </chakra.p>

          <Flex alignItems="center" mt={4} color="gray.700">
            <Icon as={BsFillBriefcaseFill} h={6} w={6} mr={2} />

            <chakra.h1 px={2} fontSize="sm">
              {task.company}
            </chakra.h1>
          </Flex>

          <Flex alignItems="center" mt={4} color="gray.700">
            <Icon as={MdLocationOn} h={6} w={6} mr={2} />

            <chakra.h1 px={2} fontSize="sm">
              {task.location}
            </chakra.h1>
          </Flex>

          <Flex alignItems="center" mt={4} color="gray.700">
            <Icon as={MdEmail} h={6} w={6} mr={2} />

            <chakra.h1 px={2} fontSize="sm">
              {task.email}
            </chakra.h1>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default TaskCard;