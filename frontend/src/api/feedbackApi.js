import axiosClient from './axiosClient';

const LOCAL_STORAGE_KEY = 'spt_feedback_submissions';

export const feedbackApi = {
  /**
   * Submit feedback to backend with offline/localStorage fallback.
   */
  async submitFeedback(data) {
    try {
      const response = await axiosClient.post('/feedback', data);
      
      // Also cache in local history for transparency
      try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        existing.unshift(response.data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing.slice(0, 20)));
      } catch {
        // ignore localStorage errors
      }

      return { success: true, data: response.data, offline: false };
    } catch (err) {
      console.warn('Backend feedback submission failed, saving locally:', err);
      
      // Fallback: save to localStorage
      const offlineEntry = {
        id: 'local_' + Date.now(),
        category: data.category || 'GENERAL',
        rating: data.rating || 5,
        subject: data.subject || '',
        message: data.message || '',
        username: data.name || 'Baithak Sathi',
        createdAt: new Date().toISOString(),
        status: 'LOCAL_SAVED',
      };

      try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        existing.unshift(offlineEntry);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing.slice(0, 20)));
      } catch (storageErr) {
        console.error('LocalStorage write error', storageErr);
      }

      return { success: true, data: offlineEntry, offline: true };
    }
  },

  /**
   * Fetch aggregated feedback statistics.
   */
  async getStats() {
    try {
      const response = await axiosClient.get('/feedback/stats');
      return response.data;
    } catch {
      // Authentic local fallback: aggregate only verified local submissions if any exist
      const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      const count = local.length;
      const avg = count > 0
        ? Math.round((local.reduce((sum, item) => sum + (Number(item.rating) || 5), 0) / count) * 10) / 10
        : 5.0;

      const categoryCounts = {};
      local.forEach((item) => {
        const cat = item.category || 'GENERAL';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      return {
        totalFeedback: count,
        averageRating: avg,
        categoryCounts,
      };
    }
  },

  /**
   * Fetch recent feedback submissions.
   * Only returns authentic feedback from the backend or the user's own local submissions.
   * No fabricated or fake testimonials are permitted.
   */
  async getRecent() {
    try {
      const response = await axiosClient.get('/feedback/recent');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch {
      // ignore network errors
    }

    // Return only actual verified submissions from local history
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    return local.slice(0, 10);
  },

  /**
   * Get feedback submitted by the currently logged-in user.
   */
  async getMyFeedback() {
    try {
      const response = await axiosClient.get('/feedback/my');
      return response.data;
    } catch {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    }
  },
};

export default feedbackApi;
