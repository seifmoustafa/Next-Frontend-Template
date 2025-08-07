import { useSettings } from "@/providers/settings-provider";
import type {
  AnimationLevel,
  BorderRadius,
  ButtonStyle,
  HeaderStyle,
  ShadowIntensity,
  SpacingSize,
} from "@/providers/settings-provider";

// Utility hook that exposes common style helpers based on global settings
export function useLayoutStyles() {
  const {
    headerStyle,
    spacingSize,
    borderRadius,
    animationLevel,
    shadowIntensity,
    buttonStyle,
  } = useSettings();

  const merge = <T extends string>(
    value: T,
    base: Record<string, string>,
    overrides?: Partial<Record<string, string>>
  ) => {
    const map = { ...base, ...overrides };
    return map[value] ?? map.default ?? "";
  };

  const getSpacingClass = (
    overrides?: Partial<Record<SpacingSize | "default", string>>
  ) =>
    merge(spacingSize, {
      compact: "px-4 py-2",
      comfortable: "px-10 py-6",
      spacious: "px-12 py-8",
      default: "px-8 py-4",
    }, overrides);

  const getHeaderStyleClass = (
    mapping: Record<HeaderStyle | "default", string>
  ) => merge(headerStyle, mapping);

  const getShadowClass = (
    overrides?: Partial<Record<ShadowIntensity | "default", string>>
  ) =>
    merge(shadowIntensity, {
      none: "",
      subtle: "shadow-sm",
      moderate: "shadow-lg",
      strong: "shadow-2xl",
      default: "shadow-lg",
    }, overrides);

  const getAnimationClass = (
    overrides?: Partial<Record<AnimationLevel | "default", string>>
  ) =>
    merge(animationLevel, {
      none: "",
      minimal: "transition-colors duration-200",
      moderate: "transition-all duration-300",
      high: "transition-all duration-500",
      default: "transition-all duration-500",
    }, overrides);

  const getBorderRadiusClass = (
    overrides?: Partial<Record<BorderRadius | "default", string>>
  ) =>
    merge(borderRadius, {
      none: "rounded-none",
      small: "rounded-sm",
      large: "rounded-lg",
      full: "rounded-full",
      default: "rounded-md",
    }, overrides);

  const getButtonStyleClass = (
    overrides?: Partial<Record<ButtonStyle | "default", string>>
  ) =>
    merge(buttonStyle, {
      rounded: "rounded-full",
      sharp: "rounded-none",
      modern: "rounded-xl",
      default: "rounded-lg",
    }, overrides);

  return {
    getSpacingClass,
    getHeaderStyleClass,
    getShadowClass,
    getAnimationClass,
    getBorderRadiusClass,
    getButtonStyleClass,
  };
}

export type LayoutStyleHelpers = ReturnType<typeof useLayoutStyles>;
