const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normaliseEmail(value: string) {
  return value.trim().toLowerCase();
}

export function emailError(email: string) {
  if (!email) return "Enter your email address";
  if (email.length > 254 || !EMAIL.test(email))
    return "Enter a valid email address, like name@example.com";
  return null;
}

export function fullNameError(name: string) {
  if (!name) return "Enter your full name";
  if (name.length < 2) return "Full name must be at least 2 characters";
  if (name.length > 100) return "Full name must be 100 characters or fewer";
  return null;
}

export function phoneError(phone: string) {
  if (!phone) return null;
  if (!/^\+?[\d\s()-]+$/.test(phone))
    return "Use digits, spaces, dashes and an optional leading +";
  const digits = phone.replace(/\D/g, "").length;
  if (digits < 7 || digits > 15)
    return "Enter a valid phone number, like +60 12-345 6789";
  return null;
}

export function field(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}
