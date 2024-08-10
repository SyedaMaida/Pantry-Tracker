'use client'

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; 
import { firestore, storage } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [filter, setFilter] = useState('');

  const updateInventory = async () => {
    if (!firestore) return;
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const uploadImage = async (itemName) => {
    if (!itemImage) return null;

    const storageRef = ref(storage, `inventory/${itemName}`);
    await uploadBytes(storageRef, itemImage);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const addItem = async (item) => {
    if (!firestore || !storage) return;
    const imageUrl = await uploadImage(item);
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1, imageUrl });
    } else {
      await setDoc(docRef, { quantity: 1, imageUrl });
    }

    await updateInventory();
    setItemImage(null);  // Reset image after upload
  };

  const removeItem = async (item) => {
    if (!firestore) return;
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    const filteredList = inventory.filter(item =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredInventory(filteredList);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={4}
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Item
            </Typography>
            <Stack direction="column" spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                type="file"
                onChange={(e) => setItemImage(e.target.files[0])}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
                sx={{ alignSelf: 'flex-end' }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ paddingX: 4, paddingY: 2 }}
        >
          Add New Item
        </Button>

        <TextField
          id="filter"
          label="Filter Items"
          variant="outlined"
          value={filter}
          onChange={handleFilterChange}
          sx={{ width: '400px' }}
        />

        <Box
          width="800px"
          bgcolor="background.paper"
          borderRadius={2}
          boxShadow={3}
          padding={2}
        >
          <Box
            width="100%"
            height="80px"
            bgcolor="primary.main"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius={1}
            marginBottom={3}
          >
            <Typography variant="h4" color="white" textAlign="center">
              My Pantry
            </Typography>
          </Box>
          <Stack spacing={2} overflow="auto">
            {filteredInventory.map(({ name, quantity, imageUrl }) => (
              <Box
                key={name}
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#f9f9f9"
                padding={2}
                borderRadius={1}
                boxShadow={1}
                flexDirection="column"
                textAlign="center"
              >
                {imageUrl && (
                  <img src={imageUrl} alt={name} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                )}
                <Typography variant="h6" color="textPrimary">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color="textPrimary">
                  Quantity: {quantity}
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => removeItem(name)}
                  sx={{ minWidth: '70px' }}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
