// src/utils/fetchFilters.js
export const fetchFilters = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/filters');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching filters:', error);
    throw error;
  }
};