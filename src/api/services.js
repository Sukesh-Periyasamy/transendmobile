/**
 * Driver API Services
 * 
 * This file contains all API service functions related to driver operations.
 * It provides a clean interface for components to interact with driver APIs
 * without worrying about the underlying HTTP implementation.
 * 
 * Features:
 * - Driver profile management
 * - Document handling
 * - Dashboard data
 * - Attendance management
 * 
 * @author Driver App Team
 * @version 1.0.0
 */

import apiClient, { handleApiResponse, createFormData } from './client';
import { ENDPOINTS } from './endpoints';

/**
 * Driver API Service Class
 * 
 * Contains all driver-related API methods.
 * Each method returns a standardized response format: { success, message, data, error? }
 */
export const driverService = {
  /**
   * Get Driver Profile
   * 
   * Retrieves the complete driver profile information.
   * 
   * API: GET /driver/profile with driver_id parameter
   * Response: { success: true, message: "Delivery Man", data: { user: {...} } }
   * 
   * @param {number} driverId - The driver ID (required)
   * @returns {Promise<Object>} Driver profile data
   */
  getProfile: async (driverId = 1) => {
    return handleApiResponse(
      apiClient.get(`${ENDPOINTS.DRIVER.PROFILE}?driver_id=${driverId}`)
    );
  },

  /**
   * Update Driver Profile
   * 
   * Updates driver profile information with new data.
   * 
   * API: POST /driver/profile/update
   * 
   * @param {Object} profileData - Updated profile information
   * @param {number} profileData.driver_id - Driver ID (required)
   * @param {string} profileData.first_name - Driver's first name
   * @param {string} profileData.last_name - Driver's last name
   * @param {string} profileData.email - Driver's email address
   * @param {string} profileData.phone - Driver's phone number
   * @param {string} profileData.address - Driver's address
   * @returns {Promise<Object>} Update result
   */
  updateProfile: async (profileData) => {
    // Ensure driver_id is included
    const dataWithDriverId = {
      driver_id: 1, // Default driver ID
      ...profileData,
    };
    
    return handleApiResponse(
      apiClient.post(ENDPOINTS.DRIVER.PROFILE_UPDATE, dataWithDriverId)
    );
  },

  /**
   * Get Driver Documents
   * 
   * Retrieves all uploaded documents for the driver.
   * 
   * API: POST /driver/documents
   * Response: { success: true, message: "Documents retrieved successfully", data: { documents: {...} } }
   * 
   * @param {number} driverId - The driver ID (required)
   * @returns {Promise<Object>} Driver documents data
   */
  getDocuments: async (driverId = 1) => {
    return handleApiResponse(
      apiClient.post(ENDPOINTS.DRIVER.DOCUMENTS, { driver_id: driverId })
    );
  },

  /**
   * Update Driver Documents
   * 
   * Uploads or updates driver documents (license, insurance, etc.).
   * 
   * API: POST /driver/documents/update
   * 
   * @param {Object} documents - Document files to upload
   * @param {number} documents.driver_id - Driver ID (required)
   * @param {File} documents.driver_license_front - Front of driver license
   * @param {File} documents.driver_license_back - Back of driver license
   * @param {File} documents.insurance - Insurance document
   * @param {File} documents.mv1_report - MV1 report
   * @param {File} documents.incident_report - Incident report
   * @param {File} documents.cuse_logbook - CUSE logbook
   * @returns {Promise<Object>} Upload result
   */
  updateDocuments: async (documents) => {
    // Ensure driver_id is included
    const documentsWithDriverId = {
      driver_id: 1, // Default driver ID
      ...documents,
    };
    
    const formData = createFormData(documentsWithDriverId);
    
    return handleApiResponse(
      apiClient.post(ENDPOINTS.DRIVER.DOCUMENTS_UPDATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  },

  /**
   * Get Driver Dashboard
   * 
   * Retrieves dashboard data including job counts and new jobs.
   * 
   * API: POST /driver/dashboard
   * Response: { success: true, message: "Delivery Man", data: { counts: {...}, new_jobs: [...] } }
   * 
   * @param {number} driverId - The driver ID (required)
   * @returns {Promise<Object>} Dashboard data with job statistics
   */
  getDashboard: async (driverId = 1) => {
    return handleApiResponse(
      apiClient.post(ENDPOINTS.DRIVER.DASHBOARD, { driver_id: driverId })
    );
  },

  /**
   * Mark Driver as Absent
   * 
   * Marks the driver as absent and updates parcel assignments.
   * 
   * API: POST /driver/mark-absent
   * Response: { message: "Driver marked absent and parcels updated successfully." }
   * 
   * @param {Object} absenceData - Absence information
   * @param {number} absenceData.driver_id - Driver ID (required)
   * @param {string} absenceData.reason - Reason for absence (optional)
   * @param {string} absenceData.date - Date of absence (optional)
   * @returns {Promise<Object>} Absence marking result
   */
  markAbsent: async (absenceData = {}) => {
    // Ensure driver_id is included
    const dataWithDriverId = {
      driver_id: 1, // Default driver ID
      ...absenceData,
    };
    
    return handleApiResponse(
      apiClient.post(ENDPOINTS.DRIVER.MARK_ABSENT, dataWithDriverId)
    );
  },

  /**
   * Upload Profile Image
   * 
   * Uploads a new profile image for the driver.
   * 
   * @param {File} imageFile - Image file to upload
   * @returns {Promise<Object>} Upload result
   */
  uploadProfileImage: async (imageFile) => {
    const formData = createFormData({ profile_image: imageFile });
    
    return handleApiResponse(
      apiClient.post(ENDPOINTS.UPLOAD.PROFILE_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  },
};

/**
 * Job API Service Class
 * 
 * Contains job-related API methods for job management and status updates.
 */
export const jobService = {
  /**
   * Get Job List
   * 
   * Retrieves list of jobs assigned to the driver.
   * 
   * @param {Object} filters - Optional filters for job list
   * @param {string} filters.status - Filter by job status
   * @param {number} filters.limit - Limit number of results
   * @returns {Promise<Object>} Job list data
   */
  getJobs: async (filters = {}) => {
    return handleApiResponse(
      apiClient.get(ENDPOINTS.JOBS.LIST, { params: filters })
    );
  },

  /**
   * Accept Job
   * 
   * Accepts a job assignment.
   * 
   * @param {number} jobId - ID of the job to accept
   * @returns {Promise<Object>} Accept result
   */
  acceptJob: async (jobId) => {
    return handleApiResponse(
      apiClient.post(ENDPOINTS.JOBS.ACCEPT.replace('{id}', jobId))
    );
  },

  /**
   * Mark Job as Picked Up
   * 
   * Updates job status to picked up.
   * 
   * @param {number} jobId - ID of the job
   * @param {Object} pickupData - Pickup information
   * @returns {Promise<Object>} Pickup result
   */
  pickupJob: async (jobId, pickupData = {}) => {
    return handleApiResponse(
      apiClient.post(ENDPOINTS.JOBS.PICKUP.replace('{id}', jobId), pickupData)
    );
  },

  /**
   * Mark Job as Delivered
   * 
   * Updates job status to delivered.
   * 
   * @param {number} jobId - ID of the job
   * @param {Object} deliveryData - Delivery information
   * @returns {Promise<Object>} Delivery result
   */
  deliverJob: async (jobId, deliveryData = {}) => {
    return handleApiResponse(
      apiClient.post(ENDPOINTS.JOBS.DELIVER.replace('{id}', jobId), deliveryData)
    );
  },
};

/**
 * Notification API Service Class
 * 
 * Contains notification-related API methods.
 */
export const notificationService = {
  /**
   * Get Notifications
   * 
   * Retrieves list of notifications for the driver.
   * 
   * @returns {Promise<Object>} Notifications list
   */
  getNotifications: async () => {
    return handleApiResponse(
      apiClient.get(ENDPOINTS.NOTIFICATIONS.LIST)
    );
  },

  /**
   * Mark Notification as Read
   * 
   * Marks a specific notification as read.
   * 
   * @param {number} notificationId - ID of the notification
   * @returns {Promise<Object>} Mark read result
   */
  markAsRead: async (notificationId) => {
    return handleApiResponse(
      apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_READ.replace('{id}', notificationId))
    );
  },

  /**
   * Mark All Notifications as Read
   * 
   * Marks all notifications as read.
   * 
   * @returns {Promise<Object>} Mark all read result
   */
  markAllAsRead: async () => {
    return handleApiResponse(
      apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
    );
  },
};

// Export all services
export default {
  driver: driverService,
  job: jobService,
  notification: notificationService,
};
