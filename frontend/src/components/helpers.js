
import api from "./api";
import {
  Box,
  Button,
  HStack,
  Checkbox,
  Flex,
  Heading,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

export function toaster (message,flag,toast) {
    
    toast({
      title: message,
      status: (flag)?("success"):("error"),
      duration: 2000,
      isClosable: true,
    });
  }
  export  async function handleAddTag (tagId,taskId,toast) {
    try{
        await api.put("/tasks/addTag",{"tagId":tagId,"taskId":taskId});
        toaster("Tag added to task",1,toast)
      fetchTasks();
    }
    catch{toaster(" There was an issue adding the tag",0,toast)}
  };
  export async function fetchTasks(userDeets, setTasks) {
    if(!userDeets)return;
    try {
      const deets = {
        "taskIds":userDeets.Tasks,
       }
      const reply = await api.post("/tasks/multiple",deets);
      setTasks(reply.data);
    } catch (error) {
      console.log(error);
    }
  }
  export async function fetchAllTasks(setTasks) {
    try {
      const response = await api.get("/tasks/allTasks");
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  export async function fetchTags (setTags) {
    try {
      const response = await api.get("/tags/allTags");
      setTags(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  export async function handleAddUser(userId,taskId,toast)
  {
    try{
        await api.put("/tasks/addUser",{"userId":userId,"taskId":taskId});
        toaster("User added to task",1,toast)
      fetchTasks();
    }
    catch {toaster(" There was an issue adding the user",0,toast)}
  };


  export async function handleDeleteTask(taskId,toast)
  {
    try {
      await api.delete(`/tasks/${taskId}`);
      //setTasks(tasks.filter((task) => task._id !== taskId));
      toaster( "Task has been successfully deleted.",1,toast)
    } catch (error) {
      console.log(error);
      toaster( "An error occurred while deleting the task.",0,toast)
    }
  };
  export async function handleCompleteTask (taskId, checked) {
    try {
      await api.put(`/tasks/updateStatus/${taskId}`, {
        status: checked ? "Completed" : "Pending",
      });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };
  export function renderTasks( tasks, tags,toast, setTasks, userDeets ) {
    fetchTasks(userDeets,setTasks)
    return tasks.map((task) => (
      <Box
        key={task._id}
        bg="brand.500"
        p={4}
        m={2}
        borderRadius="md"
        boxShadow="md"
        width="300px"
        textAlign="center"
      >
        <Box mb={4} bg="brand.50" p={2} borderRadius="md">
          <Heading textColor="brand.800" size="md">
            {task.title}
          </Heading>
        </Box>
        <Text mb={6}>{task.description}</Text>
        <Flex alignItems="center">
          <Checkbox
            isChecked={task.status === "Completed"}
            onChange={(e) => handleCompleteTask(task._id, e.target.checked)}
          >
            <Text
              ml={2}
              fontWeight="bold"
              color={task.status === "Completed" ? "green.500" : "gray.600"}
            >
              {task.status}
            </Text>
          </Checkbox>
        </Flex>
        <Text mb={2} fontSize="md" color="white">
          Tags:{" "}
          <Wrap>
            {task.assignedTags.map((tag) => (
              <WrapItem key={tag._id}>
                <Text bg="brand.200" px={2} py={1} borderRadius="md">
                  {tag.name}
                </Text>
              </WrapItem>
            ))}
          </Wrap>
        </Text>
        <Text mb={2} fontSize="md" color="white">
          Assigned Users:{" "}
          <Wrap>
            {task.assignedUsers.map((user) => (
              <WrapItem key={user._id}>
                <Text>{user.fName}</Text>
              </WrapItem>
            ))}
          </Wrap>
        </Text>
        <Text mb={2}>Due by: {new Date(task.dueDate).toLocaleDateString("en-US")}</Text>
        <HStack justify="space-between" mt="auto">
          <Menu>
            <MenuButton
              as={Button}
              flex={1}
              size="sm"
              colorScheme="brand"
              variant="outline"
            >
              Add Tag
            </MenuButton>
            <MenuList>
              {tags.map((tag) => (
                <MenuItem
                  key={tag._id}
                  onClick={() => handleAddTag(tag._id, task._id,toast)}
                >
                  {tag.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Button flex={1} size="sm" onClick={() => handleDeleteTask(task._id,toast)}>
            Delete
          </Button>
        </HStack>
      </Box>
    ));
  }
  export function renderAdminTasks(tasks, users, tags, toast, setTasks, selectedStatus, selectedTag, selectedUser) {
    fetchAllTasks(setTasks);
    const filteredTasks = tasks.filter((task) => {
    // Filter tasks based on selected filters
    const hasMatchingStatus =
      selectedStatus === "All" || task.status === selectedStatus;
    const hasMatchingTag =
      selectedTag === "" ||
      task.assignedTags.some((tag) => tag._id === selectedTag);
    const hasMatchingUser =
      selectedUser === "" ||
      task.assignedUsers.some((user) => user._id === selectedUser);

    return hasMatchingStatus && hasMatchingTag && hasMatchingUser;
  });

  return filteredTasks.map((task) => (
    <Box
      key={task._id}
      bg="brand.500"
      p={4}
      m={2}
      borderRadius="md"
      boxShadow="md"
      width="600px"
      textAlign="center"
    >
      <Box mb={4} bg="brand.50" p={2} borderRadius="md">
        <Heading textColor="brand.800" size="md">
          {task.title}
        </Heading>
      </Box>
      <Text mb={6}>{task.description}</Text>
      <Flex alignItems="center">
        <Checkbox
          isChecked={task.status === "Completed"}
          onChange={(e) =>
            handleCompleteTask(task._id, e.target.checked)
          }
        >
          <Text
            ml={2}
            fontWeight="bold"
            color={
              task.status === "Completed" ? "green.500" : "gray.600"
            }
          >
            {task.status}
          </Text>
        </Checkbox>
      </Flex>
      {task.assignedTags.length > 0 && (
        <Text mb={2} fontSize="md" color="white">
          Tags:{" "}
          <Wrap>
            {task.assignedTags.map((tag) => (
              <WrapItem key={tag._id}>
                <Text bg="brand.200" px={2} py={1} borderRadius="md">
                  {tag.name}
                </Text>
              </WrapItem>
            ))}
          </Wrap>
        </Text>
      )}
      {task.assignedUsers.length > 0 && (
        <Text mb={2} fontSize="md" color="white">
          Assigned Users:{" "}
          <Wrap>
            {task.assignedUsers.map((user) => (
              <WrapItem key={user._id}>
                <Text>{user.fName}</Text>
              </WrapItem>
            ))}
          </Wrap>
        </Text>
      )}
      <Text mb={2}>
        Due by: {new Date(task.dueDate).toLocaleDateString("en-US")}
      </Text>
      <HStack justify="space-between" mt="auto">
        <Menu>
          <MenuButton
            as={Button}
            flex={1}
            size="sm"
            colorScheme="brand"
            variant="outline"
          >
            Add User
          </MenuButton>
          <MenuList>
            {users.map((user) => (
              <MenuItem
                key={user._id}
                onClick={() => handleAddUser(user._id, task._id)}
              >
                {user.fName}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            flex={1}
            size="sm"
            colorScheme="brand"
            variant="outline"
          >
            Add Tag
          </MenuButton>
          <MenuList>
            {tags.map((tag) => (
              <MenuItem
                key={tag._id}
                onClick={() => handleAddTag(tag._id, task._id, toast)}
              >
                {tag.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Button
          flex={1}
          size="sm"
          onClick={() => handleDeleteTask(task._id, toast)}
        >
          Delete
        </Button>
      </HStack>
    </Box>
  ));
}