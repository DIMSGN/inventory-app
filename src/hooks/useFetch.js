import { useState, useEffect } from "react";
import { fetchData } from "../utils/apiUtils"; // Correct import path

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataFromUrl = async () => {
            try {
                const response = await fetchData(url);
                setData(response);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataFromUrl();
    }, [url]);

    return { data, loading, error };
};

export default useFetch;