import { Pressable, PressableProps, Text } from "react-native";
import { s } from "./styles";
import { categoriesIcons } from "@/utils/categories-icons";
import { colors } from "@/styles/theme";
import { TouchableWithoutFeedback  } from "@gorhom/bottom-sheet"
import { TouchableWithoutFeedbackProps } from "react-native";

type Props = TouchableWithoutFeedbackProps & {
    iconId: string;
    isSelected?: boolean;
    name: string;
}

export function Category({
    iconId,
    name,
    isSelected = false,
    ...rest
}: Props) {
    const Icon = categoriesIcons[iconId];
 
    return (
        <TouchableWithoutFeedback
            style={[s.container, isSelected && s.containerSelected]}
            {...rest}
        >
            <Icon size={16} color={colors.gray[isSelected ? 100 : 400]}/>
            <Text style={[s.name, isSelected && s.nameSelected]}>{name}</Text>
        </TouchableWithoutFeedback>
    )
}