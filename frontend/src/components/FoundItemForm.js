import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI } from '../services/api';

const FoundItemForm = ({ token }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    brand: '',
    color: '',
    location_found: '',
    specify_location: '',
    date_found: new Date().toISOString().split('T')[0],
    description: '',
    image_urls: []
  });
  const [formOptions, setFormOptions] = useState({
    categories: [],
    colors: [],
    locations: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadFormOptions();
  }, []);

  const loadFormOptions = async () => {
    try {
      const response = await itemsAPI.getFormOptions();
      setFormOptions({
        categories: response.data.categories,
        colors: response.data.colors.found_items,
        locations: response.data.locations.found_items
      });
    } catch (error) {
      console.error('Error loading form options:', error);
      // Fallback data matching backend validation
      setFormOptions({
        categories: ['Electronics', 'Personal Items', 'Bags & Accessories', 'Books & Stationery', 'Clothing', 'Sports Equipment', 'Other'],
        colors: ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Grey', 'Brown', 'Pink', 'Multi-color', 'Other'],
        locations: ['Main Entrance', 'IT Building', 'Library', 'Old Main Cafeteria', 'Green Cafeteria', 'Faculty of Applied Science', 'Faculty of Communication and Business Studies', 'Faculty of Siddha Medicine', 'Play Ground', 'Sport Complex', 'Girls Hostel - New Saraswathi', 'Girls Hostel - Old Saraswathi', 'Girls Hostel - Marbel', 'Boys Hostel', 'Other']
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.item_name.length < 3) {
      setError('Item name must be at least 3 characters');
      setLoading(false);
      return;
    }

    if (formData.description.length < 20) {
      setError('Description must be at least 20 characters');
      setLoading(false);
      return;
    }

    if (formData.description.length > 500) {
      setError('Description cannot exceed 500 characters');
      setLoading(false);
      return;
    }

    try {
      // Map form data to backend expected field names
      const submitData = {
        item_name: formData.item_name,
        description: formData.description,
        category: formData.category,
        brand: formData.brand || '',
        color: formData.color,
        location: formData.location_found === 'Other' ? formData.specify_location : formData.location_found,
        found_date: formData.date_found
      };
      
      // Handle "Other" location
      if (formData.location_found === 'Other' && !formData.specify_location) {
        setError('Please specify the location when selecting "Other"');
        setLoading(false);
        return;
      }

      // Add specify_location to submitData if needed
      if (formData.location_found === 'Other') {
        submitData.specify_location = formData.specify_location;
      }

      const response = await itemsAPI.submitFoundItem(submitData);
      setSuccess(response.data.confirmation_notification);
      
      // Reset form
      setFormData({
        category: '',
        item_name: '',
        brand: '',
        color: '',
        location_found: '',
        specify_location: '',
        date_found: new Date().toISOString().split('T')[0],
        description: '',
        image_urls: []
      });

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (error) {
      console.error('Submit error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to submit found item';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container" style={{ maxWidth: '600px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          📱 Report Found Item
        </h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            {success}
            <br />
            <small>Redirecting to dashboard in 3 seconds...</small>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {formOptions.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Item Name/Type *</label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              placeholder="e.g., iPhone 13, Black Backpack"
              minLength="3"
              required
            />
            <small style={{ color: '#666' }}>Minimum 3 characters</small>
          </div>

          <div className="form-group">
            <label>Brand (Optional)</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., Apple, Nike, Samsung"
            />
          </div>

          <div className="form-group">
            <label>Color *</label>
            <select
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
            >
              <option value="">Select Color</option>
              {formOptions.colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Location Found *</label>
            <select
              name="location_found"
              value={formData.location_found}
              onChange={handleChange}
              required
            >
              <option value="">Select Location</option>
              {formOptions.locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {formData.location_found === 'Other' && (
            <div className="form-group">
              <label>Specify Location *</label>
              <input
                type="text"
                name="specify_location"
                value={formData.specify_location}
                onChange={handleChange}
                placeholder="Enter exact location"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Date Found *</label>
            <input
              type="date"
              name="date_found"
              value={formData.date_found}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>Detailed Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe any unique features, markings, contents, size, condition, or any other identifying details about the item..."
              minLength="20"
              maxLength="500"
              rows="5"
              required
            />
            <small style={{ color: '#666' }}>
              {formData.description.length}/500 characters (minimum 20)
            </small>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Found Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FoundItemForm;