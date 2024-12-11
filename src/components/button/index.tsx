import { colors } from "@/styles/theme"
import { TextProps, TouchableOpacity, TouchableOpacityProps, Text, ActivityIndicator } from "react-native"
import { IconProps as TableIconProps } from "@tabler/icons-react-native"
import { s } from "./styles"

type ButtonProps = TouchableOpacityProps & {
    isLoading?: boolean;
}

function Button({ children, style, isLoading = false, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity 
            style={[s.container, style]} 
            activeOpacity={0.8} 
            disabled={isLoading}
            {...rest}
        >
            {isLoading ? <ActivityIndicator size='small' color={colors.gray[100]} /> : children}
        </TouchableOpacity>
    )
}

function Title({
    children,
}: TextProps) {
    return (
        <Text style={s.title} >{children}</Text>
    )
}

type IconProps = TableIconProps & {
    icon: React.ComponentType<TableIconProps>
}

function Icon({
    icon: Icon,
    ...rest
}: IconProps) {
    return (
        <Icon 
            size={24} 
            color={colors.gray[100]}
            {...rest}
        />
    )
}

Button.Title = Title
Button.Icon = Icon

export { Button };