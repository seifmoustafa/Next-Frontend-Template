// Centralized Logo Configuration
// Change these values to update the logo across all layouts

export const logoConfig = {
  // Logo type: "sparkles", "shield", "image", "custom"
  // type: "image" as "sparkles" | "shield" | "image" | "custom", // Changed to "image" to use the applogo.png
  type: "image" as "sparkles" | "shield" | "image" | "custom",
  // Image path (used when type is "image")
  imagePath: "/placeholder-logo.png", // Updated to use the existing placeholder logo
  
  // Text for custom logo (used when type is "custom")
  text: "SA",
  
  // Default size: "sm", "md", "lg", "xl"
  defaultSize: "md",
  
  // Default variant: "default", "gradient", "outline"
  defaultVariant: "default",
};

// Helper function to get logo configuration
export function getLogoConfig() {
  return logoConfig;
}

// Helper function to update logo type
export function updateLogoType(type: "sparkles" | "shield" | "image" | "custom") {
  logoConfig.type = type;
}

// Helper function to update logo image
export function updateLogoImage(path: string) {
  logoConfig.imagePath = path;
}

// Helper function to update logo text
export function updateLogoText(text: string) {
  logoConfig.text = text;
} 