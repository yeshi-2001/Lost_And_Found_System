import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI } from '../services/api';

const LostItemForm = ({ token }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    brand: '',
    color: '',
    location_lost: '',
    specify_location: '',
    location_description: '',
    date_lost: new Date().toISOString().split('T')[0],
    description: '',
    additional_information: '',
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
        colors: response.data.colors.lost_items,
        locations: response.data.locations.lost_items
      });
    } catch (error) {
      console.error('Error loading form options:', error);
      // Fallback data when backend is not available
      setFormOptions({
        categories: ['Electronics', 'Clothing & Accessories', 'Books & Stationery', 'Sports & Recreation', 'Personal Items', 'Bags & Luggage', 'Jewelry & Watches', 'Keys & Cards', 'Other'],
        colors: ['Black', 'White', 'Gray', 'Silver', 'Blue', 'Red', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Gold', 'Multi-colored', 'Other'],
        locations: ['Library', 'Cafeteria', 'Classroom', 'Laboratory', 'Gymnasium', 'Parking Lot', 'Student Center', 'Dormitory', 'Auditorium', 'Computer Lab', 'Study Hall', 'Restroom', 'Hallway', 'Office', 'Not Sure', 'Other']
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

    if (formData.description.length < 30) {
      setError('Description must be at least 30 characters for better verification');
      setLoading(false);
      return;
    }

    if (formData.description.length > 500) {
      setError('Description cannot exceed 500 characters');
      setLoading(false);
      return;
    }

    if (formData.additional_information.length > 300) {
      setError('Additional information cannot exceed 300 characters');
      setLoading(false);
      return;
    }

    try {
      // Handle location validation
      if (formData.location_lost === 'Other' && !formData.specify_location) {
        setError('Please specify the location when selecting "Other"');
        setLoading(false);
        return;
      }

      if (formData.location_lost === 'Not Sure' && !formData.location_description) {
        setError('Please describe where you think you lost it when selecting "Not Sure"');
        setLoading(false);
        return;
      }

      // Map form data to backend expected field names
      const submitData = {
        title: formData.item_name,
        description: formData.description,
        category: formData.category,
        brand: formData.brand || '',
        color: formData.color,
        last_seen_location: formData.location_lost === 'Other' ? formData.specify_location : 
                           formData.location_lost === 'Not Sure' ? formData.location_description :
                           formData.location_lost,
        lost_date: formData.date_lost,
        image_urls: formData.image_urls || []
      };

      const response = await itemsAPI.submitLostItem(submitData);
      setSuccess(response.data.confirmation_notification);
      
      // Reset form
      setFormData({
        category: '',
        item_name: '',
        brand: '',
        color: '',
        location_lost: '',
        specify_location: '',
        location_description: '',
        date_lost: new Date().toISOString().split('T')[0],
        description: '',
        additional_information: '',
        image_urls: []
      });

      // Redirect to matches if found, otherwise dashboard
      setTimeout(() => {
        if (response.data.confirmation_notification.includes('GREAT NEWS')) {
          navigate('/matches');
        } else {
          navigate('/dashboard');
        }
      }, 3000);

    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit lost item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container" style={{ maxWidth: '600px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          🔍 Report Lost Item
        </h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            {success}
            <br />
            <small>Redirecting in 3 seconds...</small>
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
              placeholder="e.g., Apple, Nike, Samsung (if unknown, leave empty)"
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
            <label>Location Lost *</label>
            <select
              name="location_lost"
              value={formData.location_lost}
              onChange={handleChange}
              required
            >
              <option value="">Select Location</option>
              {formOptions.locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {formData.location_lost === 'Other' && (
            <div className="form-group">
              <label>Specify Location *</label>
              <input
                type="text"
                name="specify_location"
                value={formData.specify_location}
                onChange={handleChange}
                placeholder="Enter approximate location"
                required
              />
            </div>
          )}

          {formData.location_lost === 'Not Sure' && (
            <div className="form-group">
              <label>Describe where you think you might have lost it *</label>
              <input
                type="text"
                name="location_description"
                value={formData.location_description}
                onChange={handleChange}
                placeholder="e.g., Somewhere between cafeteria and IT building"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Date Lost *</label>
            <input
              type="date"
              name="date_lost"
              value={formData.date_lost}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              required
            />
            <small style={{ color: '#666' }}>Approximate date if you're not sure</small>
          </div>

          <div className="form-group">
            <label>Detailed Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your item in detail: unique features, markings, scratches, contents, accessories, serial numbers, or anything that can help verify you're the real owner..."
              minLength="30"
              maxLength="500"
              rows="5"
              required
            />
            <small style={{ color: '#666' }}>
              {formData.description.length}/500 characters (minimum 30) - More details = better verification
            </small>
          </div>

          <div className="form-group">
            <label>Additional Information (Optional)</label>
            <textarea
              name="additional_information"
              value={formData.additional_information}
              onChange={handleChange}
              placeholder="Any additional context: Where were you before losing it? What were you doing? When did you last see it?"
              maxLength="300"
              rows="3"
            />
            <small style={{ color: '#666' }}>
              {formData.additional_information.length}/300 characters
            </small>
          </div>

          <div className="alert alert-info" style={{ marginBottom: '20px' }}>
            💡 <strong>Tip:</strong> The more details you provide, the better we can verify you're the owner when someone finds a matching item!
          </div>

          <button 
            type="submit" 
            className="btn btn-success" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Lost Item Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LostItemForm;