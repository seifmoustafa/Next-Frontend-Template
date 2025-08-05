// Centralized Logo Configuration
// Change these values to update the logo across all layouts

export const logoConfig = {
  // Logo type: "sparkles", "shield", "image", "custom"
  type: "sparkles" as "sparkles" | "shield" | "image" | "custom",
  
  // Image path (used when type is "image")
  imagePath: "/placeholder-logo.svg",
  
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