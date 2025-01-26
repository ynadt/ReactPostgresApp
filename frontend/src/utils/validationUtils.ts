interface RegisterFormFields {
    name: string;
    email: string;
    password: string;
}

export const validateRegisterForm = ({ name, email, password }: RegisterFormFields) => {
    const errors = { name: '', email: '', password: '' };

    if (!name.trim()) {
        errors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
        errors.email = 'Invalid email format';
    }

    if (!password.trim()) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return errors;
};