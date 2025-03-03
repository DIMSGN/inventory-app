const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchData = async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const updateData = async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const deleteData = async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};