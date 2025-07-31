const API_BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!response.ok) {
    const errorData = isJson ? await response.json() : { error: 'Unknown error' };
    throw new ApiError(errorData.error || 'Unknown error');
  }

  return isJson ? await response.json() : {};
}


export const api = {
  async getTransactions() {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    return handleResponse(response);
  },

  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse(response);
  },

  async createTransaction(transactionData) {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    return handleResponse(response);
  },

  async createCategory(type, name) {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, name }),
    });
    return handleResponse(response);
  },

  async deleteTransaction(id) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};