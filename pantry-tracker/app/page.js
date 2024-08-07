'use client'
import Image from "next/image";
import { useState, useEffect} from "react";
import {firestore} from '@/firebase';
import {Box, Typography,Modal, Stack, TextField, Button, IconButton,Fab} from '@mui/material'
import {collection, doc, query, setDoc, deleteDoc, getDocs, getDoc} from 'firebase/firestore'
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove'
import { generateRecipeWithGemma } from "@/pages/api/generateRecipe";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open,setOpen] = useState(false)
  const [itemName, setItemName]= useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateInventory = async () => {
  const snapshot = query(collection(firestore ,'inventory'))
  const docs = await getDocs(snapshot)
  const inventoryList = []
    docs.forEach((doc)=> {
    inventoryList.push({
      name: doc.id,
      ...doc.data(),
  
    })
  })
  setInventory(inventoryList)
  }
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose=() => setOpen(false);

  const generateRecipe = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ingredients = inventory.map(item => item.name);
      const generatedRecipe = await generateRecipeWithGemma(ingredients);
      setRecipe(generatedRecipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
      setError(` An error occurred while generating the recipe:${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() =>{
  updateInventory ()
  }, [])

  
 
  return (
    <Box
    width="100vw"
    minHeightheight="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
  overflow={'auto'}  // Added this line
  padding={'20px 0'}  // Added some vertical padding
  >
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box position="absolute" top="50%" left="50%"
        transform="translate(-50%,-50%)"
         width ={400}
         bgcolor="white"
         border="2px solid #000000"
         boxShadow={24}
         p={4}
         display="flex"
         flexDirection="column"
         gap={3}
         sx={{
          transform:"translate(-50%,-50%)"
         }} >
        <Typography id="modal-modal-title" variant="h6" component="h2" color={'#000000'}>
          Add Item
        </Typography>
        <Stack width="100%" direction={'row'} spacing={2}>
          <TextField
            id="outlined-basic"
            label="Item"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
    <Button variant="contained" onClick={handleOpen}>
      Add New Item
    </Button>
    <Box border={'1px solid #333'}>
      <Box
        width="1000px"
        height="100px"
        bgcolor={'#673ab7'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h3'}  textAlign={'center'} color={'#FFFFFF'}>
          Inventory Items
        </Typography>
      </Box>
      <Box width="1000px" p={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Inventory"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              '& input':{
                color: '#FFFFFF'
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFFFFF',
              },
            }}
          />
        </Box>
   <Box
      width="100%"
      minHeight="50px"
      display={'flex'}
      alignItems={'center'}
      bgcolor={'#3F3F3F'}  // Slightly lighter than the item background for contrast
      paddingX={5}
      borderBottom={'1px solid #FFFFFF'}
  >
   <Box width="30%" paddingRight={2}>
    <Typography variant="h6" color="#FFFFFF">
      Item Name
    </Typography>
  </Box>
  <Box width="30%" display="flex" justifyContent="center" paddingLeft={2}>
    <Typography variant="h6" color="#FFFFFF">
      Quantity
    </Typography>
  </Box>
  <Box width="50%" display="flex" justifyContent="center">
    <Typography variant="h6" color="#FFFFFF">
      Actions
    </Typography>
  </Box>
  </Box>
      <Stack width="1000px" height="500px" spacing={2} overflow={'auto'}>
        {filteredInventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#2E3532'}
            paddingX={5}
          >
            <Typography variants='h3' color="#FFFFFF" textAlign="center">
                {name.charAt(0).toUpperCase() +name.slice(1)}
              </Typography>
              <Typography variants='h3' color="#FFFFFF" textAlign="center" >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={3}>
              <Fab color="#2E3532" size ="small" aria-label="add" onClick={() => addItem(name)} >
                <AddIcon />
              </Fab>
              <Fab color="#2E3532" size="small" aria-label="remove" onClick={() => removeItem(name)} >
                <RemoveIcon />
              </Fab>
             
            <IconButton 
          aria-label="delete" 
          onClick={() => deleteItem(name)}
          color="error">
          <DeleteIcon />
        </IconButton>
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Recipe generation button */}
      <Box mt={2} mb={2} display="flex" justifyContent="center">
        <Button 
          variant="contained" 
          onClick={generateRecipe} 
          disabled={isLoading}
          sx={{
            backgroundColor: (theme) => theme.palette.primary.main,
            '&:hover': {
              backgroundColor: (theme) => theme.palette.primary.dark,
            },
            '&.Mui-disabled': {
              backgroundColor: (theme) => theme.palette.primary.main,
              opacity: 0.7,
            },
          }}
          
        >
          {isLoading ? 'Generating Recipe...' : 'Generate Recipe'}
        </Button>
      </Box>

      {/* Error display */}
      {error && (
        <Typography color="error" textAlign="center" mt={2}>
          {error}
        </Typography>
      )}

      {/* Recipe display */}
      {recipe && (
        <Box 
        mt={4} 
        p={3} 
        border="1px solid #ccc" 
        borderRadius={2} 
         maxWidth={'800px'} 
        mx="auto" // Centers the box horizontally
        display="flex"
        flexDirection="column" // Stacks children vertically
        alignItems="center">
          <Typography variant="h5" gutterBottom>
            Generated Recipe
          </Typography>
          <Typography 
            component="pre" 
            sx={{ 
              whiteSpace: 'pre-wrap', 
              wordWrap: 'break-word',
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px',
              lineHeight: 1.5,
              maxWidth: '100%', // Ensures it doesn't exceed the parent Box
              overflow: 'auto', // Adds scrollbar if content is too wide
              bgcolor: '#000000', // Light grey background for better readability
              p: 2, // Adds some padding
              borderRadius: 1, // Slightly rounded corners
            }}
          >
            {recipe}
          </Typography>
        </Box>
      )}
    </Box>
    
  </Box>
  );
}
