const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ----------------------------------------
// Response helper — throws on HTTP errors
// ----------------------------------------

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}

// --------------------
// TEST
// --------------------

export const testBackend = async () => {
  const response = await fetch(`${API_URL}/test`);

  return handleResponse(response);
};

// --------------------
// AUTH
// --------------------

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  return handleResponse(response);
};

export const registerUser = async (name, email, password, phone) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name,
      email,
      password,
      phone,
    }),
  });

  return handleResponse(response);
};

// --------------------
// IMAGE UPLOAD
// --------------------

export const uploadImage = async (image, token) => {
  const formData = new FormData();

  formData.append("image", image);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  return handleResponse(response);
};

// --------------------
// STRING ART GENERATION
// --------------------

export const generateStringArt = async (image, token) => {
  const formData = new FormData();

  formData.append("image", image);

  const response = await fetch(`${API_URL}/string-art/generate`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  return handleResponse(response);
};

// --------------------
// AUTH — current user
// --------------------

export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// --------------------
// ORDERS
// --------------------

export const createOrder = async (orderData, token) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(orderData),
  });

  return handleResponse(response);
};

export const getMyOrders = async (token) => {
  const response = await fetch(`${API_URL}/orders/my-orders`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export const getOrderById = async (orderId, token, isAdmin = false) => {
  const endpoint = isAdmin
    ? `${API_URL}/admin/orders/${orderId}`
    : `${API_URL}/orders/${orderId}`;

  const response = await fetch(endpoint, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export const updateOrderStatus = async (orderId, status, token) => {
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({ orderStatus: status }),
  });

  return handleResponse(response);
};

// --------------------
// ADMIN — Dashboard
// --------------------

export const getDashboardStats = async (token) => {
  const response = await fetch(`${API_URL}/admin/dashboard`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// --------------------
// ADMIN — Orders
// --------------------

export const getAllOrdersAdmin = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();

  const response = await fetch(
    `${API_URL}/admin/orders?${query}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
};

export const getOrderByIdAdmin = async (orderId, token) => {
  const response = await fetch(`${API_URL}/admin/orders/${orderId}`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// --------------------
// ADMIN — Users
// --------------------

export const getAllUsers = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();

  const response = await fetch(
    `${API_URL}/admin/users?${query}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
};

export const updateUserRole = async (userId, role, token) => {
  const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({ role }),
  });

  return handleResponse(response);
};

// --------------------
// ADMIN — Designs
// --------------------

export const getAllDesigns = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();

  const response = await fetch(
    `${API_URL}/admin/designs?${query}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
};

export const getDesignStats = async (token) => {
  const response = await fetch(`${API_URL}/admin/designs/stats`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};