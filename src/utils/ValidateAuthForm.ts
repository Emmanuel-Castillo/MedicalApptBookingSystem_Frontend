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
    if (password.length < 6)
      errs.push("Password must be at least 6 characters.");
    if (role && !["Patient", "Doctor", "Admin"].includes(role))
      errs.push("Invalid role selected.");

    return errs
  };