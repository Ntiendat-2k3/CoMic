"use client";
import { 
  SignIn,
  SignUp,
} from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";

const customTheme = {
  general: {
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
  },
  variables: {
    colorPrimary: "#8b5cf6", // Màu tím chủ đạo
    colorBackground: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)", // Gradient tối
    colorText: "#ffffff",
    colorInputBackground: "#2d2d2d",
    colorInputText: "#fff",
  },
  elements: {
    card: {
      background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    headerTitle: {
      color: "#8b5cf6",
      fontSize: "1.8rem",
    },
    socialButtonsIconButton: {
      "&:hover": {
        backgroundColor: "#3a3a3a !important",
      }
    },
    formButtonPrimary: {
      backgroundColor: "#8b5cf6",
      "&:hover": {
        backgroundColor: "#7c4dff !important",
      }
    },
    dividerLine: {
      backgroundColor: "#3a3a3a",
    },
    footerActionLink: {
      color: "#8b5cf6",
      "&:hover": {
        color: "#7c4dff",
      }
    }
  }
};

export const CustomSignIn = () => (
  <SignIn
    appearance={{
      baseTheme: [dark, neobrutalism],
      variables: customTheme.variables,
      elements: {
        ...customTheme.elements,
        headerSubtitle: {
          color: "#a1a1aa",
        },
      }}
    }
    path="/sign-in"
    routing="path"
    signUpUrl="/sign-up"
  />
);

export const CustomSignUp = () => (
  <SignUp
    appearance={{
      baseTheme: [dark, neobrutalism],
      variables: customTheme.variables,
      elements: {
        ...customTheme.elements,
        headerSubtitle: {
          color: "#a1a1aa",
        },
      }}
    }
    path="/sign-up"
    routing="path"
    signInUrl="/sign-in"
  />
);