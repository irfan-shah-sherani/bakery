"use server";

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

const validateMessage = (message: string): boolean => {
  return message.trim().length >= 10 && message.trim().length <= 5000;
};

const validateSubject = (subject: string): boolean => {
  return subject.trim().length >= 3 && subject.trim().length <= 100;
};

export async function sendContactMessage(payload: ContactPayload) {
  try {
    // Validate all fields
    if (!payload.name) {
      return { success: false, message: "Name is required" };
    }
    if (!validateName(payload.name)) {
      return { success: false, message: "Name must be 2-100 characters" };
    }

    if (!payload.email) {
      return { success: false, message: "Email is required" };
    }
    if (!validateEmail(payload.email)) {
      return { success: false, message: "Please enter a valid email address" };
    }

    if (!payload.phone) {
      return { success: false, message: "Phone number is required" };
    }
    if (!validatePhone(payload.phone)) {
      return { success: false, message: "Please enter a valid phone number (at least 10 digits)" };
    }

    if (!payload.subject) {
      return { success: false, message: "Subject is required" };
    }
    if (!validateSubject(payload.subject)) {
      return { success: false, message: "Subject must be 3-100 characters" };
    }

    if (!payload.message) {
      return { success: false, message: "Message is required" };
    }
    if (!validateMessage(payload.message)) {
      return { success: false, message: "Message must be 10-5000 characters" };
    }


    const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: process.env.VERIFIED_SENDER_EMAIL || "mrirfankhansherani@gmail.com",
        subject: `New Contact Message: ${payload.subject}`,
        type: "contact",
        payload: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          subject: payload.subject,
          message: payload.message,
        },
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Email sending failed:", errorData);
      return { success: false, message: "Failed to send message. Please try again." };
    }

    return { success: true, message: " Message sent successfully! We'll get back to you soon." };
  } catch (error: any) {
    console.error("Contact form error:", error);
    return { success: false, message: error.message || "An error occurred while sending your message" };
  }
}
