import { useState } from 'react';
import { listingsApi } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import styles from './CreateListingPage.module.css';

export default function CreateListingPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: 'Good',
    photoURLs: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await listingsApi.createListing({
        ...formData,
        photoURLs: formData.photoURLs ? [formData.photoURLs] : [],
      });
      
      navigate('/my-listings');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h1 className={styles.title}>Create New Listing</h1>
        
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorBox}>
                {error}
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="title" className={styles.label}>
                Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={styles.input}
                placeholder="e.g., Vintage Guitar"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description" className={styles.label}>
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={styles.textarea}
                placeholder="Describe your item..."
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="category" className={styles.label}>
                Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={styles.select}
              >
                <option value="">Select category</option>
                <option value="Books">Books</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Toys">Toys</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="condition" className={styles.label}>
                Condition *
              </label>
              <select
                id="condition"
                required
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className={styles.select}
              >
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Used">Used</option>
                <option value="For parts">For parts</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="photoURLs" className={styles.label}>
                Photo URL (optional)
              </label>
              <input
                id="photoURLs"
                type="url"
                value={formData.photoURLs}
                onChange={(e) => setFormData({ ...formData, photoURLs: e.target.value })}
                className={styles.input}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className={styles.actions}>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
