export const validateForm = (
    email: string,
    password: string,
    fullName?: string,
    role?: string
): string[] => {
    const errs: string[] = [];
    if (fullName && !fullName.trim()) errs.push("Full name is required.");
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.push("Invalid email address.");
    if (!validatePassword(password))
      errs.push("Password must be at least 6 characters.");
    if (role && !["Patient", "Doctor", "Admin"].includes(role))
      errs.push("Invalid role selected.");

    return errs
  };

  // Returns true if password is validated (length is > 6 characters)
  export const validatePassword = (password: string) => {
    return (password.length > 6)
  }