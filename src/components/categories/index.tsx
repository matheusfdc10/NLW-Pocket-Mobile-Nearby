import { FlatList } from "react-native-gesture-handler";
import { Category } from "../category";
import { s } from "./styles";
import { NativeViewGestureHandler } from 'react-native-gesture-handler';

export type CategoryPorps = {
    id: string;
    name: string;
}[]

type Porps = {
    data: CategoryPorps;
    selected: string;
    onSelect: (id: string) => void;
}

export function Categories({ 
    data, 
    selected, 
    onSelect 
}: Porps) {
    return (
        <NativeViewGestureHandler disallowInterruption={true}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Category 
                        iconId={item.id} 
                        name={item.name}
                        onPress={() => onSelect(item.id)}
                        isSelected={item.id === selected}
                    />
                )}
                horizontal
                contentContainerStyle={s.content}
                style={s.container}
                showsHorizontalScrollIndicator={false}
            />
        </NativeViewGestureHandler>
    )
}