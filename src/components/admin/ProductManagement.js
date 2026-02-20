import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Alert,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Security as SecurityIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import apiClient from '../../utils/axios';
import { getEndpoint } from '../../config/api';
import { compressImage, validateImageFile, getBase64FileSize } from '../../utils/imageCompression';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    platform: '',
    productType: 'account', // account, vpn, dating_app, texting_app, proxy, other
    followers: '',
    accountAge: '',
    features: [],
    specifications: '',
    duration: '', // for VPNs, subscriptions
    isAvailable: true,
    bulkDiscount: false,
    guarantee: false,
    images: [], // Product images
    // Array of credential text blocks for multiple logins
    credentials: ['']
  });
  const [newFeature, setNewFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  
  // Credentials preview dialog
  const [credentialsDialogOpen, setCredentialsDialogOpen] = useState(false);
  const [selectedProductCredentials, setSelectedProductCredentials] = useState(null);

  const productTypes = [
    { value: 'social_account', label: 'Social Media Account' },
    { value: 'vpn', label: 'VPN Service' },
    { value: 'dating_app', label: 'Dating App Account' },
    { value: 'texting_app', label: 'Texting App Number' },
    { value: 'proxy', label: 'Proxy/IP Service' },
    { value: 'apple_service', label: 'Apple Service' },
    { value: 'other', label: 'Other Service' }
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get(getEndpoint('ADMIN', 'ACCOUNTS'));
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get(getEndpoint('CATEGORIES', 'LIST'));
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setEditingProduct(product);
      
      // Handle credentials conversion properly
      let credentialsArray = [''];
      if (product.credentials) {
        if (Array.isArray(product.credentials)) {
          credentialsArray = product.credentials.filter(cred => cred && cred.trim());
          if (credentialsArray.length === 0) credentialsArray = [''];
        } else if (typeof product.credentials === 'string' && product.credentials.trim()) {
          credentialsArray = [product.credentials.trim()];
        }
      }
      
      console.log('Opening product for edit:', product.title);
      console.log('Original credentials:', product.credentials);
      console.log('Converted credentials array:', credentialsArray);
      
      setFormData({
        title: product.title,
        description: product.description,
        category: product.category?._id || '',
        price: product.price,
        platform: product.platform,
        productType: product.productType || 'social_account',
        followers: product.followers || '',
        accountAge: product.accountAge || '',
        features: product.features || [],
        specifications: product.specifications || '',
        duration: product.duration || '',
        isAvailable: product.isAvailable,
        bulkDiscount: product.bulkDiscount || false,
        guarantee: product.guarantee || false,
        images: product.images || [],
        credentials: credentialsArray
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        platform: '',
        productType: 'social_account',
        followers: '',
        accountAge: '',
        features: [],
        specifications: '',
        duration: '',
        isAvailable: true,
        bulkDiscount: false,
        guarantee: false,
        images: [],
        credentials: ['']
      });
    }
    setOpen(true);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    setNewFeature('');
    setError('');
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isAvailable' || name === 'bulkDiscount' || name === 'guarantee' ? checked : value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddCredential = () => {
    setFormData(prev => ({
      ...prev,
      credentials: [...prev.credentials, '']
    }));
  };

  const handleRemoveCredential = (index) => {
    if (formData.credentials.length > 1) {
      setFormData(prev => ({
        ...prev,
        credentials: prev.credentials.filter((_, i) => i !== index)
      }));
    }
  };

  const handleCredentialChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      credentials: prev.credentials.map((cred, i) => i === index ? value : cred)
    }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setImageUploading(true);
    setError('');

    try {
      const compressedImages = [];
      
      for (const file of files) {
        // Validate file
        const validation = validateImageFile(file, { maxSizeMB: 5 });
        if (!validation.isValid) {
          setError(validation.error);
          continue;
        }

        // Compress image
        const compressedImage = await compressImage(file, {
          maxWidth: 800,
          maxHeight: 600,
          quality: 0.8,
          outputFormat: 'jpeg'
        });

        const sizeKB = getBase64FileSize(compressedImage);
        console.log(`Image compressed: ${file.name} -> ${sizeKB}KB`);
        
        compressedImages.push(compressedImage);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...compressedImages]
      }));

      setSuccess(`${compressedImages.length} image(s) uploaded and compressed successfully`);
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Failed to process images: ' + error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Ensure credentials is properly formatted as an array
      const cleanedCredentials = Array.isArray(formData.credentials) 
        ? formData.credentials.filter(cred => cred && typeof cred === 'string' && cred.trim())
        : [];

      const productData = {
        ...formData,
        credentials: cleanedCredentials,
        price: Number(formData.price),
        followers: formData.followers ? Number(formData.followers) : undefined
      };

      console.log('Submitting product data:', productData);
      console.log('Credentials in product data:', productData.credentials);
      console.log('Credentials type:', typeof productData.credentials);
      console.log('Credentials is array:', Array.isArray(productData.credentials));
      console.log('Credentials length:', productData.credentials?.length);
      console.log('First credential:', productData.credentials?.[0]);

      if (editingProduct) {
        await apiClient.put(`/api/accounts/${editingProduct._id}`, productData);
        setSuccess('Product updated successfully');
      } else {
        await apiClient.post('/api/accounts', productData);
        setSuccess('Product created successfully');
      }
      
      fetchProducts();
      handleClose();
    } catch (error) {
      console.error('Submit error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`/api/accounts/${productId}`);
        setSuccess('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        setError(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleViewCredentials = (product) => {
    setSelectedProductCredentials(product);
    setCredentialsDialogOpen(true);
  };

  const getProductTypeColor = (type) => {
    const colors = {
      social_account: '#7c3aed',
      vpn: '#059669',
      dating_app: '#dc2626',
      texting_app: '#ea580c',
      proxy: '#0891b2',
      apple_service: '#6b7280',
      other: '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#7c3aed', fontWeight: 'bold' }}>
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ 
            backgroundColor: '#7c3aed',
            '& .MuiButton-startIcon': {
              display: { xs: 'none', sm: 'flex' }
            }
          }}
        >
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            Add Product
          </Box>
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <AddIcon />
          </Box>
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Platform</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Credentials</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{product.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.description?.substring(0, 50)}...
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.productType || 'Account'}
                    size="small"
                    sx={{ 
                      backgroundColor: getProductTypeColor(product.productType),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>{product.platform}</TableCell>
                <TableCell>₦{product.price?.toLocaleString()}</TableCell>
                <TableCell>{product.category?.name || 'No Category'}</TableCell>
                <TableCell>
                  <Chip
                    label={`${product.availableCredentialsCount || 0}/${product.totalCredentialsCount || 0} Available`}
                    color={product.availableCredentialsCount > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.isAvailable ? 'Available' : 'Sold Out'}
                    color={product.isAvailable ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit Product">
                    <IconButton
                      onClick={() => handleOpen(product)}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Credentials">
                    <IconButton
                      onClick={() => handleViewCredentials(product)}
                      color="info"
                      size="small"
                    >
                      <SecurityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Product">
                    <IconButton
                      onClick={() => handleDelete(product._id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="title"
                  label="Product Title"
                  fullWidth
                  variant="outlined"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <InputLabel>Product Type</InputLabel>
                  <Select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    label="Product Type"
                  >
                    {productTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="platform"
                  label="Platform/Service"
                  fullWidth
                  variant="outlined"
                  value={formData.platform}
                  onChange={handleChange}
                  placeholder="e.g. Facebook, ExpressVPN, Tinder"
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  margin="dense"
                  name="price"
                  label="Price (₦)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {formData.productType === 'social_account' && (
                <>
                  <Grid item xs={12} md={4}>
                    <TextField
                      margin="dense"
                      name="followers"
                      label="Followers/Subscribers"
                      type="number"
                      fullWidth
                      variant="outlined"
                      value={formData.followers}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      margin="dense"
                      name="accountAge"
                      label="Account Age"
                      fullWidth
                      variant="outlined"
                      value={formData.accountAge}
                      onChange={handleChange}
                      placeholder="e.g. 2 years, 6 months"
                    />
                  </Grid>
                </>
              )}

              {(formData.productType === 'vpn' || formData.productType === 'dating_app') && (
                <Grid item xs={12} md={4}>
                  <TextField
                    margin="dense"
                    name="duration"
                    label="Duration/Validity"
                    fullWidth
                    variant="outlined"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 1 month, 6 months"
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="specifications"
                  label="Additional Specifications"
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={formData.specifications}
                  onChange={handleChange}
                  placeholder="Any additional details, requirements, or specifications"
                />
              </Grid>

              {/* Credentials Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ color: '#7c3aed', mt: 2 }}>
                  Account Credentials
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Add multiple credential blocks for different accounts. Each block should contain complete login details.
                </Typography>
              </Grid>

              {formData.credentials.map((credential, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <TextField
                      margin="dense"
                      label={`Credential Block ${index + 1}`}
                      fullWidth
                      multiline
                      rows={6}
                      variant="outlined"
                      value={credential}
                      onChange={(e) => handleCredentialChange(index, e.target.value)}
                      placeholder={`Enter login details for account ${index + 1}, for example:

Email: user${index + 1}@example.com
Password: mypassword123
Username: @myusername${index + 1}
Phone: +1234567890
Recovery Email: recovery@example.com
Additional Info: Any special instructions or notes

You can format this however you prefer.`}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: 'monospace'
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                      {index === formData.credentials.length - 1 && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleAddCredential}
                          sx={{ 
                            minWidth: 'auto',
                            px: 2,
                            borderColor: '#7c3aed',
                            color: '#7c3aed'
                          }}
                        >
                          Add
                        </Button>
                      )}
                      {formData.credentials.length > 1 && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleRemoveCredential(index)}
                          sx={{ minWidth: 'auto', px: 2 }}
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))}

              {/* Features Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Features/Benefits
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <Button onClick={handleAddFeature} variant="outlined" size="small">
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      onDelete={() => handleRemoveFeature(index)}
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>

              {/* Product Images Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ color: '#7c3aed', mt: 2 }}>
                  Product Images
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Upload product images. Images will be automatically compressed to reduce file size.
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    multiple
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCameraIcon />}
                      disabled={imageUploading}
                      sx={{ 
                        borderColor: '#7c3aed',
                        color: '#7c3aed',
                        '&:hover': {
                          borderColor: '#5b21b6',
                          backgroundColor: 'rgba(124, 58, 237, 0.05)'
                        }
                      }}
                    >
                      {imageUploading ? 'Uploading...' : 'Upload Images'}
                    </Button>
                  </label>
                </Box>

                {formData.images.length > 0 && (
                  <ImageList sx={{ width: '100%', maxHeight: 300 }} cols={3} rowHeight={164}>
                    {formData.images.map((image, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          loading="lazy"
                          style={{ objectFit: 'cover' }}
                        />
                        <ImageListItemBar
                          actionIcon={
                            <IconButton
                              sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                              onClick={() => handleRemoveImage(index)}
                            >
                              <CloseIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Grid>

              {/* Toggles */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isAvailable}
                        onChange={handleChange}
                        name="isAvailable"
                        color="primary"
                      />
                    }
                    label="Available for Sale"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.bulkDiscount}
                        onChange={handleChange}
                        name="bulkDiscount"
                        color="primary"
                      />
                    }
                    label="Bulk Discount Available"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.guarantee}
                        onChange={handleChange}
                        name="guarantee"
                        color="primary"
                      />
                    }
                    label="Replacement Guarantee"
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ backgroundColor: '#7c3aed' }}
            >
              {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Credentials Preview Dialog */}
      <Dialog 
        open={credentialsDialogOpen} 
        onClose={() => setCredentialsDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon color="primary" />
          Account Credentials Preview
        </DialogTitle>
        <DialogContent>
          {selectedProductCredentials && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                These are the credentials that will be provided to customers after successful payment.
              </Alert>
              
              <Typography variant="h6" gutterBottom sx={{ color: '#7c3aed' }}>
                {selectedProductCredentials.title}
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong> {selectedProductCredentials.isSold ? 'Sold' : 'Available'}
              </Typography>

              {selectedProductCredentials.credentials && Array.isArray(selectedProductCredentials.credentials) && selectedProductCredentials.credentials.length > 0 ? (
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                    Login Credentials ({selectedProductCredentials.credentials.filter(cred => cred && cred.trim()).length} blocks):
                  </Typography>
                  {selectedProductCredentials.credentials.map((credential, index) => (
                    credential && credential.trim() ? (
                      <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, backgroundColor: selectedProductCredentials.isSold ? '#ffebee' : '#f8fafc' }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: '#7c3aed', fontWeight: 600 }}>
                          Credential Block {index + 1}:
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          value={credential}
                          variant="outlined"
                          InputProps={{
                            readOnly: true,
                            sx: {
                              fontFamily: 'monospace',
                              fontSize: '0.9rem'
                            }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'transparent'
                            }
                          }}
                        />
                      </Paper>
                    ) : null
                  ))}
                  {selectedProductCredentials.isSold && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      This account has been sold
                    </Typography>
                  )}
                </Box>
              ) : selectedProductCredentials.credentials && typeof selectedProductCredentials.credentials === 'string' ? (
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                    Login Credentials:
                  </Typography>
                  <Paper elevation={1} sx={{ p: 2, backgroundColor: selectedProductCredentials.isSold ? '#ffebee' : '#f8fafc' }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={8}
                      value={selectedProductCredentials.credentials}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                        sx: {
                          fontFamily: 'monospace',
                          fontSize: '0.9rem'
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent'
                        }
                      }}
                    />
                    {selectedProductCredentials.isSold && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        This account has been sold
                      </Typography>
                    )}
                  </Paper>
                </Box>
              ) : (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  No credentials have been added for this product yet.
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCredentialsDialogOpen(false)}>
            Close
          </Button>
          <Button 
            onClick={() => {
              setCredentialsDialogOpen(false);
              handleOpen(selectedProductCredentials);
            }}
            variant="contained"
            sx={{ backgroundColor: '#7c3aed' }}
          >
            Edit Credentials
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;