export const fetchData = async (filters = {}) => {
  try {
    // Join Player_Name array into a comma-separated string
    // if (filters.Player_Name && Array.isArray(filters.Player_Name)) {
    //   filters.Player_Name = filters.Player_Name.join(',');
    // }

    // Construct query parameters
    const params = new URLSearchParams(filters);
    console.log(params)

    // Make API request
    const url = `http://127.0.0.1:5000/api/data?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data;
    } else {
      throw new Error('Fetched data is not an array');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
