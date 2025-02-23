import { useState } from "react";

/**
 * Custom hook to handle form state and changes.
 * @param {Object} initialValues - The initial values for the form.
 * @returns {Object} - The form state, handleChange function, and resetForm function.
 */
const useForm = (initialValues) => {
    const [formData, setFormData] = useState(initialValues);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const resetForm = () => {
        setFormData(initialValues);
    };

    return { formData, handleChange, resetForm };
};

export default useForm;